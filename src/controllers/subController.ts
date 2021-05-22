import { Response, Request, NextFunction } from "express";
import validator from "validator";
import { prisma } from "../server";
import { users } from "@prisma/client";
import { ForbiddenError } from "../utils/errorHandler/ForbiddenError";
import { InternalError } from "../utils/errorHandler/InternalError";
import { BadRequestError } from "../utils/errorHandler/BadRequestError";

interface ISubErrors {
  title?: string;
  description?: string;
  name?: string;
}

export default {
  createSub: async (req: Request, res: Response, next: NextFunction) => {
    const errors: ISubErrors = {};
    const user: users = res.locals.user;
    const {
      title,
      description,
      name,
    }: { title: string; description: string; name: string } = req.body;
    if (validator.isEmpty(title)) errors.title = "Title must not be empty";
    if (validator.isEmpty(name)) errors.name = "Name must not be empty";

    if (Object.keys(errors).length > 0) {
      return next(new BadRequestError("User input error", { errors }));
    }

    try {
      const findSub = await prisma.subs.findFirst({ where: { name } });

      if (findSub) {
        return next(
          new ForbiddenError("Sub already exist", {
            sub: "Cannot create sub, sub already exist",
          })
        );
      }

      const sub = await prisma.subs.create({
        data: { title, description, name, user_uid: user.user_uid },
      });
      return res.json(sub);
    } catch (err) {
      console.log(err);
      return next(new InternalError("Something went wrong"));
    }
  },
};
