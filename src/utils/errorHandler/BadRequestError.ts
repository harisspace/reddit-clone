import { BaseError } from "./BaseError";
import { httpStatusCode } from "./httpStatusCode";

export class BadRequestError extends BaseError {
  constructor(
    public name: string,
    public description: any = { global: "Bad Request Input" },
    public statusCode = httpStatusCode.BAD_REQUEST,
    public isOperational = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}
