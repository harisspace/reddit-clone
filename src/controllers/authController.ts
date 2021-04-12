import { Request, Response } from "express";
import { prisma } from "../server";
import { registerValidation, loginValidation } from "../utils/authValidator";
import { AppError } from "../utils/catchError";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { users } from "@prisma/client";

interface IRegister {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
}

interface ILogin {
  username: string;
  password: string;
}

const cookieOptions = (route: string) => {
  const options: any = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  };
  if (route === "logout") {
    options.expires = new Date(0);
  } else if (route === "login") {
    options.maxAge = 3600;
  }
  return options;
};

const generateToken = (user: users): string => {
  return jwt.sign(user.username, process.env.JWT_SECRET!);
};

export default {
  register: async (req: Request, res: Response) => {
    let {
      username,
      first_name,
      last_name,
      email,
      password,
    }: IRegister = req.body;

    const { errors, valid } = registerValidation(
      username,
      first_name,
      last_name,
      email,
      password
    );

    if (!valid) {
      return new AppError(req, res, 401, "User Input Error", errors);
    }

    try {
      const user = await prisma.users.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (user) {
        return new AppError(req, res, 401, "User Input Error", {
          error: "Username or Email is taken",
        });
      }
    } catch (err) {
      return new AppError(req, res, 500, "Something went wrong", {
        error: "Cannot get user",
      });
    }

    let data;
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);

    try {
      data = await prisma.users.create({
        data: {
          username,
          first_name,
          last_name,
          password,
          email,
        },
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: "Something went wrong",
      });
    }

    res.json(data);
  },

  login: async (req: Request, res: Response) => {
    const { username, password }: ILogin = req.body;

    const { errors, valid } = loginValidation(username, password);

    if (!valid) {
      return new AppError(req, res, 401, "User Input Error", errors);
    }

    let user;
    let token: string;
    try {
      user = await prisma.users.findUnique({ where: { username } });
      if (!user) {
        return new AppError(req, res, 404, "User not registered", {
          error: "User not registered",
        });
      }

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return new AppError(req, res, 401, "User input error", {
          error: "Incorrect password",
        });
      }

      token = generateToken(user);
    } catch (err) {
      return new AppError(req, res, 500, "Something went wrong", {
        error: "Something went wrong",
      });
    }

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, cookieOptions("login"))
    );

    res.json(user);
  },

  me: async (_: Request, res: Response) => {
    return res.json(res.locals.user);
  },

  logout: async (_: Request, res: Response) => {
    res.set(
      "Set-Cookie",
      cookie.serialize("token", "", cookieOptions("logout"))
    );

    return res.status(200).json({ success: true });
  },
};
