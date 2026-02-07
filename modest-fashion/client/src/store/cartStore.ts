import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { LocalCartItem } from '../types';

interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  
  // Actions
  addItem: (item: LocalCartItem) => void;
  removeItem: (productId: string, size?: string, color?: string) => void;
  updateQuantity: (productId: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  toggleCart: () => void;
  openCart: () => void;
  closeCart: () => void;
  
  // Computed
  getTotal: () => number;
  getItemCount: () => number;
  getCartSummary: () => { items: LocalCartItem[]; total: number; itemCount: number };
}

/**
 * Cart Store using Zustand
 * Persists cart to localStorage for guest users
 * Syncs with server when user logs in
 */
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      addItem: (item) => {
        set((state) => {
          // Check if item with same product, size, and color exists
          const existingIndex = state.items.findIndex(
            (i) =>
              i.productId === item.productId &&
              i.size === item.size &&
              i.color === item.color
          );
          
          if (existingIndex > -1) {
            // Update quantity
            const newItems = [...state.items];
            newItems[existingIndex].quantity += item.quantity;
            return { items: newItems };
          }
          
          // Add new item
          return { items: [...state.items, item] };
        });
      },
      
      removeItem: (productId, size, color) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                item.size === size &&
                item.color === color
              )
          ),
        }));
      },
      
      updateQuantity: (productId, quantity, size, color) => {
        set((state) => {
          if (quantity <= 0) {
            return {
              items: state.items.filter(
                (item) =>
                  !(
                    item.productId === productId &&
                    item.size === size &&
                    item.color === color
                  )
              ),
            };
          }
          
          return {
            items: state.items.map((item) =>
              item.productId === productId &&
              item.size === size &&
              item.color === color
                ? { ...item, quantity }
                : item
            ),
          };
        });
      },
      
      clearCart: () => set({ items: [] }),
      
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },
      
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.quantity, 0);
      },
      
      getCartSummary: () => {
        const items = get().items;
        return {
          items,
          total: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
          itemCount: items.reduce((count, item) => count + item.quantity, 0),
        };
      },
    }),
    {
      name: 'modest-fashion-cart', // localStorage key
      partialize: (state) => ({ items: state.items }), // Only persist items
    }
  )
);
