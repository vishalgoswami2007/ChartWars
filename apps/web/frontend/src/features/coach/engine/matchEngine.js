import { COSTS, DIFFICULTIES, WARMUP } from "../data/difficultyConfig";
import { getScenario } from "../data/scenarios";
import { fmtPrice } from "../format";
import { botDecide } from "./botDecisionEngine";
import { coachTips } from "./coachAdvisor";
import { analyze } from "./indicators";
import { buildScenarioCached } from "./scenarioEngine";
import { buildOrder, getBlockers, marketClose, moveStop, newSide, openTrade, processCandle, stopPriceFromFrac } from "./tradeSimulator";

/** Everything fixed for one match: the rules, the costs and the candles both sides will trade. */
export function buildContext({ difficulty, scenarioId, capital }) {
  const rules = DIFFICULTIES[difficulty];
  const def = getScenario(scenarioId);
  if (!rules || rules.status !== "open" || !def || def.difficulty !== difficulty) return null;
  const scenario = buildScenarioCached(def, WARMUP);
  return {
    difficulty,
    rules,
    capital,
    costs: COSTS,
    candles: scenario.candles,
    regimes: scenario.regimes,
    total: scenario.total,
    warmup: WARMUP,
    seed: def.seed,
    scenario: def,
  };
}

export const createMatch = (ctx) => ({
  idx: ctx.warmup - 1,
  phase: "live",
  endReason: null,
  user: newSide(ctx.capital),
  bot: newSide(ctx.capital),
  feed: [],
  tipIds: [],
  hintsUsed: 0,
  botLog: [],
  userLog: [],
});

function finish(m, ctx, reason) {
  const price = ctx.candles[m.idx].close;
  const closeOut = (side) => {
    const closed = marketClose(side, price, "match-end", m.idx, ctx.costs);
    return { ...closed, curve: [...closed.curve.slice(0, -1), closed.balance] };
  };
  return { ...m, user: closeOut(m.user), bot: closeOut(m.bot), phase: "ended", endReason: reason };
}

export const endNow = (m, ctx) => (m.phase === "ended" ? m : finish(m, ctx, "ended-early"));

function botAct(m, ctx) {
  const i = m.idx;
  if (m.bot.busted) return m;

  const action = botDecide({
    difficulty: ctx.difficulty,
    candles: ctx.candles.slice(0, i + 1),
    bot: m.bot,
    rules: ctx.rules,
    seed: ctx.seed,
  });

  const price = ctx.candles[i].close;
  let bot = m.bot;
  let botLog = m.botLog;
  const log = (kind, text) => {
    botLog = [...botLog, { index: i, kind, text }];
  };

  if (action.type === "enter" && !bot.position && bot.tradeCount < ctx.rules.maxTrades) {
    const order = buildOrder({
      side: action.side,
      price,
      balance: bot.balance,
      stopPrice: action.stopPrice,
      tpMult: action.tpMult,
      riskFrac: ctx.rules.bot.riskFrac,
      rules: ctx.rules,
      costs: ctx.costs,
    });
    if (order) {
      bot = openTrade(
        bot,
        order,
        i,
        { by: "Coach", tag: action.tag, level: action.level, trendAligned: action.trendAligned, reason: action.reason },
        ctx.rules
      );
      log("enter", `${action.side === "buy" ? "Bought" : "Sold"}: ${action.reason}`);
    }
  } else if (action.type === "exit" && bot.position) {
    bot = marketClose(bot, price, "bot-exit", i, ctx.costs);
    log("exit", action.reason);
  } else if (action.type === "move-stop" && bot.position) {
    bot = moveStop(bot, action.stop);
    log("manage", action.reason);
  } else if (action.type === "skip") {
    const lastSkip = [...botLog].reverse().find((l) => l.kind === "skip");
    if (!lastSkip || i - lastSkip.index >= 5) log("skip", action.reason);
  }

  return bot === m.bot && botLog === m.botLog ? m : { ...m, bot, botLog };
}

function coachAuto(m, ctx) {
  if (ctx.rules.hints.mode !== "auto") return m;
  const tips = coachTips({ candles: ctx.candles.slice(0, m.idx + 1), position: m.user.position, level: ctx.difficulty, rules: ctx.rules });
  const known = new Set(m.tipIds);
  const fresh = tips.filter((t) => !known.has(t.id));
  const tipIds = tips.map((t) => t.id);
  if (fresh.length === 0) return { ...m, tipIds };
  const items = fresh.map((t) => ({ ...t, key: `${m.idx}-${t.id}`, index: m.idx }));
  return { ...m, tipIds, feed: [...items, ...m.feed].slice(0, 12) };
}

/** Reveals the next candle: both sides react to it, then the coach decides. Never looks ahead. */
export function advance(m, ctx) {
  if (m.phase === "ended") return m;
  const i = m.idx + 1;
  if (i >= ctx.total) return finish(m, ctx, "time");

  const candle = ctx.candles[i];
  let next = {
    ...m,
    idx: i,
    user: processCandle(m.user, candle, i, ctx.costs, ctx.rules),
    bot: processCandle(m.bot, candle, i, ctx.costs, ctx.rules),
  };
  if (i === ctx.total - 1) return finish(next, ctx, "time");
  next = botAct(next, ctx);
  return coachAuto(next, ctx);
}

export function userOrder(m, ctx, { side, stopFrac, tpMult, riskFrac }) {
  if (m.phase !== "live") return m;
  if (getBlockers(m.user, { running: true, rules: ctx.rules }).length > 0) return m;
  if (!(stopFrac > 0 && stopFrac <= 0.1) || !ctx.rules.riskOptions.includes(riskFrac)) return m;
  if (tpMult != null && !ctx.rules.tpOptions.includes(tpMult)) return m;

  const price = ctx.candles[m.idx].close;
  const order = buildOrder({
    side,
    price,
    balance: m.user.balance,
    stopPrice: stopPriceFromFrac(side, price, stopFrac),
    tpMult,
    riskFrac,
    rules: ctx.rules,
    costs: ctx.costs,
  });
  if (!order) return m;

  const a = analyze(ctx.candles.slice(0, m.idx + 1));
  const user = openTrade(m.user, order, m.idx, { by: "You", tag: "manual", trendAligned: a.trend === (side === "buy" ? "up" : "down") }, ctx.rules);
  const text = `${side === "buy" ? "Bought" : "Sold"} at ${fmtPrice(order.entry)}`;
  return { ...m, user, userLog: [...m.userLog, { index: m.idx, text }] };
}

export function userClose(m, ctx) {
  if (m.phase !== "live" || !m.user.position) return m;
  const user = marketClose(m.user, ctx.candles[m.idx].close, "manual", m.idx, ctx.costs);
  return { ...m, user };
}

export function userHint(m, ctx) {
  const limit = ctx.rules.hints.limit;
  if (m.phase !== "live" || m.hintsUsed >= limit) return m;
  const tips = coachTips({ candles: ctx.candles.slice(0, m.idx + 1), position: m.user.position, level: ctx.difficulty, rules: ctx.rules });
  const shown = new Set(m.feed.map((f) => f.id));
  const tip = tips.find((t) => !shown.has(t.id)) ?? {
    id: `none-${m.idx}`,
    tone: "info",
    text: "No new observation right now. Wait for the next candles.",
  };
  const item = { ...tip, key: `h-${m.idx}-${m.hintsUsed}`, index: m.idx, manual: true };
  return {
    ...m,
    feed: [item, ...m.feed].slice(0, 12),
    hintsUsed: Number.isFinite(limit) ? m.hintsUsed + 1 : m.hintsUsed,
  };
}