import { ZodError } from "zod";
import { ApiError } from "../utils/ApiError.js";

export const notFound = (_req, res) => res.status(404).json({ message: "Route not found" });

export function errorHandler(err, _req, res, _next) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      message: err.issues[0]?.message || "Validation failed",
      errors: err.issues.map((i) => ({ field: i.path.join("."), message: i.message })),
    });
  }
  if (err instanceof ApiError) {
    return res.status(err.status).json({ message: err.message, code: err.code });
  }
  if (err?.code === 11000) {
    return res.status(409).json({ message: "Already exists" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
}