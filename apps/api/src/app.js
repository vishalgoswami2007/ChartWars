
import express from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import { env } from "./config/env.js";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";

const app = express();

app.disable("x-powered-by");

app.use(helmet());

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || origin === env.WEB_ORIGIN) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
    credentials: true,
  }),
);

app.use(cookieParser());

app.use(express.json({ limit: "20kb" }));

app.use(
  pinoHttp({
    level: env.LOG_LEVEL,
    quietReqLogger: true,
    autoLogging: env.NODE_ENV !== "test",
  }),
);

app.use("/api/v1/auth", authRoutes);

app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "ChartWars API is running",
    data: {
      status: "ok",
      timestamp: new Date().toISOString(),
    },
  });
});

app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: "ROUTE_NOT_FOUND",
      message: "The requested API route was not found.",
    },
  });
});


app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }

  // Invalid JSON sent in the request body
  if (error instanceof SyntaxError && error.status === 400 && "body" in error) {
    return res.status(400).json({
      success: false,
      error: {
        code: "INVALID_JSON",
        message: "The request body contains invalid JSON.",
      },
    });
  }

  const statusCode =
    Number.isInteger(error.statusCode) &&
    error.statusCode >= 400 &&
    error.statusCode <= 599
      ? error.statusCode
      : Number.isInteger(error.status) &&
          error.status >= 400 &&
          error.status <= 599
        ? error.status
        : 500;

  const isServerError = statusCode >= 500;

  return res.status(statusCode).json({
    success: false,
    error: {
      code: isServerError
        ? "INTERNAL_SERVER_ERROR"
        : error.code || "REQUEST_ERROR",
      message: isServerError
        ? "An unexpected error occurred."
        : error.message || "The request could not be completed.",
    },
  });
});


export default app;
