class AppError {
  public readonly message: string;

  public readonly statusCode: number; // status code is the HTTP error number

  // this will make error 400 as the default code
  constructor(message: string, statusCode = 400) {
    this.message = message;
    this.statusCode = statusCode;
  }
}

export default AppError;
