class AppError extends Error {
  statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;

    // 👇 important for proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
