import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';

export const validateSignup = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2 })
    .withMessage('Name must be at least 2 characters'),
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters'),
];

export const validateLogin = [
  body('email')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
];

export const validateProject = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Project name is required')
    .isLength({ min: 2 })
    .withMessage('Project name must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
];

export const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Task title is required')
    .isLength({ min: 2 })
    .withMessage('Title must be at least 2 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 1000 })
    .withMessage('Description cannot exceed 1000 characters'),
  body('projectId')
    .notEmpty()
    .withMessage('Project ID is required')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid Project ID format');
      }
      return true;
    }),
  body('assignedTo')
    .notEmpty()
    .withMessage('At least one assigned user is required')
    .custom((value) => {
      // Handle both array and single value
      const userIds = Array.isArray(value) ? value : [value];
      
      // Check if all are valid ObjectIds
      for (const userId of userIds) {
        if (!mongoose.Types.ObjectId.isValid(userId)) {
          throw new Error('Invalid User ID format. Please provide valid user IDs.');
        }
      }
      return true;
    }),
  body('deadline')
    .optional()
    .isISO8601()
    .withMessage('Please provide a valid date'),
];

export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const errorList = errors.array();
    return res.status(400).json({
      message: errorList[0]?.msg || 'Validation failed',
      errors: errorList,
    });
  }
  next();
};
