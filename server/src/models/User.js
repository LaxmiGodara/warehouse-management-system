// User.js
// This is the User schema — defines the structure of every user document in MongoDB
// Every Admin and Staff account is stored using this schema

import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,         // no two users can have same username
      trim: true            // removes accidental spaces
    },

    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,      // always store email in lowercase
      trim: true
    },

    // We store the hashed password — never plain text
    passwordHash: {
      type: String,
      required: [true, 'Password is required']
    },

    role: {
      type: String,
      enum: ['ADMIN', 'STAFF'],   // only these two values are allowed
      required: [true, 'Role is required']
    },

    isActive: {
      type: Boolean,
      default: true             // new users are active by default
    },

    // Soft delete flag — we never permanently delete users
    // This preserves audit trail for deliveries and payments
    isDeleted: {
      type: Boolean,
      default: false
    }
  },
  {
    // Automatically adds createdAt and updatedAt fields
    timestamps: true
  }
);

const User = mongoose.model('User', userSchema);

export default User;