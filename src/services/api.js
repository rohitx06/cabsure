import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: { "Content-Type": "application/json" },
});

// Response interceptor for unified error handling
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

/**
 * Fetch overall acceptance stats for an area + app
 * @param {string} pickup_area
 * @param {string} app_name - "Uber" | "Rapido"
 */
export const getOverallStats = (pickup_area, app_name) =>
  api.get("/api/stats", { params: { pickup_area, app_name } });

/**
 * Fetch time-based stats
 * @param {string} pickup_area
 * @param {string} app_name
 * @param {number} hour - 0-23
 */
export const getTimeStats = (pickup_area, app_name, hour) =>
  api.get("/api/time-stats", { params: { pickup_area, app_name, hour } });

/**
 * Get recommendation for area + hour
 * @param {string} pickup_area
 * @param {number} hour
 */
export const getRecommendation = (pickup_area, hour) =>
  api.get("/api/recommend", { params: { pickup_area, hour } });

/**
 * Submit a ride report
 * @param {Object} payload
 * @param {string} payload.pickup_area
 * @param {string} payload.app_name
 * @param {string} payload.ride_type
 * @param {string} payload.status - "accepted" | "rejected"
 * @param {number} payload.wait_time
 * @param {string} payload.day_of_week
 * @param {string} payload.request_time - ISO string
 */
export const submitRideReport = (payload) =>
  api.post("/api/ride-report", payload);