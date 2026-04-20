import { Router } from 'express';
import { register, verifyEmail, login, refreshToken, logout, forgotPassword, resetPassword } from '../controllers/authController';
import { rateLimit } from 'express-rate-limit';

// Create rate limiter for auth routes
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: { 
    success: false, 
    message: 'Too many requests, please try again later.' 
  },
});

const router = Router();

// Public routes with rate limiting
router.post('/register', authLimiter, register);
router.post('/verify-email', authLimiter, verifyEmail);
router.post('/login', authLimiter, login);
router.post('/forgot-password', authLimiter, forgotPassword);
router.post('/reset-password', authLimiter, resetPassword);

// Protected routes
router.post('/refresh-token', refreshToken);
router.post('/logout', logout);

export default router;
```

```typescript