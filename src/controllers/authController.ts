import { NextFunction, Request, Response } from "express";
import { prisma } from "../server";
import {
  registerValidation,
  loginValidation,
} from "../utils/authentication/authValidator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookie from "cookie";
import { users } from "@prisma/client";
import { BadRequestError } from "../utils/errorHandler/BadRequestError";
import { InternalError } from "../utils/errorHandler/InternalError";
import { Api404Error } from "../utils/errorHandler/Api404Error";
import { Email } from "../utils/email/SendEmail";
import { ForbiddenError } from "../utils/errorHandler/ForbiddenError";
import queryString from "querystring";
import { user_role } from "../utils/enum";

export const User = {
  id: true,
  user_uid: true,
  username: true,
  first_name: true,
  last_name: true,
  email: true,
  created_at: true,
  updated_at: true,
};

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

const generateToken = (user: Partial<users>): string => {
  return jwt.sign(
    { username: user.username, email: user.email },
    process.env.JWT_SECRET!,
    { expiresIn: "1d" }
  );
};

// controller auth

export default {
  register: async (req: Request, res: Response, next: NextFunction) => {
    let { username, first_name, last_name, email, password }: IRegister =
      req.body;

    const { errors, valid } = registerValidation(
      username,
      first_name,
      last_name,
      email,
      password
    );

    if (!valid) {
      return next(new BadRequestError("Bad request input", { errors }));
    }

    try {
      const user = await prisma.users.findFirst({
        where: { OR: [{ username }, { email }] },
      });

      if (user) {
        return next(
          new BadRequestError("Username or email is taken", {
            username: "Username or email is taken",
            email: "Username or email is taken",
          })
        );
      }
    } catch (err) {
      return next(new InternalError("Something went wrong"));
    }

    const token = generateToken({ username, email });

    // send email
    const email1 = new Email(email, token);
    const resultEmail = await email1.sendEmail();
    console.log(resultEmail);

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
          role: user_role.USER,
        },
        select: User,
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({
        errors: "Something went wrong",
      });
    }

    res.json({
      user: { ...data },
      message: "We will send you email message to confirm you're account",
    });
  },

  login: async (req: Request, res: Response, next: NextFunction) => {
    const { username, password }: ILogin = req.body;

    const { errors, valid } = loginValidation(username, password);

    if (!valid) {
      return next(new BadRequestError("Bad user input", { errors }));
    }

    let user;
    let token: string;
    try {
      user = await prisma.users.findUnique({ where: { username } });
      if (!user) {
        return next(new Api404Error("User not found"));
      }

      // generate token
      token = generateToken(user);

      const { email } = user;
      const query_string = queryString.stringify({ email, token });

      if (user && !user.confirmed) {
        return res.json({
          message: "User need confirmation email",
          options: {
            sendEmail: {
              message:
                "Not receive email?, pleases click this link to send back",
              redirect: `/api/v1/auth/confirmation/sendEmail?${query_string}`,
            },
          },
        });
      }

      const { password: passwordDB, ...newUser } = user;

      const passwordMatches = await bcrypt.compare(password, user.password);
      if (!passwordMatches) {
        return next(
          new BadRequestError("Incorrect password", {
            password: "Incorrect password",
          })
        );
      }

      // set to cookie
      res.set(
        "Set-Cookie",
        cookie.serialize("token", token, cookieOptions("login"))
      );

      return res.json(newUser);
    } catch (err) {
      console.log(err);
      return next(new InternalError("Something went wrong"));
    }
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

  confirmation: async (req: Request, res: Response, next: NextFunction) => {
    const token = req.params.token;

    interface jwtResult {
      username: string;
      email: string;
    }

    const result = jwt.verify(token, process.env.JWT_SECRET!);

    if (!result) {
      return next(new ForbiddenError("Invalid token"));
    }

    try {
      await prisma.users.update({
        where: {
          email: (result as Partial<jwtResult>).email,
        },
        data: { confirmed: true },
      });
    } catch (err) {
      console.log(err);
      return next(new Api404Error("User not updated"));
    }

    res.set(
      "Set-Cookie",
      cookie.serialize("token", token, cookieOptions("login"))
    );

    res.json({ success: true, redirect: "/api/v1/post" });
  },

  // resend token to email
  resendEmail: async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query;
    const token = query.token as string;
    const email = query.email as string;

    jwt.verify(token, process.env.JWT_SECRET!, (err, decodedToken) => {
      if (err) {
        console.log(err);
        return next(new ForbiddenError("Invalid token query string"));
      }
    });

    if (query.email && query.token) {
      try {
        const user = await prisma.users.findUnique({ where: { email } });

        if (!user) {
          return next(new ForbiddenError("Invalid email query string"));
        }

        const sendEmail = new Email(email, token);
        const resEmail = await sendEmail.sendEmail();
        console.log(resEmail);
      } catch (err) {
        return next(new InternalError("Something went wrong"));
      }
    } else {
      return next(new BadRequestError("Query string not valid"));
    }

    return res.json({ success: true });
  },
};
