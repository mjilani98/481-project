import express from 'express';
import {
  createOrder,
  getStudentOrders,
  getVendorOrders,
  updateOrderStatus,
  getOrderById
} from '../controllers/orderController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Student routes
router.post('/', authenticateToken, authorizeRole('student'), createOrder);
router.get('/my-orders', authenticateToken, authorizeRole('student'), getStudentOrders);

// Vendor routes
router.get('/vendor/orders', authenticateToken, authorizeRole('vendor'), getVendorOrders);
router.put('/:id/status', authenticateToken, authorizeRole('vendor'), updateOrderStatus);

// Common routes
router.get('/:id', authenticateToken, getOrderById);

export default router;
