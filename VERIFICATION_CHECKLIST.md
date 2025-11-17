# Setup Verification Checklist

Use this checklist to verify everything is working correctly.

## Pre-Flight Checklist

### Backend Files Created
- [ ] `backend/package.json` - Dependencies defined
- [ ] `backend/.env` - Environment variables
- [ ] `backend/src/server.js` - Main entry point
- [ ] `backend/src/config/database.js` - DB connection
- [ ] `backend/src/config/initDatabase.js` - DB initialization
- [ ] `backend/src/middleware/auth.js` - JWT middleware
- [ ] `backend/src/controllers/` - All 4 controllers
- [ ] `backend/src/routes/` - All 4 route files

### Frontend Files Created
- [ ] `frontend/package.json` - Dependencies defined
- [ ] `frontend/src/App.js` - Main app with routes
- [ ] `frontend/src/index.js` - Entry point
- [ ] `frontend/src/services/api.js` - API service
- [ ] `frontend/src/context/AuthContext.js` - Auth state
- [ ] `frontend/src/components/ProtectedRoute.js` - Route guard
- [ ] `frontend/src/pages/` - All 7 page components

### Documentation Files
- [ ] `README.md` - Main readme
- [ ] `QUICKSTART.md` - Setup guide
- [ ] `PROJECT_README.md` - Full documentation
- [ ] `TEAM_GUIDE.md` - Team workflow
- [ ] `API_TESTING.md` - API examples
- [ ] `SETUP_COMPLETE.md` - Summary
- [ ] `ARCHITECTURE_DIAGRAM.md` - Visual guide

## Installation Test

### Backend Setup
```bash
cd backend
npm install
```
**Expected:** Packages install without errors

```bash
npm run init-db
```
**Expected:** 
```
Database tables created successfully
Sample data inserted successfully
Test Credentials shown
```

```bash
npm start
```
**Expected:**
```
Server is running on http://localhost:5000
API endpoints available at http://localhost:5000/api
```

### Frontend Setup
```bash
cd frontend
npm install
```
**Expected:** Packages install without errors

```bash
npm start
```
**Expected:** Browser opens to http://localhost:3000

## Functionality Tests

### Test 1: Backend Health Check
**Action:** Open http://localhost:5000/api/health in browser
**Expected:** `{"status":"ok","message":"Server is running"}`
**Status:** [ ] Pass [ ] Fail

### Test 2: Student Registration
**Action:** 
1. Go to http://localhost:3000/register
2. Fill form with:
- Name: Test User
- Email: test@example.com
- Password: test123
- Role: Student
3. Click Register

**Expected:** Redirect to home page with restaurants
**Status:** [ ] Pass [ ] Fail

### Test 3: Student Login
**Action:**
1. Go to http://localhost:3000/login
2. Enter: student@test.com / password123
3. Click Login

**Expected:** Redirect to home page with restaurants
**Status:** [ ] Pass [ ] Fail

### Test 4: View Restaurant Menu
**Action:**
1. Login as student
2. Click on "Pizza Palace"

**Expected:** See menu items with prices and "Add to Cart" buttons
**Status:** [ ] Pass [ ] Fail

### Test 5: Place Order
**Action:**
1. Login as student
2. Go to restaurant
3. Add items to cart
4. Click "Proceed to Checkout"
5. Enter delivery address
6. Click "Place Order"

**Expected:** Success message and redirect to orders page
**Status:** [ ] Pass [ ] Fail

### Test 6: View Student Orders
**Action:**
1. Login as student
2. Click "My Orders"

**Expected:** See list of orders with status
**Status:** [ ] Pass [ ] Fail

### Test 7: Vendor Login
**Action:**
1. Go to http://localhost:3000/login
2. Enter: pizza@vendor.com / password123
3. Click Login

**Expected:** Redirect to vendor dashboard
**Status:** [ ] Pass [ ] Fail

### Test 8: View Vendor Orders
**Action:**
1. Login as vendor
2. Dashboard should show orders

**Expected:** See orders with filter buttons
**Status:** [ ] Pass [ ] Fail

### Test 9: Update Order Status
**Action:**
1. Login as vendor
2. Find a pending order
3. Click "Confirm Order"

**Expected:** Status updates, success message
**Status:** [ ] Pass [ ] Fail

### Test 10: Order Status Progression
**Action:**
1. Login as vendor
2. Progress an order: pending → confirmed → preparing → ready → delivered

**Expected:** Each status transition works
**Status:** [ ] Pass [ ] Fail

## Security Tests

