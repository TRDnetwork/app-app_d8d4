```ts
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { StatusCodes } from 'http-status-codes';
import User, { IUser } from '../models/User';

// Extend Express Request interface to include user property
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string;
      };
    }
  }
}

// Middleware to protect routes
export const protect = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Get token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string;
      };

      // Get user from token (exclude password from returned user object)
      req.user = await User.findById(decoded.id).select('-password');

      next();
    } catch (error) {
      console.error('Auth middleware error:', error);
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Not authorized, token failed',
      });
    }
  }

  // If no token in header, check for refresh token cookie
  if (!token && req.cookies.refreshToken) {
    try {
      const decoded = jwt.verify(
        req.cookies.refreshToken,
        process.env.JWT_REFRESH_SECRET!
      ) as { id: string };

      // Get user from token
      req.user = await User.findById(decoded.id).select('-password');

      // Generate new access token
      const newToken = jwt.sign(
        { id: req.user._id },
        process.env.JWT_SECRET!,
        {
          expiresIn: '15m',
        }
      );

      // Set new access token in response
      res.setHeader('Authorization', `Bearer ${newToken}`);

      next();
    } catch (error) {
      console.error('Refresh token verification failed:', error);
      res.status(StatusCodes.UNAUTHORIZED).json({
        message: 'Not authorized, refresh token failed',
      });
    }
  }

  if (!token && !req.cookies.refreshToken) {
    res.status(StatusCodes.UNAUTHORIZED).json({
      message: 'Not authorized, no token',
    });
  }
};

// Middleware to check if user is admin
export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      message: `User role ${req.user?.role} is not authorized to access this route`,
    });
  }
};

// Middleware to check if user is seller
export const seller = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'seller' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      message: `User role ${req.user?.role} is not authorized to access this route`,
    });
  }
};

// Middleware to check if user is customer
export const customer = (req: Request, res: Response, next: NextFunction) => {
  if (req.user && (req.user.role === 'customer' || req.user.role === 'admin')) {
    next();
  } else {
    res.status(StatusCodes.FORBIDDEN).json({
      message: `User role ${req.user?.role} is not authorized to access this route`,
    });
  }
};
```