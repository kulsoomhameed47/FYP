import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Gift, Truck, Shield, Headphones } from 'lucide-react';

// Placeholder for featured products - in real app, fetch from API
const featuredProducts = [
  { id: 1, name: 'Elegant Winter Abaya', price: 189.99, originalPrice: 252.99, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', slug: 'elegant-winter-abaya', discount: 25 },
  { id: 2, name: 'Silk Formal Abaya', price: 262.49, originalPrice: 349.99, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600', slug: 'silk-formal-abaya', discount: 25 },
  { id: 3, name: 'Floral Chiffon Scarf', price: 22.49, originalPrice: 29.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', slug: 'floral-chiffon-scarf', discount: 25 },
  { id: 4, name: 'Classic Jersey Hijab', price: 14.99, originalPrice: 19.99, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', slug: 'classic-jersey-hijab', discount: 25 },
];

const categories = [
  { name: 'Abayas', image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400', href: '/abayas', discount: '25% OFF' },
  { name: 'Scarves', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', href: '/scarves', discount: '20% OFF' },
  { name: 'Accessories', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=400', href: '/accessories', discount: '15% OFF' },
  { name: 'Bags', image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400', href: '/bags', discount: '20% OFF' },
];

const features = [
  { icon: Gift, title: 'Special Gift Box', description: 'Luxurious packaging' },
  { icon: Truck, title: 'Free Shipping', description: 'On orders over $50' },
  { icon: Shield, title: 'Secure Payment', description: '100% protected' },
  { icon: Headphones, title: '24/7 Support', description: 'Always here to help' },
];

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-light-300 overflow-hidden">
        <div className="container-custom py-16 md:py-24 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Hero Content */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-primary-500 text-dark text-sm font-bold uppercase tracking-wider mb-6">
                <Gift className="w-4 h-4" />
                Special Edition Gift Box
              </span>
              <h1 className="heading-1 text-dark mb-6">
                Elegant <span className="text-primary-500">Modest Fashion</span> for the Modern World
              </h1>
              <p className="text-lg text-dark-100 mb-8 max-w-lg">
                Introducing our Special Edition Gift Box, designed to make every moment feel luxurious and unforgettable. Wrapped in a soft pink box.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link to="/women" className="btn-primary">
                  Shop Collection
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
                <Link to="/scarves" className="btn-secondary">
                  Scarfs Collection
                </Link>
              </div>
            </motion.div>
            
            {/* Hero Image */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative"
            >
              <div className="aspect-[4/5] overflow-hidden bg-primary-200">
                <img
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"
                  alt="Elegant modest fashion"
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-primary-500 shadow-lg p-4">
                <p className="text-sm text-dark font-bold uppercase">Special Offer</p>
                <p className="text-2xl font-bold text-dark">25% OFF</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>
      
      {/* Features Bar */}
      <section className="bg-dark py-6">
        <div className="container-custom">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex items-center gap-3 text-white"
              >
                <feature.icon className="w-8 h-8 text-primary-500" />
                <div>
                  <p className="font-bold text-sm">{feature.title}</p>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Categories Section */}
      <section className="section">
        <div className="container-custom">
          <div className="text-center mb-12">
            <h2 className="heading-2 text-dark mb-4">Shop by Category</h2>
            <p className="text-dark-100 max-w-2xl mx-auto">
              Explore our diverse collection of modest fashion essentials
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {categories.map((category, index) => (
              <motion.div
                key={category.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link
                  to={category.href}
                  className="group relative block aspect-[3/4] overflow-hidden bg-light-300"
                >
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/70 to-transparent" />
                  {/* Discount Badge */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-primary-500 text-dark text-xs font-bold px-3 py-1 uppercase">
                      {category.discount}
                    </span>
                  </div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white uppercase tracking-wider">{category.name}</h3>
                    <p className="text-sm text-primary-300 mt-1">Shop Now →</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Products */}
      <section className="section bg-light-300">
        <div className="container-custom">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h2 className="heading-2 text-dark mb-2">Featured Products</h2>
              <p className="text-dark-100">Our most popular picks this season</p>
            </div>
            <Link to="/search?featured=true" className="hidden sm:flex items-center gap-2 text-sm font-bold text-primary-500 hover:text-primary-600 uppercase tracking-wider">
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Link to={`/product/${product.slug}`} className="group">
                  <div className="aspect-product overflow-hidden bg-white mb-4 relative">
                    {/* Discount Badge */}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary-500 text-dark text-xs font-bold px-2 py-1">
                        -{product.discount}%
                      </span>
                    </div>
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="font-bold text-dark group-hover:text-primary-500 transition-colors">
                    {product.name}
                  </h3>
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-primary-500 font-bold">${product.price.toFixed(2)}</p>
                    <p className="text-gray-400 line-through text-sm">${product.originalPrice.toFixed(2)}</p>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
          
          <div className="mt-8 text-center sm:hidden">
            <Link to="/search?featured=true" className="btn-primary">
              View All Products
            </Link>
          </div>
        </div>
      </section>
      
      {/* CTA Banner */}
      <section className="section">
        <div className="container-custom">
          <div className="relative bg-primary-500 overflow-hidden py-16 px-8 md:py-20 md:px-16 text-center">
            <div className="relative z-10">
              <h2 className="heading-2 text-dark mb-4">
                Get 10% Off Your First Order
              </h2>
              <p className="text-dark-100 mb-8 max-w-lg mx-auto">
                Join our newsletter and be the first to know about new arrivals, exclusive offers, and style tips.
              </p>
              <form className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 text-dark focus:outline-none focus:ring-2 focus:ring-dark bg-white"
                />
                <button type="submit" className="btn-outline bg-dark text-white hover:bg-dark-300 border-dark">
                  Subscribe
                </button>
              </form>
            </div>
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 translate-y-1/2 -translate-x-1/2" />
          </div>
        </div>
      </section>
      
      {/* Abaya Collection Banner */}
      <section className="section bg-light-300">
        <div className="container-custom">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600"
                alt="Abaya Collection"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/40 flex flex-col items-center justify-center text-white">
                <span className="bg-primary-500 text-dark text-sm font-bold px-4 py-1 mb-4 uppercase">20% Off</span>
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">Abaya Collection</h3>
                <Link to="/abayas" className="btn-white mt-4">
                  Shop Now
                </Link>
              </div>
            </div>
            <div className="relative overflow-hidden group">
              <img
                src="https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600"
                alt="Scarfs Collection"
                className="w-full h-80 object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-dark/40 flex flex-col items-center justify-center text-white">
                <span className="bg-primary-500 text-dark text-sm font-bold px-4 py-1 mb-4 uppercase">New Arrivals</span>
                <h3 className="text-2xl font-bold uppercase tracking-wider mb-2">Scarfs Collection</h3>
                <Link to="/scarves" className="btn-white mt-4">
                  Shop Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
