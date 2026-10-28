
import "dotenv/config";
import { env } from "./config/env.js";
import app from "./app.js";
import { createServer } from "./utils/create-server.js";
import { connectDatabase, disconnectDatabase } from "./config/database.js";

async function start() {
  try {
    await connectDatabase();

    const { shutdown } = createServer(app, {
      host: env.HOST,
      port: env.PORT,
    });

    async function handleShutdown(signal) {
      shutdown(signal);

      try {
        await disconnectDatabase();
      } catch (error) {
        console.error("Database shutdown failed:", error);
        process.exitCode = 1;
      }
    }

    process.once("SIGINT", () => void handleShutdown("SIGINT"));
    process.once("SIGTERM", () => void handleShutdown("SIGTERM"));
  } catch (error) {
    console.error("ChartWars API startup failed:", error.message);
    process.exitCode = 1;
  }
}

void start();
