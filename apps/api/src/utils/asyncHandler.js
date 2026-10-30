// async controller me try/catch likhne ki zaroorat nahi
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);