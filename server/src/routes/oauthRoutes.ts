import { Router } from 'express';
import passport from 'passport';
import { securityHeaders } from '../middleware/securityHeaders';

const router = Router();

// Apply security headers to all OAuth routes
router.use(securityHeaders);

// Google OAuth
router.get('/google', 
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or send tokens
    res.redirect('/');
  }
);

// Facebook OAuth
router.get('/facebook',
  passport.authenticate('facebook', { scope: ['email'] })
);

router.get('/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home or send tokens
    res.redirect('/');
  }
);

export default router;
```

```typescript