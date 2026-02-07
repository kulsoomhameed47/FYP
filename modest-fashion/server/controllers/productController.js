import Product from '../models/Product.js';
import { asyncHandler } from '../middlewares/errorHandler.js';

/**
 * @desc    Get all products with filtering, sorting, and pagination
 * @route   GET /api/products
 * @access  Public
 */
export const getProducts = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    sort = '-createdAt',
    category,
    subcategory,
    targetAudience,
    minPrice,
    maxPrice,
    color,
    size,
    search,
    featured,
    onSale,
  } = req.query;

  // Build query
  const query = { isActive: true };

  // Category filter
  if (category) {
    query.category = category;
  }

  // Subcategory filter
  if (subcategory) {
    query.subcategory = { $regex: subcategory, $options: 'i' };
  }

  // Target audience filter (men, women, kids)
  if (targetAudience) {
    query.targetAudience = targetAudience.toLowerCase();
  }

  // Price range filter
  if (minPrice || maxPrice) {
    query.price = {};
    if (minPrice) query.price.$gte = parseFloat(minPrice);
    if (maxPrice) query.price.$lte = parseFloat(maxPrice);
  }

  // Color filter
  if (color) {
    query['colors.name'] = { $regex: color, $options: 'i' };
  }

  // Size filter
  if (size) {
    query['sizes.name'] = size;
  }

  // Search filter (text search)
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { description: { $regex: search, $options: 'i' } },
      { tags: { $in: [new RegExp(search, 'i')] } },
    ];
  }

  // Featured products only
  if (featured === 'true') {
    query.featured = true;
  }

  // On sale products only
  if (onSale === 'true') {
    query.isOnSale = true;
  }

  // Execute query with pagination
  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name slug')
      .sort(sort)
      .skip(skip)
      .limit(limitNum)
      .lean(),
    Product.countDocuments(query),
  ]);

  res.json({
    success: true,
    products,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.ceil(total / limitNum),
    },
  });
});

/**
 * @desc    Get single product by slug
 * @route   GET /api/products/:slug
 * @access  Public
 */
export const getProductBySlug = asyncHandler(async (req, res) => {
  const product = await Product.findOne({
    slug: req.params.slug,
    isActive: true,
  })
    .populate('category', 'name slug')
    .populate('reviews.user', 'name avatar');

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    product,
  });
});

/**
 * @desc    Get related products
 * @route   GET /api/products/:id/related
 * @access  Public
 */
export const getRelatedProducts = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Find products in same category, excluding current product
  const related = await Product.find({
    _id: { $ne: product._id },
    category: product.category,
    targetAudience: product.targetAudience,
    isActive: true,
  })
    .limit(4)
    .lean();

  res.json({
    success: true,
    products: related,
  });
});

/**
 * @desc    Get featured products
 * @route   GET /api/products/featured
 * @access  Public
 */
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    featured: true,
    isActive: true,
  })
    .limit(8)
    .populate('category', 'name slug')
    .lean();

  res.json({
    success: true,
    products,
  });
});

/**
 * @desc    Get best sellers
 * @route   GET /api/products/bestsellers
 * @access  Public
 */
export const getBestSellers = asyncHandler(async (req, res) => {
  const products = await Product.find({ isActive: true })
    .sort('-sold')
    .limit(8)
    .populate('category', 'name slug')
    .lean();

  res.json({
    success: true,
    products,
  });
});

/**
 * @desc    Get on-sale products
 * @route   GET /api/products/sale
 * @access  Public
 */
export const getSaleProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({
    isOnSale: true,
    isActive: true,
    compareAtPrice: { $exists: true, $gt: 0 },
  })
    .limit(12)
    .populate('category', 'name slug')
    .lean();

  res.json({
    success: true,
    products,
  });
});

/**
 * @desc    Create a product (Admin)
 * @route   POST /api/products
 * @access  Private/Admin
 */
export const createProduct = asyncHandler(async (req, res) => {
  const product = await Product.create(req.body);

  res.status(201).json({
    success: true,
    product,
  });
});

/**
 * @desc    Update a product (Admin)
 * @route   PUT /api/products/:id
 * @access  Private/Admin
 */
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  res.json({
    success: true,
    product,
  });
});

/**
 * @desc    Delete a product (Admin)
 * @route   DELETE /api/products/:id
 * @access  Private/Admin
 */
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Soft delete - just mark as inactive
  product.isActive = false;
  await product.save();

  res.json({
    success: true,
    message: 'Product deleted',
  });
});

/**
 * @desc    Add a product review
 * @route   POST /api/products/:id/reviews
 * @access  Private
 */
export const addReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error('Product not found');
  }

  // Check if user already reviewed
  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );

  if (alreadyReviewed) {
    res.status(400);
    throw new Error('You have already reviewed this product');
  }

  const review = {
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  product.reviews.push(review);
  await product.save();

  // Update average rating
  await Product.calcAverageRating(product._id);

  res.status(201).json({
    success: true,
    message: 'Review added',
  });
});

/**
 * @desc    Search products for chatbot
 * @route   GET /api/products/search/chatbot
 * @access  Public
 */
export const searchProductsForChatbot = asyncHandler(async (req, res) => {
  const { query, category, audience, limit = 5 } = req.query;

  const searchQuery = { isActive: true };

  if (query) {
    searchQuery.$or = [
      { name: { $regex: query, $options: 'i' } },
      { description: { $regex: query, $options: 'i' } },
      { tags: { $in: [new RegExp(query, 'i')] } },
      { subcategory: { $regex: query, $options: 'i' } },
    ];
  }

  if (category) {
    searchQuery.category = category;
  }

  if (audience) {
    searchQuery.targetAudience = audience.toLowerCase();
  }

  const products = await Product.find(searchQuery)
    .select('name slug price images shortDescription rating')
    .limit(parseInt(limit))
    .lean();

  res.json({
    success: true,
    products,
  });
});
