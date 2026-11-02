import mongoose from "mongoose";

const { ObjectId } = mongoose.Schema.Types;

const avatarImageSchema = new mongoose.Schema(
  {
    user: { type: ObjectId, ref: "User", required: true, unique: true },
    contentType: { type: String, enum: ["image/jpeg", "image/png", "image/webp"], required: true },
    data: { type: Buffer, required: true },
    version: Number, // har upload par badhta hai, taaki browser purani photo cache se na dikhaye
  },
  { timestamps: true }
);

export const AvatarImage = mongoose.model("AvatarImage", avatarImageSchema);