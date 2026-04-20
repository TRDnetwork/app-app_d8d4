import { Router } from 'express';
import { 
  getUsers, 
  getUserById, 
  updateUser, 
  deleteUser,
  createCoupon,
  getCoupons
} from '../controllers/adminController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protected routes for admins
router.route('/users')
  .get(protect, authorize('admin'), getUsers);

router.route('/users/:id')
  .get(protect, authorize('admin'), getUserById)
  .put(protect, authorize('admin'), updateUser)
  .delete(protect, authorize('admin'), deleteUser);

router.route('/coupons')
  .get(protect, authorize('admin'), getCoupons)
  .post(protect, authorize('admin'), createCoupon);

export default router;