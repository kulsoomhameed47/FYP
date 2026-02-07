# AGENTS.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview
Modest Fashion is a full-stack e-commerce platform for modest fashion items (abayas, scarves, accessories, shoes, bags) targeting men, women, and kids. The application is located in `modest-fashion/`.

## Commands

### Client (modest-fashion/client)
```powershell
cd modest-fashion/client
npm run dev      # Start Vite dev server on http://localhost:5173
npm run build    # TypeScript compile + Vite production build
npm run lint     # Run ESLint
npm run preview  # Preview production build
```

### Server (modest-fashion/server)
```powershell
cd modest-fashion/server
npm run dev      # Start with nodemon (auto-reload)
npm start        # Start production server on port 5000
npm run seed     # Seed database with sample data
```

### Running Full Stack
Start both client and server in separate terminals. The client proxies `/api` requests to the server.

## Architecture

### Client (`modest-fashion/client`)
- **Framework**: React 18 + Vite + TypeScript
- **Styling**: Tailwind CSS with custom `primary` and `accent` color palettes
- **State Management**: Zustand stores in `src/store/` (authStore, cartStore, uiStore)
- **Routing**: React Router with layouts in `src/layouts/`
- **API Layer**: Centralized Axios client in `src/services/api.ts` with interceptors for JWT refresh
- **Types**: All TypeScript interfaces in `src/types/index.ts`

### Server (`modest-fashion/server`)
- **Framework**: Express.js (ES modules)
- **Database**: MongoDB via Mongoose
- **Auth**: JWT access tokens (15m) + refresh tokens (7d) stored in HTTP-only cookies
- **Payment**: Stripe integration for checkout
- **AI**: OpenAI GPT-4o-mini for product recommendation chatbot

### Key Architectural Patterns
- **API Response Format**: All endpoints return `{ success: boolean, ...data }` or `{ success: false, message: string }`
- **Error Handling**: Centralized in `server/middlewares/errorHandler.js` with `asyncHandler` wrapper for controllers
- **Auth Middleware**: `protect` (required auth), `admin` (admin only), `optionalAuth` (attach user if present)
- **Cart Sync**: Client maintains local cart in Zustand, syncs with server-side cart on login

### API Routes
| Prefix | Purpose |
|--------|---------|
| `/api/auth` | Registration, login, logout, profile, addresses, wishlist |
| `/api/products` | Product CRUD, search, filtering, reviews |
| `/api/categories` | Category listing |
| `/api/cart` | Server-side cart management |
| `/api/orders` | Order creation and history |
| `/api/stripe` | Payment processing |
| `/api/chatbot` | AI shopping assistant (streaming SSE) |

## Environment Setup
Copy `.env.example` to `.env` in both `client/` and `server/` directories. Required services:
- MongoDB (local or Atlas)
- Stripe API keys (test mode for development)
- OpenAI API key (for chatbot functionality)

## Domain Context
- **Target Audience**: Products have `targetAudience` field: 'men', 'women', 'kids', or 'unisex'
- **Categories**: Abayas (winter/summer variants), Scarves, Accessories, Shoes, Bags
- **Product Variants**: Products can have multiple sizes and colors with individual stock tracking
