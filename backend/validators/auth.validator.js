const { body } = require('express-validator');

// Au moins 1 minuscule, 1 majuscule, 1 chiffre, 1 caractère spécial, 8 caractères minimum
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const PASSWORD_MESSAGE = 'Password must be at least 8 characters and contain an uppercase letter, a lowercase letter, a digit and a special character.';

const registerValidator = [
  body('username').trim().isLength({ min: 3, max: 50 }).withMessage('Username must be 3-50 characters.'),
  body('email').trim().isEmail().withMessage('A valid email is required.'),
  body('password').matches(PASSWORD_REGEX).withMessage(PASSWORD_MESSAGE),
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

const resendVerificationValidator = [
  body('email').trim().isEmail().withMessage('A valid email is required.'),
];

module.exports = { registerValidator, loginValidator, updateProfileValidator, resendVerificationValidator };
