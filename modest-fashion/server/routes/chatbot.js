import express from 'express';
import {
  handleMessage,
  handleMessageSync,
  getSuggestions,
  getFAQs,
} from '../controllers/chatbotController.js';

const router = express.Router();

// Chatbot endpoints
router.post('/message', handleMessage); // Streaming response
router.post('/message-sync', handleMessageSync); // Non-streaming fallback
router.get('/suggestions', getSuggestions);
router.get('/faqs', getFAQs);

export default router;
