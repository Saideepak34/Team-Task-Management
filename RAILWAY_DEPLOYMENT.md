# Railway Deployment Guide 🚀

Complete step-by-step guide to deploy Team Task Manager to Railway.

## Prerequisites

- Railway account (https://railway.app)
- GitHub account with repository
- MongoDB Atlas account
- Backend and Frontend code ready

---

## Step 1: Prepare MongoDB Atlas

### 1.1 Create MongoDB Cluster
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up or login
3. Create a free cluster
4. Choose AWS provider and region
5. Create cluster (may take 2-3 minutes)

### 1.2 Create Database User
1. Go to "Database Access"
2. Click "Add New Database User"
3. Username: `taskmanager`
4. Password: Generate a strong password (save it!)
5. Database User Privileges: "Read and write to any database"
6. Click "Add User"

### 1.3 Configure Network Access
1. Go to "Network Access"
2. Click "Add IP Address"
3. Select "Allow access from anywhere"
4. Confirm

### 1.4 Get Connection String
1. Go to "Database"
2. Click "Connect"
3. Choose "Connect your application"
4. Select Node.js and version 4.1 or later
5. Copy the connection string:
   ```
   mongodb+srv://taskmanager:PASSWORD@cluster0.mongodb.net/team-task-manager?retryWrites=true&w=majority
   ```
6. Replace PASSWORD with your database user password

---

## Step 2: Prepare GitHub Repository

### 2.1 Create Repository Structure
Your repository should have:
```
team-task-manager/
├── backend/
│   ├── src/
│   ├── package.json
│   └── .env.example
├── frontend/
│   ├── src/
│   ├── package.json
│   └── .env.example
└── README.md
```

### 2.2 Push to GitHub
```bash
cd team-task-manager
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/team-task-manager.git
git push -u origin main
```

---

## Step 3: Deploy Backend to Railway

### 3.1 Create Backend Service
1. Go to https://railway.app/dashboard
2. Click "New Project"
3. Select "Deploy from GitHub repo"
4. Connect your GitHub account
5. Select your `team-task-manager` repository
6. Click "Deploy"

### 3.2 Configure Backend Service
1. Once created, click on the service
2. Go to "Settings"
3. Change "Root Directory" to `backend`
4. Go to "Variables"
5. Add the following environment variables:

   | Key | Value |
   |-----|-------|
   | `NODE_ENV` | `production` |
   | `PORT` | `5000` |
   | `MONGODB_URI` | Paste your MongoDB connection string |
   | `JWT_SECRET` | Generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
   | `CORS_ORIGIN` | Will update after frontend deployment |

### 3.3 Add MongoDB Service (Optional - if not using Atlas)
1. Click "Add Service" (+ icon)
2. Select "Database"
3. Choose "MongoDB"
4. Click "Create"

### 3.4 Get Backend URL
1. Once deployed, click on the service
2. Go to "Deployments"
3. Wait for "Success" status
4. The public URL will be shown in the left sidebar
5. Copy it (e.g., `https://team-task-manager-backend.up.railway.app`)

### 3.5 Monitor Logs
- Click "Logs" to see deployment progress
- Look for: `Server is running on port 5000`

---

## Step 4: Deploy Frontend to Railway

### 4.1 Create Frontend Service
1. In your Railway project, click "Add Service"
2. Select "GitHub repo"
3. Select your `team-task-manager` repository
4. Click "Deploy"

### 4.2 Configure Frontend Service
1. Click on the frontend service
2. Go to "Settings"
3. Change "Root Directory" to `frontend`
4. Go to "Build" section
5. Set:
   - **Build Command**: `npm run build`
   - **Start Command**: Leave empty (static site)
   - **Publish Directory**: `dist`

### 4.3 Add Environment Variable
1. Go to "Variables"
2. Add:
   
   | Key | Value |
   |-----|-------|
   | `VITE_API_URL` | `https://your-backend-url.up.railway.app/api` |

Replace `your-backend-url` with your actual backend Railway URL

### 4.4 Add Web Service
1. Click "Add Service"
2. Select "Nixpacks"
3. This provides static hosting

---

## Step 5: Update Backend CORS

1. Go back to backend service
2. Click "Variables"
3. Update `CORS_ORIGIN` to your frontend Railway URL
4. Example: `https://team-task-manager-frontend.up.railway.app`

---

## Step 6: Verify Deployment

### 6.1 Test Backend API
```bash
curl https://your-backend-url.up.railway.app/api/health
```

Expected response:
```json
{
  "message": "Server is running"
}
```

### 6.2 Test Frontend
Visit: `https://your-frontend-url.up.railway.app`

You should see the login page.

### 6.3 Test Full Flow
1. Sign up a new user
2. Create a project
3. Create a task
4. Update task status
5. Check dashboard

---

## Step 7: Setup Custom Domain (Optional)

### 7.1 For Backend
1. Go to backend service
2. Click "Settings"
3. Find "Domains"
4. Add custom domain
5. Update your DNS records

### 7.2 For Frontend
Same process as backend

---

## 🐛 Troubleshooting

### Backend Won't Deploy

**Error: No package.json in root**
- Solution: Set "Root Directory" to `backend`

**Error: Cannot find module**
- Solution: Ensure all dependencies are in package.json
- Fix: Run `npm install` locally, then commit package-lock.json

**Error: MongoDB connection failed**
- Check MONGODB_URI is correct
- Verify IP is whitelisted in MongoDB Atlas
- Test connection string locally

### Frontend Won't Deploy

**Error: Build failed**
- Check that `npm run build` works locally
- Verify all dependencies are in package.json
- Check for TypeScript errors

**Error: Blank page**
- Check browser console for errors
- Verify VITE_API_URL is set correctly
- Check backend is running

### API Calls Failing

**Error: 401 Unauthorized**
- Backend JWT_SECRET may be different
- Check token is being sent in header
- Verify token format: `Bearer <token>`

**Error: CORS error**
- Update CORS_ORIGIN in backend
- Verify frontend URL is whitelisted
- Check Access-Control headers

**Error: Cannot find database**
- Verify MONGODB_URI is correct
- Test connection locally
- Check MongoDB Atlas firewall

### Login Issues

**Cannot login despite correct credentials**
- Check backend logs for errors
- Verify password hashing is working
- Ensure user exists in database

**Token not persisting**
- Check localStorage is enabled
- Verify token is being saved
- Check token format in API calls

---

## 📊 Monitor Deployment

### View Logs
1. Select service
2. Click "Logs"
3. View real-time logs

### View Metrics
1. Select service
2. Click "Metrics"
3. Monitor CPU, memory, network

### View Deployments
1. Select service
2. Click "Deployments"
3. See deployment history
4. View build/deployment status

---

## 🔄 Redeploy

### Auto-Redeploy on Git Push
- Railway automatically redeploys when you push to main branch

### Manual Redeploy
1. Select service
2. Click "Deployments"
3. Click the latest deployment
4. Click "Redeploy"

### Redeploy with Specific Commit
1. Select service
2. Click "Deployments"
3. Click "Deploy" button
4. Select commit
5. Click "Deploy"

---

## 🔐 Security Checklist

- [x] JWT_SECRET is strong (32+ characters)
- [x] MongoDB password is strong
- [x] CORS_ORIGIN is correctly set
- [x] NODE_ENV is set to 'production'
- [x] No sensitive data in git
- [x] .env files are in .gitignore
- [x] HTTPS is enabled (Railway provides it)
- [x] MongoDB IP whitelist is configured
- [x] Database user has limited permissions
- [x] API validates all inputs

---

## 🚀 Production Best Practices

### Performance
- Frontend: Vite provides optimized builds
- Backend: Node.js clustering (optional)
- Database: Indexes on frequently queried fields
- Caching: Implement Redis (future enhancement)

### Reliability
- Error monitoring: Add Sentry (future)
- Logging: Use structured logging
- Backups: Enable MongoDB backups
- Health checks: Implement health endpoints

### Scalability
- Horizontal scaling: Railway handles automatically
- Load balancing: Railway provides load balancing
- Database: MongoDB handles scaling

---

## 📈 Scaling Up

### If Traffic Increases

1. **Backend**: Railway scales automatically
   - Monitor CPU/Memory in Metrics
   - Increase instance size if needed

2. **Frontend**: Static site, scales easily
   - MongoDB can handle more connections
   - Add caching layer (Cloudflare)

3. **Database**: 
   - Upgrade MongoDB cluster tier
   - Add read replicas for scaling

---

## 💾 Backup & Recovery

### MongoDB Backups
1. Go to MongoDB Atlas
2. Click "Backup"
3. Enable automatic backups
4. Set retention policy

### Application Backup
- Your code is in GitHub (version control)
- Environment variables are in Railway
- Database is in MongoDB Atlas

### Recovery Process
1. MongoDB: Restore from backup in Atlas
2. Code: Redeploy from GitHub
3. Environment: Reset variables in Railway

---

## 🎉 You're Live!

Your Team Task Manager is now deployed on Railway! 🚀

### Share Your App
- Backend URL: `https://your-backend-url.up.railway.app`
- Frontend URL: `https://your-frontend-url.up.railway.app`

### What's Next?
- Monitor logs and metrics
- Add your custom domain
- Setup monitoring/alerts
- Implement additional features
- Optimize performance

---

## 📞 Support & Resources

- Railway Docs: https://docs.railway.app
- MongoDB Atlas Docs: https://docs.mongodb.com/
- Express.js Docs: https://expressjs.com
- React Docs: https://react.dev

---

**Congratulations on your deployment! 🎊**

Your Team Task Manager is now accessible to the world!
