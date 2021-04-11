import { Request, Response } from "express";

export class AppError {
  constructor(
    private req: Request,
    private res: Response,
    private statusCode: number,
    private message: string,
    private errors: object
  ) {
    res.status(statusCode).json({
      message,
      errors,
    });
  }
}
