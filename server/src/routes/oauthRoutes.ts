import express from 'express';
import passport from 'passport';
import { StatusCodes } from 'http-status-codes';

const router = express.Router();

// Google OAuth routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home
    res.redirect('/');
  }
);

// Facebook OAuth routes
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));

router.get(
  '/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  (req, res) => {
    // Successful authentication, redirect home
    res.redirect('/');
  }
);

// OAuth success handler
router.get('/success', (req, res) => {
  if (!req.user) {
    return res.status(StatusCodes.UNAUTHORIZED).json({
      success: false,
      message: 'Authentication failed',
    });
  }

  // Generate tokens
  const payload = { id: req.user.id, role: req.user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Set refresh token as HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  res.json({
    success: true,
    accessToken,
    user: req.user,
  });
});

// OAuth error handler
router.get('/error', (req, res) => {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Authentication failed',
  });
});

export default router;
```

```typescript