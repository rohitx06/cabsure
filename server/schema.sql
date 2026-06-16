-- CabSure Database Schema
-- Run this on your Render PostgreSQL instance to create the table

CREATE TABLE IF NOT EXISTS ride_reports (
  id            SERIAL PRIMARY KEY,
  pickup_area   VARCHAR(255)  NOT NULL,
  app_name      VARCHAR(50)   NOT NULL,
  ride_type     VARCHAR(50)   NOT NULL,
  status        VARCHAR(50)   NOT NULL,
  wait_time     NUMERIC(6,2)  DEFAULT 0,
  day_of_week   VARCHAR(20),
  request_time  TIMESTAMP,
  latitude      NUMERIC(10,7),
  longitude     NUMERIC(10,7),
  created_at    TIMESTAMP     DEFAULT NOW()
);

-- Index for common queries
CREATE INDEX IF NOT EXISTS idx_ride_reports_area_app
  ON ride_reports (pickup_area, app_name);

CREATE INDEX IF NOT EXISTS idx_ride_reports_created
  ON ride_reports (created_at DESC);
