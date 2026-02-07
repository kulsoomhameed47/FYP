// ============================================
// User Types
// ============================================
export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  avatar?: string;
  phone?: string;
  addresses: Address[];
  wishlist: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  _id?: string;
  fullName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// ============================================
// Product Types
// ============================================
export interface Product {
  _id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  images: ProductImage[];
  category: Category | string;
  subcategory?: string;
  targetAudience: 'men' | 'women' | 'kids' | 'unisex';
  sizes: ProductSize[];
  colors: ProductColor[];
  material?: string;
  tags: string[];
  stock: number;
  sold: number;
  rating: number;
  numReviews: number;
  reviews: Review[];
  featured: boolean;
  isOnSale: boolean;
  isActive: boolean;
  discountPercentage?: number;
  inStock?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  url: string;
  alt?: string;
  isMain?: boolean;
}

export interface ProductSize {
  name: string;
  stock: number;
}

export interface ProductColor {
  name: string;
  hex?: string;
  stock: number;
}

export interface Review {
  _id: string;
  user: User | string;
  name: string;
  rating: number;
  comment: string;
  createdAt: string;
}

// ============================================
// Category Types
// ============================================
export interface Category {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parent?: string | null;
  subcategories: Subcategory[];
  isActive: boolean;
  order: number;
}

export interface Subcategory {
  name: string;
  slug: string;
}

// ============================================
// Cart Types
// ============================================
export interface CartItem {
  _id?: string;
  product: Product | string;
  quantity: number;
  size?: string;
  color?: string;
  price: number;
  // Populated fields for display
  name?: string;
  image?: string;
  slug?: string;
}

export interface Cart {
  _id: string;
  user: string;
  items: CartItem[];
  total: number;
  itemCount: number;
}

// Local cart item (before syncing with server)
export interface LocalCartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
  color?: string;
}

// ============================================
// Order Types
// ============================================
export interface Order {
  _id: string;
  orderNumber: string;
  user: User | string;
  items: OrderItem[];
  shippingAddress: Address;
  paymentMethod: 'stripe' | 'paypal' | 'cod';
  paymentResult?: {
    id: string;
    status: string;
    updateTime: string;
    email: string;
  };
  subtotal: number;
  shippingCost: number;
  tax: number;
  discount: number;
  discountCode?: string;
  total: number;
  status: OrderStatus;
  isPaid: boolean;
  paidAt?: string;
  isDelivered: boolean;
  deliveredAt?: string;
  trackingNumber?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  product: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
  size?: string;
  color?: string;
}

export type OrderStatus =
  | 'pending'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

// ============================================
// API Response Types
// ============================================
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  products: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

// ============================================
// Auth Types
// ============================================
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  user: User;
  accessToken: string;
}

// ============================================
// Chatbot Types
// ============================================
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatSuggestion {
  text: string;
  icon?: string;
}

// ============================================
// Filter Types
// ============================================
export interface ProductFilters {
  category?: string;
  subcategory?: string;
  targetAudience?: 'men' | 'women' | 'kids';
  minPrice?: number;
  maxPrice?: number;
  color?: string;
  size?: string;
  search?: string;
  sort?: string;
  page?: number;
  limit?: number;
  featured?: boolean;
  onSale?: boolean;
}
