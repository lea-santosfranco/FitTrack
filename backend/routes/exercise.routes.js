const express            = require('express');
const router             = express.Router();
const ExerciseController = require('../controllers/exercise.controller');
const authMiddleware     = require('../middleware/auth.middleware');

router.use(authMiddleware);

router.get('/',     ExerciseController.getAll);
router.get('/:id',  ExerciseController.getOne);
router.post('/',    ExerciseController.create);
router.put('/:id',  ExerciseController.update);
router.delete('/:id', ExerciseController.delete);

module.exports = router;
