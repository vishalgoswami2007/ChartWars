import { fmtMoney, fmtR, stdev } from "../format";

export const CATEGORY = {
  "risk-reward": "Risk and reward plan",
  revenge: "Revenge trade",
  "counter-trend": "Against the trend",
  "oversized-loss": "Loss bigger than planned",
  "gave-back": "Gave back profit",
  "quick-stop": "Stopped out too fast",
};

/** Soft rules. You can break them, and they cost discipline points. */
export function violationsOf(t, rules) {
  const out = [];
  if (t.rrPlanned == null ? rules.requireTp : t.rrPlanned < rules.minRR - 1e-9) out.push("risk-reward");
  if (t.revenge) out.push("revenge");
  return out;
}

export function mistakesOf(trades, rules) {
  const list = [];
  const push = (t, category, message) => list.push({ id: `${t.id}-${category}`, category, tradeId: t.id, index: t.closedIndex, message });

  for (const t of trades) {
    if (violationsOf(t, rules).includes("risk-reward")) {
      push(t, "risk-reward", t.rrPlanned == null
        ? "No take-profit plan. This level expects every trade to have a target."
        : `Planned reward was ${t.rrPlanned.toFixed(1)}R, below the ${rules.minRR}R this level expects.`);
    }
    if (t.revenge) {
      push(t, "revenge", `Opened within ${rules.cooldownCandles} candles of a loss. A short break after a loss helps you avoid chasing it back.`);
    }
    if (!t.trendAligned) {
      push(t, "counter-trend", "Entered against the trend (20 vs 50 period averages). Counter-trend trades need a clear reason.");
    }
    if (t.pnl < 0 && Math.abs(t.pnl) > 1.3 * t.riskAmount) {
      push(t, "oversized-loss", `Lost ${(Math.abs(t.pnl) / t.riskAmount).toFixed(1)}x the planned risk, likely because of a gap or a fast move.`);
    }
    if (t.pnl < 0 && t.mfeR >= 1) {
      push(t, "gave-back", `The trade was up ${t.mfeR.toFixed(1)}R at its best but ended as a loss. Consider protecting profit once a trade reaches +1R.`);
    }
    if (t.reason === "stop-loss" && t.hold <= 2) {
      push(t, "quick-stop", `Stopped out after ${t.hold} candle${t.hold === 1 ? "" : "s"}. The entry may have been early, or the stop too tight.`);
    }
  }
  return list.sort((x, y) => x.index - y.index);
}

function consistencyLabel(trades) {
  if (trades.length < 3) return { label: "Not enough trades to judge", sd: 0 };
  const sd = stdev(trades.map((t) => t.r));
  return { label: sd <= 0.8 ? "Steady" : sd <= 1.6 ? "Mixed" : "Erratic", sd };
}

function timelineOf({ ctx, userSide, botSide, userLog, botLog }) {
  const closeText = (t) => `Closed ${t.side === "buy" ? "long" : "short"} by ${t.reason}: ${fmtMoney(t.pnl, true)} (${fmtR(t.r)})`;
  const items = [
    ...userLog.map((l) => ({ index: l.index, who: "you", text: l.text })),
    ...userSide.trades.map((t) => ({ index: t.closedIndex, who: "you", text: closeText(t) })),
    ...botLog.map((l) => ({ index: l.index, who: "coach", text: l.text })),
    ...botSide.trades.map((t) => ({ index: t.closedIndex, who: "coach", text: closeText(t) })),
  ];
  return items
    .sort((x, y) => x.index - y.index)
    .map((item) => ({ ...item, regime: ctx.regimes[item.index]?.label ?? "" }));
}

export function buildReview({ ctx, userSide, botSide, userLog, botLog }) {
  const depth = ctx.rules.review;
  const mistakes = mistakesOf(userSide.trades, ctx.rules);

  const counts = {};
  for (const m of mistakes) counts[m.category] = (counts[m.category] ?? 0) + 1;
  const groups = Object.entries(counts).sort((x, y) => y[1] - x[1]);
  const recurring = groups.find(([, n]) => n >= 2)?.[0] ?? null;

  return {
    depth,
    mistakes,
    groups,
    recurring,
    consistency: consistencyLabel(userSide.trades),
    botDecisions: botLog,
    timeline: depth === "basic" ? [] : timelineOf({ ctx, userSide, botSide, userLog, botLog }),
  };
}