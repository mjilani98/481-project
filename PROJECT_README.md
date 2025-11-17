# Smart Delivery - Campus Food Ordering System

A full-stack web application for on-campus food ordering with separate interfaces for students and vendors.

## Architecture

This project follows a **client-server architecture** with clear separation between frontend and backend:

```
481-project-main/
backend/ # Node.js/Express API Server
src/
config/ # Database configuration
controllers/ # Business logic
middleware/ # Authentication & validation
routes/ # API endpoints
server.js # Entry point
package.json
.env

frontend/ # React Application
src/
components/ # Reusable components
context/ # Auth context (state management)
pages/ # Page components
services/ # API calls
App.js # Main app component
package.json
```

## Technology Stack

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite (better-sqlite3)
- **Authentication**: JWT (JSON Web Tokens)
- **Password Hashing**: bcryptjs
- **CORS**: Enabled for cross-origin requests

### Frontend
- **Framework**: React (without TypeScript)
- **Routing**: React Router DOM
- **HTTP Client**: Native Fetch API
- **State Management**: React Context API
- **Styling**: Inline styles (simple & functional)

## Database Schema

### Users Table
```sql
CREATE TABLE users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
email TEXT UNIQUE NOT NULL,
password TEXT NOT NULL,
name TEXT NOT NULL,
role TEXT NOT NULL CHECK(role IN ('student', 'vendor')),
phone TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Restaurants Table
```sql
CREATE TABLE restaurants (
id INTEGER PRIMARY KEY AUTOINCREMENT,
vendor_id INTEGER NOT NULL,
name TEXT NOT NULL,
description TEXT,
image_url TEXT,
category TEXT,
is_active INTEGER DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (vendor_id) REFERENCES users(id)
);
```

### Menu Items Table
```sql
CREATE TABLE menu_items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
restaurant_id INTEGER NOT NULL,
name TEXT NOT NULL,
description TEXT,
price REAL NOT NULL,
image_url TEXT,
category TEXT,
is_available INTEGER DEFAULT 1,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### Orders Table
```sql
CREATE TABLE orders (
id INTEGER PRIMARY KEY AUTOINCREMENT,
student_id INTEGER NOT NULL,
restaurant_id INTEGER NOT NULL,
total_amount REAL NOT NULL,
status TEXT NOT NULL DEFAULT 'pending',
delivery_address TEXT,
notes TEXT,
created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (student_id) REFERENCES users(id),
FOREIGN KEY (restaurant_id) REFERENCES restaurants(id)
);
```

### Order Items Table
```sql
CREATE TABLE order_items (
id INTEGER PRIMARY KEY AUTOINCREMENT,
order_id INTEGER NOT NULL,
menu_item_id INTEGER NOT NULL,
quantity INTEGER NOT NULL,
price REAL NOT NULL,
FOREIGN KEY (order_id) REFERENCES orders(id),
FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

## Authentication Flow

### Registration
1. User submits registration form (email, password, name, role, phone)
2. Backend validates input and checks for duplicate email
3. Password is hashed using bcrypt (10 salt rounds)
4. User is created in database
5. JWT token is generated and returned
6. Frontend stores token in localStorage
7. User is redirected based on role (student → home, vendor → dashboard)

### Login
1. User submits credentials (email, password)
2. Backend finds user by email
3. Password is compared with stored hash
4. JWT token is generated with user info (id, email, role)
5. Token sent to frontend
6. Frontend stores token and user data
7. Redirect based on role

### Protected Routes
- Every protected API endpoint checks for `Authorization: Bearer <token>`
- JWT middleware verifies token validity
- Role-based middleware ensures correct permissions
- Invalid/expired tokens return 401/403 errors

## Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- A code editor (VS Code recommended)

### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Initialize the database with sample data
npm run init-db

# Start the backend server
npm start
```

The backend server will run on **http://localhost:5000**

### Step 2: Frontend Setup

```bash
# Open a new terminal
# Navigate to frontend directory
cd frontend

# Install dependencies (already done, but if needed)
npm install

# Start the React development server
npm start
```

The frontend will run on **http://localhost:3000**

### Step 3: Access the Application

1. Open your browser to **http://localhost:3000**
2. You'll be redirected to the login page

## Test Credentials

### Vendor Account
- **Email**: pizza@vendor.com
- **Password**: password123

### Student Account
- **Email**: student@test.com
- **Password**: password123

## Features

### Student Features
1. **Authentication**
- Register as a student
- Login with credentials

2. **Browse Restaurants**
- View all available restaurants
- See restaurant details and categories

3. **Menu & Ordering**
- Browse menu items with prices
- Add items to cart
- Adjust quantities
- Proceed to checkout

4. **Checkout**
- Enter delivery address
- Add special instructions
- Place order

5. **Order Tracking**
- View order history
- See order status (pending → confirmed → preparing → ready → delivered)
- View order details

### Vendor Features
1. **Authentication**
- Register as a vendor
- Login with credentials

2. **Order Management Dashboard**
- View all incoming orders
- Filter orders by status
- See customer details and contact info

3. **Order Processing**
- Confirm/cancel pending orders
- Mark orders as preparing
- Mark orders as ready for pickup/delivery
- Mark orders as delivered

4. **Order Details**
- View complete order information
- See customer delivery address
- Read special instructions

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get current user profile (protected)

