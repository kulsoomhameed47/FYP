import mongoose from 'mongoose';

/**
 * Cart Schema
 * Persistent cart storage for logged-in users
 */
const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1,
  },
  size: {
    type: String,
  },
  color: {
    type: String,
  },
  price: {
    type: Number,
    required: true, // Store price at time of adding to cart
  },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // One cart per user
    },
    items: [cartItemSchema],
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual for calculating cart total
cartSchema.virtual('total').get(function () {
  return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
});

// Virtual for total items count
cartSchema.virtual('itemCount').get(function () {
  return this.items.reduce((sum, item) => sum + item.quantity, 0);
});

// Method to add item to cart
cartSchema.methods.addItem = function (productId, quantity, size, color, price) {
  const existingItemIndex = this.items.findIndex(
    (item) =>
      item.product.toString() === productId.toString() &&
      item.size === size &&
      item.color === color
  );

  if (existingItemIndex > -1) {
    // Update quantity if item exists with same variant
    this.items[existingItemIndex].quantity += quantity;
  } else {
    // Add new item
    this.items.push({ product: productId, quantity, size, color, price });
  }
};

// Method to update item quantity
cartSchema.methods.updateItemQuantity = function (itemId, quantity) {
  const item = this.items.id(itemId);
  if (item) {
    if (quantity <= 0) {
      item.remove();
    } else {
      item.quantity = quantity;
    }
  }
};

// Method to remove item from cart
cartSchema.methods.removeItem = function (itemId) {
  this.items.pull(itemId);
};

// Method to clear cart
cartSchema.methods.clearCart = function () {
  this.items = [];
};

const Cart = mongoose.model('Cart', cartSchema);

export default Cart;
