const express = require("express");
const employeeAuthController = require("../controllers/employeeAuthController");
const passport = require("passport");
const router = express.Router();
/**
 * @swagger
 * tags:
 *   name: Employees Authentication
 *   description: Employees authentication and password management
 */

/**
 * @swagger
 * /api/v1/employeeauth/signup:
 *   post:
 *     summary: Register a new user
 *     tags: [Employees Authentication]
 *     description: Creates a new user account with name, email, password, and phone number.
 *     security: [] # This route does not require authentication
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
 *               - department
 *               - salary
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *               department:
 *                 type: string
 *               salary:
 *                type: number
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Missing or invalid input
 */
router.post("/signup", employeeAuthController.signup);

/**
 * @swagger
 * /api/v1/employeeauth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Employees Authentication]
 *     description: Authenticates user with email and password and returns a token.
 *     security: [] # This route does not require authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful login
 *       400:
 *         description: Incorrect email or password
 */
router.post("/login", employeeAuthController.log_in);

/**
 * @swagger
 * /api/v1/employeeauth/forgotPassword:
 *   post:
 *     summary: Request password reset
 *     tags: [Employees Authentication]
 *     description: Sends a password reset token to the user's email.
 *     security: [] # This route does not require authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token sent to email
 *       404:
 *         description: User not found
 */
router.post("/forgotPassword", employeeAuthController.forgotPassword);

/**
 * @swagger
 * /api/v1/employeeauth/resetPassword/{token}:
 *   patch:
 *     summary: Reset user password
 *     tags: [Employees Authentication]
 *     description: Resets the user's password using the provided token.
 *     security: [] # This route does not require authentication
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Password reset token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - password
 *               - passwordConfirm
 *             properties:
 *               password:
 *                 type: string
 *               passwordConfirm:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successful
 *       400:
 *         description: Token is invalid or has expired
 */
router.patch("/resetPassword/:token", employeeAuthController.resetPassword);
/**
 * @swagger
 * /api/v1/employeeauth/logout:
 *   get:
 *     summary: Employee logout
 *     tags: [Employees Authentication]
 *     description: Logs out the employee by clearing the JWT cookie.
 *     security: [] # No authentication required to hit the route, but typically JWT is cleared
 *     responses:
 *       200:
 *         description: Employee successfully logged out
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
 *                   example: Employee logged out successfully
 */
router.get("/logout", employeeAuthController.log_out);

module.exports = router;
