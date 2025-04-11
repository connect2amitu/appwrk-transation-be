const { body } = require('express-validator');

exports.validateTransaction = [
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Description must be between 3 and 100 characters'),
  
  body('amount')
    .notEmpty()
    .withMessage('Amount is required')
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('type')
    .notEmpty()
    .withMessage('Transaction type is required')
    .isIn(['credit', 'debit'])
    .withMessage('Type must be either credit or debit'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format')
];

exports.validateTransactionUpdate = [
  body('description')
    .optional()
    .trim()
    .isLength({ min: 3, max: 100 })
    .withMessage('Description must be between 3 and 100 characters'),
  
  body('amount')
    .optional()
    .isNumeric()
    .withMessage('Amount must be a number')
    .isFloat({ min: 0.01 })
    .withMessage('Amount must be greater than 0'),
  
  body('type')
    .optional()
    .isIn(['credit', 'debit'])
    .withMessage('Type must be either credit or debit'),
  
  body('date')
    .optional()
    .isISO8601()
    .withMessage('Date must be a valid date in ISO 8601 format')
];
