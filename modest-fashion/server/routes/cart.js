import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { protect, optionalAuth } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user's cart
router.get(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    let cart = await Cart.findOne({ user: req.user._id })
      .populate('items.product', 'name slug price images stock');

    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.json({
      success: true,
      cart,
    });
  })
);

// Add item to cart
router.post(
  '/add',
  protect,
  asyncHandler(async (req, res) => {
    const { productId, quantity = 1, size, color } = req.body;

    // Verify product exists and is in stock
    const product = await Product.findById(productId);
    if (!product || !product.isActive) {
      res.status(404);
      throw new Error('Product not found');
    }

    if (product.stock < quantity) {
      res.status(400);
      throw new Error('Insufficient stock');
    }

    // Find or create cart
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Add item
    cart.addItem(productId, quantity, size, color, product.price);
    await cart.save();

    // Populate and return
    await cart.populate('items.product', 'name slug price images stock');

    res.json({
      success: true,
      cart,
    });
  })
);

// Update item quantity
router.put(
  '/item/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.updateItemQuantity(req.params.itemId, quantity);
    await cart.save();

    await cart.populate('items.product', 'name slug price images stock');

    res.json({
      success: true,
      cart,
    });
  })
);

// Remove item from cart
router.delete(
  '/item/:itemId',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      res.status(404);
      throw new Error('Cart not found');
    }

    cart.removeItem(req.params.itemId);
    await cart.save();

    await cart.populate('items.product', 'name slug price images stock');

    res.json({
      success: true,
      cart,
    });
  })
);

// Clear cart
router.delete(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
      cart.clearCart();
      await cart.save();
    }

    res.json({
      success: true,
      message: 'Cart cleared',
    });
  })
);

// Sync local cart with server (for when user logs in)
router.post(
  '/sync',
  protect,
  asyncHandler(async (req, res) => {
    const { items } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = new Cart({ user: req.user._id, items: [] });
    }

    // Merge items from local storage
    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (product && product.isActive) {
        cart.addItem(item.productId, item.quantity, item.size, item.color, product.price);
      }
    }

    await cart.save();
    await cart.populate('items.product', 'name slug price images stock');

    res.json({
      success: true,
      cart,
    });
  })
);

export default router;
