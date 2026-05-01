# Architecture & System Design

## System Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                    Browser / Frontend                        │
│              (React + Vite + Tailwind CSS)                   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ HTTP/CORS
                       │
┌──────────────────────▼──────────────────────────────────────┐
│                   Express Server                            │
│         (Node.js with ES6 Modules)                         │
│  ┌────────────────────────────────────────────────────┐   │
│  │            Router Layer                             │   │
│  │  ├─ authRoutes.js                                  │   │
│  │  ├─ projectRoutes.js                              │   │
│  │  └─ taskRoutes.js                                 │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │         Middleware Layer                            │   │
│  │  ├─ CORS & Body Parser                            │   │
│  │  ├─ Authentication Middleware (JWT)               │   │
│  │  ├─ Role-based Access Control                     │   │
│  │  └─ Error Handler                                 │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │        Controller Layer (Business Logic)           │   │
│  │  ├─ authController.js                            │   │
│  │  ├─ projectController.js                         │   │
│  │  └─ taskController.js                            │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │           Model/Schema Layer                       │   │
│  │  ├─ User.js (with bcrypt hashing)                │   │
│  │  ├─ Project.js                                   │   │
│  │  └─ Task.js                                      │   │
│  └────────────────────────────────────────────────────┘   │
│  ┌────────────────────────────────────────────────────┐   │
│  │        Utility Layer                               │   │
│  │  ├─ jwt.js (token generation)                    │   │
│  │  └─ validators.js (input validation)             │   │
│  └────────────────────────────────────────────────────┘   │
└──────────────────────┬──────────────────────────────────────┘
                       │
                       │ Mongoose ODM
                       │
┌──────────────────────▼──────────────────────────────────────┐
│              MongoDB Database                               │
│  ┌────────────────────────────────────────────────────┐   │
│  │  Collections:                                      │   │
│  │  ├─ users                                         │   │
│  │  ├─ projects                                      │   │
│  │  └─ tasks                                         │   │
│  └────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

## Frontend Architecture

### Component Tree
```
App.jsx (with Router)
├── AuthProvider
│   └── Routes
│       ├── /login → AuthPage (isLogin=true)
│       ├── /signup → AuthPage (isLogin=false)
│       ├── /dashboard → ProtectedRoute → Dashboard
│       ├── /projects → ProtectedRoute → ProjectsPage
│       └── /tasks/:projectId → ProtectedRoute → TasksPage
└── Global Styles (Tailwind CSS)
```

### State Management Flow
```
AuthContext
├── user (current user data)
├── token (JWT token)
├── loading (auth state)
├── login() (persist auth)
└── logout() (clear auth)
     ↓
useAuth() hook
     ↓
Components (via context)
```

### API Integration
```
services/api.js (Axios instance)
├── Interceptors (add JWT to requests)
├── authAPI (signup, login, getCurrentUser)
├── projectAPI (CRUD operations)
└── taskAPI (CRUD operations)
     ↓
Components (via async/await)
```

## Backend Architecture

### Request Flow
```
HTTP Request
    ↓
Express Router
    ↓
CORS Middleware ← Check origin
    ↓
Body Parser Middleware ← Parse JSON
    ↓
Authentication Middleware ← Verify JWT (if protected)
    ↓
Role-based Middleware ← Check user role (if admin-only)
    ↓
Input Validation Middleware ← Validate request data
    ↓
Controller Function ← Execute business logic
    ↓
Database Operations (via Mongoose)
    ↓
Response → JSON
    ↓
Error Handler (if error occurs)
    ↓
HTTP Response
```

### Controller Logic Pattern
```
Controller Function
├── Input Validation
├── Authorization Check
├── Database Query
├── Data Transformation
├── Response Generation
└── Error Handling
```

## Authentication Flow

### Signup Flow
```
User Form Submit
    ↓
Frontend validates (client-side)
    ↓
POST /api/auth/signup { name, email, password }
    ↓
Backend validates (server-side)
    ↓
Check email uniqueness
    ↓
Hash password with bcryptjs
    ↓
Create user in MongoDB
    ↓
Generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores in localStorage
    ↓
Redirect to /dashboard
```

