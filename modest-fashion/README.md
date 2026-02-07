# Modest Fashion E-Commerce Platform

A modern, full-stack e-commerce website specialized in modest fashion (abayas, scarves, accessories, shoes, bags) with sections for Men, Women, and Kids.

## 🌟 Features

- **AI-Powered Chatbot** - Intelligent assistant for product recommendations, cart help, and FAQs
- **Modern UI** - Beautiful, responsive design with smooth animations
- **Secure Authentication** - JWT-based with refresh tokens in httpOnly cookies
- **Stripe Payments** - Secure checkout with test mode support
- **Product Management** - Categories, filters, search, and sorting
- **Shopping Cart** - Persistent cart with quantity management
- **User Profiles** - Order history, saved addresses, wishlist

## 🛠️ Tech Stack

### Frontend
- React 18 + Vite + TypeScript
- Tailwind CSS + Headless UI
- Framer Motion (animations)
- Zustand (state management)
- React Router v6
- Lucide React (icons)
- Sonner (toast notifications)

### Backend
- Node.js + Express.js
- MongoDB + Mongoose
- JWT Authentication
- Stripe API
- OpenAI API (chatbot)

## 📁 Project Structure

```
modest-fashion/
├── client/                    # React + Vite frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/            # Images, fonts
│   │   ├── components/        # Reusable UI components
│   │   │   ├── ui/            # Button, Input, Modal, etc.
│   │   │   ├── layout/        # Navbar, Footer, Sidebar
│   │   │   ├── product/       # ProductCard, ProductGrid
│   │   │   ├── cart/          # CartItem, CartSummary
│   │   │   └── chatbot/       # ChatbotWidget, ChatMessage
│   │   ├── hooks/             # Custom hooks
│   │   ├── layouts/           # MainLayout, AdminLayout
│   │   ├── pages/             # All page components
│   │   ├── services/          # API service layer
│   │   ├── store/             # Zustand stores
│   │   ├── types/             # TypeScript interfaces
│   │   ├── utils/             # Helper functions
│   │   ├── App.tsx
│   │   └── main.tsx
│   └── vite.config.ts
├── server/                    # Express backend
│   ├── config/                # DB, env config
│   ├── controllers/           # Route handlers
│   ├── middlewares/           # Auth, error handling
│   ├── models/                # Mongoose schemas
│   ├── routes/                # API routes
│   ├── utils/                 # JWT, helpers
│   ├── seed/                  # Sample data
│   └── server.js
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- MongoDB (local or Atlas)
- Stripe account (test mode)
- OpenAI API key (for chatbot)

### 1. Clone and Install

```bash
# Clone the repository
cd modest-fashion

# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Environment Setup

**Server (.env)**
```bash
cd server
cp .env.example .env
# Edit .env with your values
```

**Client (.env)**
```bash
cd client
cp .env.example .env
# Edit .env with your values
```

### 3. Start MongoDB

**Option A: Local MongoDB**
```bash
mongod
```

**Option B: MongoDB Atlas**
- Create free cluster at https://cloud.mongodb.com
- Get connection string and add to server .env

### 4. Seed Sample Data

```bash
cd server
npm run seed
```

### 5. Start Development Servers

**Terminal 1 - Backend:**
```bash
cd server
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd client
npm run dev
```

- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## 🔑 Environment Variables

### Server (.env.example)
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/modest-fashion
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_REFRESH_SECRET=your-refresh-token-secret-change-in-production
JWT_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
OPENAI_API_KEY=sk-your-openai-api-key
CLIENT_URL=http://localhost:5173
```

### Client (.env.example)
```env
VITE_API_URL=http://localhost:5000/api
VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
```

## 💳 Stripe Test Mode

Use these test card numbers:
- **Success:** 4242 4242 4242 4242
- **Decline:** 4000 0000 0000 0002
- **Requires Auth:** 4000 0025 0000 3155

Expiry: Any future date | CVC: Any 3 digits

## 🤖 AI Chatbot

The chatbot uses OpenAI's GPT-4 with streaming responses. Features:
- Product recommendations ("suggest winter abayas")
- Cart summary and checkout guidance
- FAQ handling (shipping, returns, sizing)
- Natural conversation with typing indicators

**Free Alternatives:**
- Groq (free tier with Llama models)
- Google Gemini (free tier)

## 📱 Pages

- **Home** - Hero, featured categories, bestsellers, sale section
- **Category Pages** - Men, Women, Kids, Abayas, Scarves, Accessories, Shoes, Bags
- **Product Detail** - Images, variants, reviews, related products
- **Cart** - Item list, quantity controls, subtotal
- **Checkout** - Address form, Stripe payment
- **Auth** - Sign up, Sign in, Forgot password
- **Profile** - Orders, addresses, settings

## 🎨 Design Features

- Mobile-first responsive design
- Dark/light mode support
- Smooth page transitions
- Animated components
- Welcome popup (first visit)
- Sale banners

## 📜 Scripts

**Server:**
```bash
npm run dev      # Start with nodemon
npm start        # Production start
npm run seed     # Seed database
```

**Client:**
```bash
npm run dev      # Start Vite dev server
npm run build    # Production build
npm run preview  # Preview production build
npm run lint     # Run ESLint
```

## 🔒 Security Features

- Password hashing with bcrypt
- JWT with httpOnly refresh tokens
- CORS configuration
- Rate limiting
- Input validation
- XSS protection

## 📄 License

MIT License - feel free to use for your projects!
