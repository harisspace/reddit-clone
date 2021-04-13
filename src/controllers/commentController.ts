import { Request, Response } from "express";
import validator from "validator";
import { prisma } from "../server";
import { AppError } from "../utils/catchError";
import { users } from "@prisma/client";
import { makeid } from "../utils/helpers";

export default {
  commentOnPost: async (req: Request, res: Response) => {
    const { identifier, slug }: any = req.params;
    const body: string = req.body.body;
    const user: users = res.locals.user;

    if (validator.isEmpty(body))
      return new AppError(req, res, 403, "User input error", {
        error: "Body must not empty",
      });

    try {
      const post = await prisma.posts.findFirst({
        where: { identifier, slug },
      });

      if (!post) {
        throw new Error("Post is not exist");
      }

      const commentIdentifier = makeid(6);

      const comment = await prisma.comments.create({
        data: {
          user_uid: user.user_uid,
          body,
          username: user.username,
          identifier: commentIdentifier,
          post_uid: post.post_uid,
        },
      });

      return res.json(comment);
    } catch (err) {
      return new AppError(req, res, 404, "Page not found", { error: err });
    }
  },
};
