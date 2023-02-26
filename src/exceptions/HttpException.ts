export class HttpException extends Error {
  public statusCode: number;
  public status: string;
  public message: string;

  constructor(statusCode: number, message: string) {
    super(message);
    this.status = 'error';
    this.statusCode = statusCode;
    this.message = message;
  }
}
