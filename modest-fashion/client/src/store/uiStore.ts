import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface UIState {
  // Mobile menu
  isMobileMenuOpen: boolean;
  toggleMobileMenu: () => void;
  closeMobileMenu: () => void;
  
  // Welcome popup
  hasSeenWelcomePopup: boolean;
  showWelcomePopup: boolean;
  setHasSeenWelcomePopup: () => void;
  closeWelcomePopup: () => void;
  
  // Chatbot
  isChatbotOpen: boolean;
  toggleChatbot: () => void;
  openChatbot: () => void;
  closeChatbot: () => void;
  
  // Search
  isSearchOpen: boolean;
  toggleSearch: () => void;
  closeSearch: () => void;
}

/**
 * UI Store for managing global UI state
 * Welcome popup visibility persisted to localStorage
 */
export const useUIStore = create<UIState>()(
  persist(
    (set) => ({
      // Mobile menu
      isMobileMenuOpen: false,
      toggleMobileMenu: () => set((state) => ({ isMobileMenuOpen: !state.isMobileMenuOpen })),
      closeMobileMenu: () => set({ isMobileMenuOpen: false }),
      
      // Welcome popup - show on first visit
      hasSeenWelcomePopup: false,
      showWelcomePopup: true,
      setHasSeenWelcomePopup: () => set({ hasSeenWelcomePopup: true, showWelcomePopup: false }),
      closeWelcomePopup: () => set({ showWelcomePopup: false, hasSeenWelcomePopup: true }),
      
      // Chatbot
      isChatbotOpen: false,
      toggleChatbot: () => set((state) => ({ isChatbotOpen: !state.isChatbotOpen })),
      openChatbot: () => set({ isChatbotOpen: true }),
      closeChatbot: () => set({ isChatbotOpen: false }),
      
      // Search
      isSearchOpen: false,
      toggleSearch: () => set((state) => ({ isSearchOpen: !state.isSearchOpen })),
      closeSearch: () => set({ isSearchOpen: false }),
    }),
    {
      name: 'modest-fashion-ui',
      partialize: (state) => ({ hasSeenWelcomePopup: state.hasSeenWelcomePopup }),
    }
  )
);
