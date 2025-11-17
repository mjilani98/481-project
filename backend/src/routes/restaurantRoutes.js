import express from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getVendorRestaurant,
  createRestaurant,
  updateRestaurant
} from '../controllers/restaurantController.js';
import { authenticateToken, authorizeRole } from '../middleware/auth.js';

const router = express.Router();

// Public routes
router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);

// Vendor routes
router.get('/vendor/my-restaurant', authenticateToken, authorizeRole('vendor'), getVendorRestaurant);
router.post('/', authenticateToken, authorizeRole('vendor'), createRestaurant);
router.put('/:id', authenticateToken, authorizeRole('vendor'), updateRestaurant);

export default router;
