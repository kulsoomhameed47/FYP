import mongoose from 'mongoose';

/**
 * Product Schema
 * Complete product model with variants, reviews, and SEO-friendly slugs
 */
const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: { type: String, required: true },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Name cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    shortDescription: {
      type: String,
      maxlength: [300, 'Short description cannot exceed 300 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    compareAtPrice: {
      type: Number, // Original price for showing discounts
      min: 0,
    },
    images: [
      {
        url: { type: String, required: true },
        alt: { type: String, default: '' },
        isMain: { type: Boolean, default: false },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    subcategory: {
      type: String, // e.g., "Winter Abaya", "Summer Abaya", "Stylish Scarf"
      trim: true,
    },
    targetAudience: {
      type: String,
      enum: ['men', 'women', 'kids', 'unisex'],
      required: true,
    },
    sizes: [
      {
        name: { type: String, required: true }, // e.g., "S", "M", "L", "XL", "52", "54"
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    colors: [
      {
        name: { type: String, required: true }, // e.g., "Black", "Navy"
        hex: { type: String }, // e.g., "#000000"
        stock: { type: Number, default: 0, min: 0 },
      },
    ],
    material: {
      type: String,
      trim: true, // e.g., "100% Cotton", "Silk Blend"
    },
    tags: [String], // For search and filtering
    stock: {
      type: Number,
      required: true,
      default: 0,
      min: [0, 'Stock cannot be negative'],
    },
    sold: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    reviews: [reviewSchema],
    featured: {
      type: Boolean,
      default: false,
    },
    isOnSale: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for discount percentage
productSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.price) {
    return Math.round(((this.compareAtPrice - this.price) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Virtual for checking if in stock
productSchema.virtual('inStock').get(function () {
  return this.stock > 0;
});

// Index for search and filtering
productSchema.index({ name: 'text', description: 'text', tags: 'text' });
productSchema.index({ category: 1, targetAudience: 1, price: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ featured: 1, isActive: 1 });

// Generate slug from name before saving
productSchema.pre('save', function (next) {
  if (this.isModified('name') || this.isNew) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
  next();
});

// Static method to calculate average rating
productSchema.statics.calcAverageRating = async function (productId) {
  const result = await this.aggregate([
    { $match: { _id: productId } },
    { $unwind: '$reviews' },
    {
      $group: {
        _id: '$_id',
        avgRating: { $avg: '$reviews.rating' },
        numReviews: { $sum: 1 },
      },
    },
  ]);

  if (result.length > 0) {
    await this.findByIdAndUpdate(productId, {
      rating: Math.round(result[0].avgRating * 10) / 10,
      numReviews: result[0].numReviews,
    });
  }
};

const Product = mongoose.model('Product', productSchema);

export default Product;
