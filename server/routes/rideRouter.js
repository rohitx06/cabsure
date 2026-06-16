const express = require("express");
const router = express.Router();

const {
  createRideReport,
  getRideStats,
  getTimeStats,
  getRecommendation,
  mapData,
  peakHours,
  getRecentReports,
} = require("../controllers/rideController");

/**
 * @swagger
 * /api/ride-report:
 *   post:
 *     summary: Add ride report
 *     responses:
 *       201:
 *         description: Ride report added
 */
router.post("/ride-report", createRideReport);

/**
 * @swagger
 * /api/stats:
 *   get:
 *     summary: Get ride stats
 *     responses:
 *       200:
 *         description: Returns stats
 */
router.get("/stats", getRideStats);

router.get("/time-stats", getTimeStats);
router.get("/peak-hours", peakHours);
router.get("/recommend", getRecommendation);
router.get("/map-data", mapData);
router.get("/recent-reports", getRecentReports);

module.exports = router;
