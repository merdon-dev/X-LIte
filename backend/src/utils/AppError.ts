class AppError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.status = status;

    // 👇 important for proper stack trace
    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
