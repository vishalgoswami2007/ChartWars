import { analyze } from "./indicators";
import { hashRand } from "./scenarioEngine";
import { rOf } from "./tradeSimulator";

// The coach bot is a set of rules per difficulty. It only sees candles that already happened.
// Its randomness comes from hashRand(seed, candle), so the same match always plays out the same way.

const wait = (reason) => ({ type: "wait", reason });
const exitNow = (reason) => ({ type: "exit", reason });
const skip = (reason) => ({ type: "skip", reason });

function entry(side, a, { stopAtr, tpMult, reason, tag, level = null, stopOverride = null }) {
  const long = side === "buy";
  const base = long ? a.close - stopAtr * a.atr : a.close + stopAtr * a.atr;
  let stopPrice = base;
  if (stopOverride != null) stopPrice = long ? Math.min(base, stopOverride) : Math.max(base, stopOverride);
  return { type: "enter", side, stopPrice, tpMult, reason, tag, level, trendAligned: a.trend === (long ? "up" : "down") };
}

function pullbackSetup(side, candles, a) {
  const long = side === "buy";
  const recent = candles.slice(-6);
  const touched = long
    ? recent.some((c) => c.low <= a.e20 + 0.3 * a.atr)
    : recent.some((c) => c.high >= a.e20 - 0.3 * a.atr);
  const confirm = long
    ? a.close > a.candle.open && a.close > a.prevCandle.high
    : a.close < a.candle.open && a.close < a.prevCandle.low;
  const last5 = candles.slice(-5);
  const swing = long
    ? Math.min(...last5.map((c) => c.low)) - 0.3 * a.atr
    : Math.max(...last5.map((c) => c.high)) + 0.3 * a.atr;
  return { ok: touched && confirm, swing };
}

/* ---------- Beginner: simple cross, can chase and panic ---------- */
function beginnerBot({ a, index, candles, bot, rules, rand }) {
  const pos = bot.position;
  if (pos) {
    if (rOf(pos, a.close) >= 0.6 && rand(1) < 0.12) return exitNow("Took a small profit early because it felt nervous.");
    return wait("Holding with a basic stop-loss and target.");
  }
  if (bot.tradeCount >= rules.maxTrades) return wait("Trade limit reached.");
  if (index - bot.lastCloseIndex < 3) return wait("Resting after the last trade.");

  const crossUp = a.e9p <= a.e21p && a.e9 > a.e21;
  const crossDown = a.e9p >= a.e21p && a.e9 < a.e21;
  if (crossUp || crossDown) {
    return entry(crossUp ? "buy" : "sell", a, {
      stopAtr: 1.5,
      tpMult: 1.33,
      reason: `The fast average crossed ${crossUp ? "above" : "below"} the slow one: a simple signal.`,
      tag: "cross",
    });
  }

  const last3 = candles.slice(-3);
  const rising = last3.every((c) => c.close > c.open);
  const falling = last3.every((c) => c.close < c.open);
  if ((rising || falling) && rand(2) < 0.2) {
    return entry(rising ? "buy" : "sell", a, {
      stopAtr: 1,
      tpMult: 1,
      reason: "Chased a fast move after three candles of the same colour.",
      tag: "chase",
    });
  }
  return wait("No simple signal yet.");
}

/* ---------- Intermediate: trend + pullback + confirmation, sometimes a false signal ---------- */
function intermediateBot({ a, index, candles, bot, rules, rand }) {
  const pos = bot.position;
  if (pos) {
    if (!pos.movedToBE && rOf(pos, a.close) >= 1) {
      return { type: "move-stop", stop: pos.entry, reason: "Moved the stop to breakeven after +1R." };
    }
    return wait("Managing the trade.");
  }
  if (bot.tradeCount >= rules.maxTrades) return wait("Trade limit reached.");
  if (index - bot.lastCloseIndex < 3) return wait("Cooling off after the last trade.");
  if (a.trend === "flat") return wait("No clear trend, so no trade.");

  const side = a.trend === "up" ? "buy" : "sell";
  const pb = pullbackSetup(side, candles, a);
  if (pb.ok) {
    return entry(side, a, {
      stopAtr: 1,
      stopOverride: pb.swing,
      tpMult: 2,
      reason: "Pullback to the 20-period average with a confirming candle.",
      tag: "pullback",
    });
  }
  const breakout = side === "buy" ? a.close > a.rangeHigh : a.close < a.rangeLow;
  if (breakout && rand(3) < 0.25) {
    return entry(side, a, {
      stopAtr: 1,
      tpMult: 1.5,
      reason: "Entered a breakout without waiting for confirmation.",
      tag: "unconfirmed-breakout",
    });
  }
  return wait("Waiting for a pullback with confirmation.");
}

