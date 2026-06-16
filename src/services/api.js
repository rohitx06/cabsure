import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message =
      err.response?.data?.message ||
      err.message ||
      "Something went wrong. Please try again.";
    return Promise.reject(new Error(message));
  }
);

// ── existing (kept for backward compat) ──────────────────────────────────────
export const getOverallStats = (pickup_area, app_name) =>
  api.get("/api/stats", { params: { pickup_area, app_name } });

export const getTimeStats = (pickup_area, app_name, hour) =>
  api.get("/api/time-stats", { params: { pickup_area, app_name, hour } });

export const submitRideReport = (payload) =>
  api.post("/api/ride-report", payload);

// ── new endpoints ─────────────────────────────────────────────────────────────

/** GET /api/stats → { acceptance_rate, total_reports } */
export const getStats = (pickup_area, app_name) =>
  api.get("/api/stats", { params: { pickup_area, app_name } });

/**
 * GET /api/recommend → { recommendedApp, acceptanceRate, avgWaitTime }
 * Returns null when the backend has no matching data (responds with { message: "No data" }).
 */
export const getRecommend = async (pickup_area) => {
  const data = await api.get("/api/recommend", { params: { pickup_area } });
  // Backend returns { message: "No data" } when no rows match — treat as null
  if (!data || data.message || !data.recommendedApp) return null;
  return data;
};

/** GET /api/map-data → [{ pickup_area, latitude, longitude, acceptance_rate, total_reports }] */
export const getMapData = () =>
  api.get("/api/map-data");

/**
 * GET /api/peak-hours → { best_hour, acceptance_rate, total_reports }
 * Returns null when no peak hour data is available.
 */
export const getPeakHours = async (pickup_area, app_name) => {
  const data = await api.get("/api/peak-hours", { params: { pickup_area, app_name } });
  // Backend returns { best_hour: null, ... } when no rows match HAVING >= 5
  if (!data || data.best_hour == null) return null;
  return data;
};

/** GET /api/recent-reports → [{ id, pickup_area, app_name, status, wait_time, created_at }] */
export const getRecentReports = () =>
  api.get("/api/recent-reports");