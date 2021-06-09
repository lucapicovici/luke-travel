import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  validateOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid,
  getRoomCalendarBookings_days,
  getOrders,
  updateOrderToDelivered
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/')
  .post(protect, addOrderItems)
  .get(protect, admin, getOrders);
  
router.route('/calendar/:hotel/:room').get(getRoomCalendarBookings_days);
router.route('/validate').get(validateOrder);
router.route('/my-orders').get(protect, getMyOrders);

router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

export default router;