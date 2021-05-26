import { Response, Request, NextFunction } from "express";
import validator from "validator";
import { prisma } from "../server";
import { users } from "@prisma/client";
import { ForbiddenError } from "../utils/errorHandler/ForbiddenError";
import { InternalError } from "../utils/errorHandler/InternalError";
import { BadRequestError } from "../utils/errorHandler/BadRequestError";
import { Api404Error } from "../utils/errorHandler/Api404Error";
import { user_role, messages } from "../utils/enum";

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
      return next(new BadRequestError("User input error", { ...errors }));
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

      // create sub
      const sub = await prisma.subs.create({
        data: { title, description, name, user_uid: user.user_uid },
      });

      // save user to community
      await prisma.community.create({
        data: {
          user_uid: user.user_uid,
          sub_uid: sub.sub_uid,
          role: user_role.SUPER_ADMIN,
        },
      });
      return res.json(sub);
    } catch (err) {
      return next(new InternalError("Something went wrong", err));
    }
  },

  getSub: async (req: Request, res: Response, next: NextFunction) => {
    const name = req.params.name;
    const user = res.locals.user;

    let posts;
    // find is user member of community
    try {
      // get sub_uid
      const sub_uid = await prisma.subs.findUnique({
        where: { name },
        select: { sub_uid: true },
      });
      if (!sub_uid) {
        return next(new Api404Error("Sub name not found"));
      }
      // find community
      const community = await prisma.community.findFirst({
        where: {
          AND: [
            { user_uid: user.user_uid },
            { ...(<object>(<unknown>sub_uid)) },
          ],
        },
      });

      if (!community) {
        return next(new ForbiddenError("User not allowed"));
      }

      // if yes get the sub and all post
      posts = await prisma.posts.findMany({
        where: { ...(<object>(<unknown>sub_uid)) },
      });

      if (!posts || posts.length < 1) {
        return next(new Api404Error("This sub hasn't post yet"));
      }
    } catch (err) {
      return next(new InternalError("Something went wrong", err));
    }

    return res.json(posts);
  },

  joinSub: async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.params;
    const user = res.locals.user;

    // insert to community tables
    try {
      // find sub if exist
      const { sub_uid, user_uid }: any = await prisma.subs.findUnique({
        where: { name },
        select: { sub_uid: true, user_uid: true },
      });
      // if sub not exist
      if (!sub_uid) {
        return next(new Api404Error("Sub not found"));
      }

      // send request to admin
      const message = await prisma.notifications.create({
        data: {
          message: `${user.first_name}${messages.JOIN_SUB}${name}`,
          from_uid: user.user_uid,
          to_uid: user_uid,
        },
      });

      if (!message) {
        return next(
          new InternalError("Something went wrong, cannot send notification")
        );
      }
    } catch (err) {
      return next(new InternalError("Something went wrong", err));
    }
    return res.json({ success: true, messages: "Request send to admin" });
  },
};

// utilities

export const ownSub = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name } = req.params;
  const user = res.locals.user;

  try {
    // find subs where user_id = user.user_id and name = name it means you are admin
    const sub = await prisma.subs.findFirst({
      where: { AND: [{ name, user_uid: user.user_uid }] },
    });
    if (!sub) {
      return next(new ForbiddenError("You're not allowed"));
    }
  } catch (error) {
    return next(new InternalError("Something went wrong"));
  }
  // you're admin
  next();
};

export const uploadSubImage = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.body, req.file, req.files, res.type);
  res.json({ message: "image send" });
};
