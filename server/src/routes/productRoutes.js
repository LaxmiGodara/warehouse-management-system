// productRoutes.js
// All product routes are Admin only
// authMiddleware verifies token
// allowRoles('ADMIN') blocks Staff from accessing these routes

import express from "express";
import {
  getAllProducts,
  getActiveProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/rbacMiddleware.js";

const router = express.Router();

// Apply auth and Admin role check to ALL routes in this file
router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

// GET /api/products/active  ← must be defined BEFORE /:id
// If we put this after /:id, Express will treat "active" as an ID
router.get("/active", getActiveProducts);

// GET /api/products
router.get("/", getAllProducts);

// GET /api/products/:id
router.get("/:id", getProductById);

// POST /api/products
router.post("/", createProduct);

// PUT /api/products/:id
router.put("/:id", updateProduct);

// DELETE /api/products/:id
router.delete("/:id", deleteProduct);

export default router;
