import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  validateOrder,
  getMyOrders,
  getOrderById,
  updateOrderToPaid
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/validate').get(validateOrder);
router.route('/my-orders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);

export default router;