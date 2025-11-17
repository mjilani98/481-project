# Quick Start Guide

## For First-Time Setup

### 1. Install Backend Dependencies
```bash
cd backend
npm install
```

### 2. Initialize Database
```bash
npm run init-db
```

You should see:
```
Database tables created successfully
Sample data inserted successfully

Test Credentials:
Vendor Login: pizza@vendor.com / password123
Student Login: student@test.com / password123
```

### 3. Start Backend Server
```bash
npm start
```

Server runs on: **http://localhost:5000**

### 4. Install Frontend Dependencies (New Terminal)
```bash
cd frontend
npm install
```

### 5. Start Frontend
```bash
npm start
```

App opens on: **http://localhost:3000**

## Daily Development

### Terminal 1 - Backend
```bash
cd backend
npm start
```

### Terminal 2 - Frontend
```bash
cd frontend
npm start
```

## Test the App

1. Go to http://localhost:3000
2. Login with test credentials:
   - **Student**: student@test.com / password123
   - **Vendor**: pizza@vendor.com / password123

## Common Issues

**"Port 5000 in use"**
- Change PORT in `backend/.env` to 5001

**"Can't connect to server"**
- Make sure backend is running first
- Check it's on port 5000

**"Module not found"**
- Run `npm install` in that directory

## Project Structure
```
backend/    → Node.js API (port 5000)
frontend/   → React App (port 3000)
```

## You're Ready!
Both servers running? You're all set!

Read **PROJECT_README.md** for full documentation.
