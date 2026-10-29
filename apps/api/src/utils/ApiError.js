export class ApiError extends Error {
  constructor(status, message, code) {
    super(message);
    this.status = status;
    this.code = code;
  }
  static badRequest(msg, code) { return new ApiError(400, msg, code); }
  static unauthorized(msg = "Not authenticated", code = "UNAUTHENTICATED") { return new ApiError(401, msg, code); }
  static forbidden(msg, code) { return new ApiError(403, msg, code); }
  static conflict(msg, code) { return new ApiError(409, msg, code); }
  static tooMany(msg, code = "RATE_LIMITED") { return new ApiError(429, msg, code); }
}