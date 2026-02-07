import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  ChevronDown,
} from 'lucide-react';
import { useCartStore } from '../../store/cartStore';
import { useAuthStore } from '../../store/authStore';
import { useUIStore } from '../../store/uiStore';

const navLinks = [
  { name: 'WOMEN', href: '/women' },
  { name: 'MEN', href: '/men' },
  { name: 'KIDS', href: '/kids' },
  {
    name: 'CATEGORIES',
    href: '#',
    children: [
      { name: 'Abayas', href: '/abayas' },
      { name: 'Scarves', href: '/scarves' },
      { name: 'Accessories', href: '/accessories' },
      { name: 'Shoes', href: '/shoes' },
      { name: 'Bags', href: '/bags' },
    ],
  },
];

const Navbar = () => {
  const navigate = useNavigate();
  const { getItemCount, toggleCart } = useCartStore();
  const { isAuthenticated, user, logout } = useAuthStore();
  const { isMobileMenuOpen, toggleMobileMenu, closeMobileMenu } = useUIStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  
  const itemCount = getItemCount();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };
  
  const handleLogout = async () => {
    logout();
    setShowUserMenu(false);
    navigate('/');
  };
  
  return (
    <>
      {/* Promotional Banner */}
      <div className="bg-primary-500 text-dark py-2 text-center text-sm font-bold uppercase tracking-wider">
        Summer Offer on Abayas, Scarfs & Accessories • 25% OFF On All Products
      </div>
      
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-gray-100">
        <div className="container-custom">
          <div className="flex items-center justify-between h-16 lg:h-20">
            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="lg:hidden p-2 -ml-2 text-dark hover:text-primary-500 transition-colors"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
            
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-2"
            >
              <span className="text-xl lg:text-2xl font-bold tracking-tight text-dark">
                Rehman<span className="text-primary-500">Hosiery</span>
              </span>
            </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <div key={link.name} className="relative">
                {link.children ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setShowCategoryDropdown(true)}
                    onMouseLeave={() => setShowCategoryDropdown(false)}
                  >
                    <button className="flex items-center gap-1 text-sm font-bold text-dark hover:text-primary-500 transition-colors uppercase tracking-wider">
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                    </button>
                    
                    <AnimatePresence>
                      {showCategoryDropdown && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-white shadow-lg border-t-2 border-primary-500 py-2"
                        >
                          {link.children.map((child) => (
                            <Link
                              key={child.name}
                              to={child.href}
                              className="block px-4 py-2 text-sm text-dark hover:bg-light-300 hover:text-primary-500 transition-colors"
                            >
                              {child.name}
                            </Link>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <Link
                    to={link.href}
                    className="text-sm font-bold text-dark hover:text-primary-500 transition-colors uppercase tracking-wider"
                  >
                    {link.name}
                  </Link>
                )}
              </div>
            ))}
          </nav>
          
          {/* Right Actions */}
          <div className="flex items-center gap-2 lg:gap-4">
            {/* Search */}
            <form onSubmit={handleSearch} className="hidden md:flex items-center">
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="w-40 lg:w-52 pl-10 pr-4 py-2 text-sm bg-light-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:bg-white transition-all border-0"
                />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
            </form>
            
            {/* Mobile Search */}
            <button className="md:hidden p-2 hover:text-primary-500 transition-colors" aria-label="Search">
              <Search className="w-5 h-5" />
            </button>
            
            {/* Wishlist */}
            {isAuthenticated && (
              <Link to="/profile/wishlist" className="p-2 hidden sm:block hover:text-primary-500 transition-colors">
                <Heart className="w-5 h-5" />
              </Link>
            )}
            
            {/* User Menu */}
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="p-2 hover:text-primary-500 transition-colors"
                aria-label="User menu"
              >
                <User className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showUserMenu && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 top-full mt-2 w-48 bg-white shadow-lg border-t-2 border-primary-500 py-2"
                  >
                    {isAuthenticated ? (
                      <>
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="text-sm font-bold truncate text-dark">
                            {user?.name}
                          </p>
                          <p className="text-xs text-gray-500 truncate">
                            {user?.email}
                          </p>
                        </div>
                        <Link
                          to="/profile"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-dark hover:bg-light-300 hover:text-primary-500"
                        >
                          My Profile
                        </Link>
                        <Link
                          to="/profile/orders"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-dark hover:bg-light-300 hover:text-primary-500"
                        >
                          Orders
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-2 text-sm text-primary-600 hover:bg-light-300"
                        >
                          Sign Out
                        </button>
                      </>
                    ) : (
                      <>
                        <Link
                          to="/signin"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-dark hover:bg-light-300 hover:text-primary-500"
                        >
                          Sign In
                        </Link>
                        <Link
                          to="/signup"
                          onClick={() => setShowUserMenu(false)}
                          className="block px-4 py-2 text-sm text-dark hover:bg-light-300 hover:text-primary-500"
                        >
                          Create Account
                        </Link>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Cart */}
            <button
              onClick={toggleCart}
              className="relative p-2 hover:text-primary-500 transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-primary-500 text-dark text-xs font-bold flex items-center justify-center">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-primary-200 bg-white"
          >
            <nav className="container-custom py-4 space-y-2">
              {navLinks.map((link) => (
                <div key={link.name}>
                  {link.children ? (
                    <div className="space-y-2">
                      <p className="text-sm font-bold text-dark py-2 uppercase tracking-wider">
                        {link.name}
                      </p>
                      <div className="pl-4 space-y-1 border-l-2 border-primary-500">
                        {link.children.map((child) => (
                          <Link
                            key={child.name}
                            to={child.href}
                            onClick={closeMobileMenu}
                            className="block py-2 text-sm text-dark-100 hover:text-primary-500 transition-colors"
                          >
                            {child.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <Link
                      to={link.href}
                      onClick={closeMobileMenu}
                      className="block py-2 text-sm font-bold text-dark uppercase tracking-wider hover:text-primary-500 transition-colors"
                    >
                      {link.name}
                    </Link>
                  )}
                </div>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
    </>
  );
};

export default Navbar;
