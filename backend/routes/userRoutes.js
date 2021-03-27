import express from 'express';
const router = express.Router();
import {
  authUser,
  registerUser,
  getUserProfile,
  updateUserProfile
} from '../controllers/userController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

router.route('/').post(registerUser);

router.route('/login').post(authUser);

router.route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;