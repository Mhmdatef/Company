const express = require("express");
const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");
const adminController = require("../controllers/adminController");

/**
 * @swagger
 * tags:
 *   name: Admins
 *   description: Admin management endpoints
 */

/**
 * @swagger
 * /api/v1/admins:
 *   get:
 *     summary: Get all admins
 *     tags: [Admins]
 *     responses:
 *       200:
 *         description: List of admins
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
 *                   example: 2
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                       name:
 *                         type: string
 *                       email:
 *                         type: string
 *                       role:
 *                         type: string
 *                       photo:
 *                         type: string
 */
router.get("/", authMiddleware.adminProtect,adminController.getAllAdmins);

/**
 * @swagger
 * /api/v1/admins/me:
 *   get:
 *     summary: Get the profile of the currently logged-in admin
 *     tags: [Admins]
 *     security:
 *       - bearerAuth: []   # لو عندك JWT authentication
 *     responses:
 *       200:
 *         description: Admin profile retrieved successfully
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
 *                     admin:
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
 *                         role:
 *                           type: string
 *                           example: admin
 *                         password:
 *                           type: string
 *                           description: Hidden for security, not returned
 *                         passwordConfirm:
 *                           type: string
 *                           description: Hidden for security, not returned
 */
router.get("/me",authMiddleware.adminProtect, adminController.getMyProfile);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   get:
 *     summary: Get an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin details
 *       404:
 *         description: Admin not found
 */

router.post("/", authMiddleware.adminProtect,adminController.createAdmin);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   put:
 *     summary: Update an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
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
 *               role:
 *                 type: string
 *     responses:
 *       200:
 *         description: Admin updated successfully
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Admin not found
 */
router.get("/:id",authMiddleware.adminProtect, adminController.getAdmin);

/**
 * @swagger
 * /api/v1/admins:
 *   post:
 *     summary: Create a new admin
 *     tags: [Admins]
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
 *               role:
 *                 type: string
 *                 example: admin
 *     responses:
 *       201:
 *         description: Admin created successfully
 *       400:
 *         description: Invalid input
 */
router.put("/:id",authMiddleware.adminProtect, adminController.updateAdmin);

/**
 * @swagger
 * /api/v1/admins/{id}:
 *   delete:
 *     summary: Delete an admin by ID
 *     tags: [Admins]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Admin ID
 *     responses:
 *       200:
 *         description: Admin deleted successfully
 *       404:
 *         description: Admin not found
 */
router.delete("/:id",authMiddleware.adminProtect, adminController.deleteAdmin);

module.exports = router;
