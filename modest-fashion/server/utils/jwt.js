import jwt from 'jsonwebtoken';

/**
 * Generate Access Token (short-lived)
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} JWT access token
 */
export const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '15m',
  });
};

/**
 * Generate Refresh Token (long-lived)
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {string} JWT refresh token
 */
export const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET, {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

/**
 * Generate both tokens and set refresh token as httpOnly cookie
 * @param {Object} res - Express response object
 * @param {string} userId - User's MongoDB ObjectId
 * @returns {Object} { accessToken, refreshToken }
 */
export const generateTokens = (res, userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);

  // Set refresh token as httpOnly cookie (more secure than localStorage)
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Cannot be accessed by JavaScript
    secure: process.env.NODE_ENV === 'production', // HTTPS only in production
    sameSite: 'strict', // CSRF protection
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  return { accessToken, refreshToken };
};

/**
 * Verify Refresh Token
 * @param {string} token - Refresh token to verify
 * @returns {Object|null} Decoded payload or null if invalid
 */
export const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Clear auth cookies (used for logout)
 * @param {Object} res - Express response object
 */
export const clearAuthCookies = (res) => {
  res.cookie('refreshToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
  res.cookie('accessToken', '', {
    httpOnly: true,
    expires: new Date(0),
  });
};
