import { Router } from 'express';
import { 
  getProducts, 
  getProductById, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../controllers/productController';
import { protect, authorize } from '../middleware/auth';
import { productCache } from '../middleware/caching';

const router = Router();

// Public routes
router.route('/')
  .get(productCache, getProducts)
  .post(protect, authorize('seller', 'admin'), createProduct);

router.route('/:id')
  .get(productCache, getProductById)
  .put(protect, authorize('seller', 'admin'), updateProduct)
  .delete(protect, authorize('seller', 'admin'), deleteProduct);

export default router;