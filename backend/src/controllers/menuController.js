import db from '../config/database.js';

// Get menu items for a restaurant
export const getMenuItems = (req, res) => {
  try {
    const { restaurantId } = req.params;

    const menuItems = db.prepare('SELECT * FROM menu_items WHERE restaurant_id = ?')
      .all(restaurantId);

    res.json(menuItems);
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Create menu item (vendor only)
export const createMenuItem = (req, res) => {
  try {
    const { restaurant_id, name, description, price, category, image_url } = req.body;

    if (!name || !price || !restaurant_id) {
      return res.status(400).json({ error: 'Name, price, and restaurant_id are required' });
    }

    // Verify restaurant ownership
    const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ? AND vendor_id = ?')
      .get(restaurant_id, req.user.id);

    if (!restaurant) {
      return res.status(403).json({ error: 'Unauthorized or restaurant not found' });
    }

    const stmt = db.prepare(`
      INSERT INTO menu_items (restaurant_id, name, description, price, category, image_url) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    const result = stmt.run(restaurant_id, name, description || null, price, category || null, image_url || null);

    res.status(201).json({
      message: 'Menu item created successfully',
      menuItem: { id: result.lastInsertRowid, ...req.body }
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update menu item
export const updateMenuItem = (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, category, image_url, is_available } = req.body;

    // Verify ownership through restaurant
    const menuItem = db.prepare(`
      SELECT mi.* FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE mi.id = ? AND r.vendor_id = ?
    `).get(id, req.user.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found or unauthorized' });
    }

    const stmt = db.prepare(`
      UPDATE menu_items 
      SET name = ?, description = ?, price = ?, category = ?, image_url = ?, is_available = ?
      WHERE id = ?
    `);
    stmt.run(
      name || menuItem.name,
      description !== undefined ? description : menuItem.description,
      price || menuItem.price,
      category || menuItem.category,
      image_url !== undefined ? image_url : menuItem.image_url,
      is_available !== undefined ? is_available : menuItem.is_available,
      id
    );

    res.json({ message: 'Menu item updated successfully' });
  } catch (error) {
    console.error('Update menu item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Delete menu item
export const deleteMenuItem = (req, res) => {
  try {
    const { id } = req.params;

    // Verify ownership through restaurant
    const menuItem = db.prepare(`
      SELECT mi.* FROM menu_items mi
      JOIN restaurants r ON mi.restaurant_id = r.id
      WHERE mi.id = ? AND r.vendor_id = ?
    `).get(id, req.user.id);

    if (!menuItem) {
      return res.status(404).json({ error: 'Menu item not found or unauthorized' });
    }

    db.prepare('DELETE FROM menu_items WHERE id = ?').run(id);

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
