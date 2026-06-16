const pool = require("../config/db");
const { rideSchema } = require("../validators/rideValidator");
const { insertRideReport } = require("../services/rideService");
const { getMapData } = require("../services/mapService");
const { getPeakHours } = require("../services/peakHourService");

// ── Create ride report ──────────────────────────────────────────────────────

const createRideReport = async (req, res, next) => {
  try {
    const validatedData = rideSchema.safeParse(req.body);

    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error.issues });
    }

    const result = await insertRideReport(validatedData.data);

    res.status(201).json({
      message: "Ride report added",
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ── Peak hours ──────────────────────────────────────────────────────────────

const peakHours = async (req, res, next) => {
  try {
    const { pickup_area, app_name } = req.query;
    const result = await getPeakHours(pickup_area, app_name);

    res.json({
      best_hour: result?.hour,
      acceptance_rate: result?.acceptance_rate,
      total_reports: result?.total_reports,
    });
  } catch (err) {
    next(err);
  }
};

// ── Ride stats ──────────────────────────────────────────────────────────────

const getRideStats = async (req, res) => {
  try {
    const { pickup_area, app_name } = req.query;

    const total = await pool.query(
      `SELECT COUNT(*) FROM ride_reports
       WHERE pickup_area = $1 AND app_name = $2`,
      [pickup_area, app_name]
    );

    const accepted = await pool.query(
      `SELECT COUNT(*) FROM ride_reports
       WHERE pickup_area = $1 AND app_name = $2 AND status = 'accepted'`,
      [pickup_area, app_name]
    );

    const totalReports = Number(total.rows[0].count);
    const acceptedReports = Number(accepted.rows[0].count);
    const acceptanceRate =
      totalReports === 0 ? 0 : (acceptedReports / totalReports) * 100;

    res.json({
      total_reports: totalReports,
      accepted_reports: acceptedReports,
      acceptance_rate: acceptanceRate.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ── Time stats ──────────────────────────────────────────────────────────────

const getTimeStats = async (req, res) => {
  try {
    const { pickup_area, app_name, hour } = req.query;

    const total = await pool.query(
      `SELECT COUNT(*) FROM ride_reports
       WHERE pickup_area = $1 AND app_name = $2
       AND EXTRACT(HOUR FROM request_time) = $3`,
      [pickup_area, app_name, hour]
    );

    const accepted = await pool.query(
      `SELECT COUNT(*) FROM ride_reports
       WHERE pickup_area = $1 AND app_name = $2 AND status = 'accepted'
       AND EXTRACT(HOUR FROM request_time) = $3`,
      [pickup_area, app_name, hour]
    );

    const totalReports = Number(total.rows[0].count);
    const acceptedReports = Number(accepted.rows[0].count);
    const acceptanceRate =
      totalReports === 0 ? 0 : (acceptedReports / totalReports) * 100;

    res.json({
      total_reports: totalReports,
      accepted_reports: acceptedReports,
      acceptance_rate: acceptanceRate.toFixed(2),
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server Error" });
  }
};

// ── Map data ────────────────────────────────────────────────────────────────

const mapData = async (req, res, next) => {
  try {
    const data = await getMapData();
    res.json(data);
  } catch (err) {
    next(err);
  }
};

// ── Recommendation ──────────────────────────────────────────────────────────

const getRecommendation = async (req, res, next) => {
  try {
    const { pickup_area, hour } = req.query;

    // Build query dynamically — hour is optional
    let query = `
      SELECT
        app_name,
        COUNT(*) FILTER (WHERE status = 'accepted') * 100.0 / COUNT(*) AS acceptance_rate,
        AVG(wait_time) AS avg_wait
      FROM ride_reports
      WHERE pickup_area = $1`;
    const params = [pickup_area];

    if (hour != null && hour !== "") {
      query += ` AND EXTRACT(HOUR FROM request_time) = $2`;
      params.push(hour);
    }

    query += `
      GROUP BY app_name
      ORDER BY acceptance_rate DESC, avg_wait ASC
      LIMIT 1`;

    const result = await pool.query(query, params);

    if (result.rows.length === 0) {
      return res.json({ message: "No data" });
    }

    res.json({
      recommendedApp: result.rows[0].app_name,
      acceptanceRate: Number(result.rows[0].acceptance_rate).toFixed(2),
      avgWaitTime: Number(result.rows[0].avg_wait).toFixed(2),
    });
  } catch (error) {
    next(error);
  }
};

// ── Recent reports ──────────────────────────────────────────────────────────

const getRecentReports = async (req, res, next) => {
  try {
    const result = await pool.query(
      `SELECT id, pickup_area, app_name, status, wait_time, created_at
       FROM ride_reports
       ORDER BY created_at DESC
       LIMIT 20`
    );
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createRideReport,
  getRideStats,
  getTimeStats,
  getRecommendation,
  mapData,
  peakHours,
  getRecentReports,
};
