const express = require("express");
const { listUsers, stats } = require("../../controllers/admin.controller");
const { protect } = require("../../middleware/auth.middleware");
const { allowRoles } = require("../../middleware/role.middleware");

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Admin
 *   description: Admin-only routes
 */

/**
 * @swagger
 * /api/v1/admin/users:
 *   get:
 *     summary: List all users
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User list
 */
router.get("/users", protect, allowRoles("admin"), listUsers);

/**
 * @swagger
 * /api/v1/admin/stats:
 *   get:
 *     summary: Get platform stats
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Statistics payload
 */
router.get("/stats", protect, allowRoles("admin"), stats);

module.exports = router;

