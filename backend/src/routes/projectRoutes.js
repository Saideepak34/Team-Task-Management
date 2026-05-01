import express from 'express';
import {
  createProject,
  getProjects,
  getProjectById,
  addMemberToProject,
  removeMemberFromProject,
} from '../controllers/projectController.js';
import { authMiddleware, adminMiddleware } from '../middleware/auth.js';
import {
  validateProject,
  handleValidationErrors,
} from '../utils/validators.js';

const router = express.Router();

router.post(
  '/',
  authMiddleware,
  validateProject,
  handleValidationErrors,
  createProject
);
router.get('/', authMiddleware, getProjects);
router.get('/:id', authMiddleware, getProjectById);
router.post(
  '/:id/members',
  authMiddleware,
  adminMiddleware,
  addMemberToProject
);
router.delete(
  '/:id/members/:userId',
  authMiddleware,
  adminMiddleware,
  removeMemberFromProject
);

export default router;
