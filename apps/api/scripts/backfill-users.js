import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { User } from "../src/models/User.js";

const makeCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);
const makeDigits = customAlphabet("0123456789", 6);

await mongoose.connect(process.env.MONGODB_URI);

const r = await User.updateMany(
  { elo: { $exists: false } },
  { $set: { elo: 100, "stats.played": 0, "stats.won": 0, bio: "" } }
);
console.log("elo/stats set:", r.modifiedCount);

const b = await User.updateMany({ balance: { $exists: false } }, { $set: { balance: 10000 } });
console.log("balance set:", b.modifiedCount);

async function fill(field, make) {
  const users = await User.find({ [field]: { $exists: false } }).select("email");
  for (const u of users) {
    for (let i = 0; i < 5; i++) {
      try {
        await User.updateOne({ _id: u._id }, { $set: { [field]: make(u) } });
        break;
      } catch (e) {
        if (e.code !== 11000) throw e;
      }
    }
  }
  console.log(`${field} set:`, users.length);
}

await fill("userCode", () => makeCode());
await fill("username", (u) => {
  const base = u.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 12) || "trader";
  return `${base}_${makeDigits()}`;
});

await mongoose.disconnect();