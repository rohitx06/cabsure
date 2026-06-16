const { Pool } = require("pg");
require("dotenv").config();

// Cloud databases (Render, Railway, Supabase) provide a single DATABASE_URL.
// Local dev uses individual DB_* variables.
const pool = process.env.DATABASE_URL
  ? new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }, // required by most cloud Postgres providers
    })
  : new Pool({
      user: process.env.DB_USER,
      host: process.env.DB_HOST,
      database: process.env.DB_NAME,
      password: process.env.DB_PASSWORD,
      port: process.env.DB_PORT,
    });

module.exports = pool;