import Room from "../models/Room.js";

const label = (u) => u && { ...u, username: u.username || u.name || "Player" };

// withPending=true sirf host ko jaata hai
export async function roomState(code, withPending = false) {
  const q = Room.findOne({ code }).populate("players.user", "username name elo");
  if (withPending) q.populate("pending", "username name elo");
  const room = await q;
  if (!room) return null;

  const state = room.toObject();
  state.players = state.players.filter((p) => p.user).map((p) => ({ ...p, user: label(p.user) }));
  if (withPending) state.pending = state.pending.filter(Boolean).map(label);
  else delete state.pending;
  return state;
}