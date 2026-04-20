import { Router } from 'express';
import { 
  getWishlist, 
  addToWishlist, 
  removeFromWishlist 
} from '../controllers/wishlistController';
import { protect } from '../middleware/auth';

const router = Router();

// Protected routes
router.route('/')
  .get(protect, getWishlist)
  .post(protect, addToWishlist);

router.route('/:id')
  .delete(protect, removeFromWishlist);

export default router;