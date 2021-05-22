import { Response, Request, NextFunction } from "express";
import { prisma } from "../server";
import { users } from "@prisma/client";
import { slugify, makeid } from "../utils/helpers";
import { User } from "./authController";
import { BadRequestError } from "../utils/errorHandler/BadRequestError";
import { Api404Error } from "../utils/errorHandler/Api404Error";
import { InternalError } from "../utils/errorHandler/InternalError";

export default {
  createPost: async (req: Request, res: Response, next: NextFunction) => {
    const {
      title,
      body,
      sub,
    }: { title: string; body: string | null; sub: string } = req.body;
    const user: users = res.locals.user;

    if (title.trim() === "") {
      return next(
        new BadRequestError("Title must not be empty", {
          title: "Title must not be empty",
        })
      );
    }

    try {
      // TODO: find subname on db
      const subs = await prisma.subs.findUnique({ where: { name: sub } });
      if (!subs) {
        return next(new Api404Error("Subs not found"));
      }

      // generate slug and identifier
      const slug = slugify(title);
      const identifier = makeid(7);

      // insert post to db

      const post = await prisma.posts.create({
        data: {
          sub_uid: subs.sub_uid,
          title,
          body,
          user_uid: user.user_uid,
          sub_name: sub,
          slug,
          identifier,
        },
      });
      return res.status(200).json(post);
    } catch (err) {
      console.log(err);
      return next(new InternalError("Something went wrong"));
    }
  },

  getPosts: async (_: Request, res: Response, next: NextFunction) => {
    try {
      const posts = await prisma.posts.findMany({
        include: {
          users: {
            select: User,
          },
          subs: true,
          comments: true,
        },
      });
      if (!posts) {
        return next(new Api404Error("Post not found"));
      }
      return res.json(posts);
    } catch (err) {
      return next(new Api404Error("Page not found"));
    }
  },

  getPost: async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug }: any = req.params;

    try {
      const post = await prisma.posts.findFirst({
        where: { identifier, slug },
        include: { subs: true },
      });

      if (!post) {
        return next(new Api404Error("Post not found"));
      }
      return res.json(post);
    } catch (err) {
      return next(new Api404Error("Page not found"));
    }
  },
};
