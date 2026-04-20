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

const router = Router();

// Public routes
router.post('/register', register);
router.post('/verify-email', verifyEmail);
router.post('/login', login);
router.post('/refresh', refreshToken);
router.post('/logout', logout);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
```

```typescript