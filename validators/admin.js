const { check } = require('express-validator');

exports.postAddProduct = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters.')
    .trim(),
  check('price')
    .isFloat()
    .withMessage('Price must be a numeric with decimal.'),
  check('description')
    .isLength({ min: 5, max: 400 })
    .withMessage('Description must be between 5 and 400 characters.')
    .trim()
];

exports.postEditProduct = [
  check('title')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters.')
    .trim(),
  check('price')
    .isFloat()
    .withMessage('Price must be a numeric with decimal.'),
  check('description')
    .isLength({ min: 5, max: 400 })
    .withMessage('Description must be between 5 and 400 characters.')
    .trim()
];
