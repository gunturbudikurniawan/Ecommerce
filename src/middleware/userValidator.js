const { check, validationResult } = require('express-validator');

exports.validateUser = [
  check('password')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('User name can not be empty!')
    .bail()
    .isLength({ min: 5 })
    .withMessage('Minimum 3 characters required!')
    .matches(/\d/)
    .withMessage('must contain a number'),
  check('email')
    .trim()
    .normalizeEmail()
    .not()
    .isEmpty()
    .withMessage('Invalid email address!')
    .bail(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
exports.updatePhone = [
  check('phone')
    .trim()
    .escape()
    .not()
    .isEmpty()
    .withMessage('Phone can not be empty!')
    .bail()
    .isLength({ max: 12 })
    .withMessage('Maximum 12 characters required!')
    .isNumeric()
    .withMessage('must contain a number'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
      return res.status(422).json({ errors: errors.array() });
    next();
  },
];
