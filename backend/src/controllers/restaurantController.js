import db from '../config/database.js';

// Get all restaurants
export const getAllRestaurants = (req, res) => {
  try {
    const restaurants = db.prepare(`
      SELECT r.*, u.name as vendor_name, u.phone as vendor_phone 
      FROM restaurants r 
      JOIN users u ON r.vendor_id = u.id 
      WHERE r.is_active = 1
    `).all();

    res.json(restaurants);
  } catch (error) {
    console.error('Get restaurants error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get restaurant by ID with menu items
export const getRestaurantById = (req, res) => {
  try {
    const { id } = req.params;

    const restaurant = db.prepare(`
      SELECT r.*, u.name as vendor_name, u.phone as vendor_phone 
      FROM restaurants r 
      JOIN users u ON r.vendor_id = u.id 
      WHERE r.id = ?
    `).get(id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found' });
    }

    const menuItems = db.prepare(`
      SELECT * FROM menu_items 
      WHERE restaurant_id = ? AND is_available = 1
    `).all(id);

    res.json({ ...restaurant, menuItems });
  } catch (error) {
    console.error('Get restaurant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get vendor's restaurant
export const getVendorRestaurant = (req, res) => {
  try {
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE vendor_id = ?')
      .get(req.user.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'No restaurant found for this vendor' });
    }

    const menuItems = db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ?')
      .all(restaurant.id);

    res.json({ ...restaurant, menuItems });
  } catch (error) {
    console.error('Get vendor restaurant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create restaurant (vendor only)
export const createRestaurant = (req, res) => {
  try {
    const { name, description, category, image_url } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Restaurant name is required' });
    }

    // Check if vendor already has a restaurant
    const existing = db.prepare('SELECT * FROM restaurants WHERE vendor_id = ?')
      .get(req.user.id);

    if (existing) {
      return res.status(400).json({ error: 'Vendor already has a restaurant' });
    }

    const stmt = db.prepare(`
      INSERT INTO restaurants (vendor_id, name, description, category, image_url) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const result = stmt.run(req.user.id, name, description || null, category || null, image_url || null);

    res.status(201).json({
      message: 'Restaurant created successfully',
      restaurant: { id: result.lastInsertRowid, ...req.body }
    });
  } catch (error) {
    console.error('Create restaurant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update restaurant
export const updateRestaurant = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, category, image_url, is_active } = req.body;

    // Verify ownership
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ? AND vendor_id = ?')
      .get(id, req.user.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'Restaurant not found or unauthorized' });
    }

    const stmt = db.prepare(`
      UPDATE restaurants 
      SET name = ?, description = ?, category = ?, image_url = ?, is_active = ?
      WHERE id = ?
    `);
    stmt.run(
      name || restaurant.name,
      description !== undefined ? description : restaurant.description,
      category || restaurant.category,
      image_url !== undefined ? image_url : restaurant.image_url,
      is_active !== undefined ? is_active : restaurant.is_active,
      id
    );

    res.json({ message: 'Restaurant updated successfully' });
  } catch (error) {
    console.error('Update restaurant error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
