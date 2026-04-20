```ts
import { Router } from 'express';
import passport from 'passport';
import { config } from '../config/passportConfig';

const router = Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', {
  scope: ['profile', 'email'],
  session: false
}));

router.get('/google/callback', 
  passport.authenticate('google', { 
    failureRedirect: '/auth/login',
    session: false 
  }),
  (req, res) => {
    // Successful authentication, redirect to client with tokens
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${req.user?.token}`);
  }
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', {
  scope: ['email'],
  session: false
}));

router.get('/facebook/callback',
  passport.authenticate('facebook', {
    failureRedirect: '/auth/login',
    session: false
  }),
  (req, res) => {
    // Successful authentication, redirect to client with tokens
    res.redirect(`${process.env.CLIENT_URL}/auth/callback?token=${req.user?.token}`);
  }
);

export default router;
```