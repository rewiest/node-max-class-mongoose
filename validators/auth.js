const { check } = require('express-validator');

const User = require('../models/user');

exports.postSignup = [
  check('email')
    .isEmail()
    .withMessage('Please enter a valid email.')
    .custom((value, { req }) => {
      if (value === 'test@test.com') {
        throw new Error('This email address is reserved.');
      }
      return User
        .findOne({ email: value })
        .then(userDoc => {
          if (userDoc) {
            return Promise.reject('E-mail already exists.');
          }
        });
    }),
  check('password', 'Please enter a valid password.')
    .isLength({ min: 4 })
    .isAlphanumeric(),
  check('confirmPassword')
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error('Passwords do not match.');
      }
      return true;
    })  
];
