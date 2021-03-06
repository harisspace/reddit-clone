import express from "express";
import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import morgan from "morgan";
import authRoutes from "./routes/authRoutes";
import cors from "cors";
import trim from "./utils/trim";
import cookieParser from "cookie-parser";
import postRoutes from "./routes/postRoutes";
import subRoutes from "./routes/subRoutes";
import commentRoutes from "./routes/commentRoutes";
import {
  isOperationalError,
  logError,
  logErrorMiddleware,
  returnError,
} from "./utils/errorHandler/logger";

dotenv.config();

export const prisma = new PrismaClient();
export const app = express();

// middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(trim);
app.use(cookieParser());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/posts", postRoutes);
app.use("/api/v1/subs", subRoutes);
app.use("/api/v1/posts/:identifier/:slug/comments", commentRoutes);

// handle error
app.use(logErrorMiddleware);
app.use(returnError);

process.on("unhandledRejection", (error) => {
  console.log(error);
  throw error;
});

process.on("uncaughtException", (error) => {
  logError(error);
  if (!isOperationalError(error)) {
    process.exit(1);
  }
});

app.listen(process.env.PORT, () => {
  console.log(`running on port ${process.env.PORT}`);
});
