import express from 'express';
import {
  createTask,
  getTasksByUser,
  getTasksByProject,
  getTaskById,
  updateTask,
  deleteTask,
} from '../controllers/taskController.js';
import { authMiddleware } from '../middleware/auth.js';
import { validateTask, handleValidationErrors } from '../utils/validators.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateTask,
  handleValidationErrors,
  createTask
);
router.get('/user/tasks', authMiddleware, getTasksByUser);
router.get('/project/:projectId', authMiddleware, getTasksByProject);
router.get('/:id', authMiddleware, getTaskById);
router.put('/:id', authMiddleware, updateTask);
router.delete('/:id', authMiddleware, deleteTask);

export default router;
