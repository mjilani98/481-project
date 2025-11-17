# Smart Delivery - Campus Food Ordering System

A complete full-stack web application for on-campus food ordering with dual interfaces for students and vendors.

## Quick Start

**First Time Setup? Read this first:** [QUICKSTART.md](QUICKSTART.md)

### TL;DR

```bash
# Terminal 1 - Backend
cd backend
npm install
npm run init-db
npm start

# Terminal 2 - Frontend
cd frontend
npm install
npm start
```

Then open http://localhost:3000 and login with test credentials!

## Documentation

- **[QUICKSTART.md](QUICKSTART.md)** - Get up and running in 5 minutes
- **[PROJECT_README.md](PROJECT_README.md)** - Complete technical documentation
- **[TEAM_GUIDE.md](TEAM_GUIDE.md)** - Development workflow & team collaboration
- **[API_TESTING.md](API_TESTING.md)** - API testing & debugging guide

## Project Features

### Student Side
- User authentication (register/login)
- Browse restaurants
- View menus and add items to cart
- Checkout and place orders
- Track order status in real-time
- View order history

### Vendor Side
- Vendor authentication
- Order management dashboard
- Filter orders by status
- Update order status (pending -> confirmed -> preparing -> ready -> delivered)
- View customer details and delivery information

## Tech Stack

**Backend:**
- Node.js + Express.js
- SQLite Database
- JWT Authentication
- bcrypt Password Hashing

**Frontend:**
- React (No TypeScript)
- React Router
- Context API (State Management)
- Fetch API (HTTP Requests)

## Test Credentials

**Student Account:**
- Email: student@test.com
- Password: password123

**Vendor Account:**
- Email: pizza@vendor.com
- Password: password123

## Project Structure

```
backend/          # Express API Server
├── src/
│   ├── config/      # Database setup
│   ├── controllers/ # Business logic
│   ├── middleware/  # Auth & validation
│   ├── routes/      # API endpoints
│   └── server.js    # Entry point

frontend/         # React Application
├── src/
│   ├── components/  # Reusable components
│   ├── context/     # Auth context
│   ├── pages/       # Page components
│   ├── services/    # API calls
│   └── App.js       # Main app
```

## For Team Members

**New to the project?** Read [TEAM_GUIDE.md](TEAM_GUIDE.md) for:
- Your role and responsibilities
- What files to work on
- Development workflow
- Common issues and solutions

## Testing

1. Start both backend and frontend servers
2. Login with test credentials
3. Test student flow (browse → order → track)
4. Test vendor flow (view orders → update status)

See [API_TESTING.md](API_TESTING.md) for API testing examples.

## Troubleshooting

**Backend won't start?**
- Check if port 5000 is free
- Run `npm install` in backend folder

**Frontend won't start?**
- Run `npm install` in frontend folder
- Try port 3001 if 3000 is busy

**Can't connect to backend?**
- Ensure backend is running
- Check API_URL in `frontend/src/services/api.js`

**More help?** Check [PROJECT_README.md](PROJECT_README.md) troubleshooting section.

## Full Documentation

For complete technical details, architecture, database schema, API endpoints, and more:

**[Read PROJECT_README.md](PROJECT_README.md)**

## Ready to Start

1. Follow [QUICKSTART.md](QUICKSTART.md) to set up
2. Read [TEAM_GUIDE.md](TEAM_GUIDE.md) to understand workflow
3. Start coding!

---

Built for CPSC 481 Project
# campus-restaurant-management-system
# restaurant-campus
