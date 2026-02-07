import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Sparkles,
  ShoppingCart,
  Truck,
  RotateCcw,
  Tag,
} from 'lucide-react';
import { useUIStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import type { ChatMessage, ChatSuggestion } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * AI-Powered Chatbot Widget
 * Features:
 * - Streaming responses from OpenAI
 * - Product recommendations
 * - Cart summary integration
 * - FAQ handling
 * - Animated slide-in/out
 * - Mobile responsive
 * - Typing indicator
 */
const ChatbotWidget = () => {
  const { isChatbotOpen, toggleChatbot, closeChatbot } = useUIStore();
  const { getCartSummary } = useCartStore();
  
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(true);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Quick suggestions for users
  const suggestions: ChatSuggestion[] = [
    { text: "Show me winter abayas", icon: "snowflake" },
    { text: "Suggest stylish scarves", icon: "shirt" },
    { text: "What's on sale?", icon: "tag" },
    { text: "Help with checkout", icon: "cart" },
    { text: "Shipping info", icon: "truck" },
    { text: "Return policy", icon: "return" },
  ];
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);
  
  // Focus input when chatbot opens
  useEffect(() => {
    if (isChatbotOpen && !isMinimized) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isChatbotOpen, isMinimized]);
  
  // Add welcome message on first open
  useEffect(() => {
    if (isChatbotOpen && messages.length === 0) {
      setMessages([
        {
          id: 'welcome',
          role: 'assistant',
          content: "Hello! 👋 Welcome to Modest Fashion! I'm here to help you find the perfect abayas, scarves, and accessories. How can I assist you today?",
          timestamp: new Date(),
        },
      ]);
    }
  }, [isChatbotOpen, messages.length]);
  
  // Send message to API with streaming
  const sendMessage = useCallback(async (messageText: string) => {
    if (!messageText.trim() || isLoading) return;
    
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date(),
    };
    
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setShowSuggestions(false);
    
    // Add placeholder for assistant response
    const assistantId = (Date.now() + 1).toString();
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      },
    ]);
    
    try {
      // Build conversation history for context
      const conversationHistory = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      
      // Get cart summary for context
      const cartSummary = getCartSummary();
      
      const response = await fetch(`${API_URL}/chatbot/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageText,
          conversationHistory,
          cartSummary: cartSummary.items.length > 0 ? cartSummary : undefined,
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to get response');
      }
      
      // Handle streaming response
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let fullContent = '';
      
      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          
          const chunk = decoder.decode(value);
          const lines = chunk.split('\n');
          
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const data = JSON.parse(line.slice(6));
                
                if (data.done) {
                  break;
                }
                
                if (data.error) {
                  fullContent = data.content;
                  break;
                }
                
                if (data.content) {
                  fullContent += data.content;
                  
                  // Update message with streamed content
                  setMessages((prev) =>
                    prev.map((m) =>
                      m.id === assistantId
                        ? { ...m, content: fullContent }
                        : m
                    )
                  );
                }
              } catch {
                // Ignore JSON parse errors for incomplete chunks
              }
            }
          }
        }
      }
    } catch (error) {
      console.error('Chatbot error:', error);
      
      // Update with error message
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content: "I apologize, but I'm having trouble connecting right now. Please try again or contact our support team for assistance.",
              }
            : m
        )
      );
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading, getCartSummary]);
  
  // Handle form submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };
  
  // Handle suggestion click
  const handleSuggestionClick = (suggestion: string) => {
    sendMessage(suggestion);
  };
  
  // Get icon for suggestion
  const getSuggestionIcon = (icon?: string) => {
    switch (icon) {
      case 'cart':
        return <ShoppingCart className="w-3 h-3" />;
      case 'truck':
        return <Truck className="w-3 h-3" />;
      case 'return':
        return <RotateCcw className="w-3 h-3" />;
      case 'tag':
        return <Tag className="w-3 h-3" />;
      default:
        return <Sparkles className="w-3 h-3" />;
    }
  };
  
  return (
    <>
      {/* Chat Toggle Button */}
      <AnimatePresence>
        {!isChatbotOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleChatbot}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 bg-gray-900 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-gray-800 transition-colors"
            aria-label="Open chat"
          >
            <MessageCircle className="w-6 h-6" />
            {/* Notification dot */}
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px] font-bold">
              1
            </span>
          </motion.button>
        )}
      </AnimatePresence>
      
      {/* Chat Window */}
      <AnimatePresence>
        {isChatbotOpen && (
          <motion.div
            initial={{ opacity: 0, y: 100, scale: 0.95 }}
            animate={{
              opacity: 1,
              y: 0,
              scale: 1,
              height: isMinimized ? 'auto' : undefined,
            }}
            exit={{ opacity: 0, y: 100, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className={`fixed bottom-6 right-6 z-50 w-[380px] max-w-[calc(100vw-48px)] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col ${
              isMinimized ? '' : 'h-[600px] max-h-[calc(100vh-100px)]'
            }`}
          >
            {/* Header */}
            <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-semibold">Fashion Assistant</h3>
                  <p className="text-xs text-gray-300">
                    {isLoading ? 'Typing...' : 'Online'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setIsMinimized(!isMinimized)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label={isMinimized ? 'Maximize' : 'Minimize'}
                >
                  {isMinimized ? (
                    <Maximize2 className="w-4 h-4" />
                  ) : (
                    <Minimize2 className="w-4 h-4" />
                  )}
                </button>
                <button
                  onClick={closeChatbot}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Messages */}
            {!isMinimized && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                  {messages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex ${
                        message.role === 'user' ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-[85%] p-3 rounded-2xl ${
                          message.role === 'user'
                            ? 'bg-gray-900 text-white rounded-br-md'
                            : 'bg-white text-gray-900 shadow-sm rounded-bl-md'
                        }`}
                      >
                        {message.content || (
                          // Typing indicator
                          <div className="flex items-center gap-1 py-1 px-2">
                            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                            <span className="w-2 h-2 bg-gray-400 rounded-full typing-dot" />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                
                {/* Quick Suggestions */}
                {showSuggestions && messages.length <= 2 && (
                  <div className="px-4 py-3 border-t border-gray-100 bg-white">
                    <p className="text-xs text-gray-500 mb-2">Quick questions:</p>
                    <div className="flex flex-wrap gap-2">
                      {suggestions.slice(0, 4).map((suggestion) => (
                        <button
                          key={suggestion.text}
                          onClick={() => handleSuggestionClick(suggestion.text)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs bg-gray-100 hover:bg-gray-200 rounded-full transition-colors"
                        >
                          {getSuggestionIcon(suggestion.icon)}
                          {suggestion.text}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {/* Input Form */}
                <form
                  onSubmit={handleSubmit}
                  className="p-4 border-t border-gray-100 bg-white"
                >
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Type your message..."
                      disabled={isLoading}
                      className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 disabled:opacity-50"
                    />
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="w-10 h-10 bg-gray-900 text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      aria-label="Send message"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default ChatbotWidget;
