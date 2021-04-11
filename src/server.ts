import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import trim from "./utils/trim";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trim);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1", authRoutes);

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
