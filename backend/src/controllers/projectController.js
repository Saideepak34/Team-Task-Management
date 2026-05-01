import Project from '../models/Project.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createProject = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  const project = await Project.create({
    name,
    description,
    createdBy: req.user.userId,
    members: [req.user.userId],
  });

  const populatedProject = await project.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'members', select: 'name email role' },
  ]);

  return res.status(201).json({
    message: 'Project created successfully',
    project: populatedProject,
  });
});

export const getProjects = asyncHandler(async (req, res) => {
  const projects = await Project.find({
    members: req.user.userId,
  }).populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'members', select: 'name email role' },
  ]);

  return res.status(200).json({
    projects,
  });
});

export const getProjectById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const project = await Project.findById(id).populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'members', select: 'name email role' },
  ]);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Check if user is a member
  if (!project.members.some((member) => member._id.toString() === req.user.userId)) {
    return res
      .status(403)
      .json({ message: 'You do not have access to this project' });
  }

  return res.status(200).json({ project });
});

export const addMemberToProject = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { userId } = req.body;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Only project creator can add members
  if (project.createdBy.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: 'Only project creator can add members' });
  }

  if (project.members.includes(userId)) {
    return res.status(400).json({ message: 'User already a member' });
  }

  project.members.push(userId);
  await project.save();

  const populatedProject = await project.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'members', select: 'name email role' },
  ]);

  return res.status(200).json({
    message: 'Member added successfully',
    project: populatedProject,
  });
});

export const removeMemberFromProject = asyncHandler(async (req, res) => {
  const { id, userId } = req.params;

  const project = await Project.findById(id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Only project creator can remove members
  if (project.createdBy.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: 'Only project creator can remove members' });
  }

  project.members = project.members.filter(
    (member) => member.toString() !== userId
  );
  await project.save();

  const populatedProject = await project.populate([
    { path: 'createdBy', select: 'name email' },
    { path: 'members', select: 'name email role' },
  ]);

  return res.status(200).json({
    message: 'Member removed successfully',
    project: populatedProject,
  });
});