### Test 11: Protected Route Without Login
**Action:**
1. Logout (or open incognito)
2. Try to access http://localhost:3000/home

**Expected:** Redirect to login page
**Status:** [ ] Pass [ ] Fail

### Test 12: Role-Based Access
**Action:**
1. Login as student
2. Try to access http://localhost:3000/vendor/dashboard

**Expected:** Redirect to home (student page)
**Status:** [ ] Pass [ ] Fail

### Test 13: Token Expiration
**Action:**
1. Login
2. Open browser console
3. Run: `localStorage.removeItem('token')`
4. Try to place an order

**Expected:** Error or redirect to login
**Status:** [ ] Pass [ ] Fail

## UI Tests

### Test 14: Navigation
**Action:** Click through all pages as student and vendor
**Expected:** All links work, no broken pages
**Status:** [ ] Pass [ ] Fail

### Test 15: Form Validation
**Action:** Try to submit forms with empty fields
**Expected:** Validation errors shown
**Status:** [ ] Pass [ ] Fail

### Test 16: Error Messages
**Action:** Try to login with wrong password
**Expected:** Clear error message displayed
**Status:** [ ] Pass [ ] Fail

## Database Tests

### Test 17: Data Persistence
**Action:**
1. Create an order
2. Restart backend server
3. Check if order still exists

**Expected:** Order persists in database
**Status:** [ ] Pass [ ] Fail

### Test 18: Sample Data
**Action:** Check database has sample data
```bash
# In backend directory
sqlite3 database.db "SELECT COUNT(*) FROM users;"
```
**Expected:** Shows 4 (or more if you added users)
**Status:** [ ] Pass [ ] Fail

## API Tests

### Test 19: GET All Restaurants
```bash
curl http://localhost:5000/api/restaurants
```
**Expected:** JSON array of restaurants
**Status:** [ ] Pass [ ] Fail

### Test 20: POST Create Order (with token)
**Action:** Use API_TESTING.md examples
**Expected:** Order created successfully
**Status:** [ ] Pass [ ] Fail

## Browser Compatibility

### Test 21: Different Browsers
**Action:** Test in Chrome, Firefox, Edge, Safari
**Expected:** Works in all browsers
**Status:** 
- [ ] Chrome
- [ ] Firefox
- [ ] Edge
- [ ] Safari

## Responsive Test

### Test 22: Mobile View
**Action:** 
1. Open DevTools (F12)
2. Toggle device toolbar
3. Test on mobile view

**Expected:** App is usable (may need improvements)
**Status:** [ ] Pass [ ] Fail

## Error Handling Tests

### Test 23: Backend Down
**Action:**
1. Stop backend server
2. Try to login from frontend

**Expected:** Error message (not crash)
**Status:** [ ] Pass [ ] Fail

### Test 24: Invalid API Request
**Action:** Try to access non-existent order ID
**Expected:** 404 error message
**Status:** [ ] Pass [ ] Fail

## Code Quality Checks

### Test 25: Console Errors
**Action:** Open browser console (F12) and navigate app
**Expected:** No red errors (warnings OK)
**Status:** [ ] Pass [ ] Fail

### Test 26: Backend Logs
**Action:** Check backend terminal while using app
**Expected:** No error messages
**Status:** [ ] Pass [ ] Fail

## Final Verification

### All Tests Summary
- Total Tests: 26
- Passed: ____
- Failed: ____

### Critical Tests (Must Pass)
- [ ] Test 2: Student Registration
- [ ] Test 3: Student Login
- [ ] Test 5: Place Order
- [ ] Test 7: Vendor Login
- [ ] Test 9: Update Order Status
- [ ] Test 11: Protected Routes
- [ ] Test 12: Role-Based Access

### If All Critical Tests Pass: **READY FOR DEVELOPMENT**

### If Any Critical Test Fails:
1. Check error messages in browser console
2. Check backend terminal for errors
3. Verify both servers are running
4. Review QUICKSTART.md
5. Check API_TESTING.md for examples

## Need Help?

If tests fail:
1. Read the error message carefully
2. Check PROJECT_README.md troubleshooting
3. Verify you followed QUICKSTART.md exactly
4. Make sure both servers are running
5. Clear browser cache and localStorage

## All Tests Passed?

**Congratulations!** Your setup is complete and working perfectly!

Next steps:
1. Read TEAM_GUIDE.md
2. Start customizing
3. Add your own features
4. Build something amazing!

---

**Date Tested:** _______________ 
**Tested By:** _______________ 
**Result:** [ ] All Pass [ ] Some Fail [ ] Need Fixes
