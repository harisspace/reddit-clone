import { BaseError } from "./BaseError";
import { httpStatusCode } from "./httpStatusCode";

export class Api404Error extends BaseError {
  constructor(
    public name: string,
    public description: any = { global: "Not Found" },
    public statusCode = httpStatusCode.NOT_FOUND,
    public isOperational = true
  ) {
    super(name, description, statusCode, isOperational);
  }
}
