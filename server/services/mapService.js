const pool = require("../config/db");

const getMapData = async () => {
  const result = await pool.query(`
    SELECT
      pickup_area,
      latitude,
      longitude,
      ROUND(
        COUNT(*) FILTER (WHERE status = 'accepted') * 100.0 / COUNT(*),
        2
      ) AS acceptance_rate,
      COUNT(*) AS total_reports
    FROM ride_reports
    WHERE latitude IS NOT NULL AND longitude IS NOT NULL
    GROUP BY pickup_area, latitude, longitude
  `);

  return result.rows;
};

module.exports = {
  getMapData,
};
