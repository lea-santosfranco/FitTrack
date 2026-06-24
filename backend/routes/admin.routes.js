const express          = require('express');
const router           = express.Router();
const AdminController  = require('../controllers/admin.controller');
const authMiddleware    = require('../middleware/auth.middleware');
const checkRole         = require('../middleware/role.middleware');

router.use(authMiddleware, checkRole('admin'));

/**
 * @openapi
 * /admin/users:
 *   get:
 *     summary: Liste tous les utilisateurs (admin)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des utilisateurs }
 *       403: { description: Rôle insuffisant }
 */
router.get('/users', AdminController.listUsers);

/**
 * @openapi
 * /admin/users/{id}/role:
 *   patch:
 *     summary: Modifie le rôle d'un utilisateur (admin)
 *     tags: [Admin]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               role: { type: string, enum: [user, admin] }
 *     responses:
 *       200: { description: Rôle mis à jour }
 *       400: { description: Rôle invalide }
 *       404: { description: Utilisateur introuvable }
 */
router.patch('/users/:id/role', AdminController.updateUserRole);

module.exports = router;