/* ---------- Advanced: scores several conditions, exits when the setup is invalid ---------- */
function evaluate(side, candles, a) {
  const long = side === "buy";
  let score = 0;
  const why = [];
  if (a.trend === (long ? "up" : "down")) {
    score += 2;
    why.push("trend agrees");
  }
  const c = a.candle;
  const range = c.high - c.low || 1e-9;
  if (Math.abs(c.close - c.open) / range >= 0.6 && (long ? c.close > c.open : c.close < c.open)) {
    score += 1;
    why.push("strong candle");
  }
  if (long ? a.rsi < 70 : a.rsi > 30) {
    score += 1;
    why.push("momentum not exhausted");
  }
  if (a.atrRatio < 1.5) {
    score += 1;
    why.push("volatility normal");
  }
  const breakout = long ? a.close > a.rangeHigh : a.close < a.rangeLow;
  const pb = pullbackSetup(side, candles, a);
  let tag = null;
  let level = null;
  if (breakout) {
    score += 2;
    tag = "breakout";
    level = long ? a.rangeHigh : a.rangeLow;
    why.push("closed beyond the 20-candle range");
  } else if (pb.ok) {
    score += 2;
    tag = "pullback";
    why.push("pullback with confirmation");
  }
  const stopDist = Math.max(Math.abs(a.close - pb.swing), a.atr);
  const room = long ? a.rangeHigh - a.close : a.close - a.rangeLow;
  if (breakout || room >= 1.5 * stopDist) {
    score += 1;
    why.push("room to run");
  }
  return { side, score, why, tag, level, swing: pb.swing };
}

function advancedManage({ a, index, bot }) {
  const pos = bot.position;
  const r = rOf(pos, a.close);
  if (pos.meta.tag === "breakout" && pos.meta.level != null && index - pos.openedIndex <= 6) {
    const back = pos.side === "buy" ? a.close < pos.meta.level - 0.2 * a.atr : a.close > pos.meta.level + 0.2 * a.atr;
    if (back) return exitNow("Setup invalid: price closed back inside the range.");
  }
  const flipped =
    pos.side === "buy" ? a.e20 < a.e50 && a.e20p >= a.e50p : a.e20 > a.e50 && a.e20p <= a.e50p;
  if (flipped) return exitNow("Setup invalid: the trend filter flipped against the trade.");
  if (a.atrRatio > 2 && r < 0) return exitNow("Volatility spiked while the trade was losing: cutting risk.");
  if (!pos.movedToBE && r >= 1.5) {
    return {
      type: "move-stop",
      stop: pos.side === "buy" ? pos.entry + 0.5 * pos.dist : pos.entry - 0.5 * pos.dist,
      reason: "Locked in +0.5R after the trade reached +1.5R.",
    };
  }
  return wait("Holding: the setup is still valid.");
}

function advancedBot(ctx) {
  const { a, index, candles, bot, rules, rand } = ctx;
  if (bot.position) return advancedManage(ctx);
  if (bot.tradeCount >= rules.maxTrades) return wait("Trade limit reached.");
  if (index - bot.lastCloseIndex < 4) return wait("Cooling off after the last trade.");

  const options = [evaluate("buy", candles, a), evaluate("sell", candles, a)];
  const best = options[0].score >= options[1].score ? options[0] : options[1];

  if (best.score >= 6 && best.tag) {
    if (rand(4) < 0.1) return skip("Hesitated on a valid setup and let it go.");
    return entry(best.side, a, {
      stopAtr: 1,
      stopOverride: best.swing,
      tpMult: 2.5,
      reason: `Setup scored ${best.score}/8: ${best.why.join(", ")}.`,
      tag: best.tag,
      level: best.level,
    });
  }
  if (best.score >= 4) return skip(`Passed on a ${best.side === "buy" ? "long" : "short"} setup: scored ${best.score}/8, needs 6.`);
  return wait("No setup worth taking.");
}

export function botDecide({ difficulty, candles, bot, rules, seed }) {
  const index = candles.length - 1;
  if (candles.length < 55) return wait("Warming up on the opening candles.");
  const ctx = { a: analyze(candles), index, candles, bot, rules, rand: (k) => hashRand(seed, index, k) };
  if (difficulty === "intermediate") return intermediateBot(ctx);
  if (difficulty === "advanced") return advancedBot(ctx);
  return beginnerBot(ctx);
}