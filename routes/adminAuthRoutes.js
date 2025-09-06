// routes/adminAuthRoutes.js
const express = require("express");
const router = express.Router();
const adminAuthController = require("../controllers/adminAuthController");

/**
 * @swagger
 * tags:
 *   - name: Admin Authentication
 *     description: Admin authentication endpoints
 */

/**
 * @swagger
 * /api/v1/adminAuth/signup:
 *   post:
 *     summary: Register a new admin
 *     tags: [Admin Authentication]
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
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Admin Name"
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "adminStrongPass123"
 *               passwordConfirm:
 *                 type: string
 *                 example: "adminStrongPass123"
 *     responses:
 *       201:
 *         description: Admin created successfully
 */
router.post("/signup", adminAuthController.signup);

/**
 * @swagger
 * /api/v1/adminAuth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *               password:
 *                 type: string
 *                 example: "adminStrongPass123"
 *     responses:
 *       200:
 *         description: Admin logged in successfully
 */
router.post("/login", adminAuthController.log_in);

/**
 * @swagger
 * /api/v1/adminAuth/logout:
 *   get:
 *     summary: Logout admin
 *     tags: [Admin Authentication]
 *     responses:
 *       200:
 *         description: Admin logged out successfully
 */
router.get("/logout", adminAuthController.log_out);

/**
 * @swagger
 * /api/v1/adminAuth/forgotPassword:
 *   post:
 *     summary: Admin forgot password
 *     tags: [Admin Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: "admin@example.com"
 *     responses:
 *       200:
 *         description: Password reset token sent to admin email
 */
router.post("/forgotPassword", adminAuthController.forgotPassword);

/**
 * @swagger
 * /api/v1/adminAuth/resetPassword/{token}:
 *   patch:
 *     summary: Reset admin password
 *     tags: [Admin Authentication]
 *     parameters:
 *       - in: path
 *         name: token
 *         required: true
 *         schema:
 *           type: string
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               password:
 *                 type: string
 *                 example: "newStrongPassword123"
 *               passwordConfirm:
 *                 type: string
 *                 example: "newStrongPassword123"
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.patch("/resetPassword/:token", adminAuthController.resetPassword);

module.exports = router;
