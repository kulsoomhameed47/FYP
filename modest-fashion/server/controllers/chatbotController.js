import { GoogleGenerativeAI } from "@google/generative-ai";
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

// --- Initialize Gemini Client ---
// Direct key usage (Note: For better security in production, keep this in .env)
const genAI = new GoogleGenerativeAI("AIzaSyB54P5Q8R-hY3Cdx5q5rRBzROO_BuQbQEc");
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

/**
 * System prompt for the chatbot
 * Defines the AI's personality and knowledge about the store
 */
const SYSTEM_PROMPT = `You are a helpful, friendly shopping assistant for "Modest Fashion", an online store specializing in modest fashion including abayas, scarves, accessories, shoes, and bags for men, women, and kids.

Your responsibilities:
1. Help customers find products (abayas, scarves, accessories, shoes, bags)
2. Provide product recommendations based on preferences (season, style, color, occasion)
3. Answer questions about sizing, materials, and care instructions
4. Guide customers through the shopping process
5. Answer FAQs about shipping, returns, and payments
6. Be warm, professional, and culturally sensitive

Store Information:
- Categories: Abayas (Winter/Summer), Scarves (Stylish/Simple), Accessories, Shoes, Bags
- Audiences: Men, Women, Kids
- Shipping: Free shipping on orders over $50, Standard delivery 5-7 business days
- Returns: 30-day return policy for unworn items with tags
- Payment: Secure checkout with Stripe (credit cards accepted)

When recommending products, be specific about features like:
- Material (cotton, silk, polyester blends)
- Style (casual, formal, everyday)
- Season suitability
- Color options

Keep responses concise but helpful. Use a friendly, professional tone.
If you don't know something specific, guide the customer to contact support.`;

/**
 * @desc    Handle chatbot message with streaming response
 * @route   POST /api/chatbot/message
 * @access  Public
 */
export const handleMessage = asyncHandler(async (req, res) => {
  const { message, conversationHistory = [], cartSummary } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  // --- 1. Product Search Logic ---
  let productContext = '';
  const productKeywords = [
    'abaya', 'scarf', 'bag', 'shoe', 'accessory', 'accessories',
    'winter', 'summer', 'recommend', 'suggest', 'looking for', 'find',
    'show me', 'what do you have', 'price', 'available', 'stock',
    'men', 'women', 'kids', 'children', 'boy', 'girl'
  ];

  const isProductQuery = productKeywords.some(keyword =>
    message.toLowerCase().includes(keyword)
  );

  if (isProductQuery) {
    try {
      const searchTerms = message.toLowerCase();
      const query = { isActive: true };
      const searchConditions = [];

      if (searchTerms.includes('abaya')) {
        searchConditions.push({ name: { $regex: 'abaya', $options: 'i' } });
      }
      if (searchTerms.includes('scarf') || searchTerms.includes('hijab')) {
        searchConditions.push({ name: { $regex: 'scarf|hijab', $options: 'i' } });
      }
      if (searchTerms.includes('bag')) {
        searchConditions.push({ name: { $regex: 'bag', $options: 'i' } });
      }
      if (searchTerms.includes('shoe')) {
        searchConditions.push({ name: { $regex: 'shoe', $options: 'i' } });
      }
      if (searchTerms.includes('accessor')) {
        searchConditions.push({ name: { $regex: 'accessor', $options: 'i' } });
      }

      // Audience filters
      if (searchTerms.includes('women') || searchTerms.includes('ladies')) {
        query.targetAudience = 'women';
      } else if (searchTerms.includes('men') || searchTerms.includes("men's")) {
        query.targetAudience = 'men';
      } else if (searchTerms.includes('kid') || searchTerms.includes('child') ||
                 searchTerms.includes('boy') || searchTerms.includes('girl')) {
        query.targetAudience = 'kids';
      }

      // Season filters
      if (searchTerms.includes('winter')) {
        query.subcategory = { $regex: 'winter', $options: 'i' };
      } else if (searchTerms.includes('summer')) {
        query.subcategory = { $regex: 'summer', $options: 'i' };
      }

      if (searchConditions.length > 0) {
        query.$or = searchConditions;
      }

      // Fetch relevant products
      const products = await Product.find(query)
        .select('name price images shortDescription rating colors sizes')
        .limit(5)
        .lean();

      if (products.length > 0) {
        productContext = '\n\nAvailable products matching the query:\n' +
          products.map(p => {
            return `- ${p.name}: $${p.price}${p.rating ? `, Rating: ${p.rating}/5` : ''}${p.shortDescription ? ` - ${p.shortDescription}` : ''}`;
          }).join('\n');
      }
    } catch (error) {
      console.error('Error fetching products for chatbot:', error);
    }
  }

  // --- 2. Cart Context ---
  let cartContext = '';
  if (cartSummary && cartSummary.items?.length > 0) {
    cartContext = `\n\nCurrent cart (${cartSummary.itemCount} items, Total: $${cartSummary.total?.toFixed(2)}):\n` +
      cartSummary.items.map(item => `- ${item.name} x${item.quantity}: $${(item.price * item.quantity).toFixed(2)}`).join('\n');
  }

  // --- 3. Build Prompt for Gemini ---
  // Gemini does not use "system roles" in the same way, so we combine the prompts.
  // We also format previous history for context if needed, but for simplicity, we focus on the current turn + context.
  
  const fullPrompt = `${SYSTEM_PROMPT}

CONTEXT INFORMATION:
${productContext}
${cartContext}

USER QUESTION:
${message}

Please provide a helpful response based on the above information.`;

  // --- 4. Stream Response Setup ---
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  try {
    // Generate streaming content using Gemini
    const result = await model.generateContentStream(fullPrompt);

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      
      // We wrap the text in the format your Frontend expects (data: { content: "..." })
      if (chunkText) {
        res.write(`data: ${JSON.stringify({ content: chunkText })}\n\n`);
      }
    }

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();

  } catch (error) {
    console.error('Gemini API Error:', error);
    
    // Send error as stream event
    res.write(`data: ${JSON.stringify({ 
      error: true, 
      content: "I apologize, but I'm having trouble connecting right now. Please try again in a moment." 
    })}\n\n`);
    res.end();
  }
});

