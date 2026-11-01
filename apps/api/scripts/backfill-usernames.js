import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { connectDB } from "../src/config/database.js";
import { User } from "../src/models/User.js";

const digits = customAlphabet("0123456789", 6);
await connectDB();

const users = await User.find({
  $or: [{ username: { $exists: false } }, { username: null }, { username: "" }],
}).select("email");

for (const u of users) {
  const base = (u.email.split("@")[0] || "").toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 12) || "trader";
  await User.updateOne({ _id: u._id }, { $set: { username: `${base}_${digits()}` } });
}

console.log(`updated ${users.length} users`);
await mongoose.disconnect();