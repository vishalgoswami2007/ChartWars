export const validate = (schema) => (req, _res, next) => {
  req.body = schema.parse(req.body); // ZodError is formatted in error-handler
  next();
};