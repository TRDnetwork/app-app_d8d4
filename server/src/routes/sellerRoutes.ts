import { Router } from 'express';
import { 
  getSellerOrders, 
  getSellerAnalytics 
} from '../controllers/sellerController';
import { protect, authorize } from '../middleware/auth';

const router = Router();

// Protected routes for sellers
router.route('/orders')
  .get(protect, authorize('seller'), getSellerOrders);

router.route('/analytics')
  .get(protect, authorize('seller'), getSellerAnalytics);

export default router;