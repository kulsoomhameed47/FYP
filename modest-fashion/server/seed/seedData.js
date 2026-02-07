import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import User from '../models/User.js';

dotenv.config();

// Sample Categories
const categories = [
  {
    name: 'Abayas',
    description: 'Elegant and modest abayas for every occasion',
    order: 1,
    subcategories: [
      { name: 'Winter Abayas', slug: 'winter-abayas' },
      { name: 'Summer Abayas', slug: 'summer-abayas' },
      { name: 'Formal Abayas', slug: 'formal-abayas' },
    ],
  },
  {
    name: 'Scarves',
    description: 'Beautiful scarves and hijabs in various styles',
    order: 2,
    subcategories: [
      { name: 'Stylish Scarves', slug: 'stylish-scarves' },
      { name: 'Simple Scarves', slug: 'simple-scarves' },
      { name: 'Premium Silk', slug: 'premium-silk' },
    ],
  },
  {
    name: 'Accessories',
    description: 'Complement your outfit with elegant accessories',
    order: 3,
    subcategories: [
      { name: 'Jewelry', slug: 'jewelry' },
      { name: 'Belts', slug: 'belts' },
      { name: 'Pins & Brooches', slug: 'pins-brooches' },
    ],
  },
  {
    name: 'Shoes',
    description: 'Comfortable and stylish footwear',
    order: 4,
    subcategories: [
      { name: 'Flats', slug: 'flats' },
      { name: 'Heels', slug: 'heels' },
      { name: 'Sandals', slug: 'sandals' },
    ],
  },
  {
    name: 'Bags',
    description: 'Elegant bags for every occasion',
    order: 5,
    subcategories: [
      { name: 'Handbags', slug: 'handbags' },
      { name: 'Tote Bags', slug: 'tote-bags' },
      { name: 'Clutches', slug: 'clutches' },
    ],
  },
];

