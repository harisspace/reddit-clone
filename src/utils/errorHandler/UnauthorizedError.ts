import { BaseError } from "./BaseError";
import { httpStatusCode } from "./httpStatusCode";

export class UnauthorizedError extends BaseError {
  constructor(
    public name: string,
    public statusCode = httpStatusCode.UNAUTHORIZED,
    public description: any = { global: "Unauthorized" },
    public isOperational = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}
