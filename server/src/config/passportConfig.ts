import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/generateToken';

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!, // SECURITY FIX: Use environment variable
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!, // SECURITY FIX: Use environment variable
  callbackURL: '/api/auth/oauth/google/callback',
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ 
      oauth_provider: 'google', 
      oauth_id: profile.id 
    });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      
      if (existingUser) {
        // Update existing user with OAuth info
        existingUser.oauth_provider = 'google';
        existingUser.oauth_id = profile.id;
        user = await existingUser.save();
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          oauth_provider: 'google',
          oauth_id: profile.id,
          role: 'customer',
          email_verified: true
        });
      }
    }

    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return done(null, { user, token, refreshToken });
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Facebook OAuth configuration
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!, // SECURITY FIX: Use environment variable
  clientSecret: process.env.FACEBOOK_APP_SECRET!, // SECURITY FIX: Use environment variable
  callbackURL: '/api/auth/oauth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ 
      oauth_provider: 'facebook', 
      oauth_id: profile.id 
    });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      
      if (existingUser) {
        // Update existing user with OAuth info
        existingUser.oauth_provider = 'facebook';
        existingUser.oauth_id = profile.id;
        user = await existingUser.save();
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          oauth_provider: 'facebook',
          oauth_id: profile.id,
          role: 'customer',
          email_verified: true
        });
      }
    }

    // Generate tokens
    const payload = { id: user._id, role: user.role };
    const token = generateToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return done(null, { user, token, refreshToken });
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, (user as any).id);
});

// Deserialize user
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error as Error, undefined);
  }
});

export const config = passport;
```

```typescript