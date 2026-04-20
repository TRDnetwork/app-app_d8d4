import express from 'express';
import { register, login, logout, refresh, verifyEmail, resendVerificationEmail, forgotPassword, resetPassword, getCurrentUser, updateProfile } from '../controllers/authController';
import { authRateLimit, passwordResetRateLimit } from '../middleware/rateLimit';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.post('/register', authRateLimit, register);
router.post('/login', authRateLimit, login);
router.post('/verify-email', verifyEmail);
router.post('/resend-verification', resendVerificationEmail);
router.post('/forgot-password', passwordResetRateLimit, forgotPassword);
router.post('/reset-password', passwordResetRateLimit, resetPassword);
router.post('/refresh', refresh);
router.post('/logout', logout);

// Protected routes
router.get('/me', authenticateToken, getCurrentUser);
router.patch('/me', authenticateToken, updateProfile);

export default router;
```

```typescript