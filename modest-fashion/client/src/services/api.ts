import axios from 'axios';
import { useAuthStore } from '../store/authStore';
import type { 
  Product, 
  Category, 
  LoginCredentials, 
  RegisterCredentials,
  AuthResponse,
  PaginatedResponse,
  ProductFilters,
  Order,
} from '../types';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  withCredentials: true, // Send cookies with requests
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = useAuthStore.getState().accessToken;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor - handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // If 401 and not already retried, try to refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const { data } = await api.post('/auth/refresh');
        const { accessToken } = data;
        
        // Update token in store
        useAuthStore.getState().setUser(
          useAuthStore.getState().user!,
          accessToken
        );
        
        // Retry original request with new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh failed, logout user
        useAuthStore.getState().logout();
        window.location.href = '/signin';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// ============================================
// Auth API
// ============================================
export const authAPI = {
  register: async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/register', credentials);
    return data;
  },
  
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const { data } = await api.post('/auth/login', credentials);
    return data;
  },
  
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },
  
  getMe: async () => {
    const { data } = await api.get('/auth/me');
    return data;
  },
  
  updateProfile: async (profileData: Partial<{ name: string; email: string; phone: string }>) => {
    const { data } = await api.put('/auth/profile', profileData);
    return data;
  },
  
  updatePassword: async (passwords: { currentPassword: string; newPassword: string }) => {
    const { data } = await api.put('/auth/password', passwords);
    return data;
  },
  
  addAddress: async (address: object) => {
    const { data } = await api.post('/auth/addresses', address);
    return data;
  },
  
  deleteAddress: async (addressId: string) => {
    const { data } = await api.delete(`/auth/addresses/${addressId}`);
    return data;
  },
  
  toggleWishlist: async (productId: string) => {
    const { data } = await api.post(`/auth/wishlist/${productId}`);
    return data;
  },
};

// ============================================
// Products API
// ============================================
export const productsAPI = {
  getAll: async (filters?: ProductFilters): Promise<PaginatedResponse<Product>> => {
    const { data } = await api.get('/products', { params: filters });
    return data;
  },
  
  getBySlug: async (slug: string): Promise<{ success: boolean; product: Product }> => {
    const { data } = await api.get(`/products/${slug}`);
    return data;
  },
  
  getRelated: async (productId: string): Promise<{ success: boolean; products: Product[] }> => {
    const { data } = await api.get(`/products/${productId}/related`);
    return data;
  },
  
  getFeatured: async (): Promise<{ success: boolean; products: Product[] }> => {
    const { data } = await api.get('/products/featured');
    return data;
  },
  
  getBestSellers: async (): Promise<{ success: boolean; products: Product[] }> => {
    const { data } = await api.get('/products/bestsellers');
    return data;
  },
  
  getSale: async (): Promise<{ success: boolean; products: Product[] }> => {
    const { data } = await api.get('/products/sale');
    return data;
  },
  
  addReview: async (productId: string, review: { rating: number; comment: string }) => {
    const { data } = await api.post(`/products/${productId}/reviews`, review);
    return data;
  },
};

// ============================================
// Categories API
// ============================================
export const categoriesAPI = {
  getAll: async (): Promise<{ success: boolean; categories: Category[] }> => {
    const { data } = await api.get('/categories');
    return data;
  },
  
  getBySlug: async (slug: string): Promise<{ success: boolean; category: Category }> => {
    const { data } = await api.get(`/categories/${slug}`);
    return data;
  },
};

// ============================================
// Cart API (for authenticated users)
// ============================================
export const cartAPI = {
  get: async () => {
    const { data } = await api.get('/cart');
    return data;
  },
  
  addItem: async (item: { productId: string; quantity: number; size?: string; color?: string }) => {
    const { data } = await api.post('/cart/add', item);
    return data;
  },
  
  updateItem: async (itemId: string, quantity: number) => {
    const { data } = await api.put(`/cart/item/${itemId}`, { quantity });
    return data;
  },
  
  removeItem: async (itemId: string) => {
    const { data } = await api.delete(`/cart/item/${itemId}`);
    return data;
  },
  
  clear: async () => {
    const { data } = await api.delete('/cart');
    return data;
  },
  
  sync: async (items: object[]) => {
    const { data } = await api.post('/cart/sync', { items });
    return data;
  },
};

// ============================================
// Orders API
// ============================================
export const ordersAPI = {
  create: async (orderData: { shippingAddress: object; paymentMethod?: string }): Promise<{ success: boolean; order: Order }> => {
    const { data } = await api.post('/orders', orderData);
    return data;
  },
  
  getMyOrders: async (): Promise<{ success: boolean; orders: Order[] }> => {
    const { data } = await api.get('/orders/my-orders');
    return data;
  },
  
  getById: async (orderId: string): Promise<{ success: boolean; order: Order }> => {
    const { data } = await api.get(`/orders/${orderId}`);
    return data;
  },
  
  updateToPaid: async (orderId: string, paymentResult: object) => {
    const { data } = await api.put(`/orders/${orderId}/pay`, paymentResult);
    return data;
  },
};

// ============================================
// Stripe API
// ============================================
export const stripeAPI = {
  createCheckoutSession: async (orderId: string) => {
    const { data } = await api.post('/stripe/create-checkout-session', { orderId });
    return data;
  },
  
  createPaymentIntent: async (orderId: string) => {
    const { data } = await api.post('/stripe/create-payment-intent', { orderId });
    return data;
  },
  
  verifySession: async (sessionId: string) => {
    const { data } = await api.get(`/stripe/session/${sessionId}`);
    return data;
  },
};

export default api;
