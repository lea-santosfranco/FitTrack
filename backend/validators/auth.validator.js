const { body } = require('express-validator');

const registerValidator = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters.'),
  body('weight').optional({ values: 'null' }).isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg.'),
  body('goal').optional({ values: 'null' }).isIn(['lose', 'maintain', 'gain']).withMessage('Goal must be lose, maintain or gain.'),
];

const loginValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').notEmpty().withMessage('Password is required.'),
];

const updateProfileValidator = [
  body('username').optional().trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters.'),
  body('email').optional().trim().isEmail().withMessage('A valid email is required.'),
  body('weight').optional({ values: 'null' }).isFloat({ min: 30, max: 300 }).withMessage('Weight must be between 30 and 300 kg.'),
  body('goal').optional().isIn(['lose', 'maintain', 'gain']).withMessage('Goal must be lose, maintain or gain.'),
];

module.exports = { registerValidator, loginValidator, updateProfileValidator };
