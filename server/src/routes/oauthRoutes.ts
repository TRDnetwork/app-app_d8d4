```ts
import { Router } from 'express';
import passport from 'passport';
import { authLimiter } from '../middleware/rateLimiter';

const router = Router();

// Google OAuth routes
router.get('/google', authLimiter, passport.authenticate('google', {
  scope: ['profile', 'email'],
}));

router.get('/google/callback', authLimiter, 
  passport.authenticate('google', { 
    failureRedirect: '/login?error=google_auth_failed',
    session: false 
  }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${req.user.token}`);
  }
);

// Facebook OAuth routes
router.get('/facebook', authLimiter, passport.authenticate('facebook', {
  scope: ['email'],
}));

router.get('/facebook/callback', authLimiter,
  passport.authenticate('facebook', { 
    failureRedirect: '/login?error=facebook_auth_failed',
    session: false 
  }),
  (req, res) => {
    // Successful authentication, redirect to client
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${req.user.token}`);
  }
);

export default router;
```