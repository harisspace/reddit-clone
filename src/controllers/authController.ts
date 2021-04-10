import { Request, Response } from "express";
import { prisma } from "../server";

interface IRegister {
  username: string;
  first_name: string;
  last_name: string;
  password: string;
  email: string;
}

export default {
  register: async (req: Request, res: Response) => {
    const {
      username,
      first_name,
      last_name,
      email,
      password,
    }: IRegister = req.body;
    let data;
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
};
