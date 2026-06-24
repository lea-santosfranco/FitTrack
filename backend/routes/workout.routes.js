const express           = require('express');
const router            = express.Router();
const WorkoutController = require('../controllers/workout.controller');
const authMiddleware    = require('../middleware/auth.middleware');
const validate          = require('../middleware/validate.middleware');
const {
  createWorkoutValidator,
  updateWorkoutValidator,
  addExerciseValidator,
  updateWorkoutExerciseValidator,
} = require('../validators/workout.validator');

router.use(authMiddleware);

/**
 * @openapi
 * /workouts:
 *   get:
 *     summary: Liste les séances de l'utilisateur connecté
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Liste des séances }
 */
router.get('/', WorkoutController.getAll);

/**
 * @openapi
 * /workouts/{id}:
 *   get:
 *     summary: Détail d'une séance avec ses exercices
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Séance trouvée }
 *       404: { description: Séance introuvable }
 */
router.get('/:id', WorkoutController.getOne);

/**
 * @openapi
 * /workouts:
 *   post:
 *     summary: Crée une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Séance créée }
 *       400: { description: Validation échouée }
 */
router.post('/', createWorkoutValidator, validate, WorkoutController.create);

/**
 * @openapi
 * /workouts/{id}:
 *   put:
 *     summary: Modifie une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Séance modifiée }
 *       404: { description: Séance introuvable }
 */
router.put('/:id', updateWorkoutValidator, validate, WorkoutController.update);

/**
 * @openapi
 * /workouts/{id}:
 *   delete:
 *     summary: Supprime une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Séance supprimée }
 *       404: { description: Séance introuvable }
 */
router.delete('/:id', WorkoutController.delete);

/**
 * @openapi
 * /workouts/{id}/exercises:
 *   post:
 *     summary: Ajoute un exercice à une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       201: { description: Exercice ajouté }
 *       400: { description: Validation échouée }
 */
router.post('/:id/exercises', addExerciseValidator, validate, WorkoutController.addExercise);

/**
 * @openapi
 * /workouts/{id}/exercises/{weId}:
 *   patch:
 *     summary: Modifie un exercice d'une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Exercice modifié }
 */
router.patch('/:id/exercises/:weId', updateWorkoutExerciseValidator, validate, WorkoutController.updateExercise);

/**
 * @openapi
 * /workouts/{id}/exercises/{weId}:
 *   delete:
 *     summary: Retire un exercice d'une séance
 *     tags: [Workouts]
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Exercice retiré }
 *       404: { description: Entrée introuvable }
 */
router.delete('/:id/exercises/:weId', WorkoutController.removeExercise);

module.exports = router;
