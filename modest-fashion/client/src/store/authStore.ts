import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  
  // Actions
  setUser: (user: User, token: string) => void;
  updateUser: (user: Partial<User>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

/**
 * Auth Store using Zustand
 * Manages user authentication state
 * Access token stored in memory (more secure)
 * Refresh token handled via httpOnly cookie
 */
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,
      isLoading: true, // Start loading until we check auth status
      
      setUser: (user, token) => {
        set({
          user,
          accessToken: token,
          isAuthenticated: true,
          isLoading: false,
        });
      },
      
      updateUser: (userData) => {
        set((state) => ({
          user: state.user ? { ...state.user, ...userData } : null,
        }));
      },
      
      logout: () => {
        set({
          user: null,
          accessToken: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },
      
      setLoading: (loading) => {
        set({ isLoading: loading });
      },
    }),
    {
      name: 'modest-fashion-auth',
      // Only persist user data, not tokens (tokens should be refreshed)
      partialize: (state) => ({ user: state.user }),
    }
  )
);
