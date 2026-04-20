import express from 'express';
import { authRateLimit } from '../middleware/rateLimit';
import { authController } from '../controllers/authController';
import { rls } from '../middleware/rls';

const router = express.Router();

// Apply rate limiting to all auth routes
router.use(authRateLimit);

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/verify-email', authController.verifyEmail);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

// Protected routes
router.post('/refresh', rls, authController.refreshToken);
router.post('/logout', rls, authController.logout);

export default router;
```

```typescript
// SECURITY FIX: Update cart routes to use RLS