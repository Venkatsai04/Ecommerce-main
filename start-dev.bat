@echo off
start "Backend API" cmd /k "cd backend && nodemon server.js"
start "Main Frontend" cmd /k "cd frontend && npm run dev"
start "Admin Frontend" cmd /k "cd admin && npm run dev"