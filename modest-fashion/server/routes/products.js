import express from 'express';
import {
  getProducts,
  getProductBySlug,
  getRelatedProducts,
  getFeaturedProducts,
  getBestSellers,
  getSaleProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  addReview,
  searchProductsForChatbot,
} from '../controllers/productController.js';
import { protect, admin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Public routes (order matters - specific routes before dynamic :slug)
router.get('/featured', getFeaturedProducts);
router.get('/bestsellers', getBestSellers);
router.get('/sale', getSaleProducts);
router.get('/search/chatbot', searchProductsForChatbot);
router.get('/', getProducts);
router.get('/:slug', getProductBySlug);
router.get('/:id/related', getRelatedProducts);

// Protected routes
router.post('/:id/reviews', protect, addReview);

// Admin routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;
