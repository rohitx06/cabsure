const swaggerJsDoc = require("swagger-jsdoc");

const serverUrl =
  process.env.NODE_ENV === "production"
    ? process.env.BACKEND_URL || "/"
    : `http://localhost:${process.env.PORT || 5000}`;

const options = {
  definition: {
    openapi: "3.0.0",

    info: {
      title: "CabSure API",

      version: "1.0.0",

      description: "Ride analytics API for Uber and Rapido",
    },

    servers: [
      {
        url: serverUrl,
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
