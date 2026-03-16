// customerRoutes.js
// All customer routes are Admin only

import express from "express";
import {
  getAllCustomers,
  getActiveCustomers,
  getCustomerById,
  createCustomer,
  updateCustomer,
  deleteCustomer,
} from "../controllers/customersController.js";
import authMiddleware from "../middlewares/authMiddleware.js";
import allowRoles from "../middlewares/rbacMiddleware.js";

const router = express.Router();

// Apply auth and Admin role check to ALL routes
router.use(authMiddleware);
router.use(allowRoles("ADMIN"));

// GET /api/customers/active  ← must be defined BEFORE /:id
router.get("/active", getActiveCustomers);

// GET /api/customers
router.get("/", getAllCustomers);

// GET /api/customers/:id
router.get("/:id", getCustomerById);

// POST /api/customers
router.post("/", createCustomer);

// PUT /api/customers/:id
router.put("/:id", updateCustomer);

// DELETE /api/customers/:id
router.delete("/:id", deleteCustomer);

export default router;
