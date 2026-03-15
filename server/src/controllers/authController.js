// authController.js
// Handles login logic
// When a user submits username + password, this controller verifies and returns a token

import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    // Step 1 — Check if username and password were provided
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      });
    }

    // Step 2 — Find user by username
    // Also check isDeleted is false — deleted users cannot login
    const user = await User.findOne({ username, isDeleted: false });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Step 3 — Check if user is active
    // Inactive users are blocked from logging in
    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: 'Your account is inactive. Contact Admin.'
      });
    }

    // Step 4 — Compare submitted password with stored hash
    // bcrypt.compare() does the comparison safely
    const isPasswordCorrect = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordCorrect) {
      return res.status(401).json({
        success: false,
        message: 'Invalid username or password'
      });
    }

    // Step 5 — Generate JWT token
    // We include userId and role in the payload
    // This allows middleware to identify user and role on every request
    const token = jwt.sign(
      {
        userId: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
    );

    // Step 6 — Send token and basic user info back
    res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    // Pass any unexpected errors to central error handler
    next(error);
  }
};


// Get current logged in user profile
// Protected route — requires valid token
export const getMe = async (req, res, next) => {
  try {

    // req.user is set by authMiddleware after token verification
    const user = await User.findById(req.user.userId).select('-passwordHash');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });

  } catch (error) {
    next(error);
  }
};