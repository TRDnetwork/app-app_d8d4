import { Router } from 'express';
import { 
  getCategories, 
  getCategoryById, 
  createCategory, 
  updateCategory, 
  deleteCategory 
} from '../controllers/categoryController';
import { protect, authorize } from '../middleware/auth';
import { categoryCache } from '../middleware/caching';

const router = Router();

// Public routes
router.route('/')
  .get(categoryCache, getCategories)
  .post(protect, authorize('admin'), createCategory);

router.route('/:id')
  .get(categoryCache, getCategoryById)
  .put(protect, authorize('admin'), updateCategory)
  .delete(protect, authorize('admin'), deleteCategory);

export default router;