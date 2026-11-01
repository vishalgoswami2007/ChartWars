import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const friendshipSchema = new mongoose.Schema(
  {
    requester: { type: ObjectId, ref: "User", required: true },
    recipient: { type: ObjectId, ref: "User", required: true },
    status: { type: String, enum: ["pending", "accepted"], default: "pending" },
    pairKey: { type: String, required: true, unique: true }, // dono users ke liye ek hi document
  },
  { timestamps: true }
);

friendshipSchema.index({ requester: 1, status: 1 });
friendshipSchema.index({ recipient: 1, status: 1 });

export const pairKeyOf = (a, b) => [String(a), String(b)].sort().join(":");
export const Friendship = mongoose.model("Friendship", friendshipSchema);