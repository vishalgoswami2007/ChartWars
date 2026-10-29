import mongoose from "mongoose";

const refreshSessionSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    tokenHash: { type: String, required: true, unique: true },
    family: { type: String, required: true, index: true }, // all rotations of one login share a family
    expiresAt: { type: Date, required: true },
    revokedAt: Date,
    ip: String,
    userAgent: String,
  },
  { timestamps: true }
);

refreshSessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RefreshSession = mongoose.model("RefreshSession", refreshSessionSchema);