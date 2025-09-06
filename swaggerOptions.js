// swaggerOptions.js
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: " Company System API",
      version: "1.0.0",
      description: "API documentation for the Company System",
    },
    servers: [
      {
        url: "http://localhost:2500",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ["./Routes/*.js"],
};

module.exports = options;
