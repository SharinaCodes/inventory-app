const { check, body } = require('express-validator');

const partValidationRules = [
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
  check('type', 'Type must be either InHouse or Outsourced').isIn(['InHouse', 'Outsourced']),
  body('machineId').if(body('type').equals('InHouse')).not().isEmpty().withMessage('InHouse parts must have a machine ID'),
  body('companyName').if(body('type').equals('Outsourced')).not().isEmpty().withMessage('Outsourced parts must have a company name'),
];

module.exports = {
  partValidationRules,
};
