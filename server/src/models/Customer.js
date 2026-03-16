// Customer.js
// Defines the structure of a Customer document in MongoDB
// Customers are master data — created by Admin, used by Orders and Deliveries

import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    customerName: {
      type: String,
      required: [true, "Customer name is required"],
      trim: true,
    },

    mobileNumber: {
      type: String,
      required: [true, "Mobile number is required"],
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true, // always store email in lowercase
      default: "", // email is optional — default empty string
    },

    // Single large text area for full address
    // This address auto-fills the Delivery Address when creating an Order
    address: {
      type: String,
      required: [true, "Address is required"],
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
      // Only active customers appear in Order dropdowns
    },

    // Soft delete flag
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const Customer = mongoose.model("Customer", customerSchema);

export default Customer;
