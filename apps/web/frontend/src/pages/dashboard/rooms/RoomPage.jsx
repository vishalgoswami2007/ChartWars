
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Award,
  Check,
  Clock3,
  Crown,
  DoorOpen,
  GraduationCap,
  Medal,
  Minus,
  Plus,
  Radio,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Wallet,
  X,
  Zap,
} from "lucide-react";


const MODES = [
  {
    id: "friends",
    title: "Friends Room",
    description: "Practice alongside friends and compare your decisions.",
    detail: "Social practice",
    icon: Users,
    status: "Available",
  },
  {
    id: "blind",
    title: "Blind Room",
    description: "Predict the next move before the hidden candle is revealed.",
    detail: "Prediction challenge",
    icon: ShieldCheck,
    status: "Preview",
  },
  {
    id: "coaches",
    title: "VS Coaches",
    description: "Build your market-reading skills with guided challenges.",
    detail: "Guided practice",
    icon: GraduationCap,
    status: "Available",
  },
  {
    id: "tournament",
    title: "Tournament",
    description: "Compete in structured rounds and climb the leaderboard.",
    detail: "Competitive arena",
    icon: Trophy,
    status: "Coming Soon",
  },
];

const EMOTES = [
  { emoji: "🚀", label: "MOONSHOT!" },
  { emoji: "📉", label: "REKT!" },
  { emoji: "🐋", label: "WHALE MOVE" },
  { emoji: "🤫", label: "HODL!" },
  { emoji: "💎", label: "DIAMOND HANDS" },
  { emoji: "🤡", label: "NOOB TRADER" },
];

const INITIAL_PLAYERS = [
  {
    id: "you",
    name: "You",
    handle: "@yourprofile",
    rating: 100,
    balance: 10000,
    pnl: 0,
    color: "#36D399",
    avatar: "Y",
    isYou: true,
  },
  {
    id: "nova",
    name: "Trader Nova",
    handle: "@nova_trades",
    rating: 108,
    balance: 10000,
    pnl: 184,
    color: "#44B8FF",
    avatar: "N",
  },
  {
    id: "atlas",
    name: "Atlas",
    handle: "@atlas_chart",
    rating: 96,
    balance: 10000,
    pnl: -72,
    color: "#E87524",
    avatar: "A",
  },
  {
    id: "pixel",
    name: "PixelTrader",
    handle: "@pixel_fx",
    rating: 103,
    balance: 10000,
    pnl: 48,
    color: "#F472B6",
    avatar: "P",
  },
];

function money(value, decimals = 2) {
  const absolute = Math.abs(value).toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return `${value < 0 ? "-" : ""}$${absolute}`;
}

function signedMoney(value) {
  return `${value > 0 ? "+" : value < 0 ? "−" : ""}$${Math.abs(value).toFixed(2)}`;
}

function Avatar({ player, size = "h-10 w-10" }) {
  return (
    <div
      className={`flex ${size} shrink-0 items-center justify-center rounded-xl border text-sm font-bold`}
      style={{
        color: player.color,
        borderColor: `${player.color}55`,
        background: `${player.color}16`,
      }}
      aria-label={player.name}
    >
      {player.avatar}
    </div>
  );
}

function Panel({ children, className = "" }) {
  return (
    <section
      className={`min-w-0 rounded-xl border border-white/10 bg-[#0d0d0d] ${className}`}
    >
      {children}
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
      {children}
    </p>
  );
}

