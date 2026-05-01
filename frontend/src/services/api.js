import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Auth API calls
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
  getCurrentUser: () => api.get('/auth/me'),
  getAllUsers: () => api.get('/auth/users/all'),
};

// Project API calls
export const projectAPI = {
  createProject: (data) => api.post('/projects', data),
  getProjects: () => api.get('/projects'),
  getProjectById: (id) => api.get(`/projects/${id}`),
  addMember: (projectId, userId) =>
    api.post(`/projects/${projectId}/members`, { userId }),
  removeMember: (projectId, userId) =>
    api.delete(`/projects/${projectId}/members/${userId}`),
};

// Task API calls
export const taskAPI = {
  createTask: (data) => api.post('/tasks', data),
  getUserTasks: () => api.get('/tasks/user/tasks'),
  getProjectTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
};

export default api;
