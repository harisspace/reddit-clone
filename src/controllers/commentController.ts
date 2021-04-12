import { Request, Response } from "express";
import validator from "validator";
import { prisma } from "../server";
import { AppError } from "../utils/catchError";
import { users} from '@prisma/client'

export default {
  createComment: async (req: Request, res: Response) => {
    const { body }: { body: string } = req.body;
    const user:users = res.locals.user;

    if (validator.isEmpty(body))
      return new AppError(req, res, 403, "User input error", {
        error: "Body must not empty",
      });

      try {
        const comment = await prisma.comments.create({
          data: {
            username: user.username,
            body,
            user_uid: user.user_uid,
            post_uid: 

          }
        })
      }catch(err) {

      }
  },
};
