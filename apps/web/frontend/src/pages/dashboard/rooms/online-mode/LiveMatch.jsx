import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import * as LWC from "lightweight-charts";
import { AlertCircle, Check, LogOut, Maximize2, Minus, Plus, RefreshCw, X } from "lucide-react";

import { fetchMarkets } from "../../../../services/cryptoMarketAPI";


/* ---------- Config: change values here ---------- */

const ROUTES = { setup: "/dashboard/rooms/online", home: "/dashboard" };

// No backend yet: opponent and price movement are simulated and labelled as such.
const DEMO_MODE = true;
// "live" shows the opponent's P&L during the match, "hidden" shows it only after the match.
const OPPONENT_PNL = "live";

const PROFILE = { rating: 1200 };
const START_CAPITAL = 10000;
const MAX_TRADES = 10;
const MAX_DRAWDOWN = 0.03;
const MAX_LEVERAGE = 5;
const SLIPPAGE = 0.0001;
const RISK_OPTIONS = [0.0025, 0.005, 0.01];
const TP_OPTIONS = [null, 1, 2, 3];
const STOP_PRESETS = [
  { label: "Tight", pct: 0.1 },
  { label: "Normal", pct: 0.25 },
  { label: "Wide", pct: 0.5 },
];
const STOP_MIN = 0.02;
const STOP_MAX = 5;
const STOP_STEP = 0.05;

const CANDLE_SECONDS = 5;
const HISTORY_CANDLES = 120;
const MAX_CANDLES = 600;
const TICK_MS = 1000;
const VOL = 0.0005;
const STALL_MS = 5000;
const START_COUNTDOWN = 3;

const EMOTES = ["GG", "🔥", "😮", "😬", "👏", "😎"];
const EMOTE_COOLDOWN_MS = 3000;

const SCORE = { rr: 40, consistency: 30, profit: 30, rrCap: 3, profitTargetPct: 2, penalty: 25 };
const BOT = { fast: 5, slow: 15, stopFrac: 0.0025, tpMult: 2, riskFrac: 0.005, cooldownMs: 10000 };

const SYMBOLS = { bitcoin: "BTC", ethereum: "ETH", solana: "SOL", dogecoin: "DOGE", ripple: "XRP", binancecoin: "BNB" };
const FALLBACK_PRICES = { bitcoin: 80700, ethereum: 2377, solana: 102, dogecoin: 0.078, ripple: 1.29, binancecoin: 738 };

const REASONS = {
  time: "Time is up",
  forfeit: "You forfeited the match",
  "drawdown-you": "You breached the 3% max drawdown",
  "drawdown-bot": "The opponent breached the max drawdown",
};

/* ---------- Helpers ---------- */

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const pad = (n) => String(n).padStart(2, "0");
const gauss = () => Math.sqrt(-2 * Math.log(1 - Math.random())) * Math.cos(2 * Math.PI * Math.random());

const moneyFmt = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const priceHi = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const priceLo = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

const fmtPrice = (v) => (Number.isFinite(v) ? (v < 1 ? priceLo : priceHi).format(v) : "—");
const fmtMoney = (v, signed = false) =>
  Number.isFinite(v) ? `${signed && v > 0 ? "+" : ""}${moneyFmt.format(v)}` : "—";
const fmtPct = (v) => (Number.isFinite(v) ? `${v > 0 ? "+" : ""}${v.toFixed(2)}%` : "—");
const fmtSize = (v) => (Number.isFinite(v) ? v.toFixed(v < 1 ? 6 : v < 100 ? 4 : 2) : "—");
const clock = (ms) => {
  const s = Math.ceil(ms / 1000);
  return `${pad(Math.floor(s / 60))}:${pad(s % 60)}`;
};
const tone = (v) => (v > 0 ? "text-emerald-400" : v < 0 ? "text-red-400" : "text-zinc-300");

function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = [];
  let prev = 0;
  values.forEach((v, i) => {
    prev = i === 0 ? v : v * k + prev * (1 - k);
    out.push(prev);
  });
  return out;
}

function smaSeries(values, period) {
  const out = [];
  let sum = 0;
  values.forEach((v, i) => {
    sum += v;
    if (i >= period) sum -= values[i - period];
    out.push(i >= period - 1 ? sum / period : null);
  });
  return out;
}

/* ---------- Order engine (pure functions) ---------- */

const newAccount = () => ({ balance: START_CAPITAL, position: null, trades: [], opened: 0 });

const pnlOf = (pos, price) => (pos.side === "buy" ? (price - pos.entry) * pos.size : (pos.entry - price) * pos.size);

const equityOf = (acct, price) =>
  acct.balance + (acct.position && Number.isFinite(price) ? pnlOf(acct.position, price) : 0);

const drawdownOf = (equity) => Math.max(0, (START_CAPITAL - equity) / START_CAPITAL);

function computeOrder({ balance, price, side, stopFrac, riskFrac, tpMult }) {
  if (!Number.isFinite(price) || !(stopFrac > 0) || !(balance > 0)) return null;
  const entry = side === "buy" ? price * (1 + SLIPPAGE) : price * (1 - SLIPPAGE);
  const dist = entry * stopFrac;
  const stop = side === "buy" ? entry - dist : entry + dist;
  let size = (balance * riskFrac) / dist;
  const maxSize = (balance * MAX_LEVERAGE) / entry;
  const capped = size > maxSize;
  if (capped) size = maxSize;
  const tp = tpMult ? (side === "buy" ? entry + dist * tpMult : entry - dist * tpMult) : null;
  return { side, entry, stop, tp, size, riskAmount: size * dist, notional: size * entry, capped, tpMult: tpMult ?? null };
}

const openPosition = (acct, order, now) => ({ ...acct, opened: acct.opened + 1, position: { ...order, openedAt: now } });

function closePosition(acct, exit, reason, now) {
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
  };
  return { ...acct, balance: acct.balance + pnl, position: null, trades: [...acct.trades, trade] };
}

function marketExit(acct, price, reason, now) {
  const pos = acct.position;
  if (!pos) return acct;
  const exit = pos.side === "buy" ? price * (1 - SLIPPAGE) : price * (1 + SLIPPAGE);
  return closePosition(acct, exit, reason, now);
}

