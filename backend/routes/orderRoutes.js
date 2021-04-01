import express from 'express';
const router = express.Router();
import {
  addOrderItems,
  validateOrder
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

router.route('/').post(protect, addOrderItems);
router.route('/validate').get(validateOrder);

export default router;