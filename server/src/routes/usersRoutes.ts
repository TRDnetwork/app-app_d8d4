import express from 'express';
import { authenticate } from '../middleware/auth';
import { rls, protectResource } from '../middleware/rls';
import { usersController } from '../controllers/usersController';

const router = express.Router();

// Apply authentication and RLS middleware
router.use(authenticate, rls);

// Users routes
router.get('/me', usersController.getProfile);
router.put('/me', usersController.updateProfile);
router.post('/me/avatar', usersController.uploadAvatar);
router.get('/me/addresses', usersController.getAddresses);
router.post('/me/addresses', usersController.addAddress);
router.put('/me/addresses/:id', usersController.updateAddress);
router.delete('/me/addresses/:id', usersController.deleteAddress);

export default router;
```

```typescript
// SECURITY FIX: Update .env.example with proper environment variables