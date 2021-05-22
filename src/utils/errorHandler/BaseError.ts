export class BaseError extends Error {
  public name: string;
  public statusCode: number;
  public isOperational: boolean;
  constructor(
    name: string,
    description: any,
    statusCode: number,
    isOperational: boolean
  ) {
    super(description);

    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    Error.captureStackTrace(this);
  }
}
