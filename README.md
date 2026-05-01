# Team Task Manager 🚀

A complete production-ready web application for managing team tasks and projects. Built with React, Node.js, Express, and MongoDB.

## ✨ Features

### 🔐 Authentication
- User signup and login with email/password
- JWT-based token authentication
- Password hashing using bcrypt
- Role-based access control (Admin & Member)

### 👥 User Roles
- **Admin**: Can create projects, add/remove members, assign tasks
- **Member**: Can view assigned tasks and update task status

### 📋 Project Management
- Create and manage projects (Admin only)
- Add team members to projects
- View all projects you belong to
- Project-level task organization

### ✅ Task Management
- Create tasks with title, description, deadline
- Three task statuses: Pending, In Progress, Completed
- Update task status
- Track overdue tasks
- Filter tasks by status

### 📊 Dashboard
- View all assigned tasks
- Real-time task statistics:
  - Total tasks
  - Completed tasks
  - Pending tasks
  - Overdue tasks
- Filter and search tasks

## 🛠 Tech Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose ODM)
- **Authentication**: JWT + bcryptjs
- **Validation**: express-validator
- **Environment**: dotenv

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Routing**: React Router v6
- **HTTP Client**: Axios
- **Styling**: Tailwind CSS
- **State Management**: React Context API

### Deployment
- **Platform**: Railway
- **Database**: MongoDB Atlas
- **Environment Variables**: .env configuration

## 📁 Project Structure

```
team-task-manager/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── authController.js
│   │   │   ├── projectController.js
│   │   │   └── taskController.js
│   │   ├── middleware/
│   │   │   ├── auth.js
│   │   │   └── errorHandler.js
│   │   ├── models/
│   │   │   ├── User.js
│   │   │   ├── Project.js
│   │   │   └── Task.js
│   │   ├── routes/
│   │   │   ├── authRoutes.js
│   │   │   ├── projectRoutes.js
│   │   │   └── taskRoutes.js
│   │   ├── utils/
│   │   │   ├── validators.js
│   │   │   └── jwt.js
│   │   └── server.js
│   ├── package.json
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── pages/
│   │   │   ├── AuthPage.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ProjectsPage.jsx
│   │   │   └── TasksPage.jsx
│   │   ├── components/
│   │   │   └── ProtectedRoute.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── hooks/
│   │   │   └── useAuth.js
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.cjs
│   └── .env.example
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (for cloud database)

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
```env
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/team-task-manager
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

5. **Start the backend server:**
```bash
npm run dev
```

The backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory (in a new terminal):**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in `.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

5. **Start the development server:**
```bash
npm run dev
```

The frontend will run on `http://localhost:5173`

## 🔌 API Endpoints

### Authentication
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/signup` | Register new user |
| POST | `/api/auth/login` | Login user |
| GET | `/api/auth/me` | Get current user (requires auth) |

### Projects
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/projects` | Create project (admin only) |
| GET | `/api/projects` | Get all user's projects |
| GET | `/api/projects/:id` | Get project details |
| POST | `/api/projects/:id/members` | Add member to project (admin only) |
| DELETE | `/api/projects/:id/members/:userId` | Remove member (admin only) |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks` | Create task |
| GET | `/api/tasks/user/tasks` | Get user's tasks |
| GET | `/api/tasks/project/:projectId` | Get project tasks |
| GET | `/api/tasks/:id` | Get task details |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task (creator only) |

## 📊 Database Models

### User Schema
```javascript
{
  name: String (required),
  email: String (required, unique),
  password: String (required, hashed),
  role: String (enum: ['admin', 'member']),
  createdAt: Date,
  updatedAt: Date
}
```

### Project Schema
```javascript
{
  name: String (required),
  description: String,
  createdBy: ObjectId (ref: User),
  members: [ObjectId] (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

### Task Schema
```javascript
{
  title: String (required),
  description: String,
  projectId: ObjectId (ref: Project, required),
  assignedTo: ObjectId (ref: User, required),
  status: String (enum: ['Pending', 'In Progress', 'Completed']),
  deadline: Date,
  createdBy: ObjectId (ref: User),
  createdAt: Date,
  updatedAt: Date
}
```

## 🧪 Testing the Application

### Test Credentials
Create test users via signup at `/signup`

### Test Workflow
1. Sign up a new user (will be created as 'member')
2. Admin can create projects
3. Admin can add members to projects
4. Members can view assigned tasks
5. Members can update task status
6. Check dashboard for statistics

## 🚀 Deployment on Railway

### Step 1: Prepare for Deployment

#### Backend

1. **Create `Procfile` in backend folder:**
```
web: node src/server.js
```

2. **Update `package.json` scripts:**
```json
{
  "scripts": {
    "start": "node src/server.js",
    "dev": "nodemon src/server.js"
  }
}
```

#### Frontend

1. **Build frontend:**
```bash
npm run build
```

### Step 2: Deploy on Railway

1. **Create Railway Account:** https://railway.app

2. **Deploy Backend:**
   - Go to Railway dashboard
   - Click "New Project"
   - Connect your GitHub repo or use CLI
   - Add MongoDB service:
     - Search for "MongoDB"
     - Add MongoDB plugin
     - Copy connection string
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a secure secret
     - `NODE_ENV`: production
     - `CORS_ORIGIN`: Your frontend URL
   - Deploy

3. **Deploy Frontend:**
   - Build: `npm run build`
   - The `dist` folder is ready to deploy
   - Option 1: Deploy to Vercel, Netlify, or Railway static hosting
   - Option 2: Update `VITE_API_URL` to your Railway backend URL

### Step 3: Update Environment Variables

Update frontend `.env` file in production:
```env
VITE_API_URL=https://your-backend-railway-url.up.railway.app/api
```

### Step 4: MongoDB Atlas Setup

1. Create MongoDB Atlas cluster: https://www.mongodb.com/cloud/atlas
2. Create database user
3. Get connection string: `mongodb+srv://user:password@cluster.mongodb.net/dbname`
4. Whitelist Railway IP in MongoDB Atlas

## 🔒 Security Best Practices

✅ **Implemented:**
- Password hashing with bcryptjs
- JWT token-based authentication
- Role-based access control
- Input validation using express-validator
- Error handling middleware
- CORS configuration

✅ **For Production:**
- Use strong JWT secrets (generate with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- Enable HTTPS
- Set secure cookie flags
- Use environment variables for secrets
- Implement rate limiting
- Add request logging
- Use HTTPS in CORS_ORIGIN

## 📦 Available Scripts

### Backend
```bash
npm run dev     # Start development server with nodemon
npm start       # Start production server
```

### Frontend
```bash
npm run dev     # Start development server
npm run build   # Build for production
npm run preview # Preview production build
```

## 🐛 Troubleshooting

### MongoDB Connection Error
- Check MongoDB Atlas connection string
- Verify database user credentials
- Ensure IP is whitelisted in MongoDB Atlas
- Check MONGODB_URI in .env

### CORS Error
- Verify CORS_ORIGIN matches frontend URL
- Check backend has CORS middleware enabled
- Check frontend API URL matches backend

### Token Errors
- Ensure token is sent in Authorization header: `Bearer <token>`
- Check JWT_SECRET is same on backend
- Verify token hasn't expired

### Port Already in Use
```bash
# Kill process on port 5000 (backend)
lsof -ti:5000 | xargs kill -9

# Kill process on port 5173 (frontend)
lsof -ti:5173 | xargs kill -9
```

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Happy Task Managing! 🎉**
