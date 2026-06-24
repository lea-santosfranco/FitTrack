const { body } = require('express-validator');

const createWorkoutValidator = [
  body('title').trim().isLength({ min: 2, max: 150 }).withMessage('Title must be 2-150 characters.'),
  body('date').isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD).'),
  body('duration').optional({ values: 'null' }).isInt({ min: 1, max: 1000 }).withMessage('Duration must be between 1 and 1000 minutes.'),
  body('notes').optional({ values: 'null' }).trim().isLength({ max: 2000 }),
];

const updateWorkoutValidator = [
  body('title').optional().trim().isLength({ min: 2, max: 150 }).withMessage('Title must be 2-150 characters.'),
  body('date').optional().isISO8601().withMessage('Date must be a valid date (YYYY-MM-DD).'),
  body('duration').optional({ values: 'null' }).isInt({ min: 1, max: 1000 }).withMessage('Duration must be between 1 and 1000 minutes.'),
  body('notes').optional({ values: 'null' }).trim().isLength({ max: 2000 }),
];

const addExerciseValidator = [
  body('exercise_id').isInt({ min: 1 }).withMessage('exercise_id must be a positive integer.'),
  body('sets').optional({ values: 'null' }).isInt({ min: 1, max: 50 }),
  body('reps').optional({ values: 'null' }).isInt({ min: 1, max: 500 }),
  body('weight_used').optional({ values: 'null' }).isFloat({ min: 0, max: 1000 }),
  body('duration').optional({ values: 'null' }).isInt({ min: 1, max: 36000 }),
];

const updateWorkoutExerciseValidator = [
  body('sets').optional({ values: 'null' }).isInt({ min: 1, max: 50 }),
  body('reps').optional({ values: 'null' }).isInt({ min: 1, max: 500 }),
  body('weight_used').optional({ values: 'null' }).isFloat({ min: 0, max: 1000 }),
  body('duration').optional({ values: 'null' }).isInt({ min: 1, max: 36000 }),
];

module.exports = {
  createWorkoutValidator,
  updateWorkoutValidator,
  addExerciseValidator,
  updateWorkoutExerciseValidator,
};
