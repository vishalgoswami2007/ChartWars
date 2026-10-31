const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema.Types;

const playerSchema = new mongoose.Schema({
  user: { type: ObjectId, ref: "User" },
  ready: { type: Boolean, default: false },
  finalValue: Number,
  eloChange: Number,
}, { _id: false });

const roomSchema = new mongoose.Schema({
  code: { type: String, unique: true, index: true },
  mode: { type: String, enum: ["friends", "online"], required: true },
  host: { type: ObjectId, ref: "User" },
  players: [playerSchema],
  pending: [{ type: ObjectId, ref: "User" }],   // host approval ka wait
  maxPlayers: { type: Number, default: 2 },
  durationSec: { type: Number, enum: [60, 300, 600, 900], default: 300 },
  status: { type: String, enum: ["waiting", "live", "finished"], default: "waiting" },
  winner: { type: ObjectId, ref: "User" },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);