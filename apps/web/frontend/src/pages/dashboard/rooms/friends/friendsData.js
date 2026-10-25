import { useCallback, useEffect, useRef, useState } from "react";
import { fetchMarkets } from "../../../../services/cryptoMarketAPI";

/* ---------- Routes and config ---------- */

export const ROUTES = {
  rooms: "/dashboard/rooms",
  lobby: "/dashboard/rooms/friends",
  waiting: "/dashboard/rooms/friends/room",
  live: "/dashboard/rooms/friends/live",
  analytics: "/dashboard/rooms/friends/analytics",
  home: "/dashboard",
};

// No backend yet: other players, codes and the host are simulated.
export const DEMO_MODE = true;

export const CFG = {
  capital: 10000,
  maxDrawdown: 0.03,
  maxLeverage: 5,
  slippage: 0.0001,
  maxTrades: 10,
  risks: [0.0025, 0.005, 0.01],
  tps: [null, 1, 2, 3],
  stopMin: 0.02,
  stopMax: 5,
  stopStep: 0.05,
  candleSeconds: 5,
  tickMs: 1000,
  vol: 0.0005,
  history: 120,
  maxCandles: 600,
};

export const SYMBOLS = [
  { id: "bitcoin", ticker: "BTC", name: "Bitcoin", fallback: 80700 },
  { id: "ethereum", ticker: "ETH", name: "Ethereum", fallback: 2377 },
  { id: "solana", ticker: "SOL", name: "Solana", fallback: 102 },
  { id: "dogecoin", ticker: "DOGE", name: "Dogecoin", fallback: 0.078 },
  { id: "ripple", ticker: "XRP", name: "XRP", fallback: 1.29 },
  { id: "binancecoin", ticker: "BNB", name: "BNB", fallback: 738 },
];

export const PLAYER_OPTIONS = [2, 4];
export const MINUTE_OPTIONS = [3, 5, 10, 15];

export const YOU = { id: "you", name: "You", country: "IN" };
export const DEMO_FRIENDS = [
  { id: "rahul", name: "Rahul", country: "IN" },
  { id: "aman", name: "Aman", country: "IN" },
  { id: "neha", name: "Neha", country: "IN" },
];

const BOT = { fast: 5, slow: 15, stopFrac: 0.0025, tpMult: 2, riskFrac: 0.005, cooldownMs: 10000 };

/* ---------- Formatting ---------- */

export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pad = (n) => String(n).padStart(2, "0");
const moneyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const priceHi = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const priceLo = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

export const fmtPrice = (v) => (Number.isFinite(v) ? (v < 1 ? priceLo : priceHi).format(v) : "—");
export const fmtMoney = (v, signed = false) =>
  Number.isFinite(v) ? `${signed && v > 0 ? "+" : ""}${moneyFmt.format(v)}` : "—";
export const fmtPct = (v) => (Number.isFinite(v) ? `${v > 0 ? "+" : ""}${v.toFixed(2)}%` : "—");
export const fmtSize = (v) => (Number.isFinite(v) ? v.toFixed(v < 1 ? 6 : v < 100 ? 4 : 2) : "—");
export const clock = (ms) => {
  const s = Math.ceil(Math.max(0, ms) / 1000);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};
export const tone = (v) => (v > 0 ? "text-emerald-400" : v < 0 ? "text-red-400" : "text-zinc-300");

/* ---------- Room codes and storage ---------- */

const ALPHABET = "ABCDEFGHJKMNPQRSTUVWXYZ23456789";
export const CODE_RE = /^[A-HJKMNP-Z2-9]{6}$/;
export const normalizeCode = (value) => value.toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 6);

export function makeCode() {
  const bytes = new Uint8Array(6);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join("");
}

const KEY_ROOM = "cw.friends.room.v1";
const KEY_CODE = "cw.friends.nextcode.v1";
const KEY_HISTORY = "cw.friends.history.v1";

function read(store, key, fallback) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable (private mode or full). The app still works without it.
  }
}

export const loadRoom = () => read(window.sessionStorage, KEY_ROOM, null);
export const saveRoom = (room) => write(window.sessionStorage, KEY_ROOM, room);
export function clearRoom() {
  try {
    window.sessionStorage.removeItem(KEY_ROOM);
  } catch {
    // Nothing to clear.
  }
}

export function getNextCode() {
  const saved = read(window.localStorage, KEY_CODE, "");
  if (CODE_RE.test(saved)) return saved;
  const code = makeCode();
  write(window.localStorage, KEY_CODE, code);
  return code;
}

