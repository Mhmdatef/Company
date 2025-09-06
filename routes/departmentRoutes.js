const express = require("express");
const departmentController = require("../controllers/departmentController");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Departments
 *   description: Department management endpoints
 */

/**
 * @swagger
 * /api/v1/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Departments]
 *     responses:
 *       200:
 *         description: List of all departments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                   name:
 *                     type: string
 */
router.get("/",authMiddleware.adminProtect, departmentController.getAllDepartments);

/**
 * @swagger
 * /api/v1/departments:
 *   post:
 *     summary: Create a new department
 *     tags: [Departments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Department created successfully
 *       400:
 *         description: Invalid input
 */
router.post("/",authMiddleware.adminProtect, departmentController.createDepartment);

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   get:
 *     summary: Get a single department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department details
 *       404:
 *         description: Department not found
 */
router.get("/:id",authMiddleware.adminProtect, departmentController.getDepartment);

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   put:
 *     summary: Update a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Department updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Department not found
 */
router.put("/:id",authMiddleware.adminProtect, departmentController.updateDepartment);

/**
 * @swagger
 * /api/v1/departments/{id}:
 *   delete:
 *     summary: Delete a department by ID
 *     tags: [Departments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: Department ID
 *     responses:
 *       200:
 *         description: Department deleted successfully
 *       404:
 *         description: Department not found
 */
router.delete("/:id",authMiddleware.adminProtect, departmentController.deleteDepartment);
module.exports = router;
