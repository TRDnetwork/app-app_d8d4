import { Router } from 'express';
import { 
  getCart, 
  addToCart, 
  updateCartItem, 
  removeCartItem 
} from '../controllers/cartController';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.route('/')
  .get(protect, getCart)
  .post(protect, addToCart);

router.route('/:id')
  .put(protect, updateCartItem)
  .delete(protect, removeCartItem);

export default router;