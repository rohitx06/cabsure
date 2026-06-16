const pool = require("../config/db");

const insertRideReport = async (data) => {
  const {
    pickup_area,
    app_name,
    ride_type,
    status,
    wait_time,
    day_of_week,
    request_time,
  } = data;

  const result = await pool.query(
    `INSERT INTO ride_reports (
       pickup_area, app_name, ride_type, status,
       wait_time, day_of_week, request_time
     )
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [pickup_area, app_name, ride_type, status, wait_time, day_of_week, request_time]
  );

  return result.rows[0];
};

module.exports = {
  insertRideReport,
};
