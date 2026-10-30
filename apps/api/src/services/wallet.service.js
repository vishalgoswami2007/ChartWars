import { User } from "../models/User.js";
import { Transaction } from "../models/Transaction.js";
import { ApiError } from "../utils/ApiError.js";
import { START_BALANCE, RESET_COOLDOWN_MS } from "../constants/wallet.js";

// Match / trade code baad me isi ko call karega. Balance sirf yahin se badlega.
export async function applyChange(userId, amount, type, { ref, note } = {}) {
  const filter = amount < 0 ? { _id: userId, balance: { $gte: -amount } } : { _id: userId };
  const user = await User.findOneAndUpdate(filter, { $inc: { balance: amount } }, { new: true });
  if (!user) throw ApiError.badRequest("Insufficient balance", "INSUFFICIENT_BALANCE");
  await Transaction.create({ user: userId, type, amount, balanceAfter: user.balance, ref, note });
  return user;
}

export async function getWallet(userId) {
  const user = await User.findById(userId).select("balance balanceResetAt");
  if (!user) throw ApiError.unauthorized();
  const next = user.balanceResetAt ? user.balanceResetAt.getTime() + RESET_COOLDOWN_MS : 0;
  return {
    balance: user.balance,
    canReset: Date.now() >= next,
    resetAvailableAt: Date.now() >= next ? null : new Date(next),
  };
}

export async function listTransactions(userId, { before, limit = 20 }) {
  const lim = Math.min(Math.max(Number(limit) || 20, 1), 50);
  const q = { user: userId };
  if (before) q._id = { $lt: before };
  const rows = await Transaction.find(q).sort({ _id: -1 }).limit(lim + 1).lean();
  const hasMore = rows.length > lim;
  const items = hasMore ? rows.slice(0, lim) : rows;
  return { items, nextCursor: hasMore ? items[items.length - 1]._id : null };
}

export async function resetBalance(userId) {
  const w = await getWallet(userId);
  if (!w.canReset) {
    throw ApiError.badRequest("You can reset your balance once every 7 days", "RESET_COOLDOWN");
  }
  const before = await User.findOneAndUpdate(
    { _id: userId },
    { $set: { balance: START_BALANCE, balanceResetAt: new Date() } },
    { new: false } // purana balance chahiye diff ke liye
  );
  await Transaction.create({
    user: userId, type: "reset",
    amount: START_BALANCE - before.balance,
    balanceAfter: START_BALANCE,
    note: "Balance reset",
  });
  return getWallet(userId);
}