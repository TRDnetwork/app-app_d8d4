import { Router } from 'express';
import { 
  getOrders, 
  getOrderById, 
  createOrder, 
  updateOrder, 
  cancelOrder 
} from '../controllers/orderController';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.route('/')
  .get(protect, getOrders)
  .post(protect, createOrder);

router.route('/:id')
  .get(protect, getOrderById)
  .put(protect, updateOrder);

router.route('/:id/cancel')
  .put(protect, cancelOrder);

export default router;