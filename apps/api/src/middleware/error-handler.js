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
  // Galat ObjectId, jaise GET /users/abc ya /rooms/123
  if (err?.name === "CastError") {
    return res.status(400).json({ message: "Invalid id" });
  }
  // express.json() ko kharab JSON mila
  if (err?.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON body" });
  }
  if (err?.code === 11000) {
    console.error("DUPLICATE KEY:", err.keyPattern, err.keyValue, err.message);
    return res.status(409).json({ message: "Already exists" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong" });
}