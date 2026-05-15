const pool = require("../config/db");

const createRideReport = async (req, res) => {
  try {
    const { pickup_area, app_name, status, wait_time, request_time } = req.body;

    const result = await pool.query(
      `
            INSERT INTO ride_reports
            (
                pickup_area,
                app_name,
                status,
                wait_time,
                request_time
            )

            VALUES($1,$2,$3,$4,$5)

            RETURNING *
            `,
      [pickup_area, app_name, status, wait_time, request_time],
    );

    res.status(201).json({
      message: "Ride report added",
      data: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
};

//statistics functionality
const getRideStats = async (req, res) => {
  try {
    const { pickup_area, app_name } = req.query;

    const total = await pool.query(
      `
            SELECT COUNT(*)
            FROM ride_reports
            WHERE pickup_area=$1
            AND app_name=$2
            `,
      [pickup_area, app_name],
    );

    const accepted = await pool.query(
      `
            SELECT COUNT(*)
            FROM ride_reports
            WHERE pickup_area=$1
            AND app_name=$2
            AND status='accepted'
            `,
      [pickup_area, app_name],
    );

    const totalReports = Number(total.rows[0].count);

    const acceptedReports = Number(accepted.rows[0].count);

    const acceptanceRate =
      totalReports === 0 ? 0 : (acceptedReports / totalReports) * 100;

    res.json({
      totalReports,

      acceptedReports,

      acceptanceRate: acceptanceRate.toFixed(2),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
};

const getTimeStats = async (req, res) => {
  try {
    const { pickup_area, app_name, hour } = req.query;

    const total = await pool.query(
      `
            SELECT COUNT(*)
            FROM ride_reports

            WHERE pickup_area = $1
            AND app_name = $2

            AND EXTRACT(
                HOUR
                FROM request_time
            ) = $3
            `,
      [pickup_area, app_name, hour],
    );

    const accepted = await pool.query(
      `
                SELECT COUNT(*)

                FROM ride_reports

                WHERE pickup_area = $1

                AND app_name = $2

                AND status='accepted'

                AND EXTRACT(
                    HOUR
                    FROM request_time
                ) = $3
                `,
      [pickup_area, app_name, hour],
    );

    const totalReports = Number(total.rows[0].count);

    const acceptedReports = Number(accepted.rows[0].count);

    const acceptanceRate =
      totalReports === 0 ? 0 : (acceptedReports / totalReports) * 100;

    res.json({
      totalReports,

      acceptedReports,

      acceptanceRate: acceptanceRate.toFixed(2),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
};

const getRecommendation = async (req, res) => {
  try {
    const { pickup_area, hour } = req.query;

    const result = await pool.query(
      `
            SELECT

            app_name,

            COUNT(*) FILTER(
                WHERE status='accepted'
            ) * 100.0 /

            COUNT(*) AS acceptance_rate,


            AVG(wait_time)
            AS avg_wait


            FROM ride_reports


            WHERE pickup_area=$1

            AND EXTRACT(
                HOUR
                FROM request_time
            )=$2


            GROUP BY app_name


            ORDER BY
                acceptance_rate DESC,
                avg_wait ASC


            LIMIT 1
            `,
      [pickup_area, hour],
    );

    if (result.rows.length === 0) {
      return res.json({
        message: "No data",
      });
    }

    res.json({
      recommendedApp: result.rows[0].app_name,

      acceptanceRate: Number(result.rows[0].acceptance_rate).toFixed(2),

      avgWaitTime: Number(result.rows[0].avg_wait).toFixed(2),
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      error: "Server Error",
    });
  }
};

module.exports = {
  createRideReport,
  getRideStats,
  getTimeStats,
  getRecommendation
};
