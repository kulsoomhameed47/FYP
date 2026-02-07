import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';

// Components
import ChatbotWidget from './components/chatbot/ChatbotWidget';
import WelcomePopup from './components/ui/WelcomePopup';

function App() {
  return (
    <>
      <AnimatePresence mode="wait">
        <Routes>
          {/* Main Layout Routes */}
          <Route element={<MainLayout />}>
            {/* Home */}
            <Route path="/" element={<Home />} />
            
            {/* Category Pages */}
            <Route path="/women" element={<ProductList audience="women" />} />
            <Route path="/men" element={<ProductList audience="men" />} />
            <Route path="/kids" element={<ProductList audience="kids" />} />
            
            {/* Product Category Pages */}
            <Route path="/abayas" element={<ProductList category="abayas" />} />
            <Route path="/scarves" element={<ProductList category="scarves" />} />
            <Route path="/accessories" element={<ProductList category="accessories" />} />
            <Route path="/shoes" element={<ProductList category="shoes" />} />
            <Route path="/bags" element={<ProductList category="bags" />} />
            
            {/* Product Detail */}
            <Route path="/product/:slug" element={<ProductDetail />} />
            
            {/* Search */}
            <Route path="/search" element={<ProductList />} />
            
            {/* Cart & Checkout */}
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            
            {/* Auth */}
            <Route path="/signin" element={<SignIn />} />
            <Route path="/signup" element={<SignUp />} />
            
            {/* Profile */}
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/orders" element={<Profile />} />
            <Route path="/profile/addresses" element={<Profile />} />
            <Route path="/profile/wishlist" element={<Profile />} />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </AnimatePresence>
      
      {/* Global Components */}
      <ChatbotWidget />
      <WelcomePopup />
    </>
  );
}

export default App;
