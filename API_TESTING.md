# API Testing Guide

Use these examples to test the backend API directly (useful for debugging).

## Testing Tools

**Option 1: Browser (for GET requests)**
- Just paste URL in browser

**Option 2: Command Line (curl)**
- Works for all request types

**Option 3: Postman/Insomnia**
- GUI tools for API testing

## Authentication Required

Most endpoints need a token. Get it by logging in first:

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
-H "Content-Type: application/json" \
-d '{"email":"student@test.com","password":"password123"}'
```

Response includes `token` - copy it and use in subsequent requests.

## API Examples

### Auth Endpoints

**Register Student**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
"email": "newstudent@test.com",
"password": "password123",
"name": "John Doe",
"role": "student",
"phone": "555-1234"
}'
```

**Register Vendor**
```bash
curl -X POST http://localhost:5000/api/auth/register \
-H "Content-Type: application/json" \
-d '{
"email": "newvendor@test.com",
"password": "password123",
"name": "Taco Shop",
"role": "vendor",
"phone": "555-5678"
}'
```

**Get Profile** (requires token)
```bash
curl http://localhost:5000/api/auth/profile \
-H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Restaurant Endpoints

**Get All Restaurants** (public)
```bash
curl http://localhost:5000/api/restaurants
```

**Get Restaurant with Menu** (public)
```bash
curl http://localhost:5000/api/restaurants/1
```

**Get Vendor's Restaurant** (vendor only)
```bash
curl http://localhost:5000/api/restaurants/vendor/my-restaurant \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

**Create Restaurant** (vendor only)
```bash
curl -X POST http://localhost:5000/api/restaurants \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
-d '{
"name": "Taco Paradise",
"description": "Best tacos in town",
"category": "mexican"
}'
```

### Menu Endpoints

**Get Menu Items for Restaurant** (public)
```bash
curl http://localhost:5000/api/menu/restaurant/1
```

**Create Menu Item** (vendor only)
```bash
curl -X POST http://localhost:5000/api/menu \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
-d '{
"restaurant_id": 1,
"name": "Supreme Taco",
"description": "Loaded with everything",
"price": 5.99,
"category": "tacos"
}'
```

**Update Menu Item** (vendor only)
```bash
curl -X PUT http://localhost:5000/api/menu/1 \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
-d '{
"price": 6.99,
"is_available": 1
}'
```

**Delete Menu Item** (vendor only)
```bash
curl -X DELETE http://localhost:5000/api/menu/1 \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

### Order Endpoints

**Create Order** (student only)
```bash
curl -X POST http://localhost:5000/api/orders \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_STUDENT_TOKEN" \
-d '{
"restaurant_id": 1,
"items": [
{"menu_item_id": 1, "quantity": 2},
{"menu_item_id": 2, "quantity": 1}
],
"delivery_address": "Dorm Room 304",
"notes": "Extra napkins please"
}'
```

**Get Student Orders** (student only)
```bash
curl http://localhost:5000/api/orders/my-orders \
-H "Authorization: Bearer YOUR_STUDENT_TOKEN"
```

**Get Vendor Orders** (vendor only)
```bash
curl http://localhost:5000/api/orders/vendor/orders \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN"
```

**Update Order Status** (vendor only)
```bash
curl -X PUT http://localhost:5000/api/orders/1/status \
-H "Content-Type: application/json" \
-H "Authorization: Bearer YOUR_VENDOR_TOKEN" \
-d '{"status": "confirmed"}'
```

**Get Order Details**
```bash
curl http://localhost:5000/api/orders/1 \
-H "Authorization: Bearer YOUR_TOKEN"
```

## Testing Workflow

### 1. Test Basic Connectivity
```bash
curl http://localhost:5000/api/health
```
Should return: `{"status":"ok","message":"Server is running"}`

### 2. Test Authentication Flow
1. Register a new user
2. Login to get token
3. Use token to access protected endpoints
4. Verify profile endpoint works

### 3. Test Student Flow
1. Login as student
2. Get all restaurants
3. Get specific restaurant with menu
4. Create an order
5. Get order history

### 4. Test Vendor Flow
1. Login as vendor
2. Get vendor's restaurant
3. Create menu item
4. Get vendor orders
5. Update order status

## Response Status Codes

- `200` - Success
- `201` - Created (for POST requests)
- `400` - Bad Request (validation error)
- `401` - Unauthorized (no token or invalid token)
- `403` - Forbidden (wrong role)
- `404` - Not Found
- `500` - Server Error

## Tips

**Getting Token Easily:**
1. Login through the React app
2. Open browser console (F12)
3. Type: `localStorage.getItem('token')`
4. Copy the token value

**Testing Errors:**
- Try requests without token
- Try wrong role (student accessing vendor endpoints)
- Try invalid data (missing required fields)
- Try non-existent IDs

**Debugging:**
- Check backend terminal for errors
- Look at the actual error message
- Verify request format (JSON, headers)
- Make sure backend is running

## Sample Data IDs

After running `npm run init-db`:

**Users:**
- Student: ID 4 (student@test.com)
- Vendor 1: ID 1 (pizza@vendor.com)
- Vendor 2: ID 2 (burger@vendor.com)
- Vendor 3: ID 3 (cafe@vendor.com)

**Restaurants:**
- Pizza Palace: ID 1
- Burger Kingdom: ID 2
- Campus Cafe: ID 3

**Menu Items:**
- IDs 1-9 (3 items per restaurant)

Use these IDs when testing endpoints that require IDs.
