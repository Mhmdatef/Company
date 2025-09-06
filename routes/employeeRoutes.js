const express = require("express");
const router = express.Router();
const employeeController = require("../controllers/employeeController");
const authMiddleware = require("../middlewares/authMiddleware");
const multer = require("multer");

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */
/**
 * @swagger
 * /api/v1/employees/export-csv:
 *   get:
 *     summary: Export employees to CSV, optionally filter by department
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department ID to filter employees
 *     responses:
 *       200:
 *         description: CSV file generated successfully
 *         content:
 *           text/csv:
 *             schema:
 *               type: string
 *               format: binary
 */
router.get("/export-csv", authMiddleware.adminProtect, employeeController.exportEmployeesToCSV);

/**
 * @swagger
 * /api/v1/employees/export-excel:
 *   get:
 *     summary: Export employees to Excel, optionally filter by department
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department ID to filter employees
 *     responses:
 *       200:
 *         description: Excel file generated successfully
 *         content:
 *           application/vnd.openxmlformats-officedocument.spreadsheetml.sheet:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */

router.get(
  "/export-excel",
  authMiddleware.adminProtect,
  employeeController.exportEmployeesToExcel
);

/**
 * @swagger
 * /api/v1/employees/export-pdf:
 *   get:
 *     summary: Export employees to PDF, optionally filter by department
 *     tags: [Employees]
 *     parameters:
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Department ID to filter employees
 *     responses:
 *       200:
 *         description: PDF file generated successfully
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       500:
 *         description: Server error
 */
router.get(
  "/export-pdf",
  authMiddleware.adminProtect,
  employeeController.exportEmployeesToPDF
);
const upload = multer({ dest: "uploads/" });
/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: Employee management endpoints
 */

/**
 * @swagger
 * /api/v1/employees/import-excel:
 *   post:
 *     summary: Import employees from an Excel file
 *     tags: [Employees]
 *     description: |
 *       Upload an Excel (.xlsx) file containing employee data with columns:
 *       Name, Email, Department, Salary, Password, PasswordConfirm.
 *       - Validates that all required columns exist
 *       - Validates that Password and PasswordConfirm match for all employees
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Excel file to import
 *     responses:
 *       201:
 *         description: Employees imported successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Employees imported successfully
 *                 count:
 *                   type: integer
 *                   example: 5
 *                 data:
 *                   type: object
 *                   properties:
 *                     employees:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           name:
 *                             type: string
 *                           email:
 *                             type: string
 *                           department:
 *                             type: string
 *                           salary:
 *                             type: number
 *       400:
 *         description: Missing required columns or password mismatch
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Password and PasswordConfirm must match for all employees
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */

router.post(
  "/import-excel",
  authMiddleware.adminProtect,
  upload.single("file"),
  employeeController.importEmployeesFromExcel
);

/**
 * @swagger
 * /api/v1/employees:
 *   get:
 *     summary: Get all employees
 *     tags: [Employees]
 *     description: Retrieve all employees with options for pagination, sorting, filtering, and field selection. Department is populated and _id is included.
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination (default 1)
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *         description: Number of results per page (default 100)
 *       - in: query
 *         name: sort
 *         schema:
 *           type: string
 *         description: Sort by fields, e.g., '-salary' for descending salary
 *       - in: query
 *         name: fields
 *         schema:
 *           type: string
 *         description: Comma-separated list of fields to include, e.g., 'name,email,salary,department,_id'
 *       - in: query
 *         name: name
 *         schema:
 *           type: string
 *         description: Filter employees by name (exact match)
 *       - in: query
 *         name: department
 *         schema:
 *           type: string
 *         description: Filter employees by department ID
 *     responses:
 *       200:
 *         description: List of employees returned successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 results:
 *                   type: integer
 *                   example: 10
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: 64f0e9c2b3a6f1b1d1234567
 *                       name:
 *                         type: string
 *                         example: Mohamed Atef
 *                       email:
 *                         type: string
 *                         example: mohamed.atef@example.com
 *                       salary:
 *                         type: number
 *                         example: 5000
 *                       department:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: 64f0e9c2b3a6f1b1d7654321
 *                           name:
 *                             type: string
 *                             example: IT
 */

router.get(
  "/",
  authMiddleware.adminProtect,
  employeeController.getAllEmployees
);
/**
 * @swagger
 * /api/v1/employees:
 *   post:
 *     summary: Create a new employee
 *     tags: [Employees]
 *     description: Add a new employee to the database.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *               - passwordConfirm
 *               - salary
 *               - department
 *             properties:
 *               name:
 *                 type: string
 *                 example: Mohamed Atef
 *               email:
 *                 type: string
 *                 example: mohamed.atef@example.com
 *               password:
 *                 type: string
 *                 example: myStrongPassword123
 *               passwordConfirm:
 *                 type: string
 *                 example: myStrongPassword123
 *               salary:
 *                 type: number
 *                 example: 2500
 *               department:
 *                 type: string
 *                 example: Finance
 *     responses:
 *       201:
 *         description: Employee created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     employee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                         name:
 *                           type: string
 *                         email:
 *                           type: string
 *                         salary:
 *                           type: number
 *                         department:
 *                           type: string
 *                         createdAt:
 *                           type: string
 *                         updatedAt:
 *                           type: string
 *       400:
 *         description: Invalid input or missing fields
 *       500:
 *         description: Server error
 */
router.post(
  "/",
  authMiddleware.adminProtect,
  employeeController.createEmployee
);
/**
 * @swagger
 * /api/v1/employees/me:
 *   get:
 *     summary: Get the profile of the currently logged-in employee
 *     tags: [Employees]
 *     security:
 *       - bearerAuth: []   # لو عندك JWT authentication
 *     responses:
 *       200:
 *         description: Employee profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: success
 *                 data:
 *                   type: object
 *                   properties:
 *                     employee:
 *                       type: object
 *                       properties:
 *                         _id:
 *                           type: string
 *                           example: 64f0e9c2b3a6f1b1d1234567
 *                         name:
 *                           type: string
 *                           example: Mohamed Atef
 *                         email:
 *                           type: string
 *                           example: mohamed.atef@example.com
 *                         department:
 *                           type: string
 *                           example: IT
 *                         salary:
 *                           type: number
 *                           example: 5000
 *                         age:
 *                           type: number
 *                           example: 30
 */
router.get(
  "/me",
  authMiddleware.employeeProtect,
  employeeController.getMyProfile
);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   get:
 *     summary: Get an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee details
 *       404:
 *         description: Employee not found
 */
router.get("/:id", authMiddleware.adminProtect, employeeController.getEmployee);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   put:
 *     summary: Update an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               salary:
 *                 type: number
 *               department:
 *                 type: string
 *     responses:
 *       200:
 *         description: Employee updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Employee not found
 */
router.put(
  "/:id",
  authMiddleware.adminProtect,
  employeeController.updateEmployee
);

/**
 * @swagger
 * /api/v1/employees/{id}:
 *   delete:
 *     summary: Delete an employee by ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Employee ID
 *     responses:
 *       200:
 *         description: Employee deleted successfully
 *       404:
 *         description: Employee not found
 */
router.delete(
  "/:id",
  authMiddleware.adminProtect,
  employeeController.deleteEmployee
);

module.exports = router;
