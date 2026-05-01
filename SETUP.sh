# Backend
cd backend
npm install

# Frontend
cd ../frontend
npm install

# Copy environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# Update .env files with your configuration
echo "Setup complete! Update .env files with your configuration."
echo "Backend: backend/.env"
echo "Frontend: frontend/.env"
