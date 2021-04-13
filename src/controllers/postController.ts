import { Response, Request } from "express";
import { prisma } from "../server";
import { AppError } from "../utils/catchError";
import { users } from "@prisma/client";
import { slugify, makeid } from "../utils/helpers";
import { User } from "./authController";

export default {
  createPost: async (req: Request, res: Response) => {
    const {
      title,
      body,
      sub,
    }: { title: string; body: string | null; sub: string } = req.body;
    const user: users = res.locals.user;

    if (title.trim() === "") {
      return new AppError(req, res, 400, "Title must not be empty", {
        error: "Title must not be empty",
      });
    }

    try {
      // TODO: find subname on db
      const subs = await prisma.subs.findUnique({ where: { name: sub } });
      if (!subs) {
        return new AppError(req, res, 403, "User input error", {
          error: "Subname not exist",
        });
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
      return new AppError(req, res, 500, "Something went wrong", {
        error: "Cannot create post",
      });
    }
  },

  getPosts: async (req: Request, res: Response) => {
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
        throw new Error("There is no post");
      }
      return res.json(posts);
    } catch (err) {
      return new AppError(req, res, 404, "Page not found", {
        error: err.message,
      });
    }
  },

  getPost: async (req: Request, res: Response) => {
    const { identifier, slug }: any = req.params;

    try {
      const post = await prisma.posts.findFirst({
        where: { identifier, slug },
        include: { subs: true },
      });

      if (!post) {
        throw new Error("Post not found");
      }
      return res.json(post);
    } catch (err) {
      return new AppError(req, res, 404, "Page not found", {
        error: err.message,
      });
    }
  },
};
