import { Response, Request } from "express";
import validator from "validator";
import { prisma } from "../server";
import { AppError } from "../utils/catchError";
import { users } from "@prisma/client";

interface ISubErrors {
  title?: string;
  description?: string;
  name?: string;
}

export default {
  createSub: async (req: Request, res: Response) => {
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
      return new AppError(req, res, 403, "User input error", errors);
    }

    try {
      const findSub = await prisma.subs.findFirst({ where: { name } });

      if (findSub) {
        return new AppError(req, res, 400, "Sub already exist", {
          error: "Cannot create sub, sub already exist",
        });
      }

      const sub = await prisma.subs.create({
        data: { title, description, name, user_uid: user.user_uid },
      });
      return res.json(sub);
    } catch (err) {
      console.log(err);
      return new AppError(req, res, 500, "Something went wrong", {
        error: "Cannot create sub",
      });
    }
  },
};
