import express from 'express';
import { authenticate } from '../middleware/auth';
import { rls, protectResource } from '../middleware/rls';
import { cartController } from '../controllers/cartController';

const router = express.Router();

// Apply authentication and RLS middleware
router.use(authenticate, rls);

// Cart routes
router.get('/', cartController.getCart);
router.post('/items', cartController.addItem);
router.put('/items/:id', cartController.updateItem);
router.delete('/items/:id', cartController.removeItem);
router.post('/apply-coupon', cartController.applyCoupon);

export default router;
```

```typescript
// SECURITY FIX: Update wishlist routes to use RLS