import User from '../models/User.js';
import { generateToken } from '../utils/jwt.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    return res.status(400).json({ message: 'User already exists' });
  }

  // If no admin exists, assign admin to the first qualifying user.
  const adminCount = await User.countDocuments({ role: 'admin' });
  const role = adminCount === 0 ? 'admin' : 'member';

  const user = await User.create({
    name,
    email,
    password,
    role,
  });

  const token = generateToken(user._id, user.role);

  return res.status(201).json({
    message: 'User registered successfully',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ message: 'Please provide email and password' });
  }

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const isPasswordValid = await user.comparePassword(password);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = generateToken(user._id, user.role);

  return res.status(200).json({
    message: 'Login successful',
    token,
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user.userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  return res.status(200).json({
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find().select('_id name email role');

  return res.status(200).json({
    users,
  });
});
