import mongoose from "mongoose";

const playerSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: String,     // snapshot, user delete ho jaye tab bhi history dikhe
    username: String,
    pnl: { type: Number, default: 0 },
    eloBefore: Number,
    eloAfter: Number,
    result: { type: String, enum: ["win", "loss", "draw"] },
  },
  { _id: false }
);

const matchSchema = new mongoose.Schema(
  {
    players: [playerSchema],
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    mode: { type: String, enum: ["online", "friend", "practice"], required: true },
    status: { type: String, enum: ["live", "finished"], default: "live" },
    startedAt: Date,
    endedAt: Date,
  },
  { timestamps: true }
);

matchSchema.index({ "players.user": 1, _id: -1 });

export const Match = mongoose.model("Match", matchSchema);