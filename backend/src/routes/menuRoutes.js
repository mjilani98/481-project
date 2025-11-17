import express from 'express';
import {
  getMenuItems,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem
} from '../controllers/menuController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/restaurant/:restaurantId', getMenuItems);

// Vendor routes
router.post('/', authenticateToken, authorizeRole('vendor'), createMenuItem);
router.put('/:id', authenticateToken, authorizeRole('vendor'), updateMenuItem);
router.delete('/:id', authenticateToken, authorizeRole('vendor'), deleteMenuItem);

export default router;
