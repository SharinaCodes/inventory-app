const { check, body } = require('express-validator');

const productValidationRules = [
  check('name', 'Name is required').not().isEmpty(),
  check('price', 'Price must be a number').isNumeric(),
  check('stock', 'Stock must be a number').isNumeric(),
  check('min', 'Minimum quantity must be a number').isNumeric(),
  check('max', 'Maximum quantity must be a number').isNumeric(),
  body('max').custom((value, { req }) => {
    if (value < req.body.min) {
      throw new Error('Maximum quantity must be greater than minimum quantity');
    }
    return true;
  }),
  body('stock').custom((value, { req }) => {
    if (value < req.body.min || value > req.body.max) {
      throw new Error('Stock quantity must be between minimum and maximum quantity');
    }
    return true;
  }),
];

module.exports = {
  productValidationRules,
};
