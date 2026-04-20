import { Router } from 'express';
import { 
  getReviews, 
  getReviewById, 
  createReview, 
  updateReview, 
  deleteReview 
} from '../controllers/reviewController';
import { protect } from '../middleware/auth';

const router = Router();

// Public routes
router.route('/product/:productId')
  .get(getReviews);

// Protected routes
router.route('/')
  .post(protect, createReview);

router.route('/:id')
  .get(getReviewById)
  .put(protect, updateReview)
  .delete(protect, deleteReview);

export default router;