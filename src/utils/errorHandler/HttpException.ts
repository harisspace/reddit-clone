export class HttpException extends Error {
  public status: number;
  public message: string;
  public errors: Object;
  constructor(status: number, message: string, errors: Object) {
    super(message);
    this.status = status;
    this.message = message;
    this.errors = errors;
  }
}
