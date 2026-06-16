const swaggerJsDoc = require("swagger-jsdoc");

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
        url: "http://localhost:5000",
      },
    ],
  },

  apis: ["./routes/*.js"],
};

const swaggerSpec = swaggerJsDoc(options);

module.exports = swaggerSpec;
