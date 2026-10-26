import { clamp, mean, sum } from "../format";
import { buildReview, violationsOf } from "./reviewEngine";

/** Scores one side of the match from its finished trades. */
export function scoreSide(side, ctx) {
  const { rules, capital } = ctx;
  const trades = side.trades;
  const n = trades.length;
  const pnl = side.balance - capital;
  const wins = trades.filter((t) => t.pnl > 0);
  const losses = trades.filter((t) => t.pnl < 0);
  const grossWin = sum(wins.map((t) => t.pnl));
  const grossLoss = Math.abs(sum(losses.map((t) => t.pnl)));

  // Risk management (35): contained drawdown (20) and losses close to what was planned (15).
  const drawdownPart = 20 * (1 - clamp(side.maxDrawdown / rules.maxDrawdown, 0, 1));
  const controlled = losses.filter((t) => Math.abs(t.pnl) <= 1.3 * t.riskAmount).length;
  const lossPart = 15 * (losses.length ? controlled / losses.length : 1);

  // Rule discipline (35): share of trades without a soft-rule break.
  const broken = trades.filter((t) => violationsOf(t, rules).length > 0).length;
  const discipline = n ? 35 * (1 - broken / n) : 35;

  // Setup quality (30): share of entries aligned with the trend filter.
  const setup = n ? (30 * trades.filter((t) => t.trendAligned).length) / n : 0;

  let performance = drawdownPart + lossPart + discipline + setup;
  if (n === 0) performance = Math.min(performance, 25); // doing nothing is not good play

  return {
    pnl,
    pnlPct: (pnl / capital) * 100,
    fees: sum(trades.map((t) => t.fees)),
    trades: n,
    winRate: n ? wins.length / n : 0,
    profitFactor: grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? Infinity : 0,
    avgR: mean(trades.map((t) => t.r)),
    maxDrawdown: side.maxDrawdown,
    busted: side.busted,
    violations: broken,
    parts: { risk: drawdownPart + lossPart, discipline, setup },
    performance: Math.round(performance),
  };
}

/** Net P&L decides. Inside a small margin, the performance score breaks the tie. */
export function decideWinner(user, bot, capital) {
  const margin = capital * 0.001;
  const gap = user.pnl - bot.pnl;
  if (Math.abs(gap) >= margin) {
    return { winner: gap > 0 ? "user" : "coach", reason: "Higher net P&L after fees and slippage.", tieBreak: false };
  }
  const perf = user.performance - bot.performance;
  if (Math.abs(perf) >= 1) {
    return {
      winner: perf > 0 ? "user" : "coach",
      reason: "Net P&L was almost equal, so the performance score broke the tie.",
      tieBreak: true,
    };
  }
  return { winner: "draw", reason: "Net P&L and performance score were almost equal.", tieBreak: true };
}

export function summarizeMatch(m, ctx) {
  const user = scoreSide(m.user, ctx);
  const bot = scoreSide(m.bot, ctx);
  return {
    id: `c_${Date.now()}`,
    at: Date.now(),
    difficulty: ctx.difficulty,
    difficultyLabel: ctx.rules.label,
    scenarioId: ctx.scenario.id,
    scenarioTitle: ctx.scenario.title,
    capital: ctx.capital,
    warmup: ctx.warmup,
    botName: ctx.rules.bot.name,
    botAbout: ctx.rules.bot.about,
    rules: {
      minRR: ctx.rules.minRR,
      maxDrawdown: ctx.rules.maxDrawdown,
      cooldownCandles: ctx.rules.cooldownCandles,
      requireTp: ctx.rules.requireTp,
    },
    endReason: m.endReason,
    candlesPlayed: m.idx - ctx.warmup + 1,
    totalPlay: ctx.total - ctx.warmup,
    hintsUsed: m.hintsUsed,
    user,
    bot,
    verdict: decideWinner(user, bot, ctx.capital),
    curves: { user: m.user.curve, bot: m.bot.curve },
    userTrades: m.user.trades,
    botTrades: m.bot.trades,
    review: buildReview({ ctx, userSide: m.user, botSide: m.bot, userLog: m.userLog, botLog: m.botLog }),
  };
}