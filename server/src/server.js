import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";

import connectDB from "./config/db.js";
import errorHandler from "./middlewares/errorHandler.js";
import healthRoutes from "./routes/healthRoutes.js";

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api/health", healthRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 500;

connectDB();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
