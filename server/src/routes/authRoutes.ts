import { Router } from 'express';
import { 
  register, 
  verifyEmail, 
  login, 
  refreshToken, 
  logout, 
  forgotPassword, 
  resetPassword 
} from '../controllers/authController';
import { authLimiter, passwordResetLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, register);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', passwordResetLimiter, resetPassword);

// Protected routes
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
```

```typescript
// SECURITY FIX: Use environment variables for OAuth credentials