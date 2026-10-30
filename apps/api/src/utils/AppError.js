export class AppError extends Error {
  constructor(message, statusCode = 500, code = "INTERNAL_ERROR") {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(msg = "Bad request", code = "BAD_REQUEST") {
    return new AppError(msg, 400, code);
  }
  static unauthorized(msg = "Unauthorized", code = "UNAUTHORIZED") {
    return new AppError(msg, 401, code);
  }
  static forbidden(msg = "Forbidden", code = "FORBIDDEN") {
    return new AppError(msg, 403, code);
  }
  static notFound(msg = "Not found", code = "NOT_FOUND") {
    return new AppError(msg, 404, code);
  }
  static conflict(msg = "Conflict", code = "CONFLICT") {
    return new AppError(msg, 409, code);
  }
}