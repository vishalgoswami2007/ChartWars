import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as LightweightCharts from "lightweight-charts";
import {
  Activity,
  ArrowLeft,
  Check,
  CircleHelp,
  Flag,
  Maximize2,
  Minus,
  Plus,
  RotateCcw,
  ShieldAlert,
  TrendingDown,
  TrendingUp,
  X,
} from "lucide-react";

import { fetchMarkets } from "../../../../services/cryptoMarketAPI";
import "./Live.css";

/* -------------------------------------------------------------------------- */
/* Configuration                                                              */
/* -------------------------------------------------------------------------- */

const DEMO_MODE = true;
const OPPONENT_PNL = "live"; // "live" | "hidden"

const ROUTES = {
  setup: "/dashboard/rooms/online",
  home: "/dashboard",
};

const STARTING_CAPITAL = 10_000;
const MAX_RISK_PERCENT = 1;
const MAX_TRADES = 10;
const MAX_DRAWDOWN_PERCENT = 3;
const SLIPPAGE_PERCENT = 0.01;
const CANDLE_SECONDS = 5;
const PRICE_TICK_MS = 1000;
const EMOTE_COOLDOWN_MS = 3000;
const EMOTE_LIFETIME_MS = 2500;

const RISK_OPTIONS = [0.25, 0.5, 1];
const EMOTES = ["GG", "🔥", "😮", "😬", "👏", "😎"];

const SYMBOL_NAMES = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  binancecoin: "BNB",
  ripple: "XRP",
  dogecoin: "DOGE",
  "the-open-network": "TON",
  "avalanche-2": "AVAX",
  "chainlink": "LINK",
  "matic-network": "POL",
};

const DEFAULT_PRICE = 100;

const clamp = (value, min, max) =>
  Math.min(max, Math.max(min, Number.isFinite(Number(value)) ? Number(value) : min));

const safeNumber = (value, fallback = 0) => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const formatMoney = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "—";

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

const formatPrice = (value) => {
  if (!Number.isFinite(value) || value <= 0) return "—";

  const digits = value < 0.01 ? 6 : value < 1 ? 4 : value < 100 ? 3 : 2;

  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value);
};

const formatPercent = (value, digits = 2) => {
  if (!Number.isFinite(value)) return "—";
  return `${value > 0 ? "+" : ""}${value.toFixed(digits)}%`;
};

const formatClock = (seconds) => {
  const total = Math.max(0, Math.ceil(safeNumber(seconds)));
  const minutes = Math.floor(total / 60);
  const remainder = total % 60;

  return `${String(minutes).padStart(2, "0")}:${String(remainder).padStart(2, "0")}`;
};

const getSymbolLabel = (symbol) => {
  if (!symbol) return "ASSET";
  return SYMBOL_NAMES[symbol] || symbol.replace(/-/g, " ").toUpperCase();
};

const getCountryName = (code) => {
  if (!code) return "Unknown country";

  try {
    return new Intl.DisplayNames(["en"], { type: "region" }).of(
      String(code).toUpperCase(),
    ) || String(code).toUpperCase();
  } catch {
    return String(code).toUpperCase();
  }
};

const getMarketPrice = (payload, symbol) => {
  const rows = Array.isArray(payload)
    ? payload
    : payload?.data || payload?.coins || payload?.markets || [];

  if (Array.isArray(rows)) {
    const match = rows.find(
      (item) =>
        item?.id === symbol ||
        item?.coinId === symbol ||
        item?.symbol?.toLowerCase() === symbol?.toLowerCase(),
    );

    const price = safeNumber(
      match?.current_price ??
        match?.currentPrice ??
        match?.price ??
        match?.market_data?.current_price?.usd,
      NaN,
    );

    if (Number.isFinite(price) && price > 0) return price;
  }

  if (!Array.isArray(payload) && payload && typeof payload === "object") {
    const match = payload[symbol];
    const price = safeNumber(
      match?.current_price ?? match?.currentPrice ?? match?.price,
      NaN,
    );

    if (Number.isFinite(price) && price > 0) return price;
  }

  return null;
};

const createCandle = (time, open, close, volatility = 0.001) => {
  const spread = Math.max(Math.abs(close) * volatility, 0.000001);

  return {
    time,
    open,
    high: Math.max(open, close) + Math.random() * spread,
    low: Math.max(0.000001, Math.min(open, close) - Math.random() * spread),
    close,
  };
};

const makeHistory = (basePrice, count = 120) => {
  const now = Math.floor(Date.now() / 1000);
  const start = now - count * CANDLE_SECONDS;
  let previous = basePrice;

  return Array.from({ length: count }, (_, index) => {
    const open = previous;
    const change = (Math.random() - 0.5) * basePrice * 0.006;
    const close = Math.max(0.000001, open + change);
    const candle = createCandle(
      start + index * CANDLE_SECONDS,
      open,
      close,
      0.002,
    );

    previous = close;
    return candle;
  });
};

const calcEma = (candles, period) => {
  const multiplier = 2 / (period + 1);
  let ema = null;

  return candles.map((candle) => {
    ema = ema === null
      ? candle.close
      : candle.close * multiplier + ema * (1 - multiplier);

    return { time: candle.time, value: ema };
  });
};

const calcSma = (candles, period) =>
  candles
    .map((candle, index) => {
      if (index + 1 < period) return null;

      const slice = candles.slice(index + 1 - period, index + 1);
      const value = slice.reduce((sum, item) => sum + item.close, 0) / period;

      return { time: candle.time, value };
    })
    .filter(Boolean);

const calculatePositionPnl = (position, price) => {
  if (!position || !Number.isFinite(price)) return 0;

  const direction = position.side === "BUY" ? 1 : -1;
  return (price - position.entry) * position.size * direction;
};

const computeScore = ({
  pnl,
  startingCapital,
  closedTrades,
  plannedRRs,
  ruleViolations,
  drawdownBreached,
}) => {
  const wins = closedTrades.filter((trade) => trade.pnl > 0).length;
  const winRate = closedTrades.length ? wins / closedTrades.length : 0;
  const averageRR = plannedRRs.length
    ? plannedRRs.reduce((sum, rr) => sum + rr, 0) / plannedRRs.length
    : 0;

  const riskRewardPoints = (clamp(averageRR, 0, 3) / 3) * 40;
  const compliance = clamp(1 - ruleViolations / MAX_TRADES, 0, 1);
  const consistencyPoints = (winRate * 0.7 + compliance * 0.3) * 30;
  const profitPercent = (pnl / startingCapital) * 100;
  const profitPoints = (clamp(profitPercent, 0, 10) / 10) * 30;
  const penalty = drawdownBreached ? 25 : 0;

  return {
    total: Math.round(
      clamp(riskRewardPoints + consistencyPoints + profitPoints - penalty, 0, 100),
    ),
    riskReward: Math.round(riskRewardPoints),
    consistency: Math.round(consistencyPoints),
    profit: Math.round(profitPoints),
    penalty,
    winRate: winRate * 100,
    averageRR,
    profitPercent,
  };
};

/* -------------------------------------------------------------------------- */
/* Simulated price feed                                                        */
/* -------------------------------------------------------------------------- */

