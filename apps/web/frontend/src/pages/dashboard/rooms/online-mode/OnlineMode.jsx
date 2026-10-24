import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ChevronDown, RefreshCw, Search } from "lucide-react";

import { fetchMarkets } from "../../../../services/cryptoMarketAPI";
import "./OnlineMode.css";

const ROUTES = {
  exit: "/dashboard/rooms",
  searching: "/dashboard/rooms/online/searching",
};

/* ---------- Data ---------- */

// Replace with the signed-in player's real data once the backend exists.
const PROFILE = { rating: 1200, rank: null };

const WATCH = [
  { id: "bitcoin", symbol: "BTC", name: "Bitcoin" },
  { id: "ethereum", symbol: "ETH", name: "Ethereum" },
  { id: "solana", symbol: "SOL", name: "Solana" },
  { id: "dogecoin", symbol: "DOGE", name: "Dogecoin" },
  { id: "ripple", symbol: "XRP", name: "XRP" },
  { id: "binancecoin", symbol: "BNB", name: "BNB" },
];

const TIMERS = [1, 3, 5];

const PLAYER_MODES = [
  { id: 2, label: "1 vs 1", sub: "Two players", live: true },
  { id: 4, label: "4 players", sub: "Free-for-all", live: false },
];

// Breaking these ends the match. Keep the values in step with the match engine.
const RULES = [
  { id: "stoploss", label: "Stop-loss", value: "Required", tip: "No trade without a stop-loss." },
  { id: "risk", label: "Risk per trade", value: "1% max", tip: "Position size is capped by your risk limit." },
  { id: "drawdown", label: "Max drawdown", value: "3%", tip: "If total loss passes this, the match ends." },
];

// Information only: these are not rules you can break.
const PARAMS = [
  { id: "slippage", label: "Slippage", value: "Dynamic", tip: "Fills can differ slightly from the price you see." },
  { id: "rating", label: "Rating change", value: "±100 max", tip: "One match moves your rating by at most 100." },
];

const REGIONS = ["All", "Asia", "Europe", "Americas", "Africa", "Oceania"];

const COUNTRY_CODES = [
  ["IN", "Asia"], ["CN", "Asia"], ["JP", "Asia"], ["KR", "Asia"], ["SG", "Asia"], ["AE", "Asia"],
  ["SA", "Asia"], ["ID", "Asia"], ["MY", "Asia"], ["TH", "Asia"], ["VN", "Asia"], ["PH", "Asia"],
  ["PK", "Asia"], ["BD", "Asia"], ["LK", "Asia"], ["NP", "Asia"], ["TR", "Asia"], ["IL", "Asia"],
  ["QA", "Asia"], ["GB", "Europe"], ["DE", "Europe"], ["FR", "Europe"], ["IT", "Europe"],
  ["ES", "Europe"], ["NL", "Europe"], ["CH", "Europe"], ["SE", "Europe"], ["NO", "Europe"],
  ["PL", "Europe"], ["PT", "Europe"], ["IE", "Europe"], ["UA", "Europe"], ["GR", "Europe"],
  ["US", "Americas"], ["CA", "Americas"], ["BR", "Americas"], ["MX", "Americas"],
  ["AR", "Americas"], ["CL", "Americas"], ["CO", "Americas"], ["NG", "Africa"], ["ZA", "Africa"],
  ["EG", "Africa"], ["KE", "Africa"], ["GH", "Africa"], ["MA", "Africa"], ["AU", "Oceania"],
  ["NZ", "Oceania"],
];

const regionNames =
  typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

const COUNTRIES = COUNTRY_CODES.map(([code, region]) => ({
  code,
  region,
  name: regionNames?.of(code) ?? code,
})).sort((a, b) => a.name.localeCompare(b.name));

/* ---------- Helpers ---------- */

function formatPrice(value) {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: value < 1 ? 4 : 2,
    maximumFractionDigits: value < 1 ? 6 : 2,
  }).format(value);
}