export function rotateCode() {
  const code = makeCode();
  write(window.localStorage, KEY_CODE, code);
  return code;
}

export const loadHistory = () => read(window.localStorage, KEY_HISTORY, []);
export function pushHistory(entry) {
  write(window.localStorage, KEY_HISTORY, [entry, ...loadHistory()].slice(0, 20));
}

/* ---------- Rooms and permissions ---------- */

export const makeMember = (person, extra = {}) => ({
  id: person.id,
  name: person.name,
  country: person.country,
  role: "member",
  perms: { trade: false, admin: false },
  ready: false,
  mic: true,
  cam: false,
  ...extra,
});

const hostOf = (person) =>
  makeMember(person, { role: "host", ready: true, perms: { trade: true, admin: true } });

export function createRoom({ code, symbol, players, minutes }) {
  return { code, symbol, players, minutes, hostId: YOU.id, phase: "waiting", createdAt: Date.now(), participants: [hostOf(YOU)] };
}

// Demo: joining by code puts you in a simulated room hosted by a demo friend.
export function joinRoom(code) {
  const host = hostOf(DEMO_FRIENDS[0]);
  return {
    code,
    symbol: "bitcoin",
    players: 2,
    minutes: 5,
    hostId: host.id,
    phase: "waiting",
    createdAt: Date.now(),
    participants: [host, makeMember(YOU)],
  };
}

export const isAdmin = (p) => p.role === "host" || p.perms.admin;
export const canTrade = (p) => isAdmin(p) || p.perms.trade;
export const roleLabel = (p) => (p.role === "host" ? "Host" : p.perms.admin ? "Admin" : p.perms.trade ? "Trader" : "Viewer");


export function useCopy() {
  const [copied, setCopied] = useState(false);
  const timer = useRef(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      clearTimeout(timer.current);
      timer.current = setTimeout(() => setCopied(false), 1500);
    } catch {
      setCopied(false);
    }
  }, []);

  
  useEffect(() => () => clearTimeout(timer.current), []);
  return { copied, copy };
}

/* ---------- Indicators ---------- */