// Generate sample products
const generateProducts = (categoryMap) => [
  // WOMEN'S ABAYAS
  {
    name: 'Elegant Black Winter Abaya',
    description: 'A luxurious winter abaya crafted from premium wool blend fabric. Features intricate gold embroidery on the sleeves and front panel. Perfect for formal occasions during cold weather.',
    shortDescription: 'Luxurious wool blend with gold embroidery',
    price: 189.99,
    compareAtPrice: 249.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', alt: 'Black Winter Abaya', isMain: true },
      { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', alt: 'Abaya Detail' },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Winter Abaya',
    targetAudience: 'women',
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
    tags: ['winter', 'formal', 'elegant', 'embroidered'],
    stock: 45,
    rating: 4.8,
    numReviews: 124,
    featured: true,
    isOnSale: true,
  },
  {
    name: 'Lightweight Summer Abaya',
    description: 'Breathable cotton abaya perfect for hot summer days. Features a modern cut with subtle pleating details. Light as a feather but maintains modest coverage.',
    shortDescription: 'Breathable cotton for summer comfort',
    price: 119.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800', alt: 'Summer Abaya', isMain: true },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Summer Abaya',
    targetAudience: 'women',
    sizes: [
      { name: '52', stock: 20 },
      { name: '54', stock: 25 },
      { name: '56', stock: 18 },
      { name: '58', stock: 15 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', stock: 30 },
      { name: 'Beige', hex: '#F5F5DC', stock: 28 },
      { name: 'Dusty Rose', hex: '#D4A5A5', stock: 20 },
    ],
    material: '100% Cotton',
    tags: ['summer', 'lightweight', 'casual', 'breathable'],
    stock: 78,
    rating: 4.6,
    numReviews: 89,
    featured: true,
  },
  {
    name: 'Premium Silk Formal Abaya',
    description: 'Exquisite silk abaya with hand-sewn crystal embellishments. A showstopper for weddings and special occasions. Includes matching belt.',
    shortDescription: 'Silk with crystal embellishments',
    price: 349.99,
    compareAtPrice: 450.00,
    images: [
      { url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800', alt: 'Silk Formal Abaya', isMain: true },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Formal Abaya',
    targetAudience: 'women',
    sizes: [
      { name: '52', stock: 5 },
      { name: '54', stock: 8 },
      { name: '56', stock: 6 },
    ],
    colors: [
      { name: 'Emerald', hex: '#50C878', stock: 10 },
      { name: 'Burgundy', hex: '#800020', stock: 9 },
    ],
    material: 'Pure Silk',
    tags: ['formal', 'wedding', 'luxury', 'silk'],
    stock: 19,
    rating: 4.9,
    numReviews: 45,
    featured: true,
    isOnSale: true,
  },
  // SCARVES
  {
    name: 'Floral Print Chiffon Scarf',
    description: 'Beautiful floral print chiffon scarf that adds elegance to any outfit. Lightweight and versatile for year-round wear.',
    shortDescription: 'Elegant floral chiffon for everyday style',
    price: 29.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', alt: 'Floral Scarf', isMain: true },
    ],
    category: categoryMap['Scarves'],
    subcategory: 'Stylish Scarves',
    targetAudience: 'women',
    sizes: [{ name: 'One Size', stock: 100 }],
    colors: [
      { name: 'Rose Garden', hex: '#FFB6C1', stock: 35 },
      { name: 'Ocean Blue', hex: '#4F97A3', stock: 30 },
      { name: 'Sage Green', hex: '#9DC183', stock: 35 },
    ],
    material: 'Chiffon',
    tags: ['floral', 'lightweight', 'elegant', 'everyday'],
    stock: 100,
    rating: 4.5,
    numReviews: 234,
    featured: true,
  },
  {
    name: 'Classic Jersey Hijab',
    description: 'Soft stretchy jersey hijab that stays in place all day. Perfect for active lifestyle without compromising on style.',
    shortDescription: 'Soft jersey that stays in place',
    price: 19.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800', alt: 'Jersey Hijab', isMain: true },
    ],
    category: categoryMap['Scarves'],
    subcategory: 'Simple Scarves',
    targetAudience: 'women',
    sizes: [{ name: 'One Size', stock: 150 }],
    colors: [
      { name: 'Black', hex: '#000000', stock: 50 },
      { name: 'Navy', hex: '#1B2951', stock: 40 },
      { name: 'Taupe', hex: '#483C32', stock: 30 },
      { name: 'White', hex: '#FFFFFF', stock: 30 },
    ],
    material: 'Premium Jersey',
    tags: ['everyday', 'comfortable', 'stretchy', 'basic'],
    stock: 150,
    rating: 4.7,
    numReviews: 567,
  },
  {
    name: 'Luxury Silk Hijab',
    description: 'Premium 100% mulberry silk hijab with a beautiful sheen. Gentle on hair and skin, perfect for special occasions.',
    shortDescription: '100% Mulberry silk for special occasions',
    price: 79.99,
    compareAtPrice: 99.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1596755389378-c31d21fd1273?w=800', alt: 'Silk Hijab', isMain: true },
    ],
    category: categoryMap['Scarves'],
    subcategory: 'Premium Silk',
    targetAudience: 'women',
    sizes: [{ name: 'One Size', stock: 40 }],
    colors: [
      { name: 'Champagne', hex: '#F7E7CE', stock: 15 },
      { name: 'Pearl', hex: '#FDEEF4', stock: 15 },
      { name: 'Midnight', hex: '#191970', stock: 10 },
    ],
    material: '100% Mulberry Silk',
    tags: ['silk', 'luxury', 'special occasion', 'premium'],
    stock: 40,
    rating: 4.9,
    numReviews: 123,
    isOnSale: true,
  },
  // ACCESSORIES
  {
    name: 'Gold Geometric Brooch',
    description: 'Stunning geometric brooch in 18k gold plating. Perfect for securing scarves or adding elegance to abayas.',
    shortDescription: '18k gold plated geometric design',
    price: 24.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800', alt: 'Gold Brooch', isMain: true },
    ],
    category: categoryMap['Accessories'],
    subcategory: 'Pins & Brooches',
    targetAudience: 'women',
    sizes: [{ name: 'One Size', stock: 80 }],
    colors: [
      { name: 'Gold', hex: '#FFD700', stock: 50 },
      { name: 'Rose Gold', hex: '#B76E79', stock: 30 },
    ],
    material: '18k Gold Plated',
    tags: ['brooch', 'pin', 'gold', 'accessory'],
    stock: 80,
    rating: 4.6,
    numReviews: 89,
    featured: true,
  },
  // SHOES
  {
    name: 'Elegant Kitten Heels',
    description: 'Comfortable kitten heels perfect for all-day wear. Memory foam insole for ultimate comfort without sacrificing style.',
    shortDescription: 'Comfortable heels with memory foam',
    price: 89.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800', alt: 'Kitten Heels', isMain: true },
    ],
    category: categoryMap['Shoes'],
    subcategory: 'Heels',
    targetAudience: 'women',
    sizes: [
      { name: '36', stock: 10 },
      { name: '37', stock: 15 },
      { name: '38', stock: 20 },
      { name: '39', stock: 15 },
      { name: '40', stock: 10 },
    ],
    colors: [
      { name: 'Black', hex: '#000000', stock: 35 },
      { name: 'Nude', hex: '#E8C4A2', stock: 35 },
    ],
    material: 'Genuine Leather',
    tags: ['heels', 'comfortable', 'formal', 'leather'],
    stock: 70,
    rating: 4.4,
    numReviews: 156,
  },
  // BAGS
  {
    name: 'Structured Leather Tote',
    description: 'Classic structured tote bag in genuine leather. Features multiple compartments and a detachable crossbody strap.',
    shortDescription: 'Genuine leather with multiple compartments',
    price: 149.99,
    compareAtPrice: 199.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800', alt: 'Leather Tote', isMain: true },
    ],
    category: categoryMap['Bags'],
    subcategory: 'Tote Bags',
    targetAudience: 'women',
    sizes: [{ name: 'One Size', stock: 30 }],
    colors: [
      { name: 'Black', hex: '#000000', stock: 15 },
      { name: 'Tan', hex: '#D2B48C', stock: 15 },
    ],
    material: 'Genuine Leather',
    tags: ['tote', 'leather', 'work', 'everyday'],
    stock: 30,
    rating: 4.7,
    numReviews: 78,
    featured: true,
    isOnSale: true,
  },
  // MEN'S PRODUCTS
  {
    name: "Men's Traditional Thobe",
    description: "Classic white thobe crafted from premium cotton. Features traditional collar design with subtle embroidery details.",
    shortDescription: 'Premium cotton traditional thobe',
    price: 129.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', alt: 'White Thobe', isMain: true },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Traditional',
    targetAudience: 'men',
    sizes: [
      { name: '52', stock: 15 },
      { name: '54', stock: 20 },
      { name: '56', stock: 18 },
      { name: '58', stock: 12 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', stock: 40 },
      { name: 'Cream', hex: '#FFFDD0', stock: 25 },
    ],
    material: '100% Premium Cotton',
    tags: ['men', 'traditional', 'thobe', 'formal'],
    stock: 65,
    rating: 4.8,
    numReviews: 234,
    featured: true,
  },
  {
    name: "Men's Leather Oxford Shoes",
    description: "Classic Oxford shoes in genuine leather. Perfect for formal occasions and everyday professional wear.",
    shortDescription: 'Genuine leather formal Oxfords',
    price: 159.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1614252369475-531eba835eb1?w=800', alt: 'Oxford Shoes', isMain: true },
    ],
    category: categoryMap['Shoes'],
    subcategory: 'Formal',
    targetAudience: 'men',
    sizes: [
      { name: '40', stock: 10 },
      { name: '41', stock: 15 },
      { name: '42', stock: 18 },
      { name: '43', stock: 15 },
      { name: '44', stock: 10 },
    ],
    colors: [
      { name: 'Black', hex: '#000000', stock: 35 },
      { name: 'Brown', hex: '#8B4513', stock: 33 },
    ],
    material: 'Genuine Leather',
    tags: ['men', 'formal', 'oxford', 'leather'],
    stock: 68,
    rating: 4.6,
    numReviews: 145,
  },
  // KIDS PRODUCTS
  {
    name: "Girls' Floral Abaya",
    description: "Adorable floral print abaya for little girls. Soft cotton fabric that's comfortable for all-day wear.",
    shortDescription: 'Soft cotton floral print for girls',
    price: 49.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1585487000160-6ebcfceb0d03?w=800', alt: 'Girls Abaya', isMain: true },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Kids Collection',
    targetAudience: 'kids',
    sizes: [
      { name: '4-5Y', stock: 15 },
      { name: '6-7Y', stock: 20 },
      { name: '8-9Y', stock: 18 },
      { name: '10-11Y', stock: 12 },
    ],
    colors: [
      { name: 'Pink Floral', hex: '#FFB6C1', stock: 35 },
      { name: 'Lavender', hex: '#E6E6FA', stock: 30 },
    ],
    material: '100% Cotton',
    tags: ['kids', 'girls', 'floral', 'comfortable'],
    stock: 65,
    rating: 4.8,
    numReviews: 89,
    featured: true,
  },
  {
    name: "Boys' Mini Thobe",
    description: "Adorable traditional thobe for boys. Made from soft, breathable fabric perfect for little ones.",
    shortDescription: 'Traditional thobe for little gentlemen',
    price: 44.99,
    images: [
      { url: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800', alt: 'Boys Thobe', isMain: true },
    ],
    category: categoryMap['Abayas'],
    subcategory: 'Kids Collection',
    targetAudience: 'kids',
    sizes: [
      { name: '4-5Y', stock: 12 },
      { name: '6-7Y', stock: 18 },
      { name: '8-9Y', stock: 15 },
      { name: '10-11Y', stock: 10 },
    ],
    colors: [
      { name: 'White', hex: '#FFFFFF', stock: 30 },
      { name: 'Blue', hex: '#87CEEB', stock: 25 },
    ],
    material: 'Cotton Blend',
    tags: ['kids', 'boys', 'traditional', 'thobe'],
    stock: 55,
    rating: 4.7,
    numReviews: 67,
  },
];

// Admin user
const adminUser = {
  name: 'Admin User',
  email: 'admin@modestfashion.com',
  password: 'admin123456',
  role: 'admin',
};

// Seed function
const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Clear existing data
    console.log('🗑️  Clearing existing data...');
    await Category.deleteMany({});
    await Product.deleteMany({});
    await User.deleteMany({ email: adminUser.email });

    // Create admin user
    console.log('👤 Creating admin user...');
    await User.create(adminUser);
    console.log('   Admin credentials: admin@modestfashion.com / admin123456');

    // Create categories
    console.log('📁 Creating categories...');
    const createdCategories = await Category.insertMany(categories);
    
    // Create a map of category names to IDs
    const categoryMap = {};
    createdCategories.forEach((cat) => {
      categoryMap[cat.name] = cat._id;
    });
    console.log(`   Created ${createdCategories.length} categories`);

    // Create products
    console.log('📦 Creating products...');
    const products = generateProducts(categoryMap);
    await Product.insertMany(products);
    console.log(`   Created ${products.length} products`);

    console.log('\n✅ Database seeded successfully!');
    console.log('\nYou can now start the server with: npm run dev');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();