/**
 * @desc    Handle chatbot message (non-streaming fallback)
 * @route   POST /api/chatbot/message-sync
 * @access  Public
 */
export const handleMessageSync = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message) {
    res.status(400);
    throw new Error('Message is required');
  }

  const fullPrompt = `${SYSTEM_PROMPT}\n\nUSER QUESTION: ${message}`;
  const result = await model.generateContent(fullPrompt);
  const response = result.response;

  res.json({
    success: true,
    response: response.text(),
  });
});

/**
 * @desc    Get suggested prompts/quick actions
 * @route   GET /api/chatbot/suggestions
 * @access  Public
 */
export const getSuggestions = asyncHandler(async (req, res) => {
  const suggestions = [
    { text: "Show me winter abayas", icon: "snowflake" },
    { text: "Suggest stylish scarves", icon: "shirt" },
    { text: "What's on sale?", icon: "tag" },
    { text: "Help me with checkout", icon: "shopping-cart" },
    { text: "Shipping information", icon: "truck" },
    { text: "Return policy", icon: "rotate-ccw" },
  ];

  const categories = await Category.find({ isActive: true })
    .select('name slug')
    .limit(4)
    .lean();

  res.json({
    success: true,
    suggestions,
    categories: categories.map(cat => ({
      text: `Browse ${cat.name}`,
      slug: cat.slug,
    })),
  });
});

/**
 * @desc    Get FAQs for the chatbot
 * @route   GET /api/chatbot/faqs
 * @access  Public
 */
export const getFAQs = asyncHandler(async (req, res) => {
  const faqs = [
    {
      question: "What is your return policy?",
      answer: "We offer a 30-day return policy for all unworn items with original tags attached. Simply contact our support team to initiate a return."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 5-7 business days. We also offer express shipping (2-3 business days) for an additional fee. Free shipping on orders over $50!"
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment system."
    },
    {
      question: "How do I track my order?",
      answer: "Once your order ships, you'll receive an email with a tracking number. You can also view your order status in your account dashboard."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Yes! We ship worldwide. International shipping rates and delivery times vary by location."
    },
    {
      question: "How do I find my size?",
      answer: "Each product page includes a detailed size guide. If you're between sizes, we generally recommend sizing up for a more comfortable fit."
    },
  ];

  res.json({
    success: true,
    faqs,
  });
});