function MarketChart({ price, candles, players, positions }) {
  const chart = useMemo(() => {
    const width = 760;
    const height = 350;
    const left = 18;
    const right = 88;
    const top = 18;
    const bottom = 30;
    const plotWidth = width - left - right;
    const plotHeight = height - top - bottom;

    const values = candles.map((candle) => [
      candle.open,
      candle.close,
      candle.high,
      candle.low,
    ]).flat();

    const minimum = Math.min(...values) - 2;
    const maximum = Math.max(...values) + 2;
    const range = Math.max(maximum - minimum, 1);

    const y = (value) =>
      top + ((maximum - value) / range) * plotHeight;

    const candleWidth = Math.max(
      3,
      Math.min(10, (plotWidth / candles.length) * 0.58)
    );

    const renderedCandles = candles.map((candle, index) => {
      const x = left + (index / Math.max(candles.length, 1)) * plotWidth;
      const rising = candle.close >= candle.open;

      return {
        x,
        wickTop: y(candle.high),
        wickBottom: y(candle.low),
        bodyTop: y(Math.max(candle.open, candle.close)),
        bodyHeight: Math.max(
          2,
          Math.abs(y(candle.open) - y(candle.close))
        ),
        color: rising ? "#36D399" : "#F87171",
        candleWidth,
      };
    });

    return {
      width,
      height,
      left,
      top,
      right,
      bottom,
      plotWidth,
      plotHeight,
      y,
      minimum,
      maximum,
      renderedCandles,
    };
  }, [candles]);

  const gridValues = Array.from({ length: 6 }, (_, index) =>
    chart.maximum - ((chart.maximum - chart.minimum) * index) / 5
  );

  return (
    <div className="relative min-w-0 overflow-hidden">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#F7931A]/10 text-[#F7931A]">
            ₿
          </div>
          <div>
            <p className="text-sm font-semibold text-white">BTC / USD</p>
            <p className="text-[10px] text-zinc-500">
              Bitcoin · Simulated market
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-mono text-lg font-semibold text-white">
            {money(price)}
          </p>
          <p className="text-[10px] text-emerald-400">
            <Activity className="mr-1 inline" size={12} />
            LIVE DEMO FEED
          </p>
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-white/8 px-4 py-2">
        <div className="flex flex-wrap gap-1">
          {["1m", "5m", "15m", "1h"].map((timeframe, index) => (
            <span
              key={timeframe}
              className={`rounded-md px-2.5 py-1.5 text-[10px] ${
                index === 1
                  ? "bg-[#E87524]/15 text-[#F59A55]"
                  : "text-zinc-500"
              }`}
            >
              {timeframe}
            </span>
          ))}
        </div>
        <span className="text-[10px] text-zinc-500">Candles · USD</span>
      </div>

      <svg
        viewBox={`0 0 ${chart.width} ${chart.height}`}
        className="block h-auto w-full"
        role="img"
        aria-label="Simulated Bitcoin candlestick chart"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#E87524" stopOpacity=".09" />
            <stop offset="100%" stopColor="#E87524" stopOpacity="0" />
          </linearGradient>
        </defs>

        {gridValues.map((value, index) => {
          const y = chart.y(value);
          return (
            <g key={index}>
              <line
                x1={chart.left}
                y1={y}
                x2={chart.width - chart.right}
                y2={y}
                stroke="#ffffff"
                strokeOpacity=".07"
                strokeDasharray="3 5"
              />
              <text
                x={chart.width - chart.right + 8}
                y={y + 4}
                fill="#71717a"
                fontSize="11"
              >
                {value.toFixed(0)}
              </text>
            </g>
          );
        })}

        {Array.from({ length: 7 }, (_, index) => {
          const x = chart.left + (chart.plotWidth * index) / 6;
          return (
            <line
              key={index}
              x1={x}
              y1={chart.top}
              x2={x}
              y2={chart.height - chart.bottom}
              stroke="#ffffff"
              strokeOpacity=".04"
            />
          );
        })}

        {chart.renderedCandles.map((candle, index) => (
          <g key={index}>
            <line
              x1={candle.x}
              y1={candle.wickTop}
              x2={candle.x}
              y2={candle.wickBottom}
              stroke={candle.color}
              strokeWidth="1.2"
            />
            <rect
              x={candle.x - candle.candleWidth / 2}
              y={candle.bodyTop}
              width={candle.candleWidth}
              height={candle.bodyHeight}
              rx="1"
              fill={candle.color}
            />
          </g>
        ))}

        {positions.map((position) => {
          const player = players.find((item) => item.id === position.playerId);
          if (!player) return null;

          const y = chart.y(position.entryPrice);
          return (
            <g key={position.id}>
              <line
                x1={chart.left}
                y1={y}
                x2={chart.width - chart.right}
                y2={y}
                stroke={player.color}
                strokeOpacity=".9"
                strokeDasharray="5 4"
              />
              <rect
                x={chart.left + 5}
                y={y - 14}
                width="118"
                height="18"
                rx="4"
                fill="#090909"
                stroke={player.color}
                strokeOpacity=".65"
              />
              <text
                x={chart.left + 11}
                y={y - 2}
                fill={player.color}
                fontSize="10"
              >
                {player.isYou ? "YOU" : player.name} · {position.side}
              </text>
            </g>
          );
        })}

        <line
          x1={chart.left}
          y1={chart.y(price)}
          x2={chart.width - chart.right}
          y2={chart.y(price)}
          stroke="#E87524"
          strokeOpacity=".8"
          strokeDasharray="2 4"
        />

        <rect
          x={chart.width - chart.right + 3}
          y={chart.y(price) - 10}
          width="63"
          height="20"
          rx="4"
          fill="#E87524"
        />
        <text
          x={chart.width - chart.right + 8}
          y={chart.y(price) + 4}
          fill="#090909"
          fontSize="10"
          fontWeight="700"
        >
          {price.toFixed(1)}
        </text>

        {["09:00", "09:15", "09:30", "09:45", "10:00", "10:15"].map(
          (label, index) => (
            <text
              key={label}
              x={chart.left + (chart.plotWidth * index) / 5}
              y={chart.height - 8}
              fill="#71717a"
              fontSize="10"
              textAnchor={index === 0 ? "start" : "middle"}
            >
              {label}
            </text>
          )
        )}
      </svg>

      <div className="flex flex-wrap items-center gap-4 border-t border-white/8 px-4 py-3 text-[10px] text-zinc-500">
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          Bullish candle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-red-400" />
          Bearish candle
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full bg-[#E87524]" />
          Current price
        </span>
      </div>
    </div>
  );
}

function PlayerCard({ player, rank, onEmote, activeEmote }) {
  const up = player.pnl >= 0;
  const health = Math.max(8, Math.min(100, 50 + player.pnl / 10));

  return (
    <div className="relative rounded-xl border border-white/8 bg-white/2 p-3">
      {activeEmote && (
        <div className="pointer-events-none absolute -top-8 right-2 z-20 animate-bounce rounded-xl border border-white/10 bg-[#202020] px-3 py-2 text-center shadow-xl">
          <span className="text-2xl">{activeEmote.emoji}</span>
          <p className="text-[9px] font-semibold text-white">
            {activeEmote.label}
          </p>
        </div>
      )}

      <div className="flex items-center gap-2.5">
        <div className="relative">
          <Avatar player={player} size="h-9 w-9" />
          {rank === 1 && (
            <Crown
              size={13}
              className="absolute -right-1 -top-1 text-amber-300"
              fill="currentColor"
            />
          )}
        </div>
        <div className="min-w-0 flex-1">
          <p className="truncate text-xs font-semibold text-white">
            {player.name}
          </p>
          <p className="truncate text-[10px] text-zinc-500">
            {player.handle}
          </p>
        </div>
        <span className="text-xs font-bold text-zinc-400">#{rank}</span>
      </div>

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="text-[10px] text-zinc-500">CW Rating</span>
        <span className="font-mono text-xs font-semibold text-white">
          {Math.round(player.rating)}
        </span>
      </div>

      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="text-[10px] text-zinc-500">Live PnL</span>
        <span
          className={`font-mono text-xs font-semibold ${
            up ? "text-emerald-400" : "text-red-400"
          }`}
        >
          {signedMoney(player.pnl)}
        </span>
      </div>

      <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${health}%`,
            backgroundColor: up ? "#36D399" : "#F87171",
          }}
        />
      </div>

      {player.isYou && (
        <button
          type="button"
          onClick={() => onEmote(player.id)}
          className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-white/10 py-2 text-[10px] text-zinc-300 transition hover:border-[#E87524]/50 hover:text-white"
        >
          Send reaction <Zap size={12} />
        </button>
      )}
    </div>
  );
}

function OnlineArena({ matchType, duration, onExit, onRematch }) {
  const [players, setPlayers] = useState(() =>
    INITIAL_PLAYERS.slice(0, matchType === "duel" ? 2 : 4)
  );
  const [price, setPrice] = useState(67420);
  const [candles, setCandles] = useState(() => {
    let current = 67420;
    return Array.from({ length: 48 }, (_, index) => {
      const open = current;
      const close = open + (Math.random() - 0.48) * 8;
      const high = Math.max(open, close) + Math.random() * 4;
      const low = Math.min(open, close) - Math.random() * 4;
      current = close;
      return { time: index, open, close, high, low };
    });
  });
  const [positions, setPositions] = useState([]);
  const [quantity, setQuantity] = useState(0.01);
  const [balance, setBalance] = useState(10000);
  const [elapsed, setElapsed] = useState(0);
  const [activeEmotes, setActiveEmotes] = useState({});
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState("positions");

  const totalSeconds = Number(duration) * 60;
  const remaining = Math.max(0, totalSeconds - elapsed);

  useEffect(() => {
    if (result) return undefined;

    const timer = window.setInterval(() => {
      setElapsed((value) => Math.min(value + 1, totalSeconds));
      setPrice((current) => current + (Math.random() - 0.49) * 24);
      setCandles((previous) => {
        const nextPrice = price + (Math.random() - 0.49) * 24;
        const last = previous[previous.length - 1];
        const open = last?.close ?? price;
        const candle = {
          time: (last?.time ?? 0) + 1,
          open,
          close: nextPrice,
          high: Math.max(open, nextPrice) + Math.random() * 5,
          low: Math.min(open, nextPrice) - Math.random() * 5,
        };
        return [...previous.slice(-47), candle];
      });
      setPlayers((previous) =>
        previous.map((player) => {
          if (player.isYou) return player;
          return {
            ...player,
            pnl: player.pnl + (Math.random() - 0.5) * 18,
          };
        })
      );
    }, 1000);

    return () => window.clearInterval(timer);
  }, [result, price, totalSeconds]);

  useEffect(() => {
    if (remaining === 0 && !result) {
      const sorted = [...players].sort((a, b) => b.pnl - a.pnl);
      const myRank = sorted.findIndex((player) => player.isYou) + 1;
      const change = myRank === 1 ? 16 : myRank === 2 ? 8 : -8;

      setResult({ rank: myRank, change });
    }
  }, [remaining, result, players]);

  const rankedPlayers = useMemo(
    () => [...players].sort((a, b) => b.pnl - a.pnl),
    [players]
  );

  const myPlayer = players.find((player) => player.isYou);
  const myPnl = positions.reduce((sum, position) => {
    const movement =
      position.side === "BUY"
        ? price - position.entryPrice
        : position.entryPrice - price;
    return sum + movement * position.quantity;
  }, 0);

  const myEquity = balance + myPnl;

  const placeOrder = (side) => {
    if (result) return;

    const required = price * quantity;
    if (side === "BUY" && required > balance) return;

    setPositions((previous) => [
      ...previous,
      {
        id: `${Date.now()}-${Math.random()}`,
        playerId: "you",
        side,
        entryPrice: price,
        quantity,
      },
    ]);
  };

  const closePosition = (position) => {
    const movement =
      position.side === "BUY"
        ? price - position.entryPrice
        : position.entryPrice - price;
    const pnl = movement * position.quantity;

    setBalance((current) => current + pnl);
    setPositions((previous) =>
      previous.filter((item) => item.id !== position.id)
    );
    setPlayers((previous) =>
      previous.map((player) =>
        player.isYou ? { ...player, pnl: player.pnl + pnl } : player
      )
    );
  };

  const sendEmote = (playerId) => {
    const emote = EMOTES[Math.floor(Math.random() * EMOTES.length)];
    setActiveEmotes((previous) => ({ ...previous, [playerId]: emote }));

    window.setTimeout(() => {
      setActiveEmotes((previous) => {
        const next = { ...previous };
        delete next[playerId];
        return next;
      });
    }, 2000);
  };

  if (result) {
    const newRating = (myPlayer?.rating ?? 100) + result.change;

    return (
      <main className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-10 sm:px-7">
        <Panel className="w-full overflow-hidden">
          <div className="border-b border-white/8 px-6 py-5 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#E87524]/30 bg-[#E87524]/10 text-[#F59A55]">
              {result.rank === 1 ? (
                <Trophy size={30} />
              ) : (
                <Medal size={30} />
              )}
            </div>
            <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E87524]">
              Match complete
            </p>
            <h1 className="mt-2 text-3xl font-semibold text-white">
              {result.rank === 1 ? "Victory secured." : "Round complete."}
            </h1>
            <p className="mt-2 text-sm text-zinc-400">
              You finished #{result.rank} in this simulated match.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-px bg-white/8 sm:grid-cols-3">
            <div className="bg-[#0d0d0d] p-5 text-center">
              <SectionLabel>Final PnL</SectionLabel>
              <p className="mt-2 font-mono text-lg text-white">
                {signedMoney(myPlayer?.pnl ?? 0)}
              </p>
            </div>
            <div className="bg-[#0d0d0d] p-5 text-center">
              <SectionLabel>Old rating</SectionLabel>
              <p className="mt-2 font-mono text-lg text-zinc-300">
                {myPlayer?.rating ?? 100}
              </p>
            </div>
            <div className="col-span-2 bg-[#0d0d0d] p-5 text-center sm:col-span-1">
              <SectionLabel>Demo rating change</SectionLabel>
              <p
                className={`mt-2 font-mono text-lg font-bold ${
                  result.change >= 0 ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {result.change > 0 ? "+" : ""}
                {result.change} CW
              </p>
              <p className="mt-1 text-[10px] text-zinc-500">
                New rating: {newRating}
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-3 p-5 sm:flex-row">
            <button
              type="button"
              onClick={onRematch}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-[#E87524] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#F59A55]"
            >
              <Swords size={16} /> Find another match
            </button>
            <button
              type="button"
              onClick={onExit}
              className="flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-sm text-zinc-300 transition hover:bg-white/5"
            >
              <DoorOpen size={16} /> Exit arena
            </button>
          </div>
          <p className="px-5 pb-5 text-center text-[10px] leading-5 text-zinc-600">
            Frontend demonstration only. Ratings, PnL and match results are not
            saved to a server or the Global Leaderboard.
          </p>
        </Panel>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-4 px-3 py-4 sm:px-6 sm:py-6">
      <header className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onExit}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:text-white"
            aria-label="Exit match"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
              <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-400">
                Demo match active
              </p>
            </div>
            <h1 className="mt-1 text-lg font-semibold text-white sm:text-xl">
              {matchType === "duel" ? "Online Duel" : "4-Player Rumble"}
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#0d0d0d] px-4 py-2.5">
          <Clock3 size={16} className="text-[#E87524]" />
          <div>
            <p className="text-[9px] uppercase tracking-wider text-zinc-500">
              Time remaining
            </p>
            <p className="font-mono text-base font-semibold text-white">
              {String(Math.floor(remaining / 60)).padStart(2, "0")}:
              {String(remaining % 60).padStart(2, "0")}
            </p>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {players
          .filter((player) => player.isYou || matchType === "duel")
          .map((player) => (
            <Panel key={player.id} className="p-4">
              <div className="flex items-center gap-3">
                <Avatar player={player} size="h-11 w-11" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-white">
                    {player.isYou ? "YOU · TRADER" : player.name}
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-500">
                    CW Rating {Math.round(player.rating)}
                  </p>
                </div>
                <div className="text-right">
                  <SectionLabel>Virtual PnL</SectionLabel>
                  <p
                    className={`mt-1 font-mono text-base font-semibold ${
                      player.pnl + (player.isYou ? myPnl : 0) >= 0
                        ? "text-emerald-400"
                        : "text-red-400"
                    }`}
                  >
                    {signedMoney(player.pnl + (player.isYou ? myPnl : 0))}
                  </p>
                </div>
              </div>
            </Panel>
          ))}
      </div>

      <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-[minmax(0,1fr)_310px]">
        <div className="min-w-0 space-y-4">
          <Panel className="overflow-hidden">
            <MarketChart
              price={price}
              candles={candles}
              players={players}
              positions={positions}
            />
          </Panel>

          <Panel className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <SectionLabel>Trade execution</SectionLabel>
                <h2 className="mt-1 text-sm font-semibold text-white">
                  BTC / USD · Paper trading
                </h2>
              </div>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-zinc-500">
                No real orders
              </span>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="rounded-lg border border-white/8 bg-white/2 p-3">
                <SectionLabel>Available balance</SectionLabel>
                <p className="mt-2 font-mono text-lg text-white">
                  {money(balance)}
                </p>
              </div>
              <div className="rounded-lg border border-white/8 bg-white/2 p-3">
                <SectionLabel>Open PnL</SectionLabel>
                <p
                  className={`mt-2 font-mono text-lg ${
                    myPnl >= 0 ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  {signedMoney(myPnl)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
              <label className="text-xs text-zinc-400" htmlFor="trade-size">
                Order size (BTC)
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.max(0.001, Number((value - 0.01).toFixed(3)))
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-300"
                  aria-label="Decrease order size"
                >
                  <Minus size={13} />
                </button>
                <input
                  id="trade-size"
                  type="number"
                  min="0.001"
                  max="0.1"
                  step="0.001"
                  value={quantity}
                  onChange={(event) =>
                    setQuantity(
                      Math.max(
                        0.001,
                        Math.min(0.1, Number(event.target.value) || 0.001)
                      )
                    )
                  }
                  className="w-24 rounded-md border border-white/10 bg-black px-2 py-2 text-center font-mono text-xs text-white outline-none focus:border-[#E87524]/60"
                />
                <button
                  type="button"
                  onClick={() =>
                    setQuantity((value) =>
                      Math.min(0.1, Number((value + 0.01).toFixed(3)))
                    )
                  }
                  className="flex h-8 w-8 items-center justify-center rounded-md border border-white/10 text-zinc-300"
                  aria-label="Increase order size"
                >
                  <Plus size={13} />
                </button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => placeOrder("BUY")}
                className="flex items-center justify-center gap-2 rounded-lg bg-emerald-400 px-3 py-3 text-sm font-bold text-black transition hover:bg-emerald-300"
              >
                <ArrowUpRight size={17} /> Buy / Long
              </button>
              <button
                type="button"
                onClick={() => placeOrder("SELL")}
                className="flex items-center justify-center gap-2 rounded-lg bg-red-400 px-3 py-3 text-sm font-bold text-black transition hover:bg-red-300"
              >
                <ArrowDownRight size={17} /> Sell / Short
              </button>
            </div>
            <p className="mt-3 text-[10px] leading-5 text-zinc-600">
              Demo execution only. Orders are not sent to an exchange. This
              prototype does not model fees, margin or liquidation.
            </p>
          </Panel>

          <Panel className="overflow-hidden">
            <div className="flex gap-1 border-b border-white/8 p-2">
              {[
                { id: "positions", label: `Open positions (${positions.length})` },
                { id: "activity", label: "Trade activity" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setTab(item.id)}
                  className={`rounded-lg px-3 py-2 text-[10px] ${
                    tab === item.id
                      ? "bg-white/8 text-white"
                      : "text-zinc-500 hover:text-white"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {tab === "positions" ? (
              positions.length ? (
                <div className="divide-y divide-white/6">
                  {positions.map((position) => {
                    const movement =
                      position.side === "BUY"
                        ? price - position.entryPrice
                        : position.entryPrice - price;
                    const pnl = movement * position.quantity;

                    return (
                      <div
                        key={position.id}
                        className="flex flex-wrap items-center justify-between gap-3 px-4 py-3"
                      >
                        <div>
                          <span
                            className={`text-xs font-semibold ${
                              position.side === "BUY"
                                ? "text-emerald-400"
                                : "text-red-400"
                            }`}
                          >
                            {position.side}
                          </span>
                          <p className="mt-1 text-[10px] text-zinc-500">
                            BTC · {position.quantity} BTC @{" "}
                            {money(position.entryPrice)}
                          </p>
                        </div>
                        <div className="flex items-center gap-3">
                          <span
                            className={`font-mono text-xs ${
                              pnl >= 0 ? "text-emerald-400" : "text-red-400"
                            }`}
                          >
                            {signedMoney(pnl)}
                          </span>
                          <button
                            type="button"
                            onClick={() => closePosition(position)}
                            className="rounded-md border border-white/10 px-2.5 py-1.5 text-[10px] text-zinc-300 hover:border-white/30"
                          >
                            Close
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="p-6 text-center">
                  <Activity className="mx-auto text-zinc-600" size={22} />
                  <p className="mt-2 text-xs text-zinc-400">
                    No open positions yet
                  </p>
                  <p className="mt-1 text-[10px] text-zinc-600">
                    Place a demo order to see its entry line on the chart.
                  </p>
                </div>
              )
            ) : (
              <div className="p-4">
                {positions.length ? (
                  positions.map((position) => (
                    <div
                      key={position.id}
                      className="flex justify-between gap-3 py-2 text-xs"
                    >
                      <span className="text-zinc-400">
                        {position.side} · BTC
                      </span>
                      <span className="font-mono text-zinc-300">
                        {money(position.entryPrice)}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-zinc-500">
                    Your trade activity will appear here.
                  </p>
                )}
              </div>
            )}
          </Panel>
        </div>

        <aside className="min-w-0 space-y-4">
          <Panel className="p-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <SectionLabel>Competition</SectionLabel>
                <h2 className="mt-1 text-sm font-semibold text-white">
                  Match leaderboard
                </h2>
              </div>
              <Trophy size={18} className="text-[#E87524]" />
            </div>

            <p className="mt-2 text-[10px] text-zinc-500">
              Ranked by simulated match PnL · Not CW Rating
            </p>

            <div className="mt-4 space-y-3">
              {rankedPlayers.map((player, index) => (
                <PlayerCard
                  key={player.id}
                  player={player}
                  rank={index + 1}
                  activeEmote={activeEmotes[player.id]}
                  onEmote={sendEmote}
                />
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="flex items-center justify-between gap-2">
              <SectionLabel>Quick reactions</SectionLabel>
              <span className="text-[10px] text-zinc-600">No voice chat</span>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              {EMOTES.map((emote) => (
                <button
                  key={emote.label}
                  type="button"
                  onClick={() => sendEmote("you")}
                  title={emote.label}
                  className="rounded-lg border border-white/8 bg-white/2 px-1 py-2.5 transition hover:border-[#E87524]/50 hover:bg-[#E87524]/8"
                >
                  <span className="text-xl">{emote.emoji}</span>
                  <span className="mt-1 block text-[8px] text-zinc-500">
                    {emote.label}
                  </span>
                </button>
              ))}
            </div>
          </Panel>

          <Panel className="p-4">
            <div className="flex items-center gap-2">
              <Wallet size={16} className="text-[#E87524]" />
              <SectionLabel>Your account</SectionLabel>
            </div>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Virtual equity</span>
              <span className="font-mono text-sm text-white">
                {money(myEquity)}
              </span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Open positions</span>
              <span className="text-xs text-white">{positions.length}</span>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <span className="text-xs text-zinc-500">Starting CW Rating</span>
              <span className="font-mono text-xs text-white">
                {myPlayer?.rating ?? 100}
              </span>
            </div>
          </Panel>

          <button
            type="button"
            onClick={onExit}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <X size={14} /> Leave demo match
          </button>
        </aside>
      </div>
    </main>
  );
}

function OnlineLobby({ onStart, rating = 100 }) {
  const [matchType, setMatchType] = useState("duel");
  const [duration, setDuration] = useState("5");

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0d0d0d] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E87524]/10 blur-3xl" />
        <div className="relative max-w-2xl">
          <div className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#E87524]">
            <Radio size={13} /> ChartWars · Online arena
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-tight text-white sm:text-4xl">
            Your next rival is waiting.
          </h2>
          <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
            Enter a simulated trading duel, read the market, manage your virtual
            positions and climb the match standings.
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {["Skill-first competition", "Virtual funds", "No voice chat"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 px-3 py-1.5 text-[10px] text-zinc-400"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4">
          <SectionLabel>Step 01 · Select your format</SectionLabel>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Choose your battle
          </h3>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            {
              id: "duel",
              title: "1v1 Duel",
              description: "A focused head-to-head trading challenge.",
              players: "2 PLAYERS",
              icon: Swords,
            },
            {
              id: "rumble",
              title: "4-Player Rumble",
              description: "Four traders. One market. One winner.",
              players: "4 PLAYERS",
              icon: Users,
            },
          ].map((mode) => {
            const Icon = mode.icon;
            const selected = matchType === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => setMatchType(mode.id)}
                className={`rounded-xl border p-5 text-left transition ${
                  selected
                    ? "border-[#E87524]/60 bg-[#E87524]/6"
                    : "border-white/10 bg-[#0d0d0d] hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between">
                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                      selected
                        ? "border-[#E87524]/40 bg-[#E87524]/10 text-[#F59A55]"
                        : "border-white/10 text-zinc-400"
                    }`}
                  >
                    <Icon size={22} />
                  </div>
                  <span
                    className={`rounded-full px-2.5 py-1 text-[9px] font-semibold ${
                      selected
                        ? "bg-[#E87524]/15 text-[#F59A55]"
                        : "bg-white/5 text-zinc-500"
                    }`}
                  >
                    {mode.players}
                  </span>
                </div>
                <h4 className="mt-5 text-lg font-semibold text-white">
                  {mode.title}
                </h4>
                <p className="mt-2 text-xs leading-5 text-zinc-400">
                  {mode.description}
                </p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-[10px] text-zinc-500">
                    {selected ? "Selected format" : "Select format"}
                  </span>
                  <span
                    className={`flex h-5 w-5 items-center justify-center rounded-full border ${
                      selected
                        ? "border-[#E87524] bg-[#E87524] text-black"
                        : "border-white/20 text-transparent"
                    }`}
                  >
                    <Check size={12} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4">
          <SectionLabel>Step 02 · Match settings</SectionLabel>
          <h3 className="mt-2 text-lg font-semibold text-white">
            Set your duration
          </h3>
        </div>
        <div className="grid grid-cols-3 gap-3">
          {["5", "10", "15"].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setDuration(value)}
              className={`rounded-xl border p-4 text-center transition ${
                duration === value
                  ? "border-[#E87524]/60 bg-[#E87524]/6"
                  : "border-white/10 bg-[#0d0d0d] hover:border-white/20"
              }`}
            >
              <Clock3
                size={18}
                className={`mx-auto ${
                  duration === value ? "text-[#F59A55]" : "text-zinc-500"
                }`}
              />
              <p className="mt-2 text-xl font-semibold text-white">{value}</p>
              <p className="text-[10px] text-zinc-500">Minutes</p>
            </button>
          ))}
        </div>
      </section>

      <Panel className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#E87524]/25 bg-[#E87524]/10 text-[#F59A55]">
            <Award size={23} />
          </div>
          <div>
            <SectionLabel>Your competitive profile</SectionLabel>
            <p className="mt-1 text-sm font-semibold text-white">
              CW Rating · {rating}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">
              New player starting rating
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={() => onStart(matchType, duration)}
          className="flex items-center justify-center gap-2 rounded-lg bg-[#E87524] px-5 py-3 text-sm font-semibold text-black transition hover:bg-[#F59A55]"
        >
          <Swords size={16} /> Enter demo arena <ArrowRight size={16} />
        </button>
      </Panel>

      <p className="text-center text-[10px] leading-5 text-zinc-600">
        Prototype matchmaking: this opens a local demo match with simulated
        opponents. It does not connect to real strangers yet.
      </p>
    </div>
  );
}

export default function RoomsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMode, setSelectedMode] = useState(
    searchParams.get("mode") || "friends"
  );
  const [onlineMatch, setOnlineMatch] = useState(null);

  const coinId = searchParams.get("coin");
  const startingBalance = searchParams.get("balance") || "10000";
  const duration = searchParams.get("duration") || "5";

  const startMode = (mode) => {
    setSelectedMode(mode);

    if (mode === "online") {
      setOnlineMatch(null);
      return;
    }

    if (mode === "tournament") return;

    if (["friends", "blind", "coaches"].includes(mode) && coinId) {
      navigate(
        `/dashboard/markets/${encodeURIComponent(coinId)}?mode=${mode}&balance=${encodeURIComponent(startingBalance)}&duration=${encodeURIComponent(duration)}`
      );
    }
  };

  const openArena = (matchType, matchDuration) => {
    setOnlineMatch({ matchType, duration: matchDuration });
  };

  const exitArena = () => {
    setOnlineMatch(null);
    setSelectedMode("online");
  };

  if (onlineMatch) {
    return (
      <OnlineArena
        matchType={onlineMatch.matchType}
        duration={onlineMatch.duration}
        onExit={exitArena}
        onRematch={() => openArena(onlineMatch.matchType, onlineMatch.duration)}
      />
    );
  }

  if (selectedMode === "online") {
    return (
      <main className="mx-auto w-full max-w-360 space-y-7 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setSelectedMode("friends")}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:text-white"
            aria-label="Back to room selection"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <SectionLabel>Rooms / Online mode</SectionLabel>
            <h1 className="mt-1 text-xl font-semibold text-white">
              Online Matchmaking
            </h1>
          </div>
        </div>
        <OnlineLobby onStart={openArena} rating={100} />
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-360 space-y-7 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
      <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#E87524]/8 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E87524]">
            ChartWars · Practice arena
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Every round makes you sharper.
          </h1>
          <p className="mt-3 max-w-xl text-xs leading-6 text-zinc-400 sm:text-sm">
            Choose your practice style, work with virtual funds, and learn to
            read market movements without risking real money.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
            {["Virtual funds", "Skill-first practice", "No real trades"].map(
              (label) => (
                <span
                  key={label}
                  className="rounded-full border border-white/10 px-3 py-1.5"
                >
                  {label}
                </span>
              )
            )}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">Choose your room</h2>
            <p className="mt-1 text-xs text-zinc-500">
              Select a mode to continue.
            </p>
          </div>
          <DoorOpen size={20} className="text-[#E87524]" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {[
            ...MODES,
            {
              id: "online",
              title: "Online Mode",
              description:
                "Enter a competitive arena with a live-style chart, match leaderboard, virtual trading and instant results.",
              detail: "Competitive matchmaking",
              icon: Swords,
              status: "Demo Ready",
            },
          ].map((mode) => {
            const Icon = mode.icon;
            const selected = selectedMode === mode.id;
            const comingSoon = mode.id === "tournament";

            return (
              <article
                key={mode.id}
                className={`rounded-xl border bg-[#0d0d0d] p-5 transition ${
                  selected
                    ? "border-[#E87524]/45"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#E87524]/20 bg-[#E87524]/8">
                    <Icon size={20} className="text-[#F59A55]" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] ${
                      comingSoon
                        ? "border-white/10 text-zinc-500"
                        : mode.id === "online"
                          ? "border-[#E87524]/30 text-[#F59A55]"
                          : "border-emerald-400/20 text-emerald-400"
                    }`}
                  >
                    {mode.status}
                  </span>
                </div>

                <p className="mt-5 text-[10px] uppercase tracking-wider text-zinc-600">
                  {mode.detail}
                </p>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {mode.title}
                </h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-400">
                  {mode.description}
                </p>

                {comingSoon ? (
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/8 bg-white/2 px-3 py-3 text-xs text-zinc-500">
                    <Clock3 size={14} />
                    This mode is on the roadmap.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startMode(mode.id)}
                    className={`mt-5 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-xs font-medium transition ${
                      selected
                        ? "border-[#E87524]/40 bg-[#E87524]/10 text-[#F59A55]"
                        : "border-white/10 text-zinc-300 hover:border-[#E87524]/40 hover:text-white"
                    }`}
                  >
                    {mode.id === "online"
                      ? "Open online lobby"
                      : coinId
                        ? "Continue with selected coin"
                        : "Open chart to begin"}
                    <ArrowRight size={15} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {!coinId && (
        <section className="flex flex-col justify-between gap-4 rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-white">
              Choose a market before starting practice
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Select a coin first, then configure your virtual practice session.
              Online Mode currently uses a simulated BTC/USD chart.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/markets")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#E87524] px-4 py-3 text-xs font-semibold text-black transition hover:bg-[#F59A55]"
          >
            Explore markets <ArrowRight size={14} />
          </button>
        </section>
      )}
    </main>
  );
}
