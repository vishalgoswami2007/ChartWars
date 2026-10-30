import mongoose from "mongoose";
import { env } from "../src/config/env.js";

// Script ke liye DB connect karo, kaam karo, band karo
export async function withDb(fn) {
  await mongoose.connect(env.MONGO_URI);
  try {
    await fn();
  } finally {
    await mongoose.disconnect();
  }
}