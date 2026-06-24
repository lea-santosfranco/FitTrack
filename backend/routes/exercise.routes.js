const express              = require('express');
const router                = express.Router();
const ExerciseController    = require('../controllers/exercise.controller');
const authMiddleware         = require('../middleware/auth.middleware');
const checkRole              = require('../middleware/role.middleware');
const validate                = require('../middleware/validate.middleware');
const { createExerciseValidator, updateExerciseValidator } = require('../validators/exercise.validator');

router.use(authMiddleware);

/**
 * @openapi
 * /exercises:
 *   get:
 *     summary: Liste les exercices du catalogue
 *     tags: [Exercises]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: category
 *         schema: { type: string, enum: [Musculation, Cardio, Flexibilité] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *     responses:
 *       200: { description: Liste des exercices }
 */
router.get('/', ExerciseController.getAll);

/**
 * @openapi
 * /exercises/{id}:
 *   get:
 *     summary: Détail d'un exercice
 *     tags: [Exercises]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200: { description: Exercice trouvé }
 *       404: { description: Exercice introuvable }
 */
router.get('/:id', ExerciseController.getOne);

/**
 * @openapi
 * /exercises:
 *   post:
 *     summary: Crée un exercice (admin uniquement)
 *     tags: [Exercises]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Exercice créé }
 *       403: { description: Rôle insuffisant }
 */
router.post('/', checkRole('admin'), createExerciseValidator, validate, ExerciseController.create);

/**
 * @openapi
 * /exercises/{id}:
 *   put:
 *     summary: Modifie un exercice (admin uniquement)
 *     tags: [Exercises]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Exercice modifié }
 *       403: { description: Rôle insuffisant }
 */
router.put('/:id', checkRole('admin'), updateExerciseValidator, validate, ExerciseController.update);

/**
 * @openapi
 * /exercises/{id}:
 *   delete:
 *     summary: Supprime un exercice (admin uniquement)
 *     tags: [Exercises]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Exercice supprimé }
 *       403: { description: Rôle insuffisant }
 *       409: { description: Exercice utilisé dans une séance }
 */
router.delete('/:id', checkRole('admin'), ExerciseController.delete);

module.exports = router;
