// Order and trade rules shared by you and the coach bot. Pure functions: no hidden state.

export const newSide = (capital) => ({
  capital,
  balance: capital,
  position: null,
  trades: [],
  tradeCount: 0,
  peak: capital,
  maxDrawdown: 0,
  curve: [capital],
  lastLossIndex: -Infinity,
  lastCloseIndex: -Infinity,
  busted: false,
  events: [],
});

export const unrealized = (pos, price) => (pos.side === "buy" ? price - pos.entry : pos.entry - price) * pos.size;
export const equityOf = (s, price) =>
  s.balance + (s.position && Number.isFinite(price) ? unrealized(s.position, price) : 0);
export const rOf = (pos, price) => (pos.side === "buy" ? price - pos.entry : pos.entry - price) / pos.dist;

/** Market fills are slightly worse than the shown price. `closing` flips the direction. */
function fill(side, price, costs, closing) {
  const buying = closing ? side === "sell" : side === "buy";
  return buying ? price * (1 + costs.slippage) : price * (1 - costs.slippage);
}

export const stopPriceFromFrac = (side, price, frac) => (side === "buy" ? price * (1 - frac) : price * (1 + frac));

export function buildOrder({ side, price, balance, stopPrice, tpMult, riskFrac, rules, costs }) {
  if (!Number.isFinite(stopPrice) || !Number.isFinite(price) || !(balance > 0)) return null;
  const long = side === "buy";
  const entry = fill(side, price, costs, false);
  if (long ? stopPrice >= entry : stopPrice <= entry) return null;

  const dist = Math.abs(entry - stopPrice);
  let size = (balance * riskFrac) / dist;
  const maxSize = (balance * rules.maxLeverage) / entry;
  const capped = size > maxSize;
  if (capped) size = maxSize;

  const tp = tpMult ? (long ? entry + dist * tpMult : entry - dist * tpMult) : null;
  return {
    side,
    entry,
    stop: stopPrice,
    tp,
    dist,
    size,
    riskAmount: size * dist,
    notional: size * entry,
    capped,
    rr: tpMult ?? null,
    fee: size * entry * costs.fee,
    riskFrac,
  };
}

export function getBlockers(s, { running, rules }) {
  const out = [];
  if (!running) out.push("The match is not running");
  if (s.busted) out.push("The drawdown limit was reached");
  if (s.position) out.push("Close the open position first");
  if (s.tradeCount >= rules.maxTrades) out.push(`Trade limit reached (${rules.maxTrades})`);
  return out;
}

export function openTrade(s, order, index, meta, rules) {
  const revenge = rules.cooldownCandles > 0 && index - s.lastLossIndex <= rules.cooldownCandles;
  const position = { ...order, openedIndex: index, mfe: 0, movedToBE: false, meta: { ...meta, revenge } };
  return {
    ...s,
    balance: s.balance - order.fee,
    position,
    tradeCount: s.tradeCount + 1,
    events: [...s.events, { index, type: "open", side: order.side, price: order.entry }],
  };
}

export function closeTrade(s, exitPrice, reason, index, costs) {
  const pos = s.position;
  if (!pos) return s;
  const gross = unrealized(pos, exitPrice);
  const exitFee = pos.size * exitPrice * costs.fee;
  const net = gross - pos.fee - exitFee;
  const trade = {
    id: s.tradeCount,
    side: pos.side,
    entry: pos.entry,
    exit: exitPrice,
    size: pos.size,
    pnl: net,
    fees: pos.fee + exitFee,
    riskAmount: pos.riskAmount,
    r: pos.riskAmount > 0 ? net / pos.riskAmount : 0,
    rrPlanned: pos.rr,
    openedIndex: pos.openedIndex,
    closedIndex: index,
    hold: index - pos.openedIndex,
    reason,
    mfeR: pos.dist > 0 ? pos.mfe / pos.dist : 0,
    trendAligned: Boolean(pos.meta.trendAligned),
    revenge: Boolean(pos.meta.revenge),
    tag: pos.meta.tag ?? null,
    by: pos.meta.by,
    openReason: pos.meta.reason ?? "",
  };
  return {
    ...s,
    balance: s.balance + gross - exitFee,
    position: null,
    trades: [...s.trades, trade],
    lastLossIndex: net < 0 ? index : s.lastLossIndex,
    lastCloseIndex: index,
    events: [...s.events, { index, type: "close", side: pos.side, price: exitPrice }],
  };
}

export function marketClose(s, price, reason, index, costs) {
  if (!s.position) return s;
  return closeTrade(s, fill(s.position.side, price, costs, true), reason, index, costs);
}

/** Only ever moves a stop closer to price, never away from it. */
export function moveStop(s, stop) {
  const pos = s.position;
  if (!pos) return s;
  const tighter = pos.side === "buy" ? stop > pos.stop : stop < pos.stop;
  return tighter ? { ...s, position: { ...pos, stop, movedToBE: true } } : { ...s, position: { ...pos, movedToBE: true } };
}

function checkExit(pos, c) {
  if (pos.side === "buy") {
    if (c.open <= pos.stop) return { price: c.open, reason: "stop-loss" };
    if (pos.tp && c.open >= pos.tp) return { price: c.open, reason: "take-profit" };
    if (c.low <= pos.stop) return { price: pos.stop, reason: "stop-loss" };
    if (pos.tp && c.high >= pos.tp) return { price: pos.tp, reason: "take-profit" };
  } else {
    if (c.open >= pos.stop) return { price: c.open, reason: "stop-loss" };
    if (pos.tp && c.open <= pos.tp) return { price: c.open, reason: "take-profit" };
    if (c.high >= pos.stop) return { price: pos.stop, reason: "stop-loss" };
    if (pos.tp && c.low <= pos.tp) return { price: pos.tp, reason: "take-profit" };
  }
  return null;
}

/** A new candle arrives: check stop and target (stop first if both are touched), then track equity. */
export function processCandle(s, candle, index, costs, rules) {
  let next = s;
  if (next.position) {
    const pos = next.position;
    const favourable = pos.side === "buy" ? candle.high - pos.entry : pos.entry - candle.low;
    const tracked = { ...pos, mfe: Math.max(pos.mfe, favourable) };
    const hit = checkExit(tracked, candle);
    if (hit) {
      const price = hit.reason === "stop-loss" ? fill(pos.side, hit.price, costs, true) : hit.price;
      next = closeTrade({ ...next, position: tracked }, price, hit.reason, index, costs);
    } else {
      next = { ...next, position: tracked };
    }
  }

  const equity = equityOf(next, candle.close);
  const peak = Math.max(next.peak, equity);
  const drawdown = peak > 0 ? (peak - equity) / peak : 0;
  next = { ...next, peak, maxDrawdown: Math.max(next.maxDrawdown, drawdown), curve: [...next.curve, equity] };

  if (!next.busted && equity <= next.capital * (1 - rules.maxDrawdown)) {
    next = marketClose(next, candle.close, "drawdown-limit", index, costs);
    next = { ...next, busted: true };
  }
  return next;
}