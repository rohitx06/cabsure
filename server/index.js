// initializing
const express = require("express");
const cors = require("cors");
const pool = require("./config/db");
const app = express();
const morgan = require("morgan");

// dotenv config
require("dotenv").config();

// swagger config
const swaggerUi = require("swagger-ui-express");
const swaggerSpec = require("./config/swagger");
app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// middleware
app.use(
  cors({
    origin: "http://localhost:5173",
  })
);
app.use(express.json());
app.use(morgan("dev"));

// routers
const rideRoutes = require("./routes/rideRouter");
app.use("/api", rideRoutes);

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
app.get("/", (req, res) => {
  res.send("Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
