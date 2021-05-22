import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../server";
import { User } from "../controllers/authController";
import { UnauthorizedError } from "./errorHandler/UnauthorizedError";
import { Api404Error } from "./errorHandler/Api404Error";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user: object | null;
  try {
    const token: string | undefined | null = req.cookies.token;
    if (!token) return next(new UnauthorizedError("Unauthenticated"));

    const username: any = jwt.verify(token, process.env.JWT_SECRET!);

    user = await prisma.users.findUnique({ where: { username }, select: User });
    if (!user) throw new Error("Unauthenticated");

    res.locals.user = user;
    return next();
  } catch (err) {
    return next(new Api404Error("User not found", { error: err.message }));
  }
};
