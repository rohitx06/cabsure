const express = require("express");

const router = express.Router();

const {
  createRideReport,
  getRideStats,
  getTimeStats,
  getRecommendation,
} = require("../controllers/rideController");

router.post("/ride-report", createRideReport);

router.get("/stats", getRideStats);

router.get("/time-stats", getTimeStats);

router.get("/recommend", getRecommendation);

module.exports = router;