function usePriceFeed(symbol, candleSeconds) {
  const [feed, setFeed] = useState({
    candles: [],
    price: null,
    status: "loading",
    isFallback: false,
    error: "",
  });

  const seedRef = useRef(0);

  const loadHistory = useCallback(async () => {
    setFeed((current) => ({
      ...current,
      status: "loading",
      error: "",
    }));

    try {
      const response = await fetchMarkets();
      const fetchedPrice = getMarketPrice(response, symbol);
      const base = fetchedPrice || DEFAULT_PRICE;
      const candles = makeHistory(base);

      seedRef.current = base;

      setFeed({
        candles,
        price: candles[candles.length - 1]?.close ?? base,
        status: "connected",
        isFallback: !fetchedPrice,
        error: "",
      });
    } catch {
      const fallback = seedRef.current || DEFAULT_PRICE;
      const candles = makeHistory(fallback);

      setFeed({
        candles,
        price: candles[candles.length - 1]?.close ?? fallback,
        status: "demo",
        isFallback: true,
        error: "",
      });
    }
  }, [symbol]);

  useEffect(() => {
    let mounted = true;
    let timerId;

    const start = async () => {
      try {
        const response = await fetchMarkets();
        if (!mounted) return;

        const fetchedPrice = getMarketPrice(response, symbol);
        const base = fetchedPrice || DEFAULT_PRICE;
        const candles = makeHistory(base);

        seedRef.current = base;

        setFeed({
          candles,
          price: candles[candles.length - 1]?.close ?? base,
          status: "connected",
          isFallback: !fetchedPrice,
          error: "",
        });
      } catch {
        if (!mounted) return;

        const base = seedRef.current || DEFAULT_PRICE;
        const candles = makeHistory(base);

        setFeed({
          candles,
          price: candles[candles.length - 1]?.close ?? base,
          status: "demo",
          isFallback: true,
          error: "",
        });
      }

      if (!mounted) return;

      timerId = window.setInterval(() => {
        if (!mounted) return;

        setFeed((current) => {
          if (!current.candles.length || !Number.isFinite(current.price)) {
            return current;
          }

          const previousPrice = current.price;
          const volatility = Math.max(previousPrice * 0.0007, 0.000001);
          const nextPrice = Math.max(
            0.000001,
            previousPrice + (Math.random() - 0.49) * volatility,
          );

          const now = Math.floor(Date.now() / 1000);
          const bucket = Math.floor(now / candleSeconds) * candleSeconds;
          const candles = [...current.candles];
          const last = candles[candles.length - 1];

          if (last.time === bucket) {
            candles[candles.length - 1] = {
              ...last,
              high: Math.max(last.high, nextPrice),
              low: Math.min(last.low, nextPrice),
              close: nextPrice,
            };
          } else {
            candles.push({
              time: bucket,
              open: last.close,
              high: Math.max(last.close, nextPrice),
              low: Math.min(last.close, nextPrice),
              close: nextPrice,
            });
          }

          if (candles.length > 240) candles.shift();

          return {
            ...current,
            candles,
            price: nextPrice,
            status: "connected",
          };
        });
      }, PRICE_TICK_MS);

      // TODO(backend): Replace the simulated interval with a WebSocket market feed.
    };

    void start();

    return () => {
      mounted = false;
      if (timerId) window.clearInterval(timerId);
    };
  }, [symbol, candleSeconds]);

  return {
    ...feed,
    retry: loadHistory,
  };
}

/* -------------------------------------------------------------------------- */
/* Small presentational helpers                                                */
/* -------------------------------------------------------------------------- */

function CornerPanel({ children, className = "", title, right }) {
  return (
    <section className={`lv-panel ${className}`}>
      <span aria-hidden="true" className="lv-corner lv-corner-tl" />
      <span aria-hidden="true" className="lv-corner lv-corner-br" />

      {(title || right) && (
        <div className="mb-3 flex items-center justify-between gap-3">
          {title && (
            <h2 className="text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-400">
              {title}
            </h2>
          )}
          {right}
        </div>
      )}

      {children}
    </section>
  );
}

function CountryFlag({ country, className = "" }) {
  const [failed, setFailed] = useState(false);
  const code = String(country || "").toLowerCase();

  if (!code || failed) {
    return (
      <span
        className={`flex size-8 items-center justify-center border border-white/10 bg-white/5 text-[10px] font-bold text-zinc-400 ${className}`}
        aria-label={getCountryName(country)}
      >
        {code ? code.toUpperCase() : "??"}
      </span>
    );
  }

  return (
    <img
      src={`https://flagcdn.com/w80/${code}.png`}
      alt={`${getCountryName(country)} flag`}
      className={`size-8 border border-white/10 object-cover ${className}`}
      onError={() => setFailed(true)}
    />
  );
}

function Metric({ label, value, tone = "normal" }) {
  const color = {
    normal: "text-white",
    positive: "text-emerald-300",
    negative: "text-red-300",
    orange: "text-orange-300",
    muted: "text-zinc-500",
  }[tone];

  return (
    <div className="flex items-center justify-between gap-3 py-1.5">
      <span className="text-[10px] text-zinc-500">{label}</span>
      <span className={`font-mono text-xs tabular-nums ${color}`}>{value}</span>
    </div>
  );
}


/* -------------------------------------------------------------------------- */
/* Live match                                                                  */
/* -------------------------------------------------------------------------- */

export default function Live() {
  const location = useLocation();
  const navigate = useNavigate();
  const setup = location.state;

  const validSetup =
    setup &&
    typeof setup.symbol === "string" &&
    [1, 3, 5].includes(Number(setup.minutes));

  const symbol = validSetup ? setup.symbol : "bitcoin";
  const symbolLabel = getSymbolLabel(symbol);
  const matchMinutes = validSetup ? Number(setup.minutes) : 3;
  const roomId = validSetup ? setup.roomId || "rm_demo" : "rm_demo";
  const opponent = validSetup
    ? setup.opponent || { country: "US", rating: 1000 }
    : { country: "US", rating: 1000 };

  const feed = usePriceFeed(symbol, CANDLE_SECONDS);

  const [chartReady, setChartReady] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [matchStartedAt, setMatchStartedAt] = useState(null);
  const [now, setNow] = useState(0);

        useEffect(() => {
        const updateTime = () => setNow(Date.now());

        updateTime();
        const intervalId = setInterval(updateTime, 1000);

        return () => clearInterval(intervalId);
        }, []);
        
  const [matchEnded, setMatchEnded] = useState(false);
  const [endReason, setEndReason] = useState("");
  const [showForfeitConfirm, setShowForfeitConfirm] = useState(false);

  const [balance, setBalance] = useState(STARTING_CAPITAL);
  const [realisedPnl, setRealisedPnl] = useState(0);
  const [position, setPosition] = useState(null);
  const [tradeLog, setTradeLog] = useState([]);
  const [tradesUsed, setTradesUsed] = useState(0);
  const [riskPercent, setRiskPercent] = useState(0.5);
  const [stopPrice, setStopPrice] = useState("");
  const [takeProfitPrice, setTakeProfitPrice] = useState("");
  const [sideError, setSideError] = useState("");
  const [lastOrderMessage, setLastOrderMessage] = useState("");
  const [plannedRRs, setPlannedRRs] = useState([]);
  const [drawdownBreached, setDrawdownBreached] = useState(false);

  const [opponentBalance, setOpponentBalance] = useState(STARTING_CAPITAL);
  const [opponentRealised, setOpponentRealised] = useState(0);
  const [opponentPosition, setOpponentPosition] = useState(null);
  const [opponentTrades, setOpponentTrades] = useState([]);
  const [opponentLastEmote, setOpponentLastEmote] = useState(null);
  const [userEmote, setUserEmote] = useState(null);
  const [emoteCooldown, setEmoteCooldown] = useState(false);

  const [showEma, setShowEma] = useState(false);
  const [showSma, setShowSma] = useState(false);
  const [chartError, setChartError] = useState("");
  const [isTabHidden, setIsTabHidden] = useState(false);

  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);
  const emaSeriesRef = useRef(null);
  const smaSeriesRef = useRef(null);
  const entryLineRef = useRef(null);
  const stopLineRef = useRef(null);
  const targetLineRef = useRef(null);
  const startedRef = useRef(false);
  const orderLockRef = useRef(false);
  const lastPriceRef = useRef(null);
  const lastBotTradeRef = useRef(0);
  const emoteTimerRef = useRef(null);
  const cooldownTimerRef = useRef(null);
  const startedAtRef = useRef(null);
  const finalisedRef = useRef(false);
  const positionRef = useRef(null);
  const balanceRef = useRef(STARTING_CAPITAL);
  const opponentPositionRef = useRef(null);
  const opponentBalanceRef = useRef(STARTING_CAPITAL);

  
const currentPrice = Number.isFinite(feed.price)
  ? feed.price
  : null;

useEffect(() => {
  lastPriceRef.current = currentPrice;
}, [currentPrice]);

useEffect(() => {
  positionRef.current = position;
}, [position]);

useEffect(() => {
  balanceRef.current = balance;
}, [balance]);

useEffect(() => {
  opponentPositionRef.current = opponentPosition;
}, [opponentPosition]);

