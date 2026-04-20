import { Router } from 'express';
import { createOrder, getUserOrders, getOrder } from '../controllers/orderController';
import { authLimiter } from '../middleware/security';

const router = Router();

// Create order
router.post('/', authLimiter, createOrder);

// Get user orders
router.get('/', getUserOrders);

// Get order by ID
router.get('/:id', getOrder);

export default router;
```

```typescript