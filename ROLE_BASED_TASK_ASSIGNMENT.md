# Role-Based Task Assignment System

## Overview
This document outlines the new role-based task assignment system implemented for the Team Task Manager application.

## Key Features

### 1. Admin-Only Task Creation
- **Only admins can create and assign tasks** to team members
- Members cannot create tasks but can update the status of tasks assigned to them
- Unauthorized members see a notification message on the create task button area

### 2. Multiple Task Assignments
- **Admins can assign a single task to multiple team members** simultaneously
- Members who are assigned to a task can update its status
- The multi-select UI uses Ctrl/Cmd + Click to select multiple assignees

### 3. Project Progress Tracking
- Each project now has a `status` field with values: `Planning`, `In Progress`, `On Hold`, `Completed`
- Project progress is calculated as: `(Completed Tasks / Total Tasks) × 100%`
- Progress bar and percentage displayed when viewing project tasks
- Admin can see project progress when creating tasks

### 4. Role-Based Views
- **Admins**: See all tasks in a project, can create and assign tasks
- **Members**: Only see tasks assigned to them on their dashboard

## Database Model Changes

### Task Model
```javascript
assignedTo: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
]
```
Changed from single user reference to array of users for multiple assignments.

### Project Model
```javascript
status: {
  type: String,
  enum: ['Planning', 'In Progress', 'On Hold', 'Completed'],
  default: 'Planning',
}
```
Added project status field for tracking project lifecycle.

### User Model (Already Existed)
```javascript
role: {
  type: String,
  enum: ['admin', 'member'],
  default: 'member',
}
```

## Backend API Changes

### Task Creation (POST `/api/tasks`)
**Requirements:**
- User must be authenticated and have `admin` role
- Accepts array of `assignedTo` user IDs
- Validates all assigned users exist in database
- Returns project progress with response

**Request Body:**
```json
{
  "title": "Task Title",
  "description": "Task description",
  "projectId": "project-id",
  "assignedTo": ["user-id-1", "user-id-2"],
  "deadline": "2024-05-15T10:00:00Z"
}
```

### Get Project Tasks (GET `/api/tasks/project/:projectId`)
**Returns:**
```json
{
  "tasks": [...],
  "project": {
    "_id": "project-id",
    "name": "Project Name",
    "description": "Description",
    "status": "In Progress",
    "progress": 65
  }
}
```

### Get User Tasks (GET `/api/tasks/user/tasks`)
**Returns only tasks assigned to the logged-in user:**
```json
{
  "tasks": [...],
  "stats": {
    "totalTasks": 5,
    "completedTasks": 2,
    "pendingTasks": 2,
    "overdueTasks": 1
  }
}
```

### Update Task (PUT `/api/tasks/:id`)
- **Allowed**: Assigned users, admin, or task creator
- Members can only update the task status
- Admins can update all task fields

## Frontend Changes

### TasksPage Component
1. **Multi-Select Assignment** (Admin Only)
   - Hold Ctrl/Cmd to select multiple members
   - Visual tags show selected members
   - Ability to remove members before submitting

2. **Project Progress Display**
   - Shows project status badge
   - Displays progress bar with percentage
   - Only visible when viewing a specific project

3. **Role-Based UI**
   - "Create Task" button only visible to admins
   - Members see informational message about admin-only feature
   - Task assignment display shows all assigned members as tags

4. **User Feedback**
   - Toast notifications for:
     - Successful task creation
     - Permission errors (non-admins attempting to create)
     - Validation errors (no assignees selected)

### Task Card Display
- Shows multiple assignees as individual badges
- Color-coded status badges (Pending, In Progress, Completed)
- Project name and deadline information

## Security Features

### Middleware
- **authMiddleware**: Validates JWT token
- **adminMiddleware**: Checks if user has `admin` role
- Applied to POST `/api/tasks` route

### Authorization Checks
- Task creation: User must be admin
- Task update: User must be assigned, admin, or creator
- Task access: User must be assigned, admin, or creator
- Project access: User must be project member

## User Experience

### For Admins
1. Navigate to a project
2. Click "Create Task"
3. Fill in task details
4. Select multiple members using multi-select
5. Set deadline (optional)
6. Submit to assign task to all selected members
7. View project progress indicator

### For Members
1. Dashboard shows only assigned tasks
2. Can update task status (Pending → In Progress → Completed)
3. Cannot create tasks (see informational message)
4. Can see who else is assigned to shared tasks

## API Endpoints Summary

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/tasks` | ✓ | Admin | Create task with multiple assignees |
| GET | `/api/tasks/user/tasks` | ✓ | Any | Get user's assigned tasks |
| GET | `/api/tasks/project/:id` | ✓ | Any | Get all tasks in project with progress |
| GET | `/api/tasks/:id` | ✓ | Any | Get single task details |
| PUT | `/api/tasks/:id` | ✓ | Any | Update task (status/details) |
| DELETE | `/api/tasks/:id` | ✓ | Creator | Delete task |
| GET | `/api/auth/users/all` | ✓ | Any | Get all users for assignment |

## Testing the Feature

### Test Case 1: Admin Creating Multi-Task Assignment
1. Login as admin
2. Navigate to a project
3. Click "Create Task"
4. Select 2-3 members
5. Verify all members receive the task

### Test Case 2: Member Task View
1. Login as member
2. Go to dashboard
3. Verify only assigned tasks are shown
4. Try to update task status
5. Cannot create new tasks

### Test Case 3: Project Progress
1. Create 4 tasks
2. Complete 1 task
3. Verify progress shows 25%
4. Complete more tasks
5. Verify progress updates accordingly

## Error Handling

### Client-Side Errors
- "Only admins can create tasks"
- "Please assign task to at least one person"
- "Unable to create task"
- "Unable to update task"

### Server-Side Errors
- 403 Forbidden: Non-admin attempting to create task
- 400 Bad Request: Invalid user IDs in assignedTo array
- 404 Not Found: Project or task not found
- 403 Forbidden: Unauthorized task access

## Future Enhancements
- Task reassignment by admin after creation
- Bulk task creation
- Task templates
- Recurring tasks
- Task priority levels
- Task dependencies/subtasks
