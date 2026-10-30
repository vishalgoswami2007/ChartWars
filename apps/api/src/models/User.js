import mongoose from "mongoose";
import { customAlphabet } from "nanoid";
import { START_BALANCE } from "../constants/wallet.js";

const makeCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);
const makeDigits = customAlphabet("0123456789", 6);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false }, // absent for Google-only accounts
    googleId: { type: String, unique: true, sparse: true },
    username: {
      type: String, unique: true, sparse: true, lowercase: true, trim: true,
      minlength: 3, maxlength: 20, match: /^[a-z0-9_]+$/,
    },
    avatar: String,
    bio: { type: String, trim: true, maxlength: 160, default: "" },
    userCode: { type: String, unique: true, sparse: true, uppercase: true },
    elo: { type: Number, default: 100, min: 100, max: 2000 },
    balance: { type: Number, default: START_BALANCE, min: 0 },
    balanceResetAt: Date,
    stats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
    },
    preferences: {
      sound: { type: Boolean, default: true },
      emailNotifications: { type: Boolean, default: true },
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

userSchema.pre("validate", function () {
  if (!this.userCode) this.userCode = makeCode();
  if (this.isNew && !this.username) {
    const base = this.email.split("@")[0].toLowerCase().replace(/[^a-z0-9_]/g, "").slice(0, 12) || "trader";
    this.username = `${base}_${makeDigits()}`; // max 19 chars
  }
});

userSchema.set("toJSON", {
  transform: (_doc, ret) => {
    ret.id = ret._id;
    delete ret._id;
    delete ret.__v;
    delete ret.passwordHash;
    delete ret.googleId;
    return ret;
  },
});

export const User = mongoose.model("User", userSchema);