function Flag({ code, className = "h-5 w-7" }) {
  const lower = code.toLowerCase();
  return (
    <img
      src={`https://flagcdn.com/w80/${lower}.png`}
      srcSet={`https://flagcdn.com/w160/${lower}.png 2x`}
      alt=""
      loading="lazy"
      className={`rounded-[3px] object-cover ${className}`}
      onError={(event) => {
        event.currentTarget.style.visibility = "hidden";
      }}
    />
  );
}

function Panel({ index, title, children, className = "" }) {
  return (
    <section className={`ow-panel p-4 ${className}`}>
      <h2 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
        <span className="text-orange-500">{index}</span>
        <span className="text-zinc-600">/</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

/* ---------- 01 / Origin ---------- */

function CountryHub({ value, onChange }) {
  const [open, setOpen] = useState(false);
  const [term, setTerm] = useState("");
  const [region, setRegion] = useState("All");
  const rootRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const results = useMemo(() => {
    const t = term.trim().toLowerCase();
    return COUNTRIES.filter(
      (c) =>
        (region === "All" || c.region === region) &&
        (!t || c.name.toLowerCase().includes(t) || c.code.toLowerCase().includes(t))
    );
  }, [term, region]);

  const selected = COUNTRIES.find((c) => c.code === value);

  const choose = (country) => {
    onChange(country.code);
    setOpen(false);
    setTerm("");
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") setOpen(false);
    if (event.key === "Enter" && results[0]) {
      event.preventDefault();
      choose(results[0]);
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-4 border border-white/10 bg-black/40 p-3 text-left transition hover:border-orange-500/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
      >
        <span key={value} className="ow-ring ow-bind shrink-0">
          <span className="flex h-11 w-14 items-center justify-center bg-[#0b0b0b]">
            {selected && <Flag code={selected.code} className="h-7 w-10" />}
          </span>
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
            Your origin
          </span>
          <span className="block truncate text-base font-semibold text-white">
            {selected?.name ?? "Choose a country"}
          </span>
        </span>
        <ChevronDown size={18} className={`shrink-0 text-zinc-500 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="ow-panel absolute inset-x-0 top-full z-40 mt-2 bg-[#0a0a0a] p-3 shadow-2xl shadow-black">
          <div className="flex items-center gap-2 border border-white/10 bg-black/50 px-3">
            <Search size={15} className="shrink-0 text-zinc-500" />
            <input
              ref={inputRef}
              value={term}
              onChange={(event) => setTerm(event.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search country, press Enter to lock"
              aria-label="Search country"
              className="w-full bg-transparent py-2.5 text-sm text-white outline-none placeholder:text-zinc-600"
            />
          </div>

          <div className="mt-2 flex flex-wrap gap-1.5">
            {REGIONS.map((r) => (
              <button
                key={r}
                type="button"
                aria-pressed={region === r}
                onClick={() => setRegion(r)}
                className={`border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition ${
                  region === r
                    ? "border-orange-500 bg-orange-500/15 text-orange-300"
                    : "border-white/10 text-zinc-500 hover:text-zinc-200"
                }`}
              >
                {r}
              </button>
            ))}
          </div>

          <div role="listbox" aria-label="Countries" className="mt-2 grid max-h-48 grid-cols-2 gap-1.5 overflow-y-auto pr-1">
            {results.map((c) => (
              <button
                key={c.code}
                type="button"
                role="option"
                aria-selected={c.code === value}
                onClick={() => choose(c)}
                className={`flex items-center gap-2 border px-2.5 py-2 text-left text-xs transition ${
                  c.code === value
                    ? "border-orange-500/70 bg-orange-500/10 text-white"
                    : "border-white/8 text-zinc-300 hover:border-white/25"
                }`}
              >
                <Flag code={c.code} />
                <span className="truncate">{c.name}</span>
              </button>
            ))}
            {results.length === 0 && (
              <p className="col-span-2 py-4 text-center text-xs text-zinc-500">No country found</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ---------- 02 / Rules ---------- */

function RuleTile({ item, danger = false }) {
  return (
    <div
      tabIndex={0}
      aria-describedby={`tip-${item.id}`}
      className={`ow-rule border p-2.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        danger ? "border-red-500/25 bg-red-500/4" : "border-white/10"
      }`}
    >
      <span className="block font-mono text-[10px] uppercase tracking-[0.16em] text-zinc-500">{item.label}</span>
      <span className="mt-1 block font-mono text-sm font-semibold text-white">{item.value}</span>
      <span id={`tip-${item.id}`} role="tooltip" className="ow-tip">
        {item.tip}
      </span>
    </div>
  );
}

function Rules() {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-red-400">Enforced rules</p>
        <div className="grid grid-cols-3 gap-2 max-sm:grid-cols-1">
          {RULES.map((rule) => (
            <RuleTile key={rule.id} item={rule} danger />
          ))}
        </div>
      </div>
      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Parameters</p>
        <div className="grid grid-cols-2 gap-2">
          {PARAMS.map((param) => (
            <RuleTile key={param.id} item={param} />
          ))}
        </div>
      </div>
      <p className="border-l-2 border-red-500/60 pl-3 text-xs leading-5 text-zinc-400">
        Breaking an enforced rule ends your match. Rules are checked automatically.
      </p>
    </div>
  );
}

/* ---------- 03 / Assets ---------- */

function Sparkline({ values = [], up }) {
  const points = values.filter(Number.isFinite);
  if (points.length < 2) return <div className="size-full" aria-hidden="true" />;

  const step = Math.max(1, Math.floor(points.length / 40));
  const sample = points.filter((_, i) => i % step === 0);
  const min = Math.min(...sample);
  const max = Math.max(...sample);
  const range = max - min || 1;
  const d = sample
    .map((v, i) => `${i === 0 ? "M" : "L"}${(i / (sample.length - 1)) * 100} ${30 - ((v - min) / range) * 26}`)
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" preserveAspectRatio="none" className="size-full" aria-hidden="true">
      <path
        d={d}
        fill="none"
        stroke={up ? "#34d399" : "#f87171"}
        strokeWidth="1.6"
        vectorEffect="non-scaling-stroke"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}
function AssetCard({ asset, coin, active, flash, onSelect }) {
  const change = coin?.price_change_percentage_24h;
  const weekUp = (coin?.price_change_percentage_7d_in_currency ?? change ?? 0) >= 0;

  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      onClick={() => onSelect(asset.id)}
      className={`ow-asset flex min-h-26 min-w-0 flex-col gap-1 border p-2.5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        active ? "is-active" : "border-white/10"
      }`}
    >
      <div className="flex items-baseline justify-between gap-2">
        <span className="truncate font-mono text-sm font-bold text-white">
          {asset.symbol}
          <span className="ml-1.5 hidden text-[10px] font-normal text-zinc-500 xl:inline">{asset.name}</span>
        </span>
        {change != null && (
          <span className={`shrink-0 font-mono text-[11px] ${change >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {change >= 0 ? "+" : ""}
            {change.toFixed(2)}%
          </span>
        )}
      </div>

      <div className="min-h-6 flex-1">
        <Sparkline values={coin?.sparkline_in_7d?.price} up={weekUp} />
      </div>

      <span
        key={`${asset.id}-${coin?.current_price}`}
        className={`truncate font-mono text-sm font-semibold tabular-nums text-zinc-100 ${
          flash === "up" ? "ow-flash-up" : flash === "down" ? "ow-flash-down" : ""
        }`}
      >
        ${formatPrice(coin?.current_price)}
      </span>
    </button>
  );
}

/* ---------- 04 / Match format ---------- */

const RING_LENGTH = 2 * Math.PI * 30;

function PlayerSwitch({ value, onChange }) {
  return (
    <div role="radiogroup" aria-label="Players" className="flex gap-2">
      {PLAYER_MODES.map((mode) => {
        const active = value === mode.id;
        return (
          <button
            key={mode.id}
            type="button"
            role="radio"
            aria-checked={active}
            disabled={!mode.live}
            onClick={() => onChange(mode.id)}
            className={`flex w-40 items-center justify-between border px-3 py-2.5 text-left transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
              active ? "border-orange-500/70 bg-orange-500/7" : "border-white/10"
            } ${mode.live ? "hover:border-white/25" : "cursor-not-allowed opacity-50"}`}
          >
            <span>
              <span className={`block font-mono text-sm font-semibold ${active ? "text-orange-300" : "text-white"}`}>
                {mode.label}
              </span>
              <span className="block text-[10px] text-zinc-500">{mode.sub}</span>
            </span>
            {!mode.live && (
              <span className="border border-white/15 px-1.5 py-0.5 font-mono text-[9px] tracking-widest text-zinc-500">
                SOON
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

function TimerGauge({ minutes, active, onSelect }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={active}
      aria-label={`${minutes} minute match`}
      onClick={() => onSelect(minutes)}
      className={`ow-gauge ${active ? "is-active" : ""} flex size-20 items-center justify-center rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400`}
    >
      <svg viewBox="0 0 72 72" className="absolute inset-0 size-full -rotate-90" aria-hidden="true">
        <circle cx="36" cy="36" r="30" fill="rgba(0,0,0,0.5)" stroke="rgba(255,255,255,0.08)" strokeWidth="4" />
        <circle
          className="ow-gauge-ring"
          cx="36"
          cy="36"
          r="30"
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={`${(minutes / 5) * RING_LENGTH} ${RING_LENGTH}`}
        />
      </svg>
      {active && <span key={minutes} className="ow-lock-ring" aria-hidden="true" />}
      <span className="relative text-center">
        <span className={`block font-mono text-xl font-bold ${active ? "text-orange-300" : "text-zinc-200"}`}>
          {minutes}
        </span>
        <span className="block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">min</span>
      </span>
    </button>
  );
}

/* ---------- Page ---------- */

export default function OnlineMode() {
  const navigate = useNavigate();
  const [country, setCountry] = useState("IN");
  const [symbol, setSymbol] = useState("bitcoin");
  const [minutes, setMinutes] = useState(3);
  const [players, setPlayers] = useState(2);

  const [coins, setCoins] = useState({});
  const [status, setStatus] = useState("loading"); // loading | ok | error
  const [flashes, setFlashes] = useState({});
  const [reloadKey, setReloadKey] = useState(0);
  const previousPrices = useRef({});
  const flashTimer = useRef(null);

  // Real prices from CoinGecko: on mount, then every 60 seconds.
  useEffect(() => {
    let alive = true;
    const controller = new AbortController();

    const load = () =>
      fetchMarkets({ page: 1, perPage: 30, signal: controller.signal })
        .then((data) => {
          if (!alive) return;

          const next = {};
          const flash = {};
          for (const item of WATCH) {
            const coin = data.find((c) => c.id === item.id);
            if (!coin) continue;
            next[item.id] = coin;

            const previous = previousPrices.current[item.id];
            if (previous != null && coin.current_price !== previous) {
              flash[item.id] = coin.current_price > previous ? "up" : "down";
            }
            previousPrices.current[item.id] = coin.current_price;
          }

          setCoins(next);
          setStatus("ok");

          if (Object.keys(flash).length > 0) {
            setFlashes(flash);
            clearTimeout(flashTimer.current);
            flashTimer.current = setTimeout(() => setFlashes({}), 1300);
          }
        })
        .catch((err) => {
          if (err.name === "AbortError" || !alive) return;
          // Keep the last good prices if a later refresh fails.
          setStatus((current) => (current === "ok" ? "ok" : "error"));
        });

    load();
    const intervalId = setInterval(load, 60000);

    return () => {
      alive = false;
      controller.abort();
      clearInterval(intervalId);
      clearTimeout(flashTimer.current);
    };
  }, [reloadKey]);

  const retry = () => {
    setStatus("loading");
    setReloadKey((key) => key + 1);
  };

  const countryName = COUNTRIES.find((c) => c.code === country)?.name ?? "";
  const asset = WATCH.find((w) => w.id === symbol);
  const formatLabel = players === 2 ? "1v1" : `${players} players`;

  const startMatchmaking = () => {
    // Replace this with the queue id your backend returns.
    const queueId = `q_${Math.floor(1000 + Math.random() * 9000)}`;
    navigate(`${ROUTES.searching}?queueId=${queueId}`, {
      state: { country, symbol, minutes, players },
    });
  };

  return (
    <main className="ow-root flex h-dvh flex-col overflow-hidden text-zinc-100 max-lg:h-auto max-lg:min-h-dvh max-lg:overflow-y-auto">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.exit)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          Exit
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Online mode <span className="text-orange-500">/</span> Pre-match setup
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">
          Virtual funds only
        </span>
      </header>

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[2fr_3fr]">
        {/* Left sector */}
        <div className="flex min-h-0 flex-col gap-4">
          <Panel index="01" title="Choose origin" className="relative z-20">
            <CountryHub value={country} onChange={setCountry} />
          </Panel>
          <Panel index="02" title="Duel rules & parameters" className="min-h-0 flex-1">
            <Rules />
          </Panel>
        </div>

        {/* Right sector */}
        <div className="flex min-h-64 flex-col gap-4">
          <Panel index="03" title="Market symbol" className="flex min-h-0 flex-1 flex-col">
            {status === "error" ? (
              <div className="flex flex-1 flex-col items-center justify-center gap-3 text-center">
                <p className="text-sm text-zinc-300">Could not load prices.</p>
                <button
                  type="button"
                  onClick={retry}
                  className="inline-flex items-center gap-2 border border-white/15 px-3 py-2 text-xs text-zinc-200 transition hover:border-orange-500/60"
                >
                  <RefreshCw size={13} />
                  Try again
                </button>
              </div>
            ) : (
              <div
                role="radiogroup"
                aria-label="Market symbol"
                aria-busy={status === "loading"}
                className={`grid min-h-0 flex-1 grid-cols-2 gap-2 sm:grid-cols-3 sm:grid-rows-2 ${
                  status === "loading" ? "animate-pulse opacity-60" : ""
                }`}
              >
                {WATCH.map((item) => (
                  <AssetCard
                    key={item.id}
                    asset={item}
                    coin={coins[item.id]}
                    active={symbol === item.id}
                    flash={flashes[item.id]}
                    onSelect={setSymbol}
                  />
                ))}
              </div>
            )}
            <p className="mt-2 text-[10px] text-zinc-600">Prices by CoinGecko. May be delayed. Not investment advice.</p>
          </Panel>

          <Panel index="04" title="Match format">
            <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-4">
              <div>
                <p className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Players</p>
                <PlayerSwitch value={players} onChange={setPlayers} />
              </div>
              <div>
                <p className="mb-2 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">
                  Match length
                </p>
                <div role="radiogroup" aria-label="Match length" className="flex items-center justify-center gap-5">
                  {TIMERS.map((m) => (
                    <TimerGauge key={m} minutes={m} active={minutes === m} onSelect={setMinutes} />
                  ))}
                </div>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Bottom HUD */}
      <footer className="sticky bottom-0 z-30 flex shrink-0 flex-wrap items-center justify-between gap-4 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-3 backdrop-blur">
        <div className="flex items-center gap-5">
          <div className="border border-orange-500/40 bg-orange-500/7 px-4 py-2 shadow-[0_0_20px_rgba(249,115,22,0.12)]">
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">CW Rating</span>
            <span className="block font-mono text-xl font-bold leading-6 text-orange-300">
              {PROFILE.rating.toLocaleString("en-US")}
            </span>
          </div>
          <div>
            <span className="block font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">Global rank</span>
            <span className="block font-mono text-sm text-zinc-300">
              {PROFILE.rank ? `#${PROFILE.rank.toLocaleString("en-US")}` : "Unranked"}
            </span>
          </div>
          <p className="hidden font-mono text-[11px] text-zinc-500 md:block">
            {asset?.symbol} <span className="text-zinc-700">·</span> {formatLabel}{" "}
            <span className="text-zinc-700">·</span> {minutes}m <span className="text-zinc-700">·</span> {countryName}
          </p>
        </div>

        <button
          type="button"
          onClick={startMatchmaking}
          className="ow-cta border border-orange-400 bg-orange-500 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          [ Initialize enemy matchmaking ]
        </button>
      </footer>
    </main>
  );
}