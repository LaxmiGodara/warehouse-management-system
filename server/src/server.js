

import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';

import connectDB from './config/db.js';
import errorHandler from './middlewares/errorHandler.js';

import healthRoutes from './routes/healthRoutes.js';
import authRoutes from './routes/authRoutes.js';       
import userRoutes from './routes/userRoutes.js';       

const app = express();


app.use(cors());
app.use(helmet());


app.use(express.json());


app.use('/api/health', healthRoutes);
app.use('/api/auth', authRoutes);     // Login + getMe
app.use('/api/users', userRoutes);    // User management (Admin only)


app.use(errorHandler);


const PORT = process.env.PORT || 5000;

connectDB();

app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});