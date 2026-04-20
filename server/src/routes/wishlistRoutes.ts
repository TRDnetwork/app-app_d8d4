import express from 'express';
import { authenticate } from '../middleware/auth';
import { rls, protectResource } from '../middleware/rls';
import { wishlistController } from '../controllers/wishlistController';

const router = express.Router();

// Apply authentication and RLS middleware
router.use(authenticate, rls);

// Wishlist routes
router.get('/', wishlistController.getWishlist);
router.post('/:productId', wishlistController.addToWishlist);
router.delete('/:productId', wishlistController.removeFromWishlist);

export default router;
```

```typescript
// SECURITY FIX: Update orders routes to use RLS