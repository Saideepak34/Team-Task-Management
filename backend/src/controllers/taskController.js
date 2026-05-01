import Task from '../models/Task.js';
import Project from '../models/Project.js';
import User from '../models/User.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const createTask = asyncHandler(async (req, res) => {
  const { title, description, projectId, assignedTo, deadline } = req.body;

  // Verify project exists
  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  // Only admins or project creator can create tasks
  const isAdmin = req.user.role === 'admin';
  const isProjectCreator = project.createdBy.toString() === req.user.userId;

  if (!isAdmin && !isProjectCreator) {
    return res.status(403).json({ message: 'Only admins or project creator can create tasks' });
  }

  // Verify all assigned users exist and are in the database
  const assignedUsers = Array.isArray(assignedTo) ? assignedTo : [assignedTo];
  const validUsers = await User.find({ _id: { $in: assignedUsers } });
  if (validUsers.length !== assignedUsers.length) {
    return res.status(400).json({ message: 'One or more assigned users not found' });
  }

  const task = await Task.create({
    title,
    description,
    projectId,
    assignedTo: assignedUsers,
    deadline,
    createdBy: req.user.userId,
  });

  const populatedTask = await task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'projectId', select: 'name description status' },
  ]);

  return res.status(201).json({
    message: 'Task created successfully',
    task: populatedTask,
  });
});

export const getTasksByUser = asyncHandler(async (req, res) => {
  // Members only see tasks assigned to them
  const tasks = await Task.find({
    assignedTo: req.user.userId,
  }).populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'projectId', select: 'name description status' },
  ]);

  // Calculate task statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(
    (task) => task.status === 'Completed'
  ).length;
  const pendingTasks = tasks.filter(
    (task) => task.status === 'Pending'
  ).length;
  const overdueTasks = tasks.filter(
    (task) =>
      task.status !== 'Completed' &&
      task.deadline &&
      new Date(task.deadline) < new Date()
  ).length;

  return res.status(200).json({
    tasks,
    stats: {
      totalTasks,
      completedTasks,
      pendingTasks,
      overdueTasks,
    },
  });
});

export const getTasksByProject = asyncHandler(async (req, res) => {
  const { projectId } = req.params;

  const project = await Project.findById(projectId);
  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  if (!project.members.includes(req.user.userId)) {
    return res
      .status(403)
      .json({ message: 'You are not a member of this project' });
  }

  const tasks = await Task.find({ projectId }).populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
  ]);

  // Calculate project progress
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.status === 'Completed').length;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return res.status(200).json({
    tasks,
    project: {
      _id: project._id,
      name: project.name,
      description: project.description,
      status: project.status,
      progress: progressPercentage,
    },
  });
});

export const getTaskById = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id).populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'projectId', select: 'name description status' },
  ]);

  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Verify user is assigned or is task creator or is admin
  const isAssigned = task.assignedTo.some(user => user._id.toString() === req.user.userId);
  const isCreator = task.createdBy._id.toString() === req.user.userId;
  const isAdmin = req.user.role === 'admin';

  if (!isAssigned && !isCreator && !isAdmin) {
    return res.status(403).json({ message: 'You do not have access to this task' });
  }

  return res.status(200).json({ task });
});

export const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { title, description, status, deadline } = req.body;

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Only assigned users, admin, or creator can update task
  const isAssigned = task.assignedTo.some(user => user.toString() === req.user.userId);
  const isCreator = task.createdBy.toString() === req.user.userId;
  const isAdmin = req.user.role === 'admin';

  if (!isAssigned && !isCreator && !isAdmin) {
    return res.status(403).json({ message: 'You do not have permission to update this task' });
  }

  if (title) task.title = title;
  if (description) task.description = description;
  if (status) task.status = status;
  if (deadline) task.deadline = deadline;

  await task.save();

  const populatedTask = await task.populate([
    { path: 'assignedTo', select: 'name email' },
    { path: 'createdBy', select: 'name email' },
    { path: 'projectId', select: 'name description status' },
  ]);

  return res.status(200).json({
    message: 'Task updated successfully',
    task: populatedTask,
  });
});

export const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;

  const task = await Task.findById(id);
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  if (task.createdBy.toString() !== req.user.userId) {
    return res
      .status(403)
      .json({ message: 'Only task creator can delete this task' });
  }

  await Task.findByIdAndDelete(id);

  return res.status(200).json({ message: 'Task deleted successfully' });
});
