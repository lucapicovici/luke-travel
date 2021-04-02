import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  validateOrder,
  getMyOrders
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/validate').get(validateOrder);
router.route('/my-orders').get(protect, getMyOrders);

export default router;