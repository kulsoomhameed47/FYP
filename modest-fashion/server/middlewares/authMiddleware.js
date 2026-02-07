import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from './errorHandler.js';

/**
 * Protect routes - require authentication
 * Verifies JWT from Authorization header or cookie
 */
export const protect = asyncHandler(async (req, res, next) => {
  let token;

  // Check Authorization header first (Bearer token)
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }
  // Then check cookies
  else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (!token) {
    res.status(401);
    throw new Error('Not authorized, no token provided');
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from token
    req.user = await User.findById(decoded.id).select('-password -refreshToken');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized, user not found');
    }

    next();
  } catch (error) {
    res.status(401);
    throw new Error('Not authorized, token failed');
  }
});

/**
 * Admin only middleware
 * Must be used after protect middleware
 */
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    throw new Error('Not authorized as admin');
  }
};

/**
 * Optional auth - attach user if token exists, but don't require it
 * Useful for endpoints that behave differently for logged-in users
 */
export const optionalAuth = asyncHandler(async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.accessToken) {
    token = req.cookies.accessToken;
  }

  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password -refreshToken');
    } catch (error) {
      // Token invalid, continue without user
      req.user = null;
    }
  }

  next();
});
