import { Router } from 'express';
import multer from 'multer';
import { importData, exportData, getStatus } from '../controllers/importController';
import { protect, authorize } from '../middleware/auth';

const router = Router();
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit
  },
});

// Admin routes only
router.use(protect, authorize('admin'));

// Import routes
router.post('/import/:type', upload.single('file'), importData);

// Export routes
router.get('/export/:type', exportData);

// Status route
router.get('/status', getStatus);

export default router;
```
```typescript