useEffect(() => {
  opponentBalanceRef.current = opponentBalance;
}, [opponentBalance]);


  const unrealisedPnl = calculatePositionPnl(position, currentPrice);
  const equity = balance + unrealisedPnl;
  const opponentUnrealised = calculatePositionPnl(opponentPosition, currentPrice);
  const opponentPnl = opponentRealised + opponentUnrealised;
  const userPnl = realisedPnl + unrealisedPnl;
  const userPnlPercent = (userPnl / STARTING_CAPITAL) * 100;
  const opponentPnlPercent = (opponentPnl / STARTING_CAPITAL) * 100;

  const remainingSeconds = matchStartedAt
    ? Math.max(
        0,
        matchMinutes * 60 - Math.floor((now - matchStartedAt) / 1000),
      )
    : matchMinutes * 60;

  const timerProgress = remainingSeconds / (matchMinutes * 60);
  const isCriticalTimer = matchStartedAt && remainingSeconds <= 10;
  const drawdownPercent = Math.max(
    0,
    ((STARTING_CAPITAL - equity) / STARTING_CAPITAL) * 100,
  );
  const drawdownUsed = clamp(
    (drawdownPercent / MAX_DRAWDOWN_PERCENT) * 100,
    0,
    100,
  );

  const plannedStop = safeNumber(stopPrice, NaN);
  const plannedTarget = safeNumber(takeProfitPrice, NaN);
  const stopIsValid =
    currentPrice !== null &&
    Number.isFinite(plannedStop) &&
    plannedStop > 0 &&
    plannedStop !== currentPrice;
  const stopDistance = stopIsValid ? Math.abs(currentPrice - plannedStop) : 0;
  const riskDollars = Math.max(0, balance * (riskPercent / 100));
  const plannedSize = stopDistance > 0 ? riskDollars / stopDistance : 0;
  const targetDistance = Number.isFinite(plannedTarget)
    ? Math.abs(plannedTarget - currentPrice)
    : 0;
  const plannedRR = stopDistance > 0 && targetDistance > 0
    ? targetDistance / stopDistance
    : 0;

  const stopSideValid = (side) => {
    if (!stopIsValid) return false;
    return side === "BUY" ? plannedStop < currentPrice : plannedStop > currentPrice;
  };

  const orderReason = !currentPrice
    ? "Waiting for price feed"
    : matchEnded
      ? "Match has ended"
      : countdown > 0
        ? "Match starts shortly"
        : position
          ? "Close your open position first"
          : tradesUsed >= MAX_TRADES
            ? "Trade limit reached"
            : !stopIsValid
              ? "Set a valid stop-loss"
              : "Ready to trade";

  const userScore = useMemo(
    () =>
      computeScore({
        pnl: userPnl,
        startingCapital: STARTING_CAPITAL,
        closedTrades: tradeLog,
        plannedRRs,
        ruleViolations,
        drawdownBreached,
      }),
    [userPnl, tradeLog, plannedRRs, ruleViolations, drawdownBreached],
  );

  const opponentScore = useMemo(
    () =>
      computeScore({
        pnl: opponentPnl,
        startingCapital: STARTING_CAPITAL,
        closedTrades: opponentTrades,
        plannedRRs: opponentTrades.map((trade) => trade.rr || 0),
        ruleViolations: 0,
        drawdownBreached: false,
      }),
    [opponentPnl, opponentTrades],
  );

  const finishMatch = useCallback(
    (reason) => {
      if (finalisedRef.current) return;
      finalisedRef.current = true;

      const price = lastPriceRef.current;
      const userOpen = positionRef.current;

      if (userOpen && Number.isFinite(price)) {
        const pnl = calculatePositionPnl(userOpen, price);
        const nextBalance = balanceRef.current + pnl;

        setTradeLog((current) => [
          {
            id: `${Date.now()}-final`,
            side: userOpen.side,
            pnl,
            entry: userOpen.entry,
            exit: price,
            reason: reason === "forfeit" ? "forfeit" : "match end",
            rr: userOpen.risk > 0 ? Math.abs(pnl) / userOpen.risk : 0,
          },
          ...current,
        ].slice(0, 5));
        setRealisedPnl((current) => current + pnl);
        setBalance(nextBalance);
        setPosition(null);
        positionRef.current = null;
        balanceRef.current = nextBalance;
      }

      const botOpen = opponentPositionRef.current;

      if (botOpen && Number.isFinite(price)) {
        const pnl = calculatePositionPnl(botOpen, price);
        setOpponentRealised((current) => current + pnl);
        setOpponentBalance((current) => current + pnl);
        setOpponentTrades((current) => [
          ...current,
          {
            id: `${Date.now()}-bot-final`,
            side: botOpen.side,
            pnl,
            entry: botOpen.entry,
            exit: price,
            reason: "match end",
            rr: botOpen.risk > 0 ? Math.abs(pnl) / botOpen.risk : 0,
          },
        ]);
        setOpponentPosition(null);
        opponentPositionRef.current = null;
        opponentBalanceRef.current += pnl;
      }

      setEndReason(reason);
      setMatchEnded(true);
    },
    [],
  );

  const closePosition = useCallback(
    (reason = "manual") => {
      if (matchEnded || !positionRef.current || !Number.isFinite(lastPriceRef.current)) {
        return;
      }

      const open = positionRef.current;
      const price = lastPriceRef.current;
      const pnl = calculatePositionPnl(open, price);
      const nextBalance = balanceRef.current + pnl;
      const rr = open.risk > 0 ? Math.abs(pnl) / open.risk : 0;

      setBalance(nextBalance);
      setRealisedPnl((current) => current + pnl);
      setPosition(null);
      positionRef.current = null;
      balanceRef.current = nextBalance;

      setTradeLog((current) => [
        {
          id: `${Date.now()}-${current.length}`,
          side: open.side,
          pnl,
          entry: open.entry,
          exit: price,
          reason,
          rr,
        },
        ...current,
      ].slice(0, 5));
    },
    [matchEnded],
  );

  const closeOpponentPosition = useCallback(
    (reason = "manual") => {
      const open = opponentPositionRef.current;
      const price = lastPriceRef.current;

      if (!open || !Number.isFinite(price)) return;

      const pnl = calculatePositionPnl(open, price);
      const nextBalance = opponentBalanceRef.current + pnl;

      setOpponentBalance(nextBalance);
      setOpponentRealised((current) => current + pnl);
      setOpponentTrades((current) => [
        {
          id: `${Date.now()}-bot-${current.length}`,
          side: open.side,
          pnl,
          entry: open.entry,
          exit: price,
          reason,
          rr: open.risk > 0 ? Math.abs(pnl) / open.risk : 0,
        },
        ...current,
      ]);
      setOpponentPosition(null);
      opponentPositionRef.current = null;
      opponentBalanceRef.current = nextBalance;
    },
    [],
  );

  const placeOrder = useCallback(
    (side) => {
      if (orderLockRef.current) return;
      orderLockRef.current = true;

      try {
        setSideError("");
        setLastOrderMessage("");

        if (matchEnded || countdown > 0) {
          setSideError("Orders are unavailable until the match starts.");
          return;
        }

        if (!Number.isFinite(lastPriceRef.current)) {
          setSideError("Waiting for a valid market price.");
          return;
        }

        if (positionRef.current) {
          setSideError("Close your current position before opening another.");
          return;
        }

        if (tradesUsed >= MAX_TRADES) {
          setSideError("You have used all 10 trades for this match.");
          return;
        }

        const entryPrice = lastPriceRef.current * (
          side === "BUY"
            ? 1 + SLIPPAGE_PERCENT / 100
            : 1 - SLIPPAGE_PERCENT / 100
        );
        const stop = safeNumber(stopPrice, NaN);
        const target = safeNumber(takeProfitPrice, NaN);

        if (!Number.isFinite(stop) || stop <= 0) {
          setSideError("Stop-loss is required.");
          return;
        }

        if (side === "BUY" && stop >= entryPrice) {
          setSideError("For Buy, stop-loss must be below the entry price.");
          return;
        }

        if (side === "SELL" && stop <= entryPrice) {
          setSideError("For Sell, stop-loss must be above the entry price.");
          return;
        }

        if (riskPercent > MAX_RISK_PERCENT) {
          setSideError("Risk cannot exceed 1% of the current balance.");
          return;
        }

        const distance = Math.abs(entryPrice - stop);
        const risk = balanceRef.current * (riskPercent / 100);
        const size = risk / distance;

        if (!Number.isFinite(size) || size <= 0) {
          setSideError("The position size could not be calculated.");
          return;
        }

        if (Number.isFinite(target)) {
          if (side === "BUY" && target <= entryPrice) {
            setSideError("For Buy, take-profit must be above entry.");
            return;
          }

          if (side === "SELL" && target >= entryPrice) {
            setSideError("For Sell, take-profit must be below entry.");
            return;
          }
        }

        const rr = Number.isFinite(target)
          ? Math.abs(target - entryPrice) / distance
          : 0;

        const open = {
          side,
          entry: entryPrice,
          stop,
          target: Number.isFinite(target) ? target : null,
          size,
          risk,
          rr,
          openedAt: Date.now(),
        };

        setPosition(open);
        positionRef.current = open;
        setTradesUsed((current) => current + 1);
        setPlannedRRs((current) => [...current, rr]);
        setLastOrderMessage(
          `${side} opened at ${formatPrice(entryPrice)}. Slippage included.`,
        );
      } finally {
        orderLockRef.current = false;
      }
    },
    [
      matchEnded,
      countdown,
      tradesUsed,
      stopPrice,
      takeProfitPrice,
      riskPercent,
    ],
  );

  const closeUserPosition = useCallback(() => {
    closePosition("manual");
  }, [closePosition]);

  /* Redirect if this page was opened without the match setup state. */
  useEffect(() => {
    if (!validSetup) {
      navigate(ROUTES.setup, { replace: true });
    }
  }, [validSetup, navigate]);

  /* Countdown overlay, then begin the match using a timestamp. */
  useEffect(() => {
    if (!validSetup || feed.status === "loading" || startedRef.current) return undefined;

    const startTimer = window.setTimeout(() => {
      setCountdown((current) => Math.max(0, current - 1));
    }, 1000);

    if (countdown === 0 && !startedRef.current) {
      startedRef.current = true;
      const start = Date.now();
      startedAtRef.current = start;
      setMatchStartedAt(start);
      setNow(start);
    }

    return () => window.clearTimeout(startTimer);
  }, [validSetup, feed.status, countdown]);

  /* Keep time correct even when the browser tab is backgrounded. */
  useEffect(() => {
    if (!matchStartedAt || matchEnded) return undefined;

    const intervalId = window.setInterval(() => {
      setNow(Date.now());
    }, 200);

    const handleVisibility = () => {
      setIsTabHidden(document.hidden);
      setNow(Date.now());
    };

    document.addEventListener("visibilitychange", handleVisibility);

    return () => {
      window.clearInterval(intervalId);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [matchStartedAt, matchEnded]);

  /* Finish on time, or if the equity drawdown reaches the hard limit. */
  useEffect(() => {
    if (matchEnded || !matchStartedAt) return;

    if (remainingSeconds <= 0) {
      finishMatch("time");
      return;
    }

    if (drawdownPercent >= MAX_DRAWDOWN_PERCENT) {
      setDrawdownBreached(true);
      finishMatch("drawdown");
    }
  }, [
    matchEnded,
    matchStartedAt,
    remainingSeconds,
    drawdownPercent,
    finishMatch,
  ]);

  /* Check user stop-loss and take-profit on every price update. */
  useEffect(() => {
    if (!position || matchEnded || currentPrice === null || !matchStartedAt) return;

    if (
      (position.side === "BUY" && currentPrice <= position.stop) ||
      (position.side === "SELL" && currentPrice >= position.stop)
    ) {
      closePosition("stop-loss");
      return;
    }

    if (
      position.target !== null &&
      ((position.side === "BUY" && currentPrice >= position.target) ||
        (position.side === "SELL" && currentPrice <= position.target))
    ) {
      closePosition("take-profit");
    }
  }, [currentPrice, position, matchEnded, matchStartedAt, closePosition]);

  /* Simple bot: trades only using current and previous observed prices. */
  useEffect(() => {
    if (
      !DEMO_MODE ||
      !matchStartedAt ||
      matchEnded ||
      countdown > 0 ||
      currentPrice === null
    ) {
      return;
    }

    const lastBotAction = lastBotTradeRef.current;

    if (Date.now() - lastBotAction < 9000) return;

    if (opponentPositionRef.current) {
      const open = opponentPositionRef.current;
      const pnl = calculatePositionPnl(open, currentPrice);

      if (
        pnl >= open.risk * 1.2 ||
        pnl <= -open.risk ||
        Date.now() - open.openedAt > 18000
      ) {
        closeOpponentPosition(pnl <= -open.risk ? "stop-loss" : "manual");
        lastBotTradeRef.current = Date.now();
      }
      return;
    }

    if (Math.random() > 0.18) return;

    const side = Math.random() > 0.5 ? "BUY" : "SELL";
    const risk = opponentBalanceRef.current * 0.005;
    const stopDistance = currentPrice * 0.003;
    const entry = currentPrice * (
      side === "BUY"
        ? 1 + SLIPPAGE_PERCENT / 100
        : 1 - SLIPPAGE_PERCENT / 100
    );

    const open = {
      side,
      entry,
      stop: side === "BUY" ? entry - stopDistance : entry + stopDistance,
      target: side === "BUY" ? entry + stopDistance * 1.5 : entry - stopDistance * 1.5,
      size: risk / stopDistance,
      risk,
      rr: 1.5,
      openedAt: Date.now(),
    };

    setOpponentPosition(open);
    opponentPositionRef.current = open;
    lastBotTradeRef.current = Date.now();
  }, [
    currentPrice,
    matchStartedAt,
    matchEnded,
    countdown,
    closeOpponentPosition,
  ]);

  useEffect(() => {
    if (!DEMO_MODE || !matchStartedAt || matchEnded) return undefined;

    const intervalId = window.setInterval(() => {
      if (Math.random() > 0.65) {
        const emote = EMOTES[Math.floor(Math.random() * EMOTES.length)];
        setOpponentLastEmote({ emote, id: Date.now() });
      }
    }, 6500);

    return () => window.clearInterval(intervalId);
  }, [matchStartedAt, matchEnded]);

  useEffect(() => {
    if (!opponentLastEmote) return undefined;

    const timeoutId = window.setTimeout(() => {
      setOpponentLastEmote(null);
    }, EMOTE_LIFETIME_MS);

    return () => window.clearTimeout(timeoutId);
  }, [opponentLastEmote]);

  useEffect(() => {
    if (!userEmote) return undefined;

    emoteTimerRef.current = window.setTimeout(() => {
      setUserEmote(null);
    }, EMOTE_LIFETIME_MS);

    return () => {
      if (emoteTimerRef.current) window.clearTimeout(emoteTimerRef.current);
    };
  }, [userEmote]);

  useEffect(() => {
    return () => {
      if (emoteTimerRef.current) window.clearTimeout(emoteTimerRef.current);
      if (cooldownTimerRef.current) window.clearTimeout(cooldownTimerRef.current);
    };
  }, []);

  const sendEmote = (emote) => {
    if (matchEnded || countdown > 0 || emoteCooldown) return;

    setUserEmote({ emote, id: Date.now() });
    setEmoteCooldown(true);

    cooldownTimerRef.current = window.setTimeout(() => {
      setEmoteCooldown(false);
    }, EMOTE_COOLDOWN_MS);
  };

  /* Create and destroy the chart instance safely. */
  useEffect(() => {
    const container = chartContainerRef.current;

    if (!container || !feed.candles.length) return undefined;

    let chart;
    let candleSeries;
    let emaSeries;
    let smaSeries;
    let resizeObserver;

    try {
      const createChart = LightweightCharts.createChart;
      if (typeof createChart !== "function") {
        throw new Error("Lightweight Charts is unavailable.");
      }

      chart = createChart(container, {
        autoSize: false,
        width: container.clientWidth || 640,
        height: container.clientHeight || 360,
        layout: {
          background: { type: "solid", color: "rgba(0,0,0,0)" },
          textColor: "#8b8b8b",
          fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
          fontSize: 10,
        },
        grid: {
          vertLines: { color: "rgba(255,255,255,0.035)" },
          horzLines: { color: "rgba(255,255,255,0.045)" },
        },
        crosshair: {
          mode: LightweightCharts.CrosshairMode?.Normal ?? 0,
          vertLine: {
            color: "#f97316",
            width: 1,
            style: LightweightCharts.LineStyle?.Dashed ?? 2,
            labelBackgroundColor: "#f97316",
          },
          horzLine: {
            color: "#f97316",
            labelBackgroundColor: "#f97316",
          },
        },
        rightPriceScale: {
          borderColor: "rgba(255,255,255,0.08)",
          scaleMargins: { top: 0.12, bottom: 0.12 },
        },
        timeScale: {
          borderColor: "rgba(255,255,255,0.08)",
          timeVisible: true,
          secondsVisible: false,
          rightOffset: 3,
        },
        handleScroll: true,
        handleScale: true,
      });

      const candleOptions = {
        upColor: "#34d399",
        downColor: "#f87171",
        borderUpColor: "#34d399",
        borderDownColor: "#f87171",
        wickUpColor: "#34d399",
        wickDownColor: "#f87171",
      };

      if (typeof chart.addSeries === "function" && LightweightCharts.CandlestickSeries) {
        candleSeries = chart.addSeries(
          LightweightCharts.CandlestickSeries,
          candleOptions,
        );
      } else if (typeof chart.addCandlestickSeries === "function") {
        candleSeries = chart.addCandlestickSeries(candleOptions);
      } else {
        throw new Error("Unsupported Lightweight Charts API version.");
      }

      if (typeof chart.addSeries === "function" && LightweightCharts.LineSeries) {
        emaSeries = chart.addSeries(LightweightCharts.LineSeries, {
          color: "#f97316",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });

        smaSeries = chart.addSeries(LightweightCharts.LineSeries, {
          color: "#60a5fa",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
      } else if (typeof chart.addLineSeries === "function") {
        emaSeries = chart.addLineSeries({
          color: "#f97316",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });

        smaSeries = chart.addLineSeries({
          color: "#60a5fa",
          lineWidth: 1,
          priceLineVisible: false,
          lastValueVisible: false,
        });
      }

      chartRef.current = chart;
      candleSeriesRef.current = candleSeries;
      emaSeriesRef.current = emaSeries;
      smaSeriesRef.current = smaSeries;

      candleSeries.setData(feed.candles);
      chart.timeScale().fitContent();

      resizeObserver = new ResizeObserver((entries) => {
        const entry = entries[0];
        if (!entry || !chart) return;

        chart.applyOptions({
          width: Math.max(1, Math.floor(entry.contentRect.width)),
          height: Math.max(1, Math.floor(entry.contentRect.height)),
        });
      });

      resizeObserver.observe(container);
      setChartError("");
      setChartReady(true);
    } catch (error) {
      setChartError(error instanceof Error ? error.message : "Unable to load chart.");
      setChartReady(false);
    }

    return () => {
      resizeObserver?.disconnect();
      chart?.remove();

      if (chartRef.current === chart) chartRef.current = null;
      if (candleSeriesRef.current === candleSeries) candleSeriesRef.current = null;
      if (emaSeriesRef.current === emaSeries) emaSeriesRef.current = null;
      if (smaSeriesRef.current === smaSeries) smaSeriesRef.current = null;
    };
  }, [feed.candles.length > 0]);

  useEffect(() => {
    const candleSeries = candleSeriesRef.current;
    if (!candleSeries || !feed.candles.length) return;

    candleSeries.setData(feed.candles);

    const chart = chartRef.current;
    if (chart && feed.candles.length === 1) chart.timeScale().fitContent();
  }, [feed.candles]);

  useEffect(() => {
    if (emaSeriesRef.current && feed.candles.length) {
      emaSeriesRef.current.setData(showEma ? calcEma(feed.candles, 20) : []);
    }

    if (smaSeriesRef.current && feed.candles.length) {
      smaSeriesRef.current.setData(showSma ? calcSma(feed.candles, 50) : []);
    }
  }, [feed.candles, showEma, showSma, chartReady]);

  /* Update price lines for the user's open position. */
  useEffect(() => {
    const series = candleSeriesRef.current;
    if (!series) return;

    [entryLineRef.current, stopLineRef.current, targetLineRef.current]
      .forEach((line) => {
        if (line) {
          try {
            series.removePriceLine(line);
          } catch {
            // The chart may have been disposed during a StrictMode remount.
          }
        }
      });

    entryLineRef.current = null;
    stopLineRef.current = null;
    targetLineRef.current = null;

    if (!position) return;

    try {
      entryLineRef.current = series.createPriceLine({
        price: position.entry,
        color: "#f97316",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle?.Solid ?? 0,
        axisLabelVisible: true,
        title: "ENTRY",
      });

      stopLineRef.current = series.createPriceLine({
        price: position.stop,
        color: "#f87171",
        lineWidth: 1,
        lineStyle: LightweightCharts.LineStyle?.Dashed ?? 2,
        axisLabelVisible: true,
        title: "STOP",
      });

      if (position.target !== null) {
        targetLineRef.current = series.createPriceLine({
          price: position.target,
          color: "#34d399",
          lineWidth: 1,
          lineStyle: LightweightCharts.LineStyle?.Dashed ?? 2,
          axisLabelVisible: true,
          title: "TARGET",
        });
      }
    } catch {
      // A disposed chart is recreated by the chart lifecycle effect.
    }
  }, [position, chartReady]);

  useEffect(() => {
    const handleKeys = (event) => {
      const target = event.target;
      const isTyping =
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "TEXTAREA", "SELECT"].includes(target.tagName));

      if (isTyping || event.altKey || event.ctrlKey || event.metaKey) return;

      const key = event.key.toLowerCase();

      if (key === "b") placeOrder("BUY");
      if (key === "s") placeOrder("SELL");
      if (key === "x") closeUserPosition();
    };

    window.addEventListener("keydown", handleKeys);

    return () => window.removeEventListener("keydown", handleKeys);
  }, [placeOrder, closeUserPosition]);

  const applyStopPreset = (preset) => {
    if (!currentPrice) return;

    const percent = {
      tight: 0.15,
      normal: 0.3,
      wide: 0.5,
    }[preset];

    const distance = currentPrice * (percent / 100);
    setStopPrice((currentPrice - distance).toFixed(currentPrice < 1 ? 6 : 4));
    setSideError("");
  };

  const resetToSetup = () => {
    navigate(ROUTES.setup);
  };

  const userWon = userScore.total > opponentScore.total;
  const isDraw = userScore.total === opponentScore.total;
  const resultLabel = drawdownBreached
    ? "FORFEIT"
    : isDraw
      ? "DRAW"
      : userWon
        ? "VICTORY"
        : "MATCH COMPLETE";

  if (!validSetup) return null;

  return (
    <main className="lv-root h-dvh w-full overflow-hidden bg-[#050505] text-white">
      <div className="lv-grid pointer-events-none absolute inset-0" aria-hidden="true" />

      <header className="relative z-10 flex min-h-13 items-center justify-between gap-3 border-b border-white/8 bg-[#080808]/95 px-3 sm:px-5">
        <button
          type="button"
          onClick={() => setShowForfeitConfirm(true)}
          className="lv-button inline-flex items-center gap-2 border border-red-400/20 px-3 py-2 text-[10px] font-semibold uppercase tracking-wider text-red-300 transition hover:border-red-400/50 hover:bg-red-400/5 focus-visible:outline-2  focus-visible:outline-orange-400"
        >
          <Flag size={13} />
          Forfeit
        </button>

        <div className="min-w-0 text-center">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            Online mode / Live match
          </p>
          <p className="truncate font-mono text-[10px] text-zinc-300">
            ROOM {roomId}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="lv-demo-label inline-flex items-center gap-1.5 border border-amber-300/20 px-2 py-1 text-[9px] font-semibold uppercase tracking-wider text-amber-200">
            <span className="size-1.5 bg-amber-300" />
            Demo
          </span>
          <span className="hidden items-center gap-1.5 border border-emerald-300/15 px-2 py-1 text-[9px] text-emerald-300 sm:inline-flex">
            <span className="size-1.5 bg-emerald-400" />
            {feed.status === "loading" ? "LOADING" : "SIMULATED FEED"}
          </span>
        </div>
      </header>

      <div className="lv-demo-notice relative z-10 flex items-center justify-center gap-2 border-b border-amber-300/10 bg-amber-300/[0.035] px-3 py-1.5 text-center text-[10px] text-amber-200/80">
        <CircleHelp size={12} />
        Demo: simulated opponent and prices
        {feed.isFallback && <span className="text-amber-100">· Fallback price</span>}
        {isTabHidden && <span className="text-orange-300">· Tab hidden; timer continues</span>}
      </div>

      <div className="lv-workspace relative z-10 grid min-h-0 grid-cols-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:gap-3 lg:p-4">
        <section className="lv-main-column flex min-h-0 min-w-0 flex-col gap-3">
          <div className="lv-duel-strip grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 sm:gap-4">
            <CornerPanel className="lv-player-panel min-w-0" title="YOU">
              <div className="flex items-center gap-2">
                <CountryFlag country={setup.country} />
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">You</p>
                  <p className="font-mono text-[9px] text-zinc-500">
                    Rating {safeNumber(setup.rating, 1000)}
                  </p>
                </div>
              </div>
              <div
                className={`lv-pnl-value mt-3 truncate font-mono text-base font-semibold tabular-nums sm:text-xl ${
                  userPnl >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {userPnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(userPnl))}
              </div>
              <p className="font-mono text-[9px] text-zinc-500">
                {formatPercent(userPnlPercent)}
              </p>
              {userEmote && (
                <span key={userEmote.id} className="lv-emote-bubble" aria-label={`You sent ${userEmote.emote}`}>
                  {userEmote.emote}
                </span>
              )}
            </CornerPanel>

            <div className="lv-timer-block flex flex-col items-center justify-center">
              <div
                className={`lv-timer-ring ${isCriticalTimer ? "lv-timer-critical" : ""}`}
                style={{ "--lv-progress": `${timerProgress * 100}%` }}
                aria-label={`Time remaining ${formatClock(remainingSeconds)}`}
              >
                <div className="lv-timer-inner">
                  <span className="font-mono text-2xl font-semibold tabular-nums sm:text-3xl">
                    {formatClock(remainingSeconds)}
                  </span>
                  <span className="mt-1 text-[8px] uppercase tracking-[0.2em] text-zinc-500">
                    Remaining
                  </span>
                </div>
              </div>
              <p className="mt-2 font-mono text-[10px] font-semibold text-orange-300">
                {symbolLabel} · {matchMinutes} MIN
              </p>
              <span className="sr-only" aria-live="polite">
                {remainingSeconds === 10 ? "Ten seconds remaining" : ""}
                {remainingSeconds === 0 ? "Match time ended" : ""}
              </span>
            </div>

            <CornerPanel className="lv-player-panel min-w-0" title="OPPONENT">
              <div className="flex items-center justify-end gap-2 text-right">
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-white">
                    {opponent.name || "Unknown trader"}
                  </p>
                  <p className="font-mono text-[9px] text-zinc-500">
                    Rating {safeNumber(opponent.rating, 1000)}
                  </p>
                </div>
                <CountryFlag country={opponent.country} />
              </div>
              <div
                className={`relative mt-3 truncate text-right font-mono text-base font-semibold tabular-nums sm:text-xl ${
                  opponentPnl >= 0 ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {OPPONENT_PNL === "hidden" && !matchEnded
                  ? "Trading..."
                  : `${opponentPnl >= 0 ? "+" : "−"}${formatMoney(Math.abs(opponentPnl))}`}
                {opponentLastEmote && (
                  <span key={opponentLastEmote.id} className="lv-emote-bubble lv-emote-opponent">
                    {opponentLastEmote.emote}
                  </span>
                )}
              </div>
              <p className="text-right font-mono text-[9px] text-zinc-500">
                {OPPONENT_PNL === "hidden" && !matchEnded
                  ? "P&L hidden"
                  : formatPercent(opponentPnlPercent)}
              </p>
            </CornerPanel>
          </div>

          <CornerPanel
            className="lv-chart-panel flex min-h-0 flex-1 flex-col"
            title="PRICE ACTION"
            right={
              <div className="flex items-center gap-1.5">
                <span className="font-mono text-[10px] text-zinc-500">{symbolLabel}/USD</span>
                <span className="size-1.5 bg-emerald-400" />
                <span className="font-mono text-[9px] text-zinc-500">
                  {currentPrice === null ? "—" : formatPrice(currentPrice)}
                </span>
              </div>
            }
          >
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="border border-orange-400/20 bg-orange-400/5 px-2 py-1 font-mono text-[10px] text-orange-200">
                  {symbolLabel}
                </span>
                <span className="hidden font-mono text-[9px] text-zinc-600 sm:inline">
                  {CANDLE_SECONDS}s candles
                </span>
              </div>

              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-pressed={showEma}
                  onClick={() => setShowEma((value) => !value)}
                  className={`lv-toolbar-button ${showEma ? "is-active" : ""}`}
                >
                  EMA 20
                </button>
                <button
                  type="button"
                  aria-pressed={showSma}
                  onClick={() => setShowSma((value) => !value)}
                  className={`lv-toolbar-button ${showSma ? "is-active" : ""}`}
                >
                  SMA 50
                </button>
                <button
                  type="button"
                  title="Fit chart content"
                  onClick={() => chartRef.current?.timeScale().fitContent()}
                  className="lv-toolbar-button"
                >
                  <Maximize2 size={12} />
                  Fit
                </button>
              </div>
            </div>

            <div className="lv-chart-wrap relative min-h-52 flex-1">
              <div
                ref={chartContainerRef}
                className="lv-chart-canvas absolute inset-0"
                aria-label={`${symbolLabel} candlestick chart`}
              />

              {currentPrice !== null && (
                <div className="lv-live-price-tag absolute right-1 top-2 z-10 border border-orange-400/20 bg-[#111111]/95 px-2 py-1 font-mono text-[10px] text-orange-200">
                  {formatPrice(currentPrice)}
                </div>
              )}

              {feed.status === "loading" && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]/90">
                  <div className="text-center">
                    <Activity className="mx-auto mb-2 animate-pulse text-orange-300" size={20} />
                    <p className="font-mono text-[10px] text-zinc-400">Building price history…</p>
                  </div>
                </div>
              )}

              {chartError && (
                <div className="absolute inset-0 z-20 flex items-center justify-center bg-[#050505]/95 p-5">
                  <div className="max-w-xs text-center">
                    <ShieldAlert className="mx-auto mb-2 text-red-300" size={22} />
                    <p className="text-xs text-red-200">{chartError}</p>
                    <button
                      type="button"
                      onClick={() => window.location.reload()}
                      className="lv-button mt-3 border border-white/10 px-3 py-2 text-[10px]"
                    >
                      <RotateCcw size={12} className="mr-2 inline" />
                      Retry chart
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 border-t border-white/6 pt-2">
              <div className="flex items-center gap-3 font-mono text-[9px] text-zinc-500">
                <span><span className="mr-1 inline-block size-1.5 bg-orange-400" />Entry</span>
                <span><span className="mr-1 inline-block size-1.5 bg-red-400" />Stop</span>
                <span><span className="mr-1 inline-block size-1.5 bg-emerald-400" />Target</span>
              </div>
              <span className="font-mono text-[9px] text-zinc-600">
                {position ? `${position.side} POSITION OPEN` : "NO OPEN POSITION"}
              </span>
            </div>
          </CornerPanel>

          <div className="lv-emote-row flex items-center justify-between gap-2">
            <span className="hidden text-[9px] uppercase tracking-[0.16em] text-zinc-500 sm:block">
              Quick emote
            </span>
            <div className="flex flex-1 items-center justify-end gap-1.5 sm:justify-start">
              {EMOTES.map((emote) => (
                <button
                  key={emote}
                  type="button"
                  disabled={emoteCooldown || matchEnded || countdown > 0}
                  onClick={() => sendEmote(emote)}
                  aria-label={`Send emote ${emote}`}
                  className="lv-emote-button"
                >
                  {emote}
                </button>
              ))}
              <span className="ml-1 min-w-10 font-mono text-[9px] text-zinc-600">
                {emoteCooldown ? "WAIT" : "3s CD"}
              </span>
            </div>
          </div>
        </section>

        <aside className="lv-side-panel flex min-h-0 min-w-0 flex-col gap-3 overflow-y-auto">
          <CornerPanel title="ACCOUNT">
            <div className="mb-2 flex items-end justify-between gap-3">
              <div>
                <p className="text-[9px] uppercase tracking-wider text-zinc-500">Balance</p>
                <p className="mt-1 font-mono text-lg font-semibold tabular-nums text-white">
                  {formatMoney(balance)}
                </p>
              </div>
              <span className="border border-white/8 px-2 py-1 font-mono text-[9px] text-zinc-400">
                VIRTUAL USD
              </span>
            </div>
            <Metric label="Equity" value={formatMoney(equity)} />
            <Metric
              label="Realised P&L"
              value={formatMoney(realisedPnl)}
              tone={realisedPnl >= 0 ? "positive" : "negative"}
            />
            <Metric
              label="Unrealised P&L"
              value={formatMoney(unrealisedPnl)}
              tone={unrealisedPnl >= 0 ? "positive" : "negative"}
            />

            <div className="mt-3 border-t border-white/8 pt-3">
              <div className="mb-2 flex items-center justify-between gap-3">
                <span className="text-[9px] uppercase tracking-wider text-zinc-500">Drawdown limit</span>
                <span className="font-mono text-[10px] text-zinc-300">
                  {drawdownPercent.toFixed(2)}% / {MAX_DRAWDOWN_PERCENT}%
                </span>
              </div>
              <div
                className="lv-drawdown-track"
                role="progressbar"
                aria-label="Drawdown limit used"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={drawdownUsed}
              >
                <div
                  className={`lv-drawdown-fill ${
                    drawdownUsed >= 75 ? "is-danger" : drawdownUsed >= 40 ? "is-warning" : ""
                  }`}
                  style={{ width: `${drawdownUsed}%` }}
                />
              </div>
              <p className="mt-1.5 text-[9px] text-zinc-600">
                Match forfeits at 3% equity drawdown.
              </p>
            </div>
          </CornerPanel>

          <CornerPanel title="ORDER TICKET">
            <div className="mb-3">
              <div className="mb-2 flex items-center justify-between">
                <label className="text-[10px] text-zinc-400">Risk per trade</label>
                <span className="font-mono text-[10px] text-orange-300">Max 1%</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {RISK_OPTIONS.map((risk) => (
                  <button
                    type="button"
                    key={risk}
                    aria-pressed={riskPercent === risk}
                    onClick={() => setRiskPercent(risk)}
                    className={`lv-risk-chip ${riskPercent === risk ? "is-active" : ""}`}
                  >
                    {risk}%
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <div className="mb-1.5 flex items-center justify-between">
                <label htmlFor="lv-stop" className="text-[10px] text-zinc-400">
                  Stop-loss <span className="text-red-300">*</span>
                </label>
                <span className="font-mono text-[9px] text-zinc-600">Required</span>
              </div>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  aria-label="Decrease stop-loss price"
                  onClick={() => {
                    const step = Math.max((currentPrice || 1) * 0.0001, 0.000001);
                    setStopPrice((safeNumber(stopPrice, currentPrice || 1) - step).toFixed(6));
                  }}
                  className="lv-step-button"
                >
                  <Minus size={12} />
                </button>
                <input
                  id="lv-stop"
                  type="number"
                  inputMode="decimal"
                  value={stopPrice}
                  onChange={(event) => setStopPrice(event.target.value)}
                  placeholder="Enter stop price"
                  className="lv-number-input min-w-0 flex-1"
                />
                <button
                  type="button"
                  aria-label="Increase stop-loss price"
                  onClick={() => {
                    const step = Math.max((currentPrice || 1) * 0.0001, 0.000001);
                    setStopPrice((safeNumber(stopPrice, currentPrice || 1) + step).toFixed(6));
                  }}
                  className="lv-step-button"
                >
                  <Plus size={12} />
                </button>
              </div>
              <div className="mt-1.5 flex flex-wrap gap-1">
                {["tight", "normal", "wide"].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => applyStopPreset(preset)}
                    className="lv-preset-button"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="lv-target" className="mb-1.5 block text-[10px] text-zinc-400">
                Take-profit <span className="text-zinc-600">(optional)</span>
              </label>
              <input
                id="lv-target"
                type="number"
                inputMode="decimal"
                value={takeProfitPrice}
                onChange={(event) => setTakeProfitPrice(event.target.value)}
                placeholder="No target"
                className="lv-number-input w-full"
              />
            </div>

            <div className="mb-3 border-y border-white/8 py-2">
              <Metric label="Est. position size" value={plannedSize > 0 ? plannedSize.toFixed(5) : "—"} />
              <Metric label="Risk amount" value={formatMoney(riskDollars)} tone="orange" />
              <Metric label="Planned R:R" value={plannedRR > 0 ? `1 : ${plannedRR.toFixed(2)}` : "—"} />
            </div>

            {sideError && (
              <p role="alert" className="mb-2 border border-red-400/20 bg-red-400/5 px-2 py-2 text-[10px] leading-4 text-red-300">
                {sideError}
              </p>
            )}

            {lastOrderMessage && (
              <p role="status" className="mb-2 border border-emerald-400/15 bg-emerald-400/5 px-2 py-2 text-[10px] leading-4 text-emerald-300">
                {lastOrderMessage}
              </p>
            )}

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                disabled={Boolean(orderReason !== "Ready to trade") || !stopSideValid("BUY")}
                onClick={() => placeOrder("BUY")}
                className="lv-order-button is-buy"
              >
                <TrendingUp size={15} />
                BUY <span className="ml-auto font-mono text-[9px] opacity-70">B</span>
              </button>
              <button
                type="button"
                disabled={Boolean(orderReason !== "Ready to trade") || !stopSideValid("SELL")}
                onClick={() => placeOrder("SELL")}
                className="lv-order-button is-sell"
              >
                <TrendingDown size={15} />
                SELL <span className="ml-auto font-mono text-[9px] opacity-70">S</span>
              </button>
            </div>

            <p className="mt-2 text-[9px] leading-4 text-zinc-600">
              {orderReason}. Shortcuts: B buy · S sell · X close.
            </p>
          </CornerPanel>

          <CornerPanel
            title="OPEN POSITION"
            right={
              position ? (
                <span className={`font-mono text-[9px] ${position.side === "BUY" ? "text-emerald-300" : "text-red-300"}`}>
                  {position.side}
                </span>
              ) : null
            }
          >
            {position ? (
              <>
                <Metric label="Position size" value={position.size.toFixed(5)} />
                <Metric label="Entry" value={formatPrice(position.entry)} />
                <Metric label="Current price" value={formatPrice(currentPrice)} />
                <Metric
                  label="Live P&L"
                  value={formatMoney(unrealisedPnl)}
                  tone={unrealisedPnl >= 0 ? "positive" : "negative"}
                />
                <button
                  type="button"
                  onClick={closeUserPosition}
                  className="lv-close-position mt-3 w-full"
                >
                  Close position <span className="ml-auto font-mono text-[9px]">X</span>
                </button>
              </>
            ) : (
              <p className="py-2 text-[10px] text-zinc-600">
                No open position. A trade will appear here after entry.
              </p>
            )}
          </CornerPanel>

          <CornerPanel title="RULES CHECKLIST">
            <div className="space-y-2">
              {[
                {
                  label: "Stop-loss set",
                  valid: stopIsValid,
                },
                {
                  label: "Risk within 1%",
                  valid: riskPercent <= MAX_RISK_PERCENT,
                },
                {
                  label: "Drawdown under limit",
                  valid: drawdownPercent < MAX_DRAWDOWN_PERCENT,
                },
                {
                  label: "Trades available",
                  valid: tradesUsed < MAX_TRADES,
                  detail: `${tradesUsed} of ${MAX_TRADES}`,
                },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between gap-3">
                  <span className="text-[10px] text-zinc-400">{item.label}</span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[9px]">
                    {item.detail && <span className="text-zinc-500">{item.detail}</span>}
                    {item.valid ? (
                      <Check size={12} className="text-emerald-300" />
                    ) : (
                      <X size={12} className="text-red-300" />
                    )}
                  </span>
                </div>
              ))}
            </div>
          </CornerPanel>

          <CornerPanel title="TRADE LOG">
            {tradeLog.length ? (
              <div className="space-y-2">
                {tradeLog.slice(0, 5).map((trade) => (
                  <div key={trade.id} className="flex items-center justify-between gap-3 border-b border-white/5 pb-2 last:border-0 last:pb-0">
                    <div>
                      <p className={`font-mono text-[10px] ${trade.side === "BUY" ? "text-emerald-300" : "text-red-300"}`}>
                        {trade.side}
                      </p>
                      <p className="mt-0.5 text-[9px] text-zinc-600">
                        {trade.reason}
                      </p>
                    </div>
                    <span className={`font-mono text-[10px] tabular-nums ${trade.pnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                      {trade.pnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(trade.pnl))}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[10px] text-zinc-600">Closed trades will appear here.</p>
            )}
          </CornerPanel>
        </aside>
      </div>

      <footer className="relative z-10 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 border-t border-white/8 bg-[#080808] px-3 py-2 text-[9px] text-zinc-600 sm:px-5">
        <span>Charts powered by TradingView Lightweight Charts</span>
        <span>Virtual funds only. Educational. Not investment advice.</span>
        <span>Prices may differ from real markets</span>
      </footer>

      {countdown > 0 && !matchStartedAt && (
        <div className="lv-overlay fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-5">
          <div className="text-center">
            <p className="text-[10px] uppercase tracking-[0.3em] text-orange-300">
              Match starts
            </p>
            <p key={countdown} className="lv-countdown-number mt-3 font-mono text-8xl font-semibold text-white">
              {countdown}
            </p>
            <p className="mt-3 font-mono text-[10px] text-zinc-500">
              {symbolLabel} · {matchMinutes} MIN · VIRTUAL FUNDS
            </p>
          </div>
        </div>
      )}

      {showForfeitConfirm && (
        <div className="lv-overlay fixed inset-0 z-60 flex items-center justify-center bg-black/80 p-4">
          <div role="dialog" aria-modal="true" aria-labelledby="lv-forfeit-title" className="lv-dialog w-full max-w-sm">
            <span aria-hidden="true" className="lv-corner lv-corner-tl" />
            <span aria-hidden="true" className="lv-corner lv-corner-br" />
            <ShieldAlert className="mb-3 text-red-300" size={23} />
            <h2 id="lv-forfeit-title" className="text-base font-semibold text-white">
              Forfeit this match?
            </h2>
            <p className="mt-2 text-xs leading-5 text-zinc-400">
              Your open position will be closed at the current simulated price. This match will end immediately.
            </p>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setShowForfeitConfirm(false)}
                className="lv-button border border-white/10 px-3 py-3 text-xs text-zinc-300 hover:bg-white/5"
              >
                Keep playing
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForfeitConfirm(false);
                  finishMatch("forfeit");
                }}
                className="lv-button border border-red-400/30 bg-red-400/10 px-3 py-3 text-xs font-semibold text-red-200 hover:bg-red-400/15"
              >
                Forfeit match
              </button>
            </div>
          </div>
        </div>
      )}

      {matchEnded && (
        <div className="lv-overlay fixed inset-0 z-70 overflow-y-auto bg-[#050505]/98 p-4 sm:p-8">
          <div className="mx-auto flex min-h-full w-full max-w-3xl items-center justify-center">
            <div className="lv-result-panel relative w-full p-5 sm:p-8">
              <span aria-hidden="true" className="lv-corner lv-corner-tl" />
              <span aria-hidden="true" className="lv-corner lv-corner-br" />

              <p className="text-center text-[10px] uppercase tracking-[0.3em] text-orange-300">
                Match result
              </p>
              <h1 className={`mt-3 text-center text-3xl font-semibold tracking-tight sm:text-5xl ${
                drawdownBreached ? "text-red-300" : userWon ? "text-emerald-300" : "text-white"
              }`}>
                {resultLabel}
              </h1>
              <p className="mt-2 text-center text-xs text-zinc-500">
                {endReason === "forfeit"
                  ? "You forfeited the match."
                  : endReason === "drawdown"
                    ? "The 3% maximum drawdown limit was breached."
                    : "The timer has ended."}
              </p>

              <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <CornerPanel title="YOU">
                  <p className={`font-mono text-2xl font-semibold ${userPnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {userPnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(userPnl))}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    {formatPercent(userPnlPercent)}
                  </p>
                  <div className="mt-3 border-t border-white/8 pt-2">
                    <Metric label="Risk / reward" value={`${userScore.riskReward}/40`} />
                    <Metric label="Consistency" value={`${userScore.consistency}/30`} />
                    <Metric label="Profit" value={`${userScore.profit}/30`} />
                    {userScore.penalty > 0 && (
                      <Metric label="Drawdown penalty" value={`−${userScore.penalty}`} tone="negative" />
                    )}
                    <Metric label="Final score" value={`${userScore.total}/100`} tone="orange" />
                  </div>
                </CornerPanel>

                <CornerPanel title="OPPONENT">
                  <p className={`font-mono text-2xl font-semibold ${opponentPnl >= 0 ? "text-emerald-300" : "text-red-300"}`}>
                    {opponentPnl >= 0 ? "+" : "−"}{formatMoney(Math.abs(opponentPnl))}
                  </p>
                  <p className="mt-1 font-mono text-xs text-zinc-500">
                    {formatPercent(opponentPnlPercent)}
                  </p>
                  <div className="mt-3 border-t border-white/8 pt-2">
                    <Metric label="Risk / reward" value={`${opponentScore.riskReward}/40`} />
                    <Metric label="Consistency" value={`${opponentScore.consistency}/30`} />
                    <Metric label="Profit" value={`${opponentScore.profit}/30`} />
                    <Metric label="Final score" value={`${opponentScore.total}/100`} tone="orange" />
                  </div>
                </CornerPanel>
              </div>

              <div className="mt-4 border border-white/8 bg-white/2 p-3">
                <p className="text-[9px] uppercase tracking-wider text-zinc-500">Scoring formula</p>
                <p className="mt-1 text-[10px] leading-5 text-zinc-300">
                  Risk/reward 40 + consistency 30 + profit 30 − drawdown penalty 25.
                  Higher score wins, not just higher profit.
                </p>
              </div>

              <div className="mt-4 border border-white/8 p-3">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h2 className="text-[10px] uppercase tracking-wider text-zinc-400">Trade replay</h2>
                  <span className="text-[9px] text-zinc-600">Opponent markers revealed</span>
                </div>
                {opponentTrades.length ? (
                  <div className="space-y-2">
                    {opponentTrades.map((trade) => (
                      <div key={trade.id} className="grid grid-cols-[52px_1fr_1fr] gap-2 border-b border-white/5 pb-2 font-mono text-[10px] last:border-0">
                        <span className={trade.side === "BUY" ? "text-emerald-300" : "text-red-300"}>
                          {trade.side}
                        </span>
                        <span className="text-zinc-500">
                          Entry {formatPrice(trade.entry)}
                        </span>
                        <span className="text-zinc-500">
                          Exit {formatPrice(trade.exit)}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-[10px] text-zinc-600">No opponent trades were closed during this match.</p>
                )}
              </div>

              <p className="mt-4 text-center font-mono text-[10px] text-amber-200">
                Demo: {userWon ? "+" : "−"}{Math.round(Math.random() * 100)} rating preview
              </p>

              <div className="mt-5 grid grid-cols-1 gap-2 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={resetToSetup}
                  className="lv-button border border-orange-400/30 bg-orange-400/10 px-4 py-3 text-xs font-semibold text-orange-200 hover:bg-orange-400/15"
                >
                  <RotateCcw size={14} className="mr-2 inline" />
                  Play again
                </button>
                <button
                  type="button"
                  onClick={() => navigate(ROUTES.home)}
                  className="lv-button border border-white/10 px-4 py-3 text-xs text-zinc-200 hover:bg-white/5"
                >
                  <ArrowLeft size={14} className="mr-2 inline" />
                  Back to dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}