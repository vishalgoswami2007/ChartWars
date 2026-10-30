import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { User } from "../src/models/User.js";

const makeCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

await mongoose.connect(process.env.MONGODB_URI);

// 1) elo + stats
const r = await User.updateMany(
  { elo: { $exists: false } },
  { $set: { elo: 100, "stats.played": 0, "stats.won": 0, bio: "" } }
);
console.log("elo/stats set:", r.modifiedCount);

// 2) userCode
const users = await User.find({ userCode: { $exists: false } }).select("_id");
for (const u of users) {
  for (let i = 0; i < 5; i++) {
    try {
      await User.updateOne({ _id: u._id }, { $set: { userCode: makeCode() } });
      break;
    } catch (e) {
      if (e.code !== 11000) throw e; // collision hua to naya code try
    }
  }
}
console.log("userCode set:", users.length);

await mongoose.disconnect();