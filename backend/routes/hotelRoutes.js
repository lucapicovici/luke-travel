import express from 'express';
const router = express.Router();
import {
  getHotels,
  getHotelById,
  deleteHotel,
  updateHotel,
  createHotelReview,
  deleteHotelReview
} from '../controllers/hotelController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').get(getHotels);

router.route('/:id/reviews').post(protect, createHotelReview);
router.route('/:id/reviews/:reviewId').delete(protect, admin, deleteHotelReview);

router.route('/:id')
  .get(getHotelById)
  .delete(protect, admin, deleteHotel)
  .put(protect, admin, updateHotel);

export default router;