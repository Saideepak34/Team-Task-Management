# Quick Start Guide

## Prerequisites
- Node.js v16+
- MongoDB Atlas account
- Git

## Installation

### 1. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```

Edit `backend/.env`:
```
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/team-task-manager
JWT_SECRET=your_secure_secret_key_here
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 2. Frontend Setup
```bash
cd ../frontend
npm install
cp .env.example .env
```

Edit `frontend/.env`:
```
VITE_API_URL=http://localhost:5000/api
```

## Running the Application

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
cd frontend
npm run dev
```

Access the application at http://localhost:5173

## Default Test Flow

1. **Sign Up** - Create a new account at /signup
2. **Dashboard** - View your tasks and statistics
3. **Projects** - Create and manage projects (admin role required)
4. **Tasks** - Create and update tasks within projects

## API Documentation

See [README.md](./README.md#-api-endpoints) for complete API documentation.

## Deployment

See [README.md](./README.md#-deployment-on-railway) for Railway deployment guide.

## Troubleshooting

See [README.md](./README.md#-troubleshooting) for common issues and solutions.
