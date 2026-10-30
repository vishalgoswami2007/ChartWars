// validate(schema)            -> req.body
// validate(schema, "params")  -> req.params
// validate(schema, "query")   -> req.validatedQuery (req.query ko overwrite nahi karte, Express 5 me read-only hota hai)
export const validate = (schema, target = "body") => (req, _res, next) => {
  const parsed = schema.parse(req[target]); // ZodError error-handler format karega
  if (target === "query") req.validatedQuery = parsed;
  else req[target] = parsed;
  next();
};