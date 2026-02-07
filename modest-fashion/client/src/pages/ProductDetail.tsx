import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Star, Heart, Minus, Plus, Truck, RotateCcw, Shield } from 'lucide-react';
import { toast } from 'sonner';
import { useCartStore } from '../store/cartStore';

// Mock product data - in real app, fetch from API
const mockProduct = {
  _id: '1',
  name: 'Elegant Black Winter Abaya',
  slug: 'elegant-black-winter-abaya',
  description: 'A luxurious winter abaya crafted from premium wool blend fabric. Features intricate gold embroidery on the sleeves and front panel. Perfect for formal occasions during cold weather. The flowing silhouette provides both comfort and elegance.',
  shortDescription: 'Luxurious wool blend with gold embroidery',
  price: 189.99,
  compareAtPrice: 249.99,
  images: [
    { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', alt: 'Front view', isMain: true },
    { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', alt: 'Detail view' },
    { url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800', alt: 'Side view' },
  ],
  sizes: [
    { name: '52', stock: 10 },
    { name: '54', stock: 15 },
    { name: '56', stock: 12 },
    { name: '58', stock: 8 },
  ],
  colors: [
    { name: 'Black', hex: '#000000', stock: 25 },
    { name: 'Navy', hex: '#1B2951', stock: 20 },
  ],
  material: 'Wool Blend',
  rating: 4.8,
  numReviews: 124,
  stock: 45,
};

const ProductDetail = () => {
  const { slug } = useParams();
  const { addItem } = useCartStore();
  
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  
  const product = mockProduct; // In real app: useEffect to fetch product by slug
  
  const handleAddToCart = () => {
    if (!selectedSize) {
      toast.error('Please select a size');
      return;
    }
    if (!selectedColor) {
      toast.error('Please select a color');
      return;
    }
    
    addItem({
      productId: product._id,
      name: product.name,
      slug: product.slug,
      price: product.price,
      image: product.images[0].url,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
    
    toast.success('Added to cart!');
  };
  
  const discountPercent = product.compareAtPrice 
    ? Math.round(((product.compareAtPrice - product.price) / product.compareAtPrice) * 100)
    : 0;
  
  return (
    <div className="container-custom py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-gray-500 mb-8">
        <Link to="/" className="hover:text-gray-900">Home</Link>
        <span className="mx-2">/</span>
        <Link to="/abayas" className="hover:text-gray-900">Abayas</Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{product.name}</span>
      </nav>
      
      <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Images */}
        <div className="space-y-4">
          <motion.div
            key={selectedImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100"
          >
            <img
              src={product.images[selectedImage].url}
              alt={product.images[selectedImage].alt}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Thumbnails */}
          <div className="flex gap-4">
            {product.images.map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={`w-20 h-24 rounded-lg overflow-hidden border-2 transition-colors ${
                  selectedImage === index ? 'border-gray-900' : 'border-transparent'
                }`}
              >
                <img src={image.url} alt={image.alt} className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>
        
        {/* Product Info */}
        <div>
          {discountPercent > 0 && (
            <span className="badge badge-sale mb-4">{discountPercent}% OFF</span>
          )}
          
          <h1 className="text-2xl md:text-3xl font-serif font-semibold text-gray-900 mb-4">
            {product.name}
          </h1>
          
          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-4 h-4 ${
                    i < Math.floor(product.rating)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-gray-300'
                  }`}
                />
              ))}
            </div>
            <span className="text-sm text-gray-600">
              {product.rating} ({product.numReviews} reviews)
            </span>
          </div>
          
          {/* Price */}
          <div className="flex items-center gap-3 mb-6">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toFixed(2)}
            </span>
            {product.compareAtPrice && (
              <span className="text-lg text-gray-500 line-through">
                ${product.compareAtPrice.toFixed(2)}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 mb-8">{product.description}</p>
          
          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Color: <span className="font-normal text-gray-600">{selectedColor}</span>
            </p>
            <div className="flex gap-3">
              {product.colors.map((color) => (
                <button
                  key={color.name}
                  onClick={() => setSelectedColor(color.name)}
                  className={`w-10 h-10 rounded-full border-2 ${
                    selectedColor === color.name ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                />
              ))}
            </div>
          </div>
          
          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-gray-900 mb-3">
              Size: <span className="font-normal text-gray-600">{selectedSize}</span>
            </p>
            <div className="flex flex-wrap gap-3">
              {product.sizes.map((size) => (
                <button
                  key={size.name}
                  onClick={() => setSelectedSize(size.name)}
                  disabled={size.stock === 0}
                  className={`w-14 h-10 rounded-lg border text-sm font-medium transition-colors ${
                    selectedSize === size.name
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : size.stock === 0
                      ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                      : 'border-gray-300 text-gray-700 hover:border-gray-900'
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>
          
          {/* Quantity */}
          <div className="mb-8">
            <p className="text-sm font-medium text-gray-900 mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-3 hover:bg-gray-100 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-gray-500">{product.stock} in stock</span>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex gap-4 mb-8">
            <button onClick={handleAddToCart} className="btn-primary flex-1">
              Add to Cart
            </button>
            <button className="btn-secondary p-3">
              <Heart className="w-5 h-5" />
            </button>
          </div>
          
          {/* Features */}
          <div className="space-y-4 pt-8 border-t border-gray-200">
            <div className="flex items-center gap-4">
              <Truck className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Free shipping on orders over $50</span>
            </div>
            <div className="flex items-center gap-4">
              <RotateCcw className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">30-day return policy</span>
            </div>
            <div className="flex items-center gap-4">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-600">Secure checkout with Stripe</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
