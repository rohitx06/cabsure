const pool = require("../config/db");

const getPeakHours = async (pickup_area, app_name) => {
  const result = await pool.query(
    `SELECT
       EXTRACT(HOUR FROM request_time) AS hour,
       ROUND(
         COUNT(*) FILTER (WHERE status = 'accepted') * 100.0 / COUNT(*),
         2
       ) AS acceptance_rate,
       COUNT(*) AS total_reports
     FROM ride_reports
     WHERE pickup_area = $1 AND app_name = $2
     GROUP BY hour
     HAVING COUNT(*) >= 5
     ORDER BY acceptance_rate DESC
     LIMIT 1`,
    [pickup_area, app_name]
  );

  return result.rows[0];
};

module.exports = {
  getPeakHours,
};
