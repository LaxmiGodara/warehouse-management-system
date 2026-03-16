// Product.js
// Defines the structure of a Product document in MongoDB
// Products are master data — created by Admin, used by Orders and Stock

import mongoose from 'mongoose';

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true          // removes accidental leading/trailing spaces
    },

    unit: {
      type: String,
      required: [true, 'Unit is required'],
      trim: true
      // Examples: kg, litre, piece, box, bag
      // We keep this as free text so Admin can define any unit
    },

    defaultRate: {
      type: Number,
      required: [true, 'Default rate is required'],
      min: [0, 'Rate cannot be negative']
      // This rate auto-fills when product is selected in an Order
    },

    isActive: {
      type: Boolean,
      default: true
      // Only active products appear in Order dropdowns
    },

    // totalQty lives here on the Product document
    // It is updated only by:
    // 1. Stock module (Admin manual correction)
    // 2. Delivery module (when delivery is marked Delivered)
    totalQty: {
      type: Number,
      default: 0,
      min: [0, 'Total quantity cannot be negative']
    },

    // Soft delete flag
    // We never permanently delete products
    // Old orders reference products — hard delete would break them
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    // Automatically manages createdAt and updatedAt fields
    timestamps: true
  }
);

const Product = mongoose.model('Product', productSchema);

export default Product;