### Restaurants
- `GET /api/restaurants` - Get all restaurants (public)
- `GET /api/restaurants/:id` - Get restaurant details with menu (public)
- `GET /api/restaurants/vendor/my-restaurant` - Get vendor's restaurant (vendor only)
- `POST /api/restaurants` - Create restaurant (vendor only)
- `PUT /api/restaurants/:id` - Update restaurant (vendor only)

### Menu Items
- `GET /api/menu/restaurant/:restaurantId` - Get menu items (public)
- `POST /api/menu` - Create menu item (vendor only)
- `PUT /api/menu/:id` - Update menu item (vendor only)
- `DELETE /api/menu/:id` - Delete menu item (vendor only)

### Orders
- `POST /api/orders` - Create order (student only)
- `GET /api/orders/my-orders` - Get student's orders (student only)
- `GET /api/orders/vendor/orders` - Get vendor's orders (vendor only)
- `PUT /api/orders/:id/status` - Update order status (vendor only)
- `GET /api/orders/:id` - Get order details (protected)

## Order Status Flow

```
pending → confirmed → preparing → ready → delivered
↓
cancelled
```

1. **Pending**: Order placed by student, waiting for vendor confirmation
2. **Confirmed**: Vendor accepted the order
3. **Preparing**: Vendor is preparing the food
4. **Ready**: Food is ready for pickup/delivery
5. **Delivered**: Order completed
6. **Cancelled**: Order cancelled by vendor

## Development Workflow

### For Team Members

Each team member can work on different parts:

1. **Frontend Developer**
- Customize page designs in `frontend/src/pages/`
- Add new components in `frontend/src/components/`
- Modify styles (currently inline, can move to CSS files)
- The API calls are already set up in `services/api.js`

2. **Backend Developer**
- Add new controllers in `backend/src/controllers/`
- Create new routes in `backend/src/routes/`
- Modify database schema in `backend/src/config/initDatabase.js`
- Add middleware in `backend/src/middleware/`

3. **Full-Stack Features**
- When adding a feature:
1. Add database table/columns if needed
2. Create controller methods
3. Add routes
4. Create/update API calls in frontend
5. Create/update pages/components

### Making Changes

```bash
# Always pull latest changes first
git pull

# Make your changes

# Test your changes
# Backend: npm start in backend folder
# Frontend: npm start in frontend folder

# Commit your changes
git add .
git commit -m "Description of changes"
git push
```

## Testing the Application

### Test Student Flow
1. Login as student@test.com
2. Browse restaurants on home page
3. Click on a restaurant
4. Add items to cart
5. Go to checkout
6. Enter delivery address
7. Place order
8. View orders page to see status

### Test Vendor Flow
1. Login as pizza@vendor.com
2. View dashboard with all orders
3. Filter orders by status
4. Click "Confirm Order" on pending order
5. Progress order through statuses
6. See customer information and delivery details

## Troubleshooting

### Backend Issues

**Port 5000 already in use**
```bash
# Change PORT in backend/.env to a different number
PORT=5001
```

**Database errors**
```bash
# Delete database.db file and re-initialize
cd backend
rm database.db
npm run init-db
```

### Frontend Issues

**Port 3000 already in use**
- When prompted, press 'Y' to run on different port

**Can't connect to backend**
- Ensure backend is running on port 5000
- Check `frontend/src/services/api.js` - API_URL should be `http://localhost:5000/api`

**Login not working**
- Check browser console for errors
- Verify backend is running
- Check network tab in browser dev tools

## Code Structure Explanation

### Backend Structure

**Controllers**: Handle business logic
- `authController.js` - Registration, login, profile
- `restaurantController.js` - Restaurant CRUD operations
- `menuController.js` - Menu item management
- `orderController.js` - Order creation and management

**Routes**: Define API endpoints
- Map HTTP methods (GET, POST, PUT, DELETE) to controller functions
- Apply middleware (authentication, authorization)

**Middleware**:
- `auth.js` - JWT verification and role-based access control

### Frontend Structure

**Context**:
- `AuthContext.js` - Global authentication state
- Provides login, register, logout functions
- Tracks current user

**Services**:
- `api.js` - All fetch calls to backend
- Handles authentication headers
- Organized by feature (auth, restaurant, menu, order)

**Pages**:
- Each page is a separate component
- Pages use hooks (useState, useEffect)
- Call API services to fetch/submit data

**Protected Routes**:
- `ProtectedRoute.js` - Wrapper component
- Checks if user is logged in
- Verifies user role matches required role

## Next Steps for Your Team

1. **Styling Improvements**
- Move inline styles to CSS files
- Add CSS frameworks (Bootstrap, Tailwind, etc.)
- Make responsive for mobile

2. **Additional Features**
- Image uploads for restaurants/menu items
- Search and filter functionality
- Real-time notifications
- Order ratings and reviews
- Payment integration

3. **Code Improvements**
- Add error boundaries
- Implement loading states consistently
- Add form validation
- Improve error messages

4. **Testing**
- Write unit tests
- Add integration tests
- Test edge cases

## Support

If you encounter issues:
1. Check the troubleshooting section
2. Look at browser console for errors
3. Check backend terminal for error messages
4. Review the code comments

## License

This is a school project - free to use and modify.

---

**Good luck with your project! The foundation is solid and ready for your team to build upon.** 
