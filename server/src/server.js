

import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import productRoutes from './routes/productRoutes.js';     // NEW
import customerRoutes from './routes/customerRoutes.js';   // NEW

const app = express();

app.use(cors());
app.use(helmet());
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────
app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);     // NEW
app.use('/api/customers', customerRoutes);   // NEW

// ── Central Error Handler ─────────────────────────────────────────────────
app.use(errorHandler);

// ── Start Server ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
