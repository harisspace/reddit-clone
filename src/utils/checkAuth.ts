import { NextFunction, Request, Response } from "express";
import { users } from "@prisma/client";
import jwt from "jsonwebtoken";
import { prisma } from "../server";
import { AppError } from "../utils/catchError";

export const checkAuth = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let user: users | null;
  try {
    const token: string | undefined | null = req.cookies.token;
    if (!token) throw new Error("Unauthenticated");

    const username: any = jwt.verify(token, process.env.JWT_SECRET!);

    user = await prisma.users.findUnique({ where: { username } });
    if (!user) throw new Error("Unauthenticated");

    res.locals.user = user;
    return next();
  } catch (err) {
    console.log(err);
    return new AppError(req, res, 401, err.message, { error: err.message });
  }
};
