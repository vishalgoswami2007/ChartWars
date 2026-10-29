import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 60 },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    passwordHash: { type: String, select: false }, // absent for Google-only accounts
    googleId: { type: String, unique: true, sparse: true },
    avatar: String,
    isEmailVerified: { type: Boolean, default: false },
    lastLoginAt: Date,
  },
  { timestamps: true }
);

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