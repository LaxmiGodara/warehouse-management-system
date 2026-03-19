// reservationService.js
// This utility computes Reserved Qty and Available Qty for products
// It is used by Orders, Stock, and Delivery modules
// Reserved Qty is NEVER stored — always computed fresh from active orders

import mongoose from 'mongoose';
import Order from '../models/Order.js';

// ── Get Reserved Qty for a Single Product ─────────────────────────────────
// Sums quantities from all active, undelivered orders for a product
export const getReservedQty = async (productId) => {

  const result = await Order.aggregate([
    {
      // Stage 1: Only consider active, non-deleted, non-delivered orders
      $match: {
        isActive: true,
        isDeleted: false,
        isDelivered: false
      }
    },
    {
      // Stage 2: Break items array into individual documents
      // Each item becomes a separate document for processing
      $unwind: '$items'
    },
    {
      // Stage 3: Filter to only items matching our target product
      $match: {
        'items.productId': new mongoose.Types.ObjectId(productId)
      }
    },
    {
      // Stage 4: Sum up all quantities for this product
      $group: {
        _id: null,
        totalReserved: { $sum: '$items.quantity' }
      }
    }
  ]);

  // If no orders found for this product, reserved qty is 0
  return result.length > 0 ? result[0].totalReserved : 0;
};


// ── Get Reserved Qty for Multiple Products at Once ─────────────────────────
// More efficient than calling getReservedQty one by one
// Returns an object: { productId: reservedQty, ... }
export const getReservedQtyForProducts = async (productIds) => {

  const result = await Order.aggregate([
    {
      $match: {
        isActive: true,
        isDeleted: false,
        isDelivered: false
      }
    },
    {
      $unwind: '$items'
    },
    {
      // Filter to only products we care about
      $match: {
        'items.productId': {
          $in: productIds.map(id => new mongoose.Types.ObjectId(id))
        }
      }
    },
    {
      // Group by productId and sum quantities
      $group: {
        _id: '$items.productId',
        totalReserved: { $sum: '$items.quantity' }
      }
    }
  ]);

  // Convert array result to a clean object for easy lookup
  // [{ _id: "p1", totalReserved: 10 }] → { "p1": 10 }
  const reservedMap = {};
  result.forEach(item => {
    reservedMap[item._id.toString()] = item.totalReserved;
  });

  return reservedMap;
};


// ── Get Available Qty for a Single Product ─────────────────────────────────
// Available Qty = Total Qty - Reserved Qty
export const getAvailableQty = async (product) => {
  const reservedQty = await getReservedQty(product._id);
  return product.totalQty - reservedQty;
};