class AppError extends Error {
  statusCode: number;
  error: any;
  isOperational: boolean;

  constructor(msg: any, statusCode: number) {
    super(msg);

    this.statusCode = statusCode;
    this.error = `${statusCode}`.startsWith("4") ? "fail" : "error";
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;
