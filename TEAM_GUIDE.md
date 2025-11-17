# 👥 Team Development Guide

## 🎯 Project Overview

This is a **Smart Delivery System** for on-campus food ordering. It has:
- **Backend**: Express.js REST API with SQLite database
- **Frontend**: React SPA (Single Page Application)
- **Authentication**: JWT-based with role separation (student/vendor)

## 📋 Team Roles & Responsibilities

### Frontend Team
**Files to work with:**
- `frontend/src/pages/` - All page components
- `frontend/src/components/` - Reusable components
- `frontend/src/services/api.js` - Already set up, use these functions

**What you can customize:**
- Page layouts and styling
- Add new pages
- Improve UI/UX
- Add form validations
- Make it responsive

**What NOT to change:**
- Authentication flow (unless you know what you're doing)
- API endpoint URLs (they're already configured)

### Backend Team
**Files to work with:**
- `backend/src/controllers/` - Business logic
- `backend/src/routes/` - API endpoints
- `backend/src/middleware/` - Custom middleware

**What you can add:**
- New API endpoints
- New controllers
- Database tables/columns
- Validation logic
- Error handling

**What NOT to change:**
- Authentication middleware (it's working!)
- Database connection setup

### Full-Stack Features

If adding a complete new feature:

1. **Database** (if needed)
   - Modify `backend/src/config/initDatabase.js`
   - Add new tables

2. **Backend**
   - Create controller in `backend/src/controllers/`
   - Add routes in `backend/src/routes/`
   - Import routes in `backend/src/server.js`

3. **Frontend**
   - Add API calls in `frontend/src/services/api.js`
   - Create page in `frontend/src/pages/`
   - Add route in `frontend/src/App.js`

## 🔧 Development Workflow

### Starting Work

```bash
# 1. Pull latest changes
git pull origin main

# 2. Start backend (Terminal 1)
cd backend
npm start

# 3. Start frontend (Terminal 2)
cd frontend
npm start
```

### Making Changes

1. **Make your changes** in your assigned files
2. **Test thoroughly** - click around, try to break it
3. **Check browser console** for errors (F12)
4. **Check backend terminal** for errors

### Committing Changes

```bash
# Check what changed
git status

# Add your changes
git add .

# Commit with a clear message
git commit -m "Add: feature description"
# or
git commit -m "Fix: bug description"
# or
git commit -m "Update: what you updated"

# Push to repository
git push origin main
```

## 📁 File Guide

### Most Important Files

**Frontend:**
- `App.js` - Main app, all routes defined here
- `pages/Login.js` - Login page
- `pages/Home.js` - Student home page (restaurant list)
- `pages/VendorDashboard.js` - Vendor order management
- `services/api.js` - All backend API calls
- `context/AuthContext.js` - Authentication state

**Backend:**
- `server.js` - Entry point, all routes registered here
- `controllers/authController.js` - Login/Register logic
- `controllers/orderController.js` - Order management
- `routes/` - API endpoint definitions
- `middleware/auth.js` - JWT verification

## 🎨 Customization Ideas

### Easy Changes
- Change colors (search for backgroundColor, color in styles)
- Modify button text
- Add images/logos
- Change page titles

### Medium Difficulty
- Add loading spinners
- Improve form validation
- Add more filter options
- Create better error messages

### Advanced
- Add image upload for menu items
- Real-time order updates
- Search functionality
- Email notifications

## 🐛 Common Issues & Solutions

### "I changed code but nothing happens"
- Make sure you saved the file
- Refresh browser (Ctrl+R or Cmd+R)
- Check browser console for errors
- Restart the dev server

### "I get 401 Unauthorized error"
- Logout and login again
- Check if token expired (24 hours)
- Clear localStorage: `localStorage.clear()` in browser console

### "Backend not responding"
- Check if backend server is running
- Look at backend terminal for errors
- Verify the port (should be 5000)

### "Can't see my changes"
- Hard refresh: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
- Clear browser cache

## 🧪 Testing Checklist

Before pushing code, test:

**Student Flow:**
- [ ] Can register new student
- [ ] Can login
- [ ] Can see restaurants
- [ ] Can add items to cart
- [ ] Can checkout and place order
- [ ] Can view orders

**Vendor Flow:**
- [ ] Can login as vendor
- [ ] Can see all orders
- [ ] Can filter orders
- [ ] Can update order status
- [ ] Status updates are saved

## 💡 Tips

1. **Use Browser DevTools** (F12)
   - Console tab: See JavaScript errors
   - Network tab: See API calls
   - Application tab: See localStorage

2. **Test with Multiple Roles**
   - Open one browser window as student
   - Open incognito/private window as vendor
   - Test interactions

3. **Read Error Messages**
   - Backend errors show in terminal
   - Frontend errors show in browser console
   - Most error messages tell you exactly what's wrong

4. **Don't Be Afraid to Ask**
   - If stuck, ask teammates
   - Google the error message
   - Check the documentation

## 📞 Getting Help

1. Check `PROJECT_README.md` for detailed docs
2. Look at the troubleshooting section
3. Search the error message online
4. Ask in team chat

## ✅ Code Quality

### Good Practices
- Write clear variable names
- Add comments for complex logic
- Keep functions small and focused
- Test before committing

### Bad Practices
- Don't commit broken code
- Don't push directly to main without testing
- Don't change files you don't understand
- Don't hardcode sensitive data

## 🚀 Deployment (Future)

When ready to deploy:
1. Build frontend: `npm run build` in frontend folder
2. Set up production database
3. Configure environment variables
4. Deploy backend to a service (Heroku, Railway, etc.)
5. Deploy frontend to a service (Netlify, Vercel, etc.)

## 🎓 Learning Resources

- **React**: reactjs.org/docs
- **Express**: expressjs.com
- **JWT**: jwt.io
- **SQLite**: sqlite.org/docs.html

---

**Remember**: This is a learning project. Make mistakes, experiment, and ask questions! 🎉
