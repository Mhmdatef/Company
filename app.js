const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const swaggerJsdoc = require("swagger-jsdoc");
const swaggerOptions = require("./swaggerOptions");
const specs = swaggerJsdoc(swaggerOptions);

// Routes imports
const employeeauthRoutes = require("./routes/employeeAuthRoutes");
const adminAuthRoutes = require("./routes/adminAuthRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const adminRoutes = require("./routes/adminRoutes");

const app = express();
app.use(cors());

// Middlewares
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));

app.use(express.json());
app.use(express.static(`${__dirname}/public`));
// Routes
app.use("/api/v1/employeeauth", employeeauthRoutes);
app.use("/api/v1/employees", employeeRoutes);
app.use("/api/v1/departments", departmentRoutes);
app.use("/api/v1/admins", adminRoutes);
app.use("/api/v1/adminAuth", adminAuthRoutes);

module.exports = app;
