import { Router } from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/auth';
import { 
  importProducts, 
  importUsers, 
  exportProducts, 
  exportUsers 
} from '../controllers/importController';
import { rateLimiter } from '../middleware/rateLimiter';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Product import routes
router.post('/products/csv', 
  protect, 
  authorize('admin', 'seller'), 
  rateLimiter.apiLimiter,
  upload.single('file'), 
  importProducts
);

router.post('/products/json', 
  protect, 
  authorize('admin', 'seller'), 
  rateLimiter.apiLimiter,
  importProducts
);

// User import routes
router.post('/users/csv', 
  protect, 
  authorize('admin'), 
  rateLimiter.apiLimiter,
  upload.single('file'), 
  importUsers
);

router.post('/users/json', 
  protect, 
  authorize('admin'), 
  rateLimiter.apiLimiter,
  importUsers
);

// Export routes
router.get('/products/csv', 
  protect, 
  authorize('admin', 'seller'), 
  rateLimiter.apiLimiter,
  exportProducts
);

router.get('/users/csv', 
  protect, 
  authorize('admin'), 
  rateLimiter.apiLimiter,
  exportUsers
);

export default router;