import express from 'express';
const router = express.Router();
import {
  getHotels
} from '../controllers/hotelController.js';

router.route('/').get(getHotels);

export default router;