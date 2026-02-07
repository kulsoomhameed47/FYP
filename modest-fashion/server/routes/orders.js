import express from 'express';
import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Get user's orders
router.get(
  '/my-orders',
  protect,
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
      .sort('-createdAt')
      .lean();

    res.json({
      success: true,
      orders,
    });
  })
);

// Get single order
router.get(
  '/:id',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    // Check if user owns this order or is admin
    if (order.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403);
      throw new Error('Not authorized to view this order');
    }

    res.json({
      success: true,
      order,
    });
  })
);

// Create order
router.post(
  '/',
  protect,
  asyncHandler(async (req, res) => {
    const { shippingAddress, paymentMethod = 'stripe' } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      res.status(400);
      throw new Error('Cart is empty');
    }

    // Build order items and calculate totals
    const orderItems = [];
    let subtotal = 0;

    for (const item of cart.items) {
      const product = item.product;

      // Verify stock
      if (product.stock < item.quantity) {
        res.status(400);
        throw new Error(`Insufficient stock for ${product.name}`);
      }

      orderItems.push({
        product: product._id,
        name: product.name,
        image: product.images[0]?.url || '',
        price: item.price,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
      });

      subtotal += item.price * item.quantity;

      // Update product stock
      product.stock -= item.quantity;
      product.sold += item.quantity;
      await product.save();
    }

    // Calculate shipping and tax
    const shippingCost = subtotal >= 50 ? 0 : 9.99; // Free shipping over $50
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shippingCost + tax;

    // Create order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      subtotal,
      shippingCost,
      tax,
      total,
    });

    // Clear cart
    cart.clearCart();
    await cart.save();

    res.status(201).json({
      success: true,
      order,
    });
  })
);

// Update order to paid (called by Stripe webhook or after successful payment)
router.put(
  '/:id/pay',
  protect,
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.isPaid = true;
    order.paidAt = new Date();
    order.status = 'processing';
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      updateTime: req.body.updateTime,
      email: req.body.email,
    };

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  })
);

// Get all orders (Admin)
router.get(
  '/',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { page = 1, limit = 20, status } = req.query;

    const query = {};
    if (status) query.status = status;

    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    const [orders, total] = await Promise.all([
      Order.find(query)
        .populate('user', 'name email')
        .sort('-createdAt')
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .lean(),
      Order.countDocuments(query),
    ]);

    res.json({
      success: true,
      orders,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  })
);

// Update order status (Admin)
router.put(
  '/:id/status',
  protect,
  admin,
  asyncHandler(async (req, res) => {
    const { status, trackingNumber } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    order.status = status;

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (status === 'delivered') {
      order.isDelivered = true;
      order.deliveredAt = new Date();
    }

    const updatedOrder = await order.save();

    res.json({
      success: true,
      order: updatedOrder,
    });
  })
);

export default router;
