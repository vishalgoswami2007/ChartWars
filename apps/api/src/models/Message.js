import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const messageSchema = new mongoose.Schema(
  {
    pairKey: { type: String, required: true },
    from: { type: ObjectId, ref: "User", required: true },
    to: { type: ObjectId, ref: "User", required: true },
    text: { type: String, required: true, trim: true, maxlength: 1000 },
    readAt: Date,
  },
  { timestamps: true }
);

messageSchema.index({ pairKey: 1, createdAt: -1 });

export const Message = mongoose.model("Message", messageSchema);