import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

// 0/O aur 1/I jaise confusing characters hata diye, taaki code bolke dena easy ho
const makeCode = customAlphabet("23456789ABCDEFGHJKLMNPQRSTUVWXYZ", 8);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false }, // absent for Google-only accounts
    googleId: { type: String, unique: true, sparse: true },
    avatar: String,
    bio: { type: String, trim: true, maxlength: 160, default: "" },
    userCode: { type: String, unique: true, sparse: true, uppercase: true }, // public ID, friend search ke liye
    elo: { type: Number, default: 100, min: 100, max: 2000 },
    stats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
    },
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

// naye user ko automatically code mil jayega
userSchema.pre("validate", function () {
  if (!this.userCode) this.userCode = makeCode();
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