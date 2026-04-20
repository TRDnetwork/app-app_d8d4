```ts
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { Strategy as FacebookStrategy } from 'passport-facebook';
import User from '../models/User';
import { generateToken, generateRefreshToken } from '../utils/generateToken';

// Configure Google strategy
passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID!,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  callbackURL: '/api/auth/oauth/google/callback',
  passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find user by Google ID
    let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'google' });

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        oauthProvider: 'google',
        oauthId: profile.id,
        emailVerified: true,
        role: 'customer'
      });
    }

    // Generate tokens
    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return done(null, { token, refreshToken, user });
  } catch (error) {
    return done(error, false);
  }
}));

// Configure Facebook strategy
passport.use(new FacebookStrategy({
  clientID: process.env.FACEBOOK_APP_ID!,
  clientSecret: process.env.FACEBOOK_APP_SECRET!,
  callbackURL: '/api/auth/oauth/facebook/callback',
  profileFields: ['id', 'displayName', 'email'],
  passReqToCallback: true
},
async (request, accessToken, refreshToken, profile, done) => {
  try {
    // Find user by Facebook ID
    let user = await User.findOne({ oauthId: profile.id, oauthProvider: 'facebook' });

    // If user doesn't exist, create one
    if (!user) {
      user = await User.create({
        name: profile.displayName,
        email: profile.emails?.[0].value,
        oauthProvider: 'facebook',
        oauthId: profile.id,
        emailVerified: true,
        role: 'customer'
      });
    }

    // Generate tokens
    const token = generateToken({ id: user._id, role: user.role });
    const refreshToken = generateRefreshToken({ id: user._id, role: user.role });

    return done(null, { token, refreshToken, user });
  } catch (error) {
    return done(error, false);
  }
}));

// Serialize user
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user
passport.deserializeUser((user: any, done) => {
  done(null, user);
});

export default passport;
```