function checkExits(acct, price, now) {
  const pos = acct.position;
  if (!pos) return acct;
  const long = pos.side === "buy";
  if (long ? price <= pos.stop : price >= pos.stop) return closePosition(acct, price, "stop-loss", now);
  if (pos.tp && (long ? price >= pos.tp : price <= pos.tp)) return closePosition(acct, pos.tp, "take-profit", now);
  return acct;
}

function getBlockers({ phase, acct, price, stopPct }) {
  const out = [];
  if (phase === "ended") out.push("Match ended");
  else if (phase !== "running") out.push("Match has not started");
  if (!Number.isFinite(price)) out.push("Waiting for price");
  if (!(stopPct >= STOP_MIN && stopPct <= STOP_MAX)) out.push(`Set a stop-loss between ${STOP_MIN}% and ${STOP_MAX}%`);
  if (acct.position) out.push("Close your open position first");
  if (acct.opened >= MAX_TRADES) out.push(`Trade limit reached (${MAX_TRADES})`);
  return out;
}

/** Simulated opponent: EMA cross on completed candles. It never sees future prices. */
function botStep(acct, candles, price, now, evalRef) {
  if (acct.position || acct.opened >= MAX_TRADES) return acct;
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
  return order ? openPosition(acct, order, now) : acct;
}

/* ---------- Scoring ---------- */

function computeScore(acct, breach) {
  const n = acct.trades.length;
  const pnl = acct.balance - START_CAPITAL;
  const pnlPct = (pnl / START_CAPITAL) * 100;
  const penalty = breach ? SCORE.penalty : 0;
  if (n === 0) return { n, pnl, pnlPct, winRate: 0, rr: 0, cons: 0, profit: 0, penalty, total: 0 };

  const avgRR = acct.trades.reduce((sum, t) => sum + (t.tpMult ?? 1), 0) / n;
  const wins = acct.trades.filter((t) => t.pnl > 0).length;
  const blown = acct.trades.filter((t) => t.pnl < 0 && Math.abs(t.pnl) > t.riskAmount * 1.25).length;
  const winRate = wins / n;
  const rr = clamp(avgRR / SCORE.rrCap, 0, 1) * SCORE.rr;
  const cons = (0.5 * winRate + 0.5 * (1 - blown / n)) * SCORE.consistency;
  const profit = clamp(pnlPct / SCORE.profitTargetPct, 0, 1) * SCORE.profit;
  return { n, pnl, pnlPct, winRate, rr, cons, profit, penalty, total: Math.max(0, rr + cons + profit - penalty) };
}

function buildResult(you, bot, reason) {
  const s = computeScore(you, reason === "drawdown-you");
  const b = computeScore(bot, reason === "drawdown-bot");

  let outcome;
  if (reason === "forfeit" || reason === "drawdown-you") outcome = "loss";
  else if (reason === "drawdown-bot") outcome = "win";
  else if (Math.abs(s.total - b.total) > 0.05) outcome = s.total > b.total ? "win" : "loss";
  else outcome = s.pnl > b.pnl ? "win" : s.pnl < b.pnl ? "loss" : "draw";

  const magnitude = Math.round(clamp(Math.abs(s.total - b.total) * 1.2 + 20, 10, 100));
  const ratingDelta = outcome === "draw" ? 0 : outcome === "win" ? magnitude : -magnitude;

  let why = "Higher score wins, not only higher profit.";
  if (reason === "time") {
    if (outcome === "win" && s.pnl < b.pnl) why = "You won with less profit: your risk-reward and consistency scored higher.";
    else if (outcome === "loss" && s.pnl > b.pnl) why = "You made more profit, but the opponent scored higher on risk-reward and consistency.";
  }
  return { outcome, reasonText: REASONS[reason] ?? "", why, you: s, bot: b, ratingDelta };
}

/* ---------- Price feed (simulated) ---------- */

function makeHistory(base) {
  const closes = new Array(HISTORY_CANDLES);
  closes[HISTORY_CANDLES - 1] = base;
  const vol = VOL * Math.sqrt(CANDLE_SECONDS);
  for (let i = HISTORY_CANDLES - 2; i >= 0; i -= 1) closes[i] = closes[i + 1] / (1 + gauss() * vol);

  const t0 = Math.floor(Date.now() / 1000 / CANDLE_SECONDS) * CANDLE_SECONDS;
  return closes.map((close, i) => {
    const open = i === 0 ? close : closes[i - 1];
    const spread = Math.abs(gauss()) * vol * 0.5;
    return {
      time: t0 - (HISTORY_CANDLES - i) * CANDLE_SECONDS,
      open,
      close,
      high: Math.max(open, close) * (1 + spread),
      low: Math.min(open, close) * (1 - spread),
    };
  });
}

/**
 * Starts from the real CoinGecko price, then simulates movement tick by tick.
 * TODO(backend): replace the interval below with a WebSocket price stream.
 */
function usePriceFeed(symbol, onTick) {
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

  const build = useCallback((base, source, status) => {
    const candles = makeHistory(base);
    candlesRef.current = candles;
    priceRef.current = candles[candles.length - 1].close;
    lastTickRef.current = Date.now();
    setFeed({ status, candles: candles.slice(), price: priceRef.current, source });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    let alive = true;

    fetchMarkets({ page: 1, perPage: 30, signal: controller.signal })
      .then((data) => {
        if (!alive) return;
        const coin = data.find((c) => c.id === symbol);
        if (!coin || !Number.isFinite(coin.current_price)) throw new Error("Price not found");
        build(coin.current_price, "coingecko", "ok");
      })
      .catch((err) => {
        if (!alive || err.name === "AbortError") return;
        setFeed((f) => ({ ...f, status: "error" }));
      });

    return () => {
      alive = false;
      controller.abort();
    };
  }, [symbol, attempt, build]);

  const ready = feed.status === "ok" || feed.status === "fallback";

  useEffect(() => {
    if (!ready) return undefined;
    let n = 0;
    const id = setInterval(() => {
      n += 1;
      if (n % 15 === 1) driftRef.current = (Math.random() - 0.5) * 0.0006;
      const prev = priceRef.current;
      const next = Math.max(prev * (1 + driftRef.current + gauss() * VOL), prev * 0.5);
      priceRef.current = next;
      lastTickRef.current = Date.now();

      const list = candlesRef.current;
      const bucket = Math.floor(Date.now() / 1000 / CANDLE_SECONDS) * CANDLE_SECONDS;
      const last = list[list.length - 1];
      if (bucket > last.time) {
        list.push({ time: bucket, open: last.close, high: Math.max(last.close, next), low: Math.min(last.close, next), close: next });
      } else {
        last.high = Math.max(last.high, next);
        last.low = Math.min(last.low, next);
        last.close = next;
      }
      if (list.length > MAX_CANDLES) list.splice(0, list.length - MAX_CANDLES);

      setFeed((f) => ({ ...f, candles: list.slice(), price: next }));
      onTickRef.current?.(next, list);
    }, TICK_MS);
    return () => clearInterval(id);
  }, [ready]);

  const retry = () => {
    setFeed((f) => ({ ...f, status: "loading" }));
    setAttempt((a) => a + 1);
  };
  const continueWithDemo = () => build(FALLBACK_PRICES[symbol] ?? 100, "demo", "fallback");

  return { ...feed, ready, priceRef, lastTickRef, candlesRef, retry, continueWithDemo };
}

