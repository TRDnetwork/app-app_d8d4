import express from 'express';
import { authenticate } from '../middleware/auth';
import { rls, protectResource } from '../middleware/rls';
import { ordersController } from '../controllers/ordersController';

const router = express.Router();

// Apply authentication and RLS middleware
router.use(authenticate, rls);

// Orders routes
router.get('/', ordersController.getOrders);
router.post('/', ordersController.createOrder);
router.get('/:id', ordersController.getOrder);
router.put('/:id/cancel', ordersController.cancelOrder);
router.post('/:id/return', ordersController.requestReturn);

export default router;
```

```typescript
// SECURITY FIX: Update users routes to use RLS