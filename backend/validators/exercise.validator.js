const { body } = require('express-validator');

const VALID_CATEGORIES = ['Musculation', 'Cardio', 'Flexibilité'];

const createExerciseValidator = [
  body('name').trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
  body('category').isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('muscle_group').optional({ values: 'null' }).trim().isLength({ max: 100 }),
  body('description').optional({ values: 'null' }).trim().isLength({ max: 2000 }),
];

const updateExerciseValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 100 }).withMessage('Name must be 2-100 characters.'),
  body('category').optional().isIn(VALID_CATEGORIES).withMessage(`Category must be one of: ${VALID_CATEGORIES.join(', ')}`),
  body('muscle_group').optional({ values: 'null' }).trim().isLength({ max: 100 }),
  body('description').optional({ values: 'null' }).trim().isLength({ max: 2000 }),
];

module.exports = { createExerciseValidator, updateExerciseValidator };
