import { Router } from 'express';
import { searchProducts } from '../controllers/searchController';
import { searchLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public route with rate limiting
router.route('/')
  .get(searchLimiter, searchProducts);

export default router;