// productsController.js
// Handles all product operations
// All routes are Admin only — enforced at route level

import Product from "../models/Product.js";

// ── Get All Products ───────────────────────────────────────────────────────
// Supports optional search by product name using query parameter
// Example: GET /api/products?search=rice
export const getAllProducts = async (req, res, next) => {
  try {
    // Start with base filter — exclude deleted products
    const filter = { isDeleted: false };

    // If search query is provided, filter by product name
    // $regex allows partial matching — "ric" matches "Rice", "Brown Rice"
    // $options: 'i' makes it case insensitive
    if (req.query.search) {
      filter.productName = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });
    // sort by newest first

    res.status(200).json({
      success: true,
      count: products.length,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Active Products for Dropdown ──────────────────────────────────────
// Used by Orders module to populate product dropdown
// Returns only fields needed for dropdown — keeps response light
export const getActiveProducts = async (req, res, next) => {
  try {
    const products = await Product.find(
      { isActive: true, isDeleted: false },
      // Second argument = projection — only return these fields
      { productName: 1, unit: 1, defaultRate: 1 },
    ).sort({ productName: 1 });
    // sort alphabetically by name

    res.status(200).json({
      success: true,
      products,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get Single Product by ID ───────────────────────────────────────────────
export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ── Create Product ─────────────────────────────────────────────────────────
export const createProduct = async (req, res, next) => {
  try {
    const { productName, unit, defaultRate, isActive } = req.body;

    // Validate required fields
    if (!productName || !unit || defaultRate === undefined) {
      return res.status(400).json({
        success: false,
        message: "Product name, unit and default rate are required",
      });
    }

    // Validate rate is not negative
    if (defaultRate < 0) {
      return res.status(400).json({
        success: false,
        message: "Default rate cannot be negative",
      });
    }

    // Check for duplicate product name
    const existing = await Product.findOne({
      productName: { $regex: `^${productName}$`, $options: "i" },
      isDeleted: false,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "A product with this name already exists",
      });
    }

    const product = await Product.create({
      productName,
      unit,
      defaultRate,
      isActive: isActive !== undefined ? isActive : true,
      totalQty: 0, // stock starts at 0 — Admin sets it via Stock module
    });

    res.status(201).json({
      success: true,
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ── Update Product ─────────────────────────────────────────────────────────
export const updateProduct = async (req, res, next) => {
  try {
    const { productName, unit, defaultRate, isActive } = req.body;

    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Validate rate if provided
    if (defaultRate !== undefined && defaultRate < 0) {
      return res.status(400).json({
        success: false,
        message: "Default rate cannot be negative",
      });
    }

    // Update only the fields that are provided
    if (productName) product.productName = productName;
    if (unit) product.unit = unit;
    if (defaultRate !== undefined) product.defaultRate = defaultRate;
    if (isActive !== undefined) product.isActive = isActive;

    await product.save();

    res.status(200).json({
      success: true,
      message: "Product updated successfully",
      product,
    });
  } catch (error) {
    next(error);
  }
};

// ── Soft Delete Product ────────────────────────────────────────────────────
// We never hard delete products
// Old orders reference products — deleting would break historical records
export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findOne({
      _id: req.params.id,
      isDeleted: false,
    });

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    // Soft delete — mark as deleted and inactive
    product.isDeleted = true;
    product.isActive = false;
    await product.save();

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
