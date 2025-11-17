import db from '../config/database.js';

// Create a new order
export const createOrder = (req, res) => {
  try {
    const { restaurant_id, items, delivery_address, notes } = req.body;

    if (!restaurant_id || !items || items.length === 0) {
      return res.status(400).json({ error: 'Restaurant and items are required' });
    }

    // Calculate total
    let totalAmount = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = db.prepare('SELECT * FROM menu_items WHERE id = ? AND is_available = 1')
        .get(item.menu_item_id);

      if (!menuItem) {
        return res.status(400).json({ error: `Menu item ${item.menu_item_id} not found or unavailable` });
      }

      const itemTotal = menuItem.price * item.quantity;
      totalAmount += itemTotal;
      orderItems.push({
        menu_item_id: item.menu_item_id,
        quantity: item.quantity,
        price: menuItem.price
      });
    }

    // Create order
    const orderStmt = db.prepare(`
      INSERT INTO orders (student_id, restaurant_id, total_amount, delivery_address, notes) 
      VALUES (?, ?, ?, ?, ?)
    `);
    const orderResult = orderStmt.run(
      req.user.id,
      restaurant_id,
      totalAmount,
      delivery_address || null,
      notes || null
    );

    // Insert order items
    const itemStmt = db.prepare(`
      INSERT INTO order_items (order_id, menu_item_id, quantity, price) 
      VALUES (?, ?, ?, ?)
    `);

    for (const item of orderItems) {
      itemStmt.run(orderResult.lastInsertRowid, item.menu_item_id, item.quantity, item.price);
    }

    res.status(201).json({
      message: 'Order created successfully',
      order: { id: orderResult.lastInsertRowid, total_amount: totalAmount }
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get student's orders
export const getStudentOrders = (req, res) => {
  try {
    const orders = db.prepare(`
      SELECT o.*, r.name as restaurant_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.student_id = ?
      ORDER BY o.created_at DESC
    `).all(req.user.id);

    // Get order items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.prepare(`
        SELECT oi.*, mi.name as item_name 
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `).all(order.id);

      return { ...order, items };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get student orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get vendor's orders (for their restaurant)
export const getVendorOrders = (req, res) => {
  try {
    // Get vendor's restaurant
    const restaurant = db.prepare('SELECT id FROM restaurants WHERE vendor_id = ?')
      .get(req.user.id);

    if (!restaurant) {
      return res.status(404).json({ error: 'No restaurant found for this vendor' });
    }

    const orders = db.prepare(`
      SELECT o.*, u.name as student_name, u.phone as student_phone 
      FROM orders o
      JOIN users u ON o.student_id = u.id
      WHERE o.restaurant_id = ?
      ORDER BY o.created_at DESC
    `).all(restaurant.id);

    // Get order items for each order
    const ordersWithItems = orders.map(order => {
      const items = db.prepare(`
        SELECT oi.*, mi.name as item_name 
        FROM order_items oi
        JOIN menu_items mi ON oi.menu_item_id = mi.id
        WHERE oi.order_id = ?
      `).all(order.id);

      return { ...order, items };
    });

    res.json(ordersWithItems);
  } catch (error) {
    console.error('Get vendor orders error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Update order status (vendor only)
export const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const validStatuses = ['pending', 'confirmed', 'preparing', 'ready', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    // Verify the order belongs to vendor's restaurant
    const order = db.prepare(`
      SELECT o.* FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ? AND r.vendor_id = ?
    `).get(id, req.user.id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found or unauthorized' });
    }

    db.prepare('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?')
      .run(status, id);

    res.json({ message: 'Order status updated successfully' });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};

// Get single order details
export const getOrderById = (req, res) => {
  try {
    const { id } = req.params;

    const order = db.prepare(`
      SELECT o.*, r.name as restaurant_name, u.name as student_name 
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      JOIN users u ON o.student_id = u.id
      WHERE o.id = ?
    `).get(id);

    if (!order) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Verify access (student owns order or vendor owns restaurant)
    if (req.user.role === 'student' && order.student_id !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    if (req.user.role === 'vendor') {
      const restaurant = db.prepare('SELECT * FROM restaurants WHERE id = ? AND vendor_id = ?')
        .get(order.restaurant_id, req.user.id);
      if (!restaurant) {
        return res.status(403).json({ error: 'Unauthorized' });
      }
    }

    const items = db.prepare(`
      SELECT oi.*, mi.name as item_name 
      FROM order_items oi
      JOIN menu_items mi ON oi.menu_item_id = mi.id
      WHERE oi.order_id = ?
    `).all(id);

    res.json({ ...order, items });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({ error: 'Server error' });
  }
};
