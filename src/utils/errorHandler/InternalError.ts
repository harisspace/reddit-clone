import { BaseError } from "./BaseError";
import { httpStatusCode } from "./httpStatusCode";

export class InternalError extends BaseError {
  constructor(
    public name: string,
    public statusCode = httpStatusCode.INTERNAL_SERVER,
    public description: any = { global: "Something Went Wrong" },
    public isOperational = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}
