// validators/authValidators.js
const { check } = require('express-validator');

const registerValidationRules = [
  check('name', 'Name is required').not().isEmpty(),
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
  check('isAdmin', 'isAdmin must be a boolean').optional().isBoolean(),
];

const loginValidationRules = [
  check('email', 'Please include a valid email').isEmail(),
  check('password', 'Password is required').exists(),
];

module.exports = {
  registerValidationRules,
  loginValidationRules,
};
