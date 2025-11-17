import db from './database.js';

// Initialize database tables
const initDatabase = () => {
  try {
    // Users table (for both students and vendors)
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT UNIQUE NOT NULL,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        role TEXT NOT NULL CHECK(role IN ('student', 'vendor')),
        phone TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Restaurants table
    db.exec(`
      CREATE TABLE IF NOT EXISTS restaurants (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        vendor_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        image_url TEXT,
        category TEXT,
        is_active INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (vendor_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Menu items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS menu_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        restaurant_id INTEGER NOT NULL,
        name TEXT NOT NULL,
        description TEXT,
        price REAL NOT NULL,
        image_url TEXT,
        category TEXT,
        is_available INTEGER DEFAULT 1,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `);

    // Orders table
    db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        student_id INTEGER NOT NULL,
        restaurant_id INTEGER NOT NULL,
        total_amount REAL NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending' CHECK(status IN ('pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled')),
        delivery_address TEXT,
        notes TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (restaurant_id) REFERENCES restaurants(id) ON DELETE CASCADE
      )
    `);

    // Order items table
    db.exec(`
      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        menu_item_id INTEGER NOT NULL,
        quantity INTEGER NOT NULL,
        price REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE,
        FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
      )
    `);

    console.log('Database tables created successfully');

    // Insert sample data
    insertSampleData();

  } catch (error) {
    console.error('Error initializing database:', error.message);
    process.exit(1);
  }
};

const insertSampleData = async () => {
  try {
    // Check if data already exists
    const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get();
    if (existingUsers.count > 0) {
      console.log('Sample data already exists');
      return;
    }

    // Insert sample vendors (password is 'password123' hashed)
    const bcrypt = await import('bcryptjs');
    const hashedPassword = bcrypt.default.hashSync('password123', 10);

    const insertUser = db.prepare(`
      INSERT INTO users (email, password, name, role, phone) 
      VALUES (?, ?, ?, ?, ?)
    `);

    // Sample vendors
    const vendor1 = insertUser.run('pizza@vendor.com', hashedPassword, 'Pizza Palace', 'vendor', '555-0101');
    const vendor2 = insertUser.run('burger@vendor.com', hashedPassword, 'Burger Kingdom', 'vendor', '555-0102');
    const vendor3 = insertUser.run('cafe@vendor.com', hashedPassword, 'Campus Cafe', 'vendor', '555-0103');

    // Sample student
    insertUser.run('student@test.com', hashedPassword, 'Test Student', 'student', '555-0200');

    // Insert sample restaurants
    const insertRestaurant = db.prepare(`
      INSERT INTO restaurants (vendor_id, name, description, category) 
      VALUES (?, ?, ?, ?)
    `);

    const rest1 = insertRestaurant.run(vendor1.lastInsertRowid, 'Pizza Palace', 'Authentic Italian Pizza', 'pizza');
    const rest2 = insertRestaurant.run(vendor2.lastInsertRowid, 'Burger Kingdom', 'Gourmet Burgers & Fries', 'burgers');
    const rest3 = insertRestaurant.run(vendor3.lastInsertRowid, 'Campus Cafe', 'Coffee & Quick Bites', 'cafe');

    // Insert sample menu items
    const insertMenuItem = db.prepare(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category) 
      VALUES (?, ?, ?, ?, ?)
    `);

    // Pizza items
    insertMenuItem.run(rest1.lastInsertRowid, 'Margherita Pizza', 'Classic tomato and mozzarella', 12.99, 'pizza');
    insertMenuItem.run(rest1.lastInsertRowid, 'Pepperoni Pizza', 'Loaded with pepperoni', 14.99, 'pizza');
    insertMenuItem.run(rest1.lastInsertRowid, 'Veggie Supreme', 'Fresh vegetables', 13.99, 'pizza');

    // Burger items
    insertMenuItem.run(rest2.lastInsertRowid, 'Classic Burger', 'Beef patty with lettuce and tomato', 8.99, 'burgers');
    insertMenuItem.run(rest2.lastInsertRowid, 'Cheese Burger', 'With cheddar cheese', 9.99, 'burgers');
    insertMenuItem.run(rest2.lastInsertRowid, 'Chicken Burger', 'Grilled chicken breast', 9.49, 'burgers');

    // Cafe items
    insertMenuItem.run(rest3.lastInsertRowid, 'Cappuccino', 'Fresh espresso with steamed milk', 4.50, 'coffee');
    insertMenuItem.run(rest3.lastInsertRowid, 'Club Sandwich', 'Triple decker sandwich', 7.99, 'sandwiches');
    insertMenuItem.run(rest3.lastInsertRowid, 'Chocolate Muffin', 'Freshly baked', 3.50, 'pastries');

    console.log('Sample data inserted successfully');
    console.log('\nTest Credentials:');
    console.log('Vendor Login: pizza@vendor.com / password123');
    console.log('Student Login: student@test.com / password123');

  } catch (error) {
    console.error('Error inserting sample data:', error.message);
  }
};

initDatabase();
