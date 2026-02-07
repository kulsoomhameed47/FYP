import express from 'express';
import Category from '../models/Category.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get all categories
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const categories = await Category.find({ isActive: true })
      .sort('order')
      .lean();

    res.json({
      success: true,
      categories,
    });
  })
);

// Get category by slug
router.get(
  '/:slug',
  asyncHandler(async (req, res) => {
    const category = await Category.findOne({
      slug: req.params.slug,
      isActive: true,
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json({
      success: true,
      category,
    });
  })
);

// Create category (Admin)
router.post(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.create(req.body);

    res.status(201).json({
      success: true,
      category,
    });
  })
);

// Update category (Admin)
router.put(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json({
      success: true,
      category,
    });
  })
);

// Delete category (Admin)
router.delete(
  '/:id',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const category = await Category.findByIdAndUpdate(req.params.id, {
      isActive: false,
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.json({
      success: true,
      message: 'Category deleted',
    });
  })
);

export default router;
