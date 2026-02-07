import User from '../models/User.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import {
  generateTokens,
  verifyRefreshToken,
  clearAuthCookies,
  generateAccessToken,
} from '../utils/jwt.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Check if user exists
  const userExists = await User.findOne({ email: email.toLowerCase() });
  if (userExists) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Create user
  const user = await User.create({
    name,
    email: email.toLowerCase(),
    password,
  });

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(res, user._id);

  // Save refresh token to database
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    accessToken,
  });
});

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    res.status(400);
    throw new Error('Please provide email and password');
  }

  // Find user and include password for comparison
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');

  if (!user || !(await user.comparePassword(password))) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Generate tokens
  const { accessToken, refreshToken } = generateTokens(res, user._id);

  // Save refresh token
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
    },
    accessToken,
  });
});

/**
 * @desc    Logout user (clear cookies)
 * @route   POST /api/auth/logout
 * @access  Private
 */
export const logout = asyncHandler(async (req, res) => {
  // Clear refresh token from database
  await User.findByIdAndUpdate(req.user._id, { refreshToken: '' });

  // Clear cookies
  clearAuthCookies(res);

  res.json({ success: true, message: 'Logged out successfully' });
});

/**
 * @desc    Refresh access token
 * @route   POST /api/auth/refresh
 * @access  Public (requires valid refresh token cookie)
 */
export const refreshToken = asyncHandler(async (req, res) => {
  const token = req.cookies.refreshToken;

  if (!token) {
    res.status(401);
    throw new Error('No refresh token provided');
  }

  // Verify refresh token
  const decoded = verifyRefreshToken(token);
  if (!decoded) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  // Find user and verify stored refresh token
  const user = await User.findById(decoded.id).select('+refreshToken');
  if (!user || user.refreshToken !== token) {
    res.status(401);
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const accessToken = generateAccessToken(user._id);

  res.json({
    success: true,
    accessToken,
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/me
 * @access  Private
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate('wishlist', 'name slug price images');

  res.json({
    success: true,
    user,
  });
});

/**
 * @desc    Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email, phone, avatar } = req.body;

  const user = await User.findById(req.user._id);

  if (user) {
    user.name = name || user.name;
    user.phone = phone || user.phone;
    user.avatar = avatar || user.avatar;

    // If email is being changed, check it's not taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) {
        res.status(400);
        throw new Error('Email already in use');
      }
      user.email = email.toLowerCase();
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        avatar: updatedUser.avatar,
        role: updatedUser.role,
      },
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

/**
 * @desc    Update password
 * @route   PUT /api/auth/password
 * @access  Private
 */
export const updatePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  const user = await User.findById(req.user._id).select('+password');

  if (!(await user.comparePassword(currentPassword))) {
    res.status(400);
    throw new Error('Current password is incorrect');
  }

  user.password = newPassword;
  await user.save();

  res.json({ success: true, message: 'Password updated successfully' });
});

/**
 * @desc    Add/Update user address
 * @route   POST /api/auth/addresses
 * @access  Private
 */
export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const { fullName, phone, street, city, state, postalCode, country, isDefault } = req.body;

  // If setting as default, unset other defaults
  if (isDefault) {
    user.addresses.forEach((addr) => {
      addr.isDefault = false;
    });
  }

  user.addresses.push({
    fullName,
    phone,
    street,
    city,
    state,
    postalCode,
    country,
    isDefault: isDefault || user.addresses.length === 0, // First address is default
  });

  await user.save();

  res.status(201).json({
    success: true,
    addresses: user.addresses,
  });
});

/**
 * @desc    Delete user address
 * @route   DELETE /api/auth/addresses/:addressId
 * @access  Private
 */
export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  user.addresses.pull(req.params.addressId);
  await user.save();

  res.json({
    success: true,
    addresses: user.addresses,
  });
});

/**
 * @desc    Toggle product in wishlist
 * @route   POST /api/auth/wishlist/:productId
 * @access  Private
 */
export const toggleWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const productId = req.params.productId;

  const index = user.wishlist.indexOf(productId);

  if (index > -1) {
    // Remove from wishlist
    user.wishlist.splice(index, 1);
  } else {
    // Add to wishlist
    user.wishlist.push(productId);
  }

  await user.save();

  res.json({
    success: true,
    wishlist: user.wishlist,
    inWishlist: index === -1, // true if was added, false if was removed
  });
});