export function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = [];
  let prev = 0;
  values.forEach((v, i) => {
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
}

/* ---------- Order engine (pure functions) ---------- */

export const newAccount = () => ({ balance: CFG.capital, position: null, trades: [], opened: 0 });
export const pnlOf = (pos, price) => (pos.side === "buy" ? (price - pos.entry) * pos.size : (pos.entry - price) * pos.size);
export const equityOf = (acct, price) =>
  acct.balance + (acct.position && Number.isFinite(price) ? pnlOf(acct.position, price) : 0);
export const drawdownOf = (equity) => Math.max(0, (CFG.capital - equity) / CFG.capital);

export function computeOrder({ balance, price, side, stopFrac, riskFrac, tpMult }) {
  if (!Number.isFinite(price) || !(stopFrac > 0) || !(balance > 0)) return null;
  const entry = side === "buy" ? price * (1 + CFG.slippage) : price * (1 - CFG.slippage);
  const dist = entry * stopFrac;
  const stop = side === "buy" ? entry - dist : entry + dist;
  let size = (balance * riskFrac) / dist;
  const maxSize = (balance * CFG.maxLeverage) / entry;
  const capped = size > maxSize;
  if (capped) size = maxSize;
  const tp = tpMult ? (side === "buy" ? entry + dist * tpMult : entry - dist * tpMult) : null;
  return { side, entry, stop, tp, size, riskAmount: size * dist, notional: size * entry, capped, tpMult: tpMult ?? null };
}

export const openPosition = (acct, order, now, by = "You") => ({
  ...acct,
  opened: acct.opened + 1,
  position: { ...order, openedAt: now, by },
});

export function closePosition(acct, exit, reason, now) {
  const pos = acct.position;
  if (!pos) return acct;
  const pnl = pnlOf(pos, exit);
  const trade = {
    id: acct.opened,
    side: pos.side,
    entry: pos.entry,
    exit,
    size: pos.size,
    pnl,
    riskAmount: pos.riskAmount,
    tpMult: pos.tpMult,
    reason,
    closedAt: now,
    by: pos.by,
  };
  return { ...acct, balance: acct.balance + pnl, position: null, trades: [...acct.trades, trade] };
}

export function marketExit(acct, price, reason, now) {
  const pos = acct.position;
  if (!pos) return acct;
  const exit = pos.side === "buy" ? price * (1 - CFG.slippage) : price * (1 + CFG.slippage);
  return closePosition(acct, exit, reason, now);
}

export function checkExits(acct, price, now) {
  const pos = acct.position;
  if (!pos) return acct;
  const long = pos.side === "buy";
  if (long ? price <= pos.stop : price >= pos.stop) return closePosition(acct, price, "stop-loss", now);
  if (pos.tp && (long ? price >= pos.tp : price <= pos.tp)) return closePosition(acct, pos.tp, "take-profit", now);
  return acct;
}

export function getBlockers({ running, acct, price, stopPct, allowed }) {
  const out = [];
  if (!running) out.push("Match is not running");
  if (!allowed) out.push("Ask the host for trade permission");
  if (!Number.isFinite(price)) out.push("Waiting for price");
  if (!(stopPct >= CFG.stopMin && stopPct <= CFG.stopMax)) out.push(`Set a stop-loss between ${CFG.stopMin}% and ${CFG.stopMax}%`);
  if (acct.position) out.push("Close the open position first");
  if (acct.opened >= CFG.maxTrades) out.push(`Trade limit reached (${CFG.maxTrades})`);
  return out;
}

/** Demo only: a friend with trade permission places EMA-cross trades. It never sees future prices. */
export function friendStep(acct, candles, price, now, evalRef, by) {
  if (acct.position || acct.opened >= CFG.maxTrades) return acct;
  const lastClosed = acct.trades[acct.trades.length - 1]?.closedAt ?? 0;
  if (now - lastClosed < BOT.cooldownMs || candles.length < BOT.slow + 3) return acct;

  const done = candles.slice(0, -1);
  const stamp = done[done.length - 1].time;
  if (evalRef.current === stamp) return acct;
  evalRef.current = stamp;

  const closes = done.map((c) => c.close);
  const fast = emaSeries(closes, BOT.fast);
  const slow = emaSeries(closes, BOT.slow);
  const i = closes.length - 1;
  const up = fast[i - 1] <= slow[i - 1] && fast[i] > slow[i];
  const down = fast[i - 1] >= slow[i - 1] && fast[i] < slow[i];
  if (!up && !down) return acct;

  const order = computeOrder({
    balance: acct.balance,
    price,
    side: up ? "buy" : "sell",
    stopFrac: BOT.stopFrac,
    riskFrac: BOT.riskFrac,
    tpMult: BOT.tpMult,
  });
  return order ? openPosition(acct, order, now, by) : acct;
}

/* ---------- Simulated price feed ---------- */

const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

function makeHistory(base) {
  const closes = new Array(CFG.history);
  closes[CFG.history - 1] = base;
  const vol = CFG.vol * Math.sqrt(CFG.candleSeconds);
  for (let i = CFG.history - 2; i >= 0; i -= 1) closes[i] = closes[i + 1] / (1 + gauss() * vol);

  const t0 = Math.floor(Date.now() / 1000 / CFG.candleSeconds) * CFG.candleSeconds;
  return closes.map((close, i) => {
    const open = i === 0 ? close : closes[i - 1];
    const spread = Math.abs(gauss()) * vol * 0.5;
    return {
      time: t0 - (CFG.history - i) * CFG.candleSeconds,
      open,
      close,
      high: Math.max(open, close) * (1 + spread),
      low: Math.min(open, close) * (1 - spread),
    };
  });
}

/**
 * Starts from the real CoinGecko price, then simulates movement tick by tick.
 * TODO(backend): replace the interval with a WebSocket price stream shared by the whole room.
 */

export function usePriceFeed(symbolId, onTick) {
  const [feed, setFeed] = useState({ status: "loading", candles: [], price: null, source: "demo" });
  const [attempt, setAttempt] = useState(0);
  const priceRef = useRef(null);
  const candlesRef = useRef([]);
  const lastTickRef = useRef(0);
  const driftRef = useRef(0);
  const onTickRef = useRef(onTick);

  useEffect(() => {
    onTickRef.current = onTick;
  });

  const build = useCallback((base, source) => {
    const candles = makeHistory(base);
    candlesRef.current = candles;
    priceRef.current = candles[candles.length - 1].close;
    lastTickRef.current = Date.now();
    setFeed({ status: "ok", candles: candles.slice(), price: priceRef.current, source });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;
    fetchMarkets({ page: 1, perPage: 30, signal: controller.signal })
      .then((data) => {
        if (!alive) return;
        const coin = data.find((c) => c.id === symbolId);
        if (!coin || !Number.isFinite(coin.current_price)) throw new Error("Price not found");
        build(coin.current_price, "coingecko");
      })
      .catch((err) => {
        if (!alive || err.name === "AbortError") return;
        setFeed((f) => ({ ...f, status: "error" }));
      });
    return () => {
      alive = false;
      controller.abort();
    };
  }, [symbolId, attempt, build]);

  const ready = feed.status === "ok";

  useEffect(() => {
    if (!ready) return undefined;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (n % 15 === 1) driftRef.current = (Math.random() - 0.5) * 0.0006;
      const prev = priceRef.current;
      const next = Math.max(prev * (1 + driftRef.current + gauss() * CFG.vol), prev * 0.5);
      priceRef.current = next;
      lastTickRef.current = Date.now();

      const list = candlesRef.current;
      const bucket = Math.floor(Date.now() / 1000 / CFG.candleSeconds) * CFG.candleSeconds;
      const last = list[list.length - 1];
      if (bucket > last.time) {
        list.push({ time: bucket, open: last.close, high: Math.max(last.close, next), low: Math.min(last.close, next), close: next });
      } else {
        last.high = Math.max(last.high, next);
        last.low = Math.min(last.low, next);
        last.close = next;
      }
      if (list.length > CFG.maxCandles) list.splice(0, list.length - CFG.maxCandles);

      setFeed((f) => ({ ...f, candles: list.slice(), price: next }));
      onTickRef.current?.(next, list);
    }, CFG.tickMs);
    return () => clearInterval(id);
  }, [ready]);

  const retry = () => {
    setFeed((f) => ({ ...f, status: "loading" }));
    setAttempt((a) => a + 1);
  };
  const useDemoPrice = () => build(SYMBOLS.find((s) => s.id === symbolId)?.fallback ?? 100, "demo");

  return { ...feed, ready, priceRef, lastTickRef, retry, useDemoPrice };
}

