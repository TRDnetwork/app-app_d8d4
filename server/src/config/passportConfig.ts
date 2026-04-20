import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import { User } from '../models/User';
import { generateAccessToken, generateRefreshToken } from '../utils/token';

// Google OAuth configuration
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/auth/oauth/google/callback',
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ 
      oauthProvider: 'google', 
      oauthId: profile.id 
    });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      
      if (existingUser) {
        // Update existing user with OAuth info
        existingUser.oauthProvider = 'google';
        existingUser.oauthId = profile.id;
        existingUser.emailVerified = true;
        user = await existingUser.save();
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          oauthProvider: 'google',
          oauthId: profile.id,
          role: 'customer',
          emailVerified: true
        });
      }
    }

    // Generate tokens
    const payload = { id: user._id.toString(), role: user.role };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return done(null, { 
      id: user._id.toString(), 
      role: user.role,
      token,
      refreshToken
    });
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Facebook OAuth configuration
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: '/api/auth/oauth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
  passReqToCallback: true
}, async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find or create user
    let user = await User.findOne({ 
      oauthProvider: 'facebook', 
      oauthId: profile.id 
    });

    if (!user) {
      // Check if user exists with same email
      const existingUser = await User.findOne({ email: profile.emails?.[0].value });
      
      if (existingUser) {
        // Update existing user with OAuth info
        existingUser.oauthProvider = 'facebook';
        existingUser.oauthId = profile.id;
        existingUser.emailVerified = true;
        user = await existingUser.save();
      } else {
        // Create new user
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          oauthProvider: 'facebook',
          oauthId: profile.id,
          role: 'customer',
          emailVerified: true
        });
      }
    }

    // Generate tokens
    const payload = { id: user._id.toString(), role: user.role };
    const token = generateAccessToken(payload);
    const refreshToken = generateRefreshToken(payload);

    return done(null, { 
      id: user._id.toString(), 
      role: user.role,
      token,
      refreshToken
    });
  } catch (error) {
    return done(error as Error, undefined);
  }
}));

// Serialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
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

export default passport;
```

```typescript