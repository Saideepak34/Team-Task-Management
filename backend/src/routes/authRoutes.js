import express from 'express';
import {
  signup,
  login,
  getCurrentUser,
  getAllUsers,
} from '../controllers/authController.js';
import { authMiddleware } from '../middleware/auth.js';
import {
  validateSignup,
  validateLogin,
  handleValidationErrors,
} from '../utils/validators.js';

const router = express.Router();

router.post('/signup', validateSignup, handleValidationErrors, signup);
router.post('/login', validateLogin, handleValidationErrors, login);
router.get('/me', authMiddleware, getCurrentUser);
router.get('/users/all', authMiddleware, getAllUsers);

export default router;
