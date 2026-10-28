
import mongoose from "mongoose";
import { env } from "./env.js";

export async function connectDatabase() {
  const uri = env.MONGODB_URI;

  if (!uri) {
    throw new Error("MONGODB_URI is missing from the .env file.");
  }

  await mongoose.connect(uri, {
    serverSelectionTimeoutMS: 10000,
  });

  console.log("MongoDB connected successfully.");
}

export async function disconnectDatabase() {
  await mongoose.disconnect();
}