/* ---------- Small UI pieces ---------- */

function FlagImg({ code, className = "h-7 w-10" }) {
  const lower = String(code || "us").toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w80/${lower}.png`}
      srcSet={`https://flagcdn.com/w160/${lower}.png 2x`}
      alt=""
      className={`rounded-[3px] object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

function Panel({ title, right, children, className = "" }) {
  return (
    <section className={`lv-panel p-3 ${className}`}>
      {title && (
        <h2 className="mb-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          <span>{title}</span>
          {right}
        </h2>
      )}
      {children}
    </section>
  );
}

function DuelCard({ who, code, name, sub, pnl, pnlPct, hidden, emote }) {
  const mirror = who === "opp";
  return (
    <div className={`lv-panel flex min-w-0 items-center gap-3 p-3 ${mirror ? "flex-row-reverse text-right" : ""}`}>
      {emote && (
        <span key={emote.key} className={`lv-bubble ${mirror ? "right-4" : "left-4"}`}>
          {emote.text}
        </span>
      )}
      <span className="lv-flag-ring shrink-0">
        <span className="flex h-10 w-14 items-center justify-center bg-[#0b0b0b]">
          <FlagImg code={code} className="h-7 w-10" />
        </span>
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate font-mono text-[11px] text-zinc-500">{sub}</p>
      </div>
      <div className={mirror ? "text-left" : "text-right"}>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">P&amp;L</p>
        {hidden ? (
          <p className="font-mono text-lg font-bold text-zinc-500">Trading...</p>
        ) : (
          <p
            key={Math.round(pnl / 5)}
            className={`font-mono text-2xl font-bold leading-7 tabular-nums ${tone(pnl)} ${
              pnl > 0 ? "lv-flash-up" : pnl < 0 ? "lv-flash-down" : ""
            }`}
          >
            {fmtMoney(pnl, true)}
          </p>
        )}
        <p className={`font-mono text-[11px] ${hidden ? "text-zinc-600" : tone(pnl)}`}>{hidden ? "hidden" : fmtPct(pnlPct)}</p>
      </div>
    </div>
  );
}

function TimerRing({ remaining, total, label }) {
  const circumference = 2 * Math.PI * 44;
  const fraction = total > 0 ? clamp(remaining / total, 0, 1) : 0;
  const urgent = remaining > 0 && remaining <= 10000;
  return (
    <div role="timer" aria-label={`${clock(remaining)} left`} className={`relative size-28 shrink-0 text-orange-400 ${urgent ? "lv-urgent" : ""}`}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          className="lv-ring-arc"
          cx="50"
          cy="50"
          r="44"
          fill="none"
          stroke="currentColor"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="lv-time font-mono text-2xl font-bold tabular-nums text-white">{clock(remaining)}</span>
        <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{label}</span>
      </div>
    </div>
  );
}

/* ---------- Chart ---------- */

function addSeries(chart, kind, options) {
  if (typeof chart.addSeries === "function" && LWC[kind]) return chart.addSeries(LWC[kind], options); // v5
  return kind === "CandlestickSeries" ? chart.addCandlestickSeries(options) : chart.addLineSeries(options); // v4
}

function PriceChart({ candles, position, showEma, showSma, fitKey }) {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const emaRef = useRef(null);
  const smaRef = useRef(null);
  const linesRef = useRef([]);
  const initRef = useRef(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;

    const chart = LWC.createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#a1a1aa",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
      },
      grid: { vertLines: { color: "rgba(255,255,255,0.04)" }, horzLines: { color: "rgba(255,255,255,0.04)" } },
      crosshair: {
        mode: LWC.CrosshairMode.Normal,
        vertLine: { color: "rgba(249,115,22,0.6)", labelBackgroundColor: "#f97316" },
        horzLine: { color: "rgba(249,115,22,0.6)", labelBackgroundColor: "#f97316" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true, secondsVisible: true },
    });

    const lineOptions = { visible: false, priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false };
    seriesRef.current = addSeries(chart, "CandlestickSeries", {
      upColor: "#34d399",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
    });
    emaRef.current = addSeries(chart, "LineSeries", { ...lineOptions, color: "#fb923c", lineWidth: 2 });
    smaRef.current = addSeries(chart, "LineSeries", { ...lineOptions, color: "#e4e4e7", lineWidth: 1 });
    chartRef.current = chart;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) chart.applyOptions({ width, height });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      emaRef.current = null;
      smaRef.current = null;
      linesRef.current = [];
      initRef.current = false;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || candles.length === 0) return;

    if (!initRef.current) {
      const p = candles[candles.length - 1].close;
      series.applyOptions({ priceFormat: { type: "price", precision: p < 1 ? 6 : 2, minMove: p < 1 ? 0.000001 : 0.01 } });
      series.setData(candles);
      chartRef.current?.timeScale().fitContent();
      initRef.current = true;
    } else {
      series.update(candles[candles.length - 1]);
    }

    const closes = candles.map((c) => c.close);
    const toLine = (values) =>
      candles.map((c, i) => ({ time: c.time, value: values[i] })).filter((d) => d.value != null);
    emaRef.current?.setData(toLine(emaSeries(closes, 20)));
    smaRef.current?.setData(toLine(smaSeries(closes, 50)));
  }, [candles]);

  useEffect(() => {
    emaRef.current?.applyOptions({ visible: showEma });
  }, [showEma]);

  useEffect(() => {
    smaRef.current?.applyOptions({ visible: showSma });
  }, [showSma]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    for (const line of linesRef.current) {
      try {
        series.removePriceLine(line);
      } catch {
        // The chart was already disposed.
      }
    }
    linesRef.current = [];
    if (!position) return;

    const make = (price, color, title, dashed) =>
      series.createPriceLine({
        price,
        color,
        lineWidth: 1,
        lineStyle: dashed ? LWC.LineStyle.Dashed : LWC.LineStyle.Solid,
        axisLabelVisible: true,
        title,
      });
    linesRef.current.push(make(position.entry, "#f97316", "ENTRY", false), make(position.stop, "#f87171", "SL", true));
    if (position.tp) linesRef.current.push(make(position.tp, "#34d399", "TP", true));
  }, [position]);

  useEffect(() => {
    if (fitKey > 0) chartRef.current?.timeScale().fitContent();
  }, [fitKey]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={boxRef} className="absolute inset-0" />
    </div>
  );
}

/* ---------- Right panel ---------- */

function Meter({ value }) {
  const used = clamp(value / MAX_DRAWDOWN, 0, 1);
  const color = used < 0.5 ? "bg-emerald-400" : used < 0.8 ? "bg-orange-400" : "bg-red-500";
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] text-zinc-500">
        <span>Drawdown</span>
        <span className={used >= 0.8 ? "text-red-400" : ""}>
          {(value * 100).toFixed(2)}% / {(MAX_DRAWDOWN * 100).toFixed(2)}%
        </span>
      </div>
      <div className="mt-1 h-1.5 bg-white/8">
        <div className={`lv-dd ${color} h-full`} style={{ width: `${used * 100}%` }} />
      </div>
    </div>
  );
}

function AccountPanel({ acct, price }) {
  const equity = equityOf(acct, price);
  const realised = acct.balance - START_CAPITAL;
  const unrealised = acct.position ? pnlOf(acct.position, price) : 0;
  const cell = (label, value, colored) => (
    <div>
      <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`font-mono text-sm font-semibold tabular-nums ${colored ? tone(value) : "text-white"}`}>
        {colored ? fmtMoney(value, true) : fmtMoney(value)}
      </p>
    </div>
  );
  return (
    <Panel title="Account" className="shrink-0">
      <div className="grid grid-cols-2 gap-x-3 gap-y-2">
        {cell("Balance", acct.balance)}
        {cell("Equity", equity)}
        {cell("Realised", realised, true)}
        {cell("Unrealised", unrealised, true)}
      </div>
      <div className="mt-3">
        <Meter value={drawdownOf(equity)} />
      </div>
    </Panel>
  );
}

function Ticket({ symbol, phase, acct, price, buy, sell, riskIdx, setRiskIdx, stopText, setStopText, tp, setTp, onTrade }) {
  const stopPct = parseFloat(stopText);
  const blockers = getBlockers({ phase, acct, price, stopPct });
  const blocked = blockers.length > 0;

  const step = (delta) => {
    const base = Number.isFinite(stopPct) ? stopPct : STOP_PRESETS[1].pct;
    setStopText(String(clamp(Math.round((base + delta) * 100) / 100, STOP_MIN, STOP_MAX)));
  };

  const chip = (active) =>
    `border px-2.5 py-1.5 font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
      active ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-400 hover:text-white"
    }`;
  const label = "mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500";

  return (
    <Panel title="Order ticket" className="shrink-0">
      <p className={label}>Risk per trade</p>
      <div className="flex gap-1.5">
        {RISK_OPTIONS.map((r, i) => (
          <button key={r} type="button" aria-pressed={riskIdx === i} onClick={() => setRiskIdx(i)} className={chip(riskIdx === i)}>
            {(r * 100).toFixed(2).replace(/\.?0+$/, "")}%
          </button>
        ))}
      </div>

      <p className={`${label} mt-2.5`}>Stop-loss distance (required)</p>
      <div className="flex items-center gap-1.5">
        <button type="button" aria-label="Tighter stop-loss" onClick={() => step(-STOP_STEP)} className={chip(false)}>
          <Minus size={12} />
        </button>
        <div className="flex h-8 flex-1 items-center border border-white/10 bg-black/40 px-2">
          <input
            value={stopText}
            onChange={(event) => setStopText(event.target.value)}
            inputMode="decimal"
            aria-label="Stop-loss distance in percent"
            className="w-full bg-transparent font-mono text-sm text-white outline-none"
          />
          <span className="font-mono text-xs text-zinc-500">%</span>
        </div>
        <button type="button" aria-label="Wider stop-loss" onClick={() => step(STOP_STEP)} className={chip(false)}>
          <Plus size={12} />
        </button>
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {STOP_PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => setStopText(String(p.pct))} className={`${chip(stopPct === p.pct)} flex-1`}>
            {p.label} {p.pct}%
          </button>
        ))}
      </div>

      <p className={`${label} mt-2.5`}>Take-profit (optional)</p>
      <div className="flex gap-1.5">
        {TP_OPTIONS.map((m) => (
          <button key={m ?? "none"} type="button" aria-pressed={tp === m} onClick={() => setTp(m)} className={`${chip(tp === m)} flex-1`}>
            {m ? `${m}R` : "None"}
          </button>
        ))}
      </div>

      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <div className="flex justify-between"><dt className="text-zinc-500">Size</dt><dd className="text-zinc-200">{buy ? `${fmtSize(buy.size)} ${symbol}` : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Risk</dt><dd className="text-zinc-200">{buy ? fmtMoney(buy.riskAmount) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">R:R</dt><dd className="text-zinc-200">{tp ? `1 : ${tp}` : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Leverage</dt><dd className={buy?.capped ? "text-orange-300" : "text-zinc-200"}>{buy ? `${(buy.notional / acct.balance).toFixed(1)}x${buy.capped ? " cap" : ""}` : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Buy stop</dt><dd className="text-red-300">{buy ? fmtPrice(buy.stop) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Sell stop</dt><dd className="text-red-300">{sell ? fmtPrice(sell.stop) : "—"}</dd></div>
      </dl>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button
          type="button"
          disabled={blocked}
          onClick={() => onTrade("buy")}
          className="lv-buy h-11 bg-emerald-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-35"
        >
          BUY <span className="ml-1 text-[10px] font-normal opacity-70">[B]</span>
        </button>
        <button
          type="button"
          disabled={blocked}
          onClick={() => onTrade("sell")}
          className="lv-sell h-11 bg-red-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-35"
        >
          SELL <span className="ml-1 text-[10px] font-normal opacity-70">[S]</span>
        </button>
      </div>
      <p className={`mt-1.5 min-h-4 font-mono text-[10px] ${blocked ? "text-amber-300" : "text-zinc-600"}`}>
        {blocked ? blockers[0] : "Market order. Fills with small simulated slippage."}
      </p>
    </Panel>
  );
}

function PositionPanel({ acct, price, symbol, onClose, canClose }) {
  const pos = acct.position;
  if (!pos) {
    return (
      <Panel title="Open position" className="shrink-0">
        <p className="font-mono text-[11px] text-zinc-500">No open position. One position at a time.</p>
      </Panel>
    );
  }
  const pnl = pnlOf(pos, price);
  return (
    <Panel
      title="Open position"
      className="shrink-0"
      right={<span className={`px-1.5 py-0.5 text-[10px] ${pos.side === "buy" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>{pos.side.toUpperCase()}</span>}
    >
      <div className="flex items-end justify-between">
        <p className={`font-mono text-xl font-bold tabular-nums ${tone(pnl)}`}>{fmtMoney(pnl, true)}</p>
        <button
          type="button"
          disabled={!canClose}
          onClick={onClose}
          className="border border-white/15 px-3 py-1.5 font-mono text-[11px] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
        >
          Close [X]
        </button>
      </div>
      <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <div className="flex justify-between"><dt className="text-zinc-500">Size</dt><dd className="text-zinc-200">{fmtSize(pos.size)} {symbol}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Now</dt><dd className="text-zinc-200">{fmtPrice(price)}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Entry</dt><dd className="text-zinc-200">{fmtPrice(pos.entry)}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">SL</dt><dd className="text-red-300">{fmtPrice(pos.stop)}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">TP</dt><dd className="text-emerald-300">{pos.tp ? fmtPrice(pos.tp) : "—"}</dd></div>
      </dl>
    </Panel>
  );
}

