import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true, lowercase: true },
  purpose: { type: String, required: true },
  codeHash: { type: String, required: true },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  expiresAt: { type: Date, required: true },
});

otpSchema.index({ email: 1, purpose: 1 }, { unique: true });
otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Mongo auto-deletes expired OTPs

export const Otp = mongoose.model("Otp", otpSchema);