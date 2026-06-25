const express           = require('express');
const router            = express.Router();
const ProgramController = require('../controllers/program.controller');
const authMiddleware    = require('../middleware/auth.middleware');

router.use(authMiddleware);

/**
 * @openapi
 * /programs:
 *   get:
 *     summary: Liste les programmes d'entraînement pré-définis
 *     tags: [Programs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des programmes }
 */
router.get('/', ProgramController.getAll);

/**
 * @openapi
 * /programs/{id}:
 *   get:
 *     summary: Détail d'un programme avec ses exercices
 *     tags: [Programs]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Programme trouvé }
 *       404: { description: Programme introuvable }
 */
router.get('/:id', ProgramController.getOne);

/**
 * @openapi
 * /programs/{id}/clone:
 *   post:
 *     summary: Copie un programme dans les séances personnelles de l'utilisateur
 *     tags: [Programs]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               date: { type: string, format: date }
 *     responses:
 *       201: { description: Séance créée à partir du programme }
 *       404: { description: Programme introuvable }
 */
router.post('/:id/clone', ProgramController.clone);

module.exports = router;
