import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

// middleware
app.use(express.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));

// routes
app.use("/api/v1", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
