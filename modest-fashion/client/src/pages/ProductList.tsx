import { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Filter, Grid, List, ChevronDown, Star } from 'lucide-react';

interface ProductListProps {
  category?: string;
  audience?: 'men' | 'women' | 'kids';
}

// Placeholder products - in real app, fetch from API based on filters
const mockProducts = [
  { id: '1', name: 'Elegant Black Winter Abaya', slug: 'elegant-black-winter-abaya', price: 189.99, compareAtPrice: 249.99, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=600', rating: 4.8, reviews: 124 },
  { id: '2', name: 'Lightweight Summer Abaya', slug: 'lightweight-summer-abaya', price: 119.99, image: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=600', rating: 4.6, reviews: 89 },
  { id: '3', name: 'Premium Silk Formal Abaya', slug: 'premium-silk-formal-abaya', price: 349.99, compareAtPrice: 450.00, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600', rating: 4.9, reviews: 45 },
  { id: '4', name: 'Floral Print Chiffon Scarf', slug: 'floral-print-chiffon-scarf', price: 29.99, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600', rating: 4.5, reviews: 234 },
  { id: '5', name: 'Classic Jersey Hijab', slug: 'classic-jersey-hijab', price: 19.99, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600', rating: 4.7, reviews: 567 },
  { id: '6', name: 'Luxury Silk Hijab', slug: 'luxury-silk-hijab', price: 79.99, compareAtPrice: 99.99, image: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=600', rating: 4.9, reviews: 123 },
];

const sortOptions = [
  { label: 'Newest', value: '-createdAt' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: '-price' },
  { label: 'Best Selling', value: '-sold' },
  { label: 'Top Rated', value: '-rating' },
];

const ProductList = ({ category, audience }: ProductListProps) => {
  const [searchParams] = useSearchParams();
  const [products] = useState(mockProducts);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sortBy, setSortBy] = useState('-createdAt');
  const [showFilters, setShowFilters] = useState(false);
  
  const searchQuery = searchParams.get('q');
  
  // Page title
  const getPageTitle = () => {
    if (searchQuery) return `Search Results for "${searchQuery}"`;
    if (audience) return `${audience.charAt(0).toUpperCase() + audience.slice(1)}'s Collection`;
    if (category) return `${category.charAt(0).toUpperCase() + category.slice(1)}`;
    return 'All Products';
  };
  
  useEffect(() => {
    // In real app, fetch products based on filters
    // productsAPI.getAll({ category, targetAudience: audience, search: searchQuery, sort: sortBy })
  }, [category, audience, searchQuery, sortBy]);
  
  return (
    <div className="min-h-screen bg-white">
      {/* Page Header */}
      <div className="bg-gray-50 py-8 md:py-12">
        <div className="container-custom">
          <h1 className="heading-2 text-gray-900">{getPageTitle()}</h1>
          <p className="text-gray-600 mt-2">{products.length} products found</p>
        </div>
      </div>
      
      <div className="container-custom py-8">
        {/* Toolbar */}
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
          >
            <Filter className="w-4 h-4" />
            Filters
          </button>
          
          <div className="flex items-center gap-4">
            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="appearance-none pl-4 pr-10 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900 bg-white cursor-pointer"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            </div>
            
            {/* View Mode */}
            <div className="hidden sm:flex items-center border border-gray-300 rounded-lg overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 ${viewMode === 'grid' ? 'bg-gray-100' : ''}`}
                aria-label="Grid view"
              >
                <Grid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 ${viewMode === 'list' ? 'bg-gray-100' : ''}`}
                aria-label="List view"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <motion.aside
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 240 }}
              exit={{ opacity: 0, width: 0 }}
              className="hidden lg:block flex-shrink-0"
            >
              <div className="sticky top-24 space-y-6">
                {/* Price Range */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded" />
                      Under $50
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded" />
                      $50 - $100
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded" />
                      $100 - $200
                    </label>
                    <label className="flex items-center gap-2 text-sm text-gray-600">
                      <input type="checkbox" className="rounded" />
                      $200+
                    </label>
                  </div>
                </div>
                
                {/* Colors */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Color</h3>
                  <div className="flex flex-wrap gap-2">
                    {['Black', 'White', 'Navy', 'Beige', 'Pink'].map((color) => (
                      <button
                        key={color}
                        className="px-3 py-1 text-sm border border-gray-300 rounded-full hover:border-gray-900"
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
                
                {/* Sizes */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Size</h3>
                  <div className="flex flex-wrap gap-2">
                    {['S', 'M', 'L', 'XL', '52', '54', '56'].map((size) => (
                      <button
                        key={size}
                        className="w-10 h-10 text-sm border border-gray-300 rounded-lg hover:border-gray-900"
                      >
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.aside>
          )}
          
          {/* Products Grid */}
          <div className="flex-1">
            <div className={`grid gap-4 md:gap-6 ${
              viewMode === 'grid' 
                ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' 
                : 'grid-cols-1'
            }`}>
              {products.map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Link
                    to={`/product/${product.slug}`}
                    className={`group ${viewMode === 'list' ? 'flex gap-6' : ''}`}
                  >
                    {/* Image */}
                    <div className={`relative bg-gray-100 rounded-xl overflow-hidden ${
                      viewMode === 'list' ? 'w-48 flex-shrink-0' : 'aspect-product'
                    }`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      {product.compareAtPrice && (
                        <span className="absolute top-2 left-2 badge badge-sale">
                          Sale
                        </span>
                      )}
                    </div>
                    
                    {/* Info */}
                    <div className={viewMode === 'list' ? 'flex-1 py-2' : 'mt-4'}>
                      <h3 className="font-medium text-gray-900 group-hover:text-gray-600 transition-colors line-clamp-2">
                        {product.name}
                      </h3>
                      
                      {/* Rating */}
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                        <span className="text-sm text-gray-600">
                          {product.rating} ({product.reviews})
                        </span>
                      </div>
                      
                      {/* Price */}
                      <div className="flex items-center gap-2 mt-2">
                        <span className="font-semibold text-gray-900">
                          ${product.price.toFixed(2)}
                        </span>
                        {product.compareAtPrice && (
                          <span className="text-sm text-gray-500 line-through">
                            ${product.compareAtPrice.toFixed(2)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Pagination */}
            <div className="mt-12 flex justify-center gap-2">
              {[1, 2, 3, 4, 5].map((page) => (
                <button
                  key={page}
                  className={`w-10 h-10 rounded-lg text-sm font-medium ${
                    page === 1 
                      ? 'bg-gray-900 text-white' 
                      : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
