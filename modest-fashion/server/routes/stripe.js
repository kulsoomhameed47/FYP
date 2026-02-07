import express from 'express';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { asyncHandler } from '../middlewares/errorHandler.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Initialize Stripe with secret key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Create a Stripe Checkout Session
 * This redirects the user to Stripe's hosted checkout page
 */
router.post(
  '/create-checkout-session',
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    // Get order details
    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Build line items for Stripe
    const lineItems = order.items.map((item) => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.name,
          images: item.image ? [item.image] : [],
          metadata: {
            productId: item.product.toString(),
            size: item.size || '',
            color: item.color || '',
          },
        },
        unit_amount: Math.round(item.price * 100), // Stripe expects cents
      },
      quantity: item.quantity,
    }));

    // Add shipping as a line item if applicable
    if (order.shippingCost > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Shipping',
          },
          unit_amount: Math.round(order.shippingCost * 100),
        },
        quantity: 1,
      });
    }

    // Add tax as a line item
    if (order.tax > 0) {
      lineItems.push({
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'Tax',
          },
          unit_amount: Math.round(order.tax * 100),
        },
        quantity: 1,
      });
    }

    // Create Stripe Checkout Session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: req.user.email,
      metadata: {
        orderId: orderId,
        userId: req.user._id.toString(),
      },
      success_url: `${process.env.CLIENT_URL}/order-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.CLIENT_URL}/checkout?canceled=true`,
    });

    res.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    });
  })
);

/**
 * Create a Payment Intent (for custom payment forms)
 * Use this if you want to use Stripe Elements instead of Checkout
 */
router.post(
  '/create-payment-intent',
  protect,
  asyncHandler(async (req, res) => {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      res.status(404);
      throw new Error('Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Not authorized');
    }

    // Create Payment Intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.total * 100), // Stripe expects cents
      currency: 'usd',
      metadata: {
        orderId: orderId,
        userId: req.user._id.toString(),
      },
    });

    res.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
    });
  })
);

/**
 * Verify Checkout Session (after successful payment)
 */
router.get(
  '/session/:sessionId',
  protect,
  asyncHandler(async (req, res) => {
    const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }

    // Update order if payment was successful
    if (session.payment_status === 'paid' && session.metadata.orderId) {
      const order = await Order.findById(session.metadata.orderId);

      if (order && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.status = 'processing';
        order.paymentResult = {
          id: session.payment_intent,
          status: session.payment_status,
          updateTime: new Date().toISOString(),
          email: session.customer_email,
        };
        await order.save();
      }
    }

    res.json({
      success: true,
      session: {
        id: session.id,
        status: session.payment_status,
        orderId: session.metadata.orderId,
      },
    });
  })
);

/**
 * Stripe Webhook Handler
 * Handles events from Stripe (payment success, failure, etc.)
 * 
 * Note: This endpoint should NOT use the protect middleware
 * Stripe needs to access it directly
 */
router.post(
  '/webhook',
  express.raw({ type: 'application/json' }),
  asyncHandler(async (req, res) => {
    const sig = req.headers['stripe-signature'];
    let event;

    try {
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.error('Webhook signature verification failed:', err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle the event
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;

        // Update order to paid
        if (session.metadata.orderId) {
          const order = await Order.findById(session.metadata.orderId);

          if (order && !order.isPaid) {
            order.isPaid = true;
            order.paidAt = new Date();
            order.status = 'processing';
            order.paymentResult = {
              id: session.payment_intent,
              status: 'completed',
              updateTime: new Date().toISOString(),
              email: session.customer_email,
            };
            await order.save();
            console.log(`Order ${order.orderNumber} marked as paid`);
          }
        }
        break;
      }

      case 'payment_intent.payment_failed': {
        const paymentIntent = event.data.object;
        console.log('Payment failed:', paymentIntent.id);
        // Could send email notification here
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  })
);

export default router;