### Login Flow
```
User Form Submit
    ↓
Frontend validates
    ↓
POST /api/auth/login { email, password }
    ↓
Backend finds user by email
    ↓
Compare password with hash
    ↓
If valid → Generate JWT token
    ↓
Return token + user data
    ↓
Frontend stores token
    ↓
Redirect to /dashboard
```

### Protected Route Flow
```
User navigates to /dashboard
    ↓
ProtectedRoute component checks
    ↓
Is token in localStorage?
    ↓
No → Redirect to /login
    ↓
Yes → Render component
    ↓
API calls include token in header
    ↓
Backend validates token
    ↓
If valid → Process request
    ↓
If invalid → Return 401
```

## Database Relationships

```
User (one-to-many)
    ├─ createdBy → Project
    ├─ createdBy → Task
    ├─ assignedTo → Task
    └─ members → Project

Project (one-to-many)
    ├─ projectId → Task
    └─ members → User

Task (many-to-one)
    ├─ projectId → Project
    ├─ assignedTo → User
    └─ createdBy → User
```

## Data Flow Examples

### Creating a Task
```
1. User fills form on /tasks/:projectId
2. Form submission → frontend validation
3. POST /api/tasks with JWT token
4. Backend auth middleware validates token
5. Controllers checks project membership
6. Validates input data
7. Creates task in MongoDB
8. Returns populated task with user details
9. Frontend updates tasks list
10. UI re-renders
```

### Updating Task Status
```
1. User clicks status dropdown
2. Select new status (PUT request)
3. Frontend sends: PUT /api/tasks/:id { status: "Completed" }
4. Backend verifies JWT and user assignment
5. Updates task in MongoDB
6. Returns updated task
7. Frontend updates local state
8. Dashboard statistics auto-update
```

## Middleware Stack

### Auth Middleware
- Extracts JWT from Authorization header
- Verifies token signature
- Attaches decoded user data to request
- Returns 401 if invalid

### Admin Middleware
- Checks if user role is 'admin'
- Returns 403 if not admin
- Allows only admin actions

### Error Handler
- Catches all errors
- Formats error responses
- Handles Mongoose validation errors
- Handles JWT errors
- Returns appropriate status codes

## Security Implementation

### Password Security
```
User Input → bcryptjs.hash (10 rounds) → Stored in DB
Login: User Input → bcryptjs.compare → Password Hash → Match?
```

### Token Security
```
JWT Structure: Header.Payload.Signature
Payload contains: { userId, role, expiresIn: '7d' }
Signature: HMAC(header.payload, JWT_SECRET)
Stored in: localStorage (frontend)
Sent in: Authorization: Bearer <token>
Verified by: jwt.verify(token, JWT_SECRET)
```

### Request Validation
```
Input → express-validator rules
├─ Type checking
├─ Length validation
├─ Email format
├─ Required fields
└─ Custom validators
```

## Error Handling

### Backend Error Handling
```
try-catch in controllers
    ↓
Catch block in asyncHandler
    ↓
Error middleware
    ├─ Mongoose ValidationError → 400
    ├─ Duplicate key error → 400
    ├─ JWT errors → 401
    ├─ Authorization errors → 403
    ├─ Not found → 404
    └─ Server errors → 500
```

### Frontend Error Handling
```
try-catch in async operations
    ↓
Catch error from API
    ├─ Check response.data.message
    ├─ Display in UI
    └─ Show loading state
```

## Performance Considerations

### Database Optimization
- Indexes on frequently queried fields
- Population of referenced documents
- Lean queries where needed

### Frontend Optimization
- Code splitting with React Router
- Lazy loading of pages
- Tailwind CSS tree-shaking
- Vite fast build process

### API Optimization
- RESTful endpoints
- Minimal data transfer
- Proper HTTP caching headers
- GZIP compression

## Scalability & Extensibility

### Current Implementation
- Single MongoDB database
- Simple JWT authentication
- Basic role-based access

### Future Enhancements
- Add more roles (Manager, Viewer, etc.)
- Implement pagination
- Add search and advanced filtering
- Real-time updates with WebSockets
- File upload for task attachments
- Task comments and history
- Email notifications
- Team chat integration
- Analytics and reporting

---

**This architecture supports the full application lifecycle from authentication to task management with security and scalability in mind.**
