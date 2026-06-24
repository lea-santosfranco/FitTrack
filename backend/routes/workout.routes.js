const express           = require('express');
const router            = express.Router();
const WorkoutController = require('../controllers/workout.controller');
const authMiddleware    = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/',    WorkoutController.getAll);
router.get('/:id', WorkoutController.getOne);
router.post('/',   WorkoutController.create);
router.put('/:id', WorkoutController.update);
router.delete('/:id', WorkoutController.delete);

router.post('/:id/exercises',           WorkoutController.addExercise);
router.patch('/:id/exercises/:weId',    WorkoutController.updateExercise);
router.delete('/:id/exercises/:weId',   WorkoutController.removeExercise);

module.exports = router;
