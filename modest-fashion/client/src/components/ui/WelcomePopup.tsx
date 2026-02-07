import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles } from 'lucide-react';
import { useUIStore } from '../../store/uiStore';

/**
 * Welcome Popup
 * Shows on first visit with discount offer
 * Persists "seen" state to localStorage
 */
const WelcomePopup = () => {
  const { hasSeenWelcomePopup, showWelcomePopup, closeWelcomePopup } = useUIStore();
  
  // Auto-show popup after a short delay on first visit
  useEffect(() => {
    if (!hasSeenWelcomePopup) {
      const timer = setTimeout(() => {
        // Popup will show because showWelcomePopup is true by default
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [hasSeenWelcomePopup]);
  
  // Don't render if already seen
  if (hasSeenWelcomePopup || !showWelcomePopup) {
    return null;
  }
  
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
        onClick={(e) => {
          if (e.target === e.currentTarget) closeWelcomePopup();
        }}
      >
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Close Button */}
          <button
            onClick={closeWelcomePopup}
            className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition-colors z-10"
            aria-label="Close popup"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
          
          {/* Image/Decoration */}
          <div className="h-32 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="w-16 h-16 text-white" />
            </motion.div>
          </div>
          
          {/* Content */}
          <div className="p-8 text-center">
            <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-2">
              Welcome to Modest Fashion!
            </h2>
            <p className="text-gray-600 mb-6">
              Join our community and get{' '}
              <span className="font-semibold text-primary-600">10% OFF</span>{' '}
              your first order.
            </p>
            
            {/* Email Input */}
            <form className="space-y-4">
              <input
                type="email"
                placeholder="Enter your email"
                className="input text-center"
              />
              <button type="submit" className="btn-primary w-full">
                Get My 10% Off
              </button>
            </form>
            
            {/* Dismiss Link */}
            <button
              onClick={closeWelcomePopup}
              className="mt-4 text-sm text-gray-500 hover:text-gray-700 transition-colors"
            >
              No thanks, I'll pay full price
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default WelcomePopup;
