import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookieParser from "cookie-parser";
import { env, isProd } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import { notFound, errorHandler } from "./middleware/error-handler.js";
import mongoose from "mongoose"; 
import  userRoutes from "./routes/user.routes.js";

const app = express();

if (isProd) app.set("trust proxy", 1); // correct client IP behind a proxy (for rate limiting)

app.use(helmet());
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: "10kb" }));
app.use(cookieParser());

app.get("/api/v1/health", (_req, res) =>
  res.json({ ok: true, db: mongoose.connection.readyState === 1 })
);
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;