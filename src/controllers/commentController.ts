import { NextFunction, Request, Response } from "express";
import validator from "validator";
import { prisma } from "../server";
import { users } from "@prisma/client";
import { makeid } from "../utils/helpers";
import { BadRequestError } from "../utils/errorHandler/BadRequestError";
import { Api404Error } from "../utils/errorHandler/Api404Error";

export default {
  commentOnPost: async (req: Request, res: Response, next: NextFunction) => {
    const { identifier, slug }: any = req.params;
    const body: string = req.body.body;
    const user: users = res.locals.user;

    if (validator.isEmpty(body))
      return next(
        new BadRequestError("Bad user input", {
          body: "Body must not empty",
        })
      );

    try {
      const post = await prisma.posts.findFirst({
        where: { identifier, slug },
      });

      if (!post) {
        return next(new Api404Error("Post not exist"));
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
      return next(new Api404Error("Post not exist"));
    }
  },
};