function RulesLog({ tab, setTab, rules, trades }) {
  const tabClass = (active) =>
    `border-b-2 px-2 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
      active ? "border-orange-500 text-orange-300" : "border-transparent text-zinc-500 hover:text-zinc-300"
    }`;
  const recent = trades.slice(-5).reverse();
  return (
    <Panel className="shrink-0">
      <div className="mb-2 flex gap-3" role="tablist">
        <button type="button" role="tab" aria-selected={tab === "rules"} onClick={() => setTab("rules")} className={tabClass(tab === "rules")}>Rules</button>
        <button type="button" role="tab" aria-selected={tab === "log"} onClick={() => setTab("log")} className={tabClass(tab === "log")}>Trade log</button>
      </div>
      {tab === "rules" ? (
        <ul className="space-y-1.5">
          {rules.map((rule) => (
            <li key={rule.label} className="flex items-center gap-2 font-mono text-[11px]">
              {rule.ok ? <Check size={13} className="shrink-0 text-emerald-400" /> : <X size={13} className="shrink-0 text-red-400" />}
              <span className="text-zinc-300">{rule.label}</span>
              <span className={`ml-auto ${rule.ok ? "text-zinc-500" : "text-red-300"}`}>{rule.note}</span>
            </li>
          ))}
        </ul>
      ) : recent.length === 0 ? (
        <p className="font-mono text-[11px] text-zinc-500">No closed trades yet.</p>
      ) : (
        <ul className="space-y-1">
          {recent.map((t) => (
            <li key={t.id} className="flex items-center gap-2 font-mono text-[11px]">
              <span className={t.side === "buy" ? "text-emerald-300" : "text-red-300"}>{t.side.toUpperCase()}</span>
              <span className="text-zinc-500">{t.reason}</span>
              <span className={`ml-auto tabular-nums ${tone(t.pnl)}`}>{fmtMoney(t.pnl, true)}</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

/* ---------- Overlays ---------- */

function StartOverlay({ feed, count }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/80 backdrop-blur-sm">
      {feed.status === "loading" && (
        <div role="status" className="text-center">
          <RefreshCw size={26} className="mx-auto animate-spin text-orange-500" />
          <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Loading market data</p>
        </div>
      )}
      {feed.status === "error" && (
        <div role="alert" className="lv-panel max-w-sm p-6 text-center">
          <AlertCircle size={22} className="mx-auto text-red-400" />
          <p className="mt-3 text-sm text-zinc-200">Could not load the market price.</p>
          <p className="mt-1 text-xs text-zinc-500">Retry, or continue with a clearly labelled demo price.</p>
          <div className="mt-4 flex justify-center gap-2">
            <button type="button" onClick={feed.retry} className="border border-orange-400 bg-orange-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">Retry</button>
            <button type="button" onClick={feed.continueWithDemo} className="border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-200">Use demo price</button>
          </div>
        </div>
      )}
      {feed.ready && (
        <div className="text-center" role="status">
          <p className="font-mono text-xs uppercase tracking-[0.35em] text-orange-400">Match starts in</p>
          <p key={count} className="lv-count font-mono text-9xl font-bold text-white">{count}</p>
        </div>
      )}
    </div>
  );
}

function TradeTable({ title, trades }) {
  return (
    <div>
      <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">{title}</p>
      {trades.length === 0 ? (
        <p className="font-mono text-[11px] text-zinc-600">No trades</p>
      ) : (
        <ul className="space-y-1">
          {trades.slice(-6).map((t) => (
            <li key={t.id} className="flex items-center gap-2 font-mono text-[11px]">
              <span className={t.side === "buy" ? "text-emerald-300" : "text-red-300"}>{t.side.toUpperCase()}</span>
              <span className="text-zinc-500">{fmtPrice(t.entry)} to {fmtPrice(t.exit)}</span>
              <span className={`ml-auto tabular-nums ${tone(t.pnl)}`}>{fmtMoney(t.pnl, true)}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function ScoreColumn({ title, score, winner }) {
  const row = (label, value) => (
    <div className="flex justify-between font-mono text-[11px]">
      <span className="text-zinc-500">{label}</span>
      <span className="text-zinc-200">{value}</span>
    </div>
  );
  return (
    <div className={`border p-3 ${winner ? "border-orange-500/60 bg-orange-500/6" : "border-white/10"}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-400">{title}</p>
      <p className={`mt-1 font-mono text-xl font-bold ${tone(score.pnl)}`}>{fmtMoney(score.pnl, true)}</p>
      <p className="mb-2 font-mono text-[11px] text-zinc-500">{fmtPct(score.pnlPct)} · {score.n} trades · {Math.round(score.winRate * 100)}% wins</p>
      <div className="space-y-0.5 border-t border-white/10 pt-2">
        {row(`R:R (of ${SCORE.rr})`, score.rr.toFixed(1))}
        {row(`Consistency (of ${SCORE.consistency})`, score.cons.toFixed(1))}
        {row(`Profit (of ${SCORE.profit})`, score.profit.toFixed(1))}
        {score.penalty > 0 && row("Breach penalty", `-${score.penalty}`)}
        <div className="flex justify-between border-t border-white/10 pt-1 font-mono text-sm font-bold">
          <span className="text-zinc-300">Score</span>
          <span className="text-orange-300">{score.total.toFixed(1)}</span>
        </div>
      </div>
    </div>
  );
}

function ResultOverlay({ result, you, bot, onAgain, onHome, againRef }) {
  const title = result.outcome === "win" ? "Victory" : result.outcome === "loss" ? "Defeat" : "Draw";
  const color = result.outcome === "win" ? "text-emerald-400" : result.outcome === "loss" ? "text-red-400" : "text-zinc-200";
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Match result">
      <div className="lv-panel lv-pop my-auto w-full max-w-2xl p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">{result.reasonText}</p>
        <h2 className={`mt-1 font-mono text-4xl font-bold tracking-widest ${color}`}>{title.toUpperCase()}</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">{result.why}</p>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <ScoreColumn title="You" score={result.you} winner={result.outcome === "win"} />
          <ScoreColumn title="Unknown trader" score={result.bot} winner={result.outcome === "loss"} />
        </div>

        <p className="mt-3 border-l-2 border-orange-500/60 pl-3 font-mono text-[11px] leading-5 text-zinc-400">
          Score = R:R {SCORE.rr} + Consistency {SCORE.consistency} + Profit {SCORE.profit}, minus a penalty for a drawdown breach.
          Higher score wins, not just higher profit.
        </p>
        <p className="mt-2 font-mono text-xs text-zinc-300">
          Rating change (demo): <span className={tone(result.ratingDelta)}>{result.ratingDelta > 0 ? "+" : ""}{result.ratingDelta}</span>
        </p>

        <div className="mt-4 grid gap-4 border-t border-white/10 pt-3 sm:grid-cols-2">
          <TradeTable title="Your trades" trades={you.trades} />
          <TradeTable title="Opponent trades (revealed)" trades={bot.trades} />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <button ref={againRef} type="button" onClick={onAgain} className="border border-orange-400 bg-orange-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
            Play again
          </button>
          <button type="button" onClick={onHome} className="border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
            Back to dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

function ForfeitDialog({ onKeep, onForfeit }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4" role="alertdialog" aria-modal="true" aria-label="Forfeit match">
      <div className="lv-panel lv-pop w-full max-w-sm p-5">
        <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">Forfeit this match?</h2>
        <p className="mt-2 text-sm leading-6 text-zinc-400">The match will count as a loss. Open positions are closed at the current price.</p>
        <div className="mt-4 flex gap-2">
          <button type="button" autoFocus onClick={onKeep} className="border border-orange-400 bg-orange-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">Keep playing</button>
          <button type="button" onClick={onForfeit} className="border border-red-500/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-red-300">Forfeit</button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Page ---------- */

function LiveMatch({ setup }) {
  const navigate = useNavigate();
  const [params] = useSearchParams();

  const symbol = setup.symbol;
  const ticker = SYMBOLS[symbol] ?? symbol.toUpperCase();
  const minutes = [1, 3, 5].includes(setup.minutes) ? setup.minutes : 3;
  const total = minutes * 60000;
  const opponent = setup.opponent ?? { country: "US", rating: PROFILE.rating };
  const roomId = params.get("roomId") ?? setup.roomId ?? "rm_demo";

  const [phase, setPhase] = useState("countdown"); // countdown | running | ended
  const [count, setCount] = useState(START_COUNTDOWN);
  const [remaining, setRemaining] = useState(total);
  const [reason, setReason] = useState("");
  const [announce, setAnnounce] = useState("");
  const [stalled, setStalled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const [you, setYou] = useState(newAccount);
  const [bot, setBot] = useState(newAccount);
  const [riskIdx, setRiskIdx] = useState(1);
  const [stopText, setStopText] = useState("0.25");
  const [tp, setTp] = useState(2);
  const [tab, setTab] = useState("rules");
  const [showEma, setShowEma] = useState(true);
  const [showSma, setShowSma] = useState(false);
  const [fitKey, setFitKey] = useState(0);
  const [emotes, setEmotes] = useState({ you: null, opp: null });
  const [cooling, setCooling] = useState(false);

  const phaseRef = useRef("countdown");
  const youRef = useRef(you);
  const botRef = useRef(bot);
  const deadlineRef = useRef(0);
  const announcedRef = useRef(new Set());
  const botEvalRef = useRef(0);
  const botEmoteAtRef = useRef(0);
  const emoteTimerRef = useRef(null);
  const againRef = useRef(null);
  const latest = useRef({});

  const feed = usePriceFeed(symbol, (price, candles) => latest.current.handleTick?.(price, candles));
  const price = feed.price;

  const commitYou = (next) => {
    youRef.current = next;
    setYou(next);
  };
  const commitBot = (next) => {
    botRef.current = next;
    setBot(next);
  };
  const showEmote = (who, text) => setEmotes((prev) => ({ ...prev, [who]: { key: Date.now() + Math.random(), text } }));

  const finish = (why, atPrice) => {
    if (phaseRef.current === "ended") return;
    phaseRef.current = "ended";
    const p = Number.isFinite(atPrice) ? atPrice : feed.priceRef.current;
    const now = Date.now();
    if (Number.isFinite(p)) {
      commitYou(marketExit(youRef.current, p, "match end", now));
      commitBot(marketExit(botRef.current, p, "match end", now));
    }
    setReason(why);
    setPhase("ended");
    setConfirmOpen(false);
    setAnnounce("Match ended");
  };

  const handleTick = (tickPrice, candles) => {
    if (phaseRef.current !== "running") return;
    const now = Date.now();

    const before = youRef.current;
    const afterYou = checkExits(before, tickPrice, now);
    if (afterYou !== before) {
      commitYou(afterYou);
      const closed = afterYou.trades[afterYou.trades.length - 1];
      setAnnounce(`Position closed by ${closed.reason}: ${fmtMoney(closed.pnl, true)}`);
    }

    let nextBot = checkExits(botRef.current, tickPrice, now);
    nextBot = botStep(nextBot, candles, tickPrice, now, botEvalRef);
    if (nextBot !== botRef.current) commitBot(nextBot);

    if (Math.random() < 0.025 && now - botEmoteAtRef.current > 9000) {
      botEmoteAtRef.current = now;
      showEmote("opp", EMOTES[Math.floor(Math.random() * EMOTES.length)]);
    }

    if (drawdownOf(equityOf(youRef.current, tickPrice)) >= MAX_DRAWDOWN) finish("drawdown-you", tickPrice);
    else if (drawdownOf(equityOf(botRef.current, tickPrice)) >= MAX_DRAWDOWN) finish("drawdown-bot", tickPrice);
  };

  const stopPct = parseFloat(stopText);
  const previewBase = { balance: you.balance, price, stopFrac: stopPct / 100, riskFrac: RISK_OPTIONS[riskIdx], tpMult: tp };
  const previewBuy = computeOrder({ ...previewBase, side: "buy" });
  const previewSell = computeOrder({ ...previewBase, side: "sell" });

  const placeOrder = (side) => {
    const acct = youRef.current;
    const livePrice = feed.priceRef.current;
    if (getBlockers({ phase: phaseRef.current, acct, price: livePrice, stopPct }).length > 0) return;
    const order = computeOrder({
      balance: acct.balance,
      price: livePrice,
      side,
      stopFrac: stopPct / 100,
      riskFrac: RISK_OPTIONS[riskIdx],
      tpMult: tp,
    });
    if (!order) return;
    commitYou(openPosition(acct, order, Date.now()));
    setAnnounce(`${side === "buy" ? "Buy" : "Sell"} position opened`);
  };

  const closeNow = () => {
    if (phaseRef.current !== "running" || !youRef.current.position) return;
    const next = marketExit(youRef.current, feed.priceRef.current, "manual", Date.now());
    commitYou(next);
    const closed = next.trades[next.trades.length - 1];
    setAnnounce(`Position closed: ${fmtMoney(closed.pnl, true)}`);
  };

  const sendEmote = (text) => {
    if (cooling || phaseRef.current === "ended") return;
    showEmote("you", text);
    setCooling(true);
    clearTimeout(emoteTimerRef.current);
    emoteTimerRef.current = setTimeout(() => setCooling(false), EMOTE_COOLDOWN_MS);
  };

  useEffect(() => {
    latest.current = { handleTick, finish, placeOrder, closeNow, escape: () => setConfirmOpen(false) };
  });

  useEffect(() => () => clearTimeout(emoteTimerRef.current), []);

  // 3-2-1 countdown, started once the price is ready.
  useEffect(() => {
    if (phase !== "countdown" || !feed.ready) return undefined;
    let n = START_COUNTDOWN;
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCount(n);
        return;
      }
      clearInterval(id);
      deadlineRef.current = Date.now() + total;
      phaseRef.current = "running";
      setRemaining(total);
      setPhase("running");
      setAnnounce("Match started");
    }, 1000);
    return () => clearInterval(id);
  }, [phase, feed.ready, total]);

  // Match timer based on timestamps, so a hidden tab cannot slow it down.
  useEffect(() => {
    if (phase !== "running") return undefined;
    const id = setInterval(() => {
      const now = Date.now();
      const ms = Math.max(0, deadlineRef.current - now);
      setRemaining(ms);
      setStalled(now - feed.lastTickRef.current > STALL_MS);

      const secs = Math.ceil(ms / 1000);
      if ([60, 30, 10].includes(secs) && !announcedRef.current.has(secs)) {
        announcedRef.current.add(secs);
        setAnnounce(`${secs} seconds left`);
      }
      if (ms <= 0) latest.current.finish?.("time");
    }, 250);
    return () => clearInterval(id);
  }, [phase, feed.lastTickRef]);

  useEffect(() => {
    if (phase === "ended") againRef.current?.focus();
  }, [phase]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (key === "escape") latest.current.escape?.();
      else if (key === "b") latest.current.placeOrder?.("buy");
      else if (key === "s") latest.current.placeOrder?.("sell");
      else if (key === "x") latest.current.closeNow?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const result = useMemo(() => (phase === "ended" ? buildResult(you, bot, reason) : null), [phase, you, bot, reason]);

  const youEquity = equityOf(you, price);
  const botEquity = equityOf(bot, price);
  const youPnl = youEquity - START_CAPITAL;
  const botPnl = botEquity - START_CAPITAL;
  const dd = drawdownOf(youEquity);
  const stopOk = Number.isFinite(stopPct) && stopPct >= STOP_MIN && stopPct <= STOP_MAX;
  const rules = [
    { ok: you.position ? true : stopOk, label: "Stop-loss set", note: you.position ? "on position" : stopOk ? `${stopPct}%` : "missing" },
    { ok: !previewBuy || previewBuy.riskAmount <= you.balance * 0.01 + 0.01, label: "Risk within 1%", note: previewBuy ? fmtMoney(previewBuy.riskAmount) : "—" },
    { ok: dd < MAX_DRAWDOWN, label: "Drawdown used", note: `${(dd * 100).toFixed(2)}% of ${MAX_DRAWDOWN * 100}%` },
    { ok: you.opened < MAX_TRADES, label: "Trades used", note: `${you.opened} of ${MAX_TRADES}` },
  ];

  const running = phase === "running";
  const sourceLabel = feed.source === "coingecko" ? "Sim feed · CoinGecko base" : "Demo price";

  return (
    <main className="lv-root flex h-dvh flex-col overflow-hidden text-zinc-100 max-lg:h-auto max-lg:min-h-dvh max-lg:overflow-visible">
      <p className="sr-only" aria-live="polite">{announce}</p>

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <button
          type="button"
          disabled={phase === "ended"}
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
        >
          <LogOut size={14} />
          Forfeit
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Online mode <span className="text-orange-500">/</span> Live match <span className="ml-2 text-zinc-700">{roomId}</span>
        </p>
        <div className="flex items-center gap-2">
          {DEMO_MODE && (
            <span className="border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
              Demo: simulated opponent and prices
            </span>
          )}
          <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${stalled ? "border-red-500/50 text-red-300" : "border-white/10 text-zinc-400"}`}>
            {stalled ? "Feed stalled" : feed.status === "loading" ? "Connecting" : sourceLabel}
          </span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_340px]">
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 max-md:grid-cols-1 max-md:justify-items-center">
            <div className="w-full">
              <DuelCard who="you" code={setup.country} name="You" sub={`${PROFILE.rating.toLocaleString("en-US")} rating`} pnl={youPnl} pnlPct={(youPnl / START_CAPITAL) * 100} emote={emotes.you} />
            </div>
            <div className="text-center">
              <TimerRing remaining={remaining} total={total} label={`${ticker} · ${minutes} min`} />
            </div>
            <div className="w-full">
              <DuelCard
                who="opp"
                code={opponent.country}
                name="Unknown trader"
                sub={`${Number(opponent.rating).toLocaleString("en-US")} rating`}
                pnl={botPnl}
                pnlPct={(botPnl / START_CAPITAL) * 100}
                hidden={OPPONENT_PNL === "hidden" && phase !== "ended"}
                emote={emotes.opp}
              />
            </div>
          </div>

          <Panel className="flex min-h-0 flex-1 flex-col max-lg:h-96 max-lg:flex-none">
            <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
              <span className="border border-orange-500/50 bg-orange-500/10 px-2 py-1 font-mono text-[11px] text-orange-300">{ticker}/USD</span>
              <span className="font-mono text-lg font-bold tabular-nums text-white">{fmtPrice(price)}</span>
              <span className="font-mono text-[10px] text-zinc-600">{CANDLE_SECONDS}s candles</span>
              <div className="ml-auto flex items-center gap-1.5">
                <button type="button" aria-pressed={showEma} onClick={() => setShowEma((v) => !v)} className={`border px-2 py-1 font-mono text-[10px] ${showEma ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-500"}`}>EMA 20</button>
                <button type="button" aria-pressed={showSma} onClick={() => setShowSma((v) => !v)} className={`border px-2 py-1 font-mono text-[10px] ${showSma ? "border-zinc-300 bg-white/10 text-zinc-100" : "border-white/10 text-zinc-500"}`}>SMA 50</button>
                <button type="button" aria-label="Fit chart" onClick={() => setFitKey((k) => k + 1)} className="border border-white/10 p-1.5 text-zinc-400 transition hover:text-white"><Maximize2 size={12} /></button>
              </div>
            </div>
            <PriceChart candles={feed.candles} position={you.position} showEma={showEma} showSma={showSma} fitKey={fitKey} />
            {stalled && running && (
              <p role="alert" className="mt-2 font-mono text-[11px] text-red-300">Price feed stalled. Orders may fill at an old price.</p>
            )}
          </Panel>

          <div className="lv-panel flex shrink-0 flex-wrap items-center gap-2 px-3 py-2">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Emotes</span>
            {EMOTES.map((e) => (
              <button
                key={e}
                type="button"
                disabled={cooling || phase === "ended"}
                onClick={() => sendEmote(e)}
                aria-label={`Send ${e}`}
                className="h-8 min-w-10 border border-white/10 px-2 text-base transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
              >
                {e}
              </button>
            ))}
            <span className="ml-auto font-mono text-[10px] text-zinc-600">{cooling ? "Cooldown..." : "No text chat in a match"}</span>
          </div>
        </div>

        <aside className="lv-scroll flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
          <AccountPanel acct={you} price={price} />
          <Ticket
            symbol={ticker}
            phase={phase}
            acct={you}
            price={price}
            buy={previewBuy}
            sell={previewSell}
            riskIdx={riskIdx}
            setRiskIdx={setRiskIdx}
            stopText={stopText}
            setStopText={setStopText}
            tp={tp}
            setTp={setTp}
            onTrade={placeOrder}
          />
          <PositionPanel acct={you} price={price} symbol={ticker} onClose={closeNow} canClose={running} />
          <RulesLog tab={tab} setTab={setTab} rules={rules} trades={you.trades} />
        </aside>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-orange-500/30 bg-[#070707]/95 px-3 py-2 font-mono text-[10px] text-zinc-600">
        <span>Virtual funds only. Educational. Not investment advice. Prices may differ from real markets.</span>
        <span>Charts powered by TradingView Lightweight Charts</span>
      </footer>

      {phase === "countdown" && <StartOverlay feed={feed} count={count} />}
      {confirmOpen && <ForfeitDialog onKeep={() => setConfirmOpen(false)} onForfeit={() => finish("forfeit")} />}
      {result && (
        <ResultOverlay result={result} you={you} bot={bot} againRef={againRef} onAgain={() => navigate(ROUTES.setup)} onHome={() => navigate(ROUTES.home)} />
      )}
    </main>
  );
}

export default function Live() {
  const location = useLocation();
  const setup = location.state;
  if (!setup?.symbol) return <Navigate to={ROUTES.setup} replace />;
  return <LiveMatch setup={setup} />;
}
