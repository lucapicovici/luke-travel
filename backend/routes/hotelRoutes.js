import express from 'express';
const router = express.Router();
import {
  getHotels,
  getHotelById,
  deleteHotel
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getHotels);

router.route('/:id')
  .get(getHotelById)
  .delete(protect, admin, deleteHotel);

export default router;