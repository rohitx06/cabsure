// dotenv MUST be loaded before anything that reads env vars (e.g. db.js)
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const pool = require("./config/db");
const morgan = require("morgan");
const app = express();

// swagger config
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// ── CORS ────────────────────────────────────────────────────────────────────
// In production set ALLOWED_ORIGINS to your frontend URL, e.g.:
//   ALLOWED_ORIGINS=https://cabsure.onrender.com
// Multiple origins can be comma-separated.
const allowedOrigins = (process.env.ALLOWED_ORIGINS || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: allowedOrigins,
  })
);

app.use(express.json());

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

// ── API routes ──────────────────────────────────────────────────────────────
const rideRoutes = require("./routes/rideRouter");
app.use("/api", rideRoutes);

// ── Serve frontend in production ────────────────────────────────────────────
// When deployed, the Vite build output (../dist) is served by Express itself,
// so the frontend and backend are a single Render Web Service.
if (process.env.NODE_ENV === "production") {
  const distPath = path.join(__dirname, "..", "dist");
  app.use(express.static(distPath));

  // SPA fallback — any route that isn't /api/* gets index.html
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
}

// error handler — MUST come AFTER routes so Express can invoke it
const errorHandler = require("./middleware/errorHandler");
app.use(errorHandler);

// database
pool.connect((err) => {
  if (err) {
    console.error(`DB connection error: ${err}`);
  } else {
    console.log("Connection to DB Success!");
  }
});

// health check
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