/* ---------- Match summary and review ---------- */

export function buildSummary({ room, acct, samples, maxDd, reason, people }) {
  const pnl = acct.balance - CFG.capital;
  const rows = {};
  for (const p of people) rows[p.name] = { name: p.name, country: p.country, role: roleLabel(p), trades: 0, pnl: 0 };
  for (const t of acct.trades) {
    const row = rows[t.by] ?? (rows[t.by] = { name: t.by, country: "", role: "Trader", trades: 0, pnl: 0 });
    row.trades += 1;
    row.pnl += t.pnl;
  }
  return {
    id: `m_${Date.now()}`,
    at: Date.now(),
    code: room.code,
    symbol: room.symbol,
    players: room.players,
    minutes: room.minutes,
    reason,
    capital: CFG.capital,
    endBalance: acct.balance,
    pnl,
    pnlPct: (pnl / CFG.capital) * 100,
    maxDd,
    trades: acct.trades,
    equity: samples,
    people: Object.values(rows),
    demo: DEMO_MODE,
  };
}

export function matchStats(m) {
  const n = m.trades.length;
  const wins = m.trades.filter((t) => t.pnl > 0);
  const losses = m.trades.filter((t) => t.pnl < 0);
  const gross = wins.reduce((s, t) => s + t.pnl, 0);
  const lost = Math.abs(losses.reduce((s, t) => s + t.pnl, 0));
  const withTp = m.trades.filter((t) => t.tpMult);
  return {
    n,
    winRate: n ? wins.length / n : 0,
    avgR: withTp.length ? withTp.reduce((s, t) => s + t.tpMult, 0) / withTp.length : 0,
    profitFactor: lost > 0 ? gross / lost : gross > 0 ? Infinity : 0,
    best: n ? Math.max(...m.trades.map((t) => t.pnl)) : 0,
    worst: n ? Math.min(...m.trades.map((t) => t.pnl)) : 0,
  };
}

export function insightsFor(m, s) {
  const tips = [];
  if (s.n === 0) return ["No trades were placed. Try one small trade with a stop-loss to practise the full flow."];
  if (m.maxDd >= CFG.maxDrawdown * 0.66) {
    tips.push(`You used ${((m.maxDd / CFG.maxDrawdown) * 100).toFixed(0)}% of the drawdown limit. A smaller risk per trade keeps you in the match longer.`);
  }
  if (s.avgR > 0 && s.avgR < 1.5) tips.push(`Your average planned reward was ${s.avgR.toFixed(1)}R. Try a take-profit at 2R or more.`);
  if (s.n >= 3 && s.winRate < 0.4) tips.push(`Win rate was ${(s.winRate * 100).toFixed(0)}%. Fewer, more patient entries may help.`);
  if (tips.length === 0) tips.push("Good discipline: every trade had a stop-loss, and risk stayed inside the limit.");
  return tips.slice(0, 3);
}