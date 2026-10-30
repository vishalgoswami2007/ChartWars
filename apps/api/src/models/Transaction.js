import mongoose from "mongoose";

const txSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String, required: true,
      enum: ["signup_bonus", "match_win", "match_loss", "trade", "reset", "adjust"],
    },
    amount: { type: Number, required: true }, // + ya - (signed)
    balanceAfter: { type: Number, required: true },
    ref: mongoose.Schema.Types.ObjectId, // matchId etc.
    note: { type: String, maxlength: 200 },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

txSchema.index({ user: 1, _id: -1 });

export const Transaction = mongoose.model("Transaction", txSchema);