import { Router } from 'express';
import passport from 'passport';

const router = Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get('/google/callback', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to frontend with token
    const user = (req as any).user;
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${user.token}&refreshToken=${user.refreshToken}`);
  }
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get('/facebook/callback', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Redirect to frontend with token
    const user = (req as any).user;
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${user.token}&refreshToken=${user.refreshToken}`);
  }
);

export default router;
```

```typescript
// SECURITY FIX: Use environment variables for client URL