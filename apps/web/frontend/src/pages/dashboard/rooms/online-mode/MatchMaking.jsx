import { useEffect, useState } from "react";
import { Navigate, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { X } from "lucide-react";

import "./MatchMaking.css";

// Adjust these to your real router paths.
const ROUTES = {
  setup: "/dashboard/rooms/online",
  matchFound: "/dashboard/rooms/online/match-found",
  coach: "/dashboard/rooms?mode=coach",
};

const SEARCH_SECONDS = 15;
const RATING_BAND = 100;

// While there is no backend, the opponent is simulated and clearly labelled.
// Set to false once the real queue exists.
const DEMO_MODE = true;

// Replace with the signed-in player's real rating.
const PROFILE = { rating: 1200 };

const SYMBOLS = {
  bitcoin: "BTC",
  ethereum: "ETH",
  solana: "SOL",
  dogecoin: "DOGE",
  ripple: "XRP",
  binancecoin: "BNB",
};

const DEMO_COUNTRIES = ["US", "GB", "DE", "JP", "BR", "SG", "AE", "AU", "CA", "FR"];

const PHASES = [
  { until: 4, text: "Opening the queue" },
  { until: 9, text: "Looking for a rating match" },
  { until: 13, text: "Checking symbol and match length" },
  { until: Infinity, text: "Last seconds of the search" },
];

// Decorative dots on the radar (angle in degrees, distance in % from the centre).
// They are not real players.
const BLIPS = [
  [35, 30], [80, 18], [130, 36], [165, 24], [210, 33], [250, 14], [295, 28], [330, 38],
];

const regionNames =
  typeof Intl.DisplayNames === "function" ? new Intl.DisplayNames(["en"], { type: "region" }) : null;

const countryName = (code) => regionNames?.of(code) ?? code;

function Flag({ code, className = "h-7 w-10" }) {
  const lower = code.toLowerCase();
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

function Side({ code, label, sub }) {
  return (
    <div className="flex min-w-32 flex-col items-center gap-2 text-center">
      <span className="mm-ring-static p-0.5">
        <span className="flex h-12 w-16 items-center justify-center bg-[#0b0b0b]">
          <Flag code={code} className="h-8 w-12" />
        </span>
      </span>
      <span className="text-sm font-semibold text-white">{label}</span>
      <span className="font-mono text-[11px] text-zinc-500">{sub}</span>
    </div>
  );
}

export default function MatchMaking() {
  const navigate = useNavigate();
  const location = useLocation();
  const [params] = useSearchParams();

  const queueId = params.get("queueId") ?? "q_unknown";
  const setup = location.state;
  const valid = Boolean(setup?.symbol);

  const [status, setStatus] = useState("searching"); // searching | found | timeout
  const [elapsed, setElapsed] = useState(0);
  const [opponent, setOpponent] = useState(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!valid || status !== "searching") return undefined;

    const start = performance.now();
    // TODO(backend): join the queue here, then listen for a match (WebSocket) instead of this timer.
    const foundAtMs = DEMO_MODE ? 5000 + Math.random() * 6000 : null;

    const id = setInterval(() => {
      const ms = performance.now() - start;

      if (foundAtMs != null && ms >= foundAtMs) {
        setOpponent({
          country: DEMO_COUNTRIES[Math.floor(Math.random() * DEMO_COUNTRIES.length)],
          rating: PROFILE.rating + Math.round((Math.random() * 2 - 1) * RATING_BAND),
        });
        setStatus("found");
        return;
      }

      if (ms >= SEARCH_SECONDS * 1000) {
        setElapsed(SEARCH_SECONDS);
        setStatus("timeout");
        return;
      }

      setElapsed(ms / 1000);
    }, 200);

    // TODO(backend): leave the queue in this cleanup.
    return () => clearInterval(id);
  }, [valid, status, attempt]);

  if (!valid) return <Navigate to={ROUTES.setup} replace />;

  const symbol = SYMBOLS[setup.symbol] ?? setup.symbol.toUpperCase();
  const formatLabel = setup.players === 4 ? "4 players" : "1v1";
  const low = PROFILE.rating - RATING_BAND;
  const high = PROFILE.rating + RATING_BAND;
  const remaining = Math.max(0, Math.ceil(SEARCH_SECONDS - elapsed));
  const phase = PHASES.find((p) => elapsed < p.until)?.text ?? "";
  const chips = [symbol, formatLabel, `${setup.minutes} min`, `Rating ${low.toLocaleString("en-US")}-${high.toLocaleString("en-US")}`];

  const RING = 2 * Math.PI * 48;

  const cancel = () => navigate(ROUTES.setup);

  const searchAgain = () => {
    setElapsed(0);
    setOpponent(null);
    setStatus("searching");
    setAttempt((n) => n + 1);
  };

  const enterMatch = () => {
    const roomId = `rm_demo_${Math.floor(1000 + Math.random() * 9000)}`;
    navigate(`${ROUTES.matchFound}?roomId=${roomId}`, {
      state: { ...setup, opponent, roomId, demo: DEMO_MODE },
    });
  };

  return (
    <main className="mm-root flex h-dvh flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={cancel}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <X size={14} />
          {status === "searching" ? "Cancel" : "Back to setup"}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Online mode <span className="text-orange-500">/</span> Matchmaking
        </p>
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">{queueId}</span>
      </header>

      <section className="flex min-h-0 flex-1 flex-col items-center justify-center gap-5 overflow-y-auto px-4 py-4">
        {DEMO_MODE && (
          <p className="border border-amber-500/40 bg-amber-500/10 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.18em] text-amber-300">
            Demo: backend not connected, opponent is simulated
          </p>
        )}

        {/* Radar */}
        <div
          className={`relative size-[min(42vh,80vw,380px)] shrink-0 ${status === "found" ? "is-found" : ""}`}
          aria-hidden="true"
        >
          <div className="mm-radar absolute inset-[3%]">
            <div className="absolute inset-[16%] rounded-full border border-orange-500/25" />
            <div className="absolute inset-[33%] rounded-full border border-orange-500/25" />
            <div className="absolute inset-[50%] rounded-full border border-orange-500/25" />
            <div className="absolute left-0 right-0 top-1/2 h-px bg-orange-500/20" />
            <div className="absolute bottom-0 left-1/2 top-0 w-px bg-orange-500/20" />

            {status === "searching" && <div className="mm-sweep" />}

            {status === "searching" &&
              BLIPS.map(([angle, dist]) => {
                const rad = (angle * Math.PI) / 180;
                return (
                  <span
                    key={angle}
                    className="mm-blip"
                    style={{
                      left: `${50 + dist * Math.sin(rad)}%`,
                      top: `${50 - dist * Math.cos(rad)}%`,
                      animationDelay: `${(angle / 360) * 3}s`,
                    }}
                  />
                );
              })}

            <div className="absolute inset-0 flex items-center justify-center">
              <span className="mm-ping" />
              <span className="relative flex h-10 w-14 items-center justify-center rounded-md border border-orange-500/60 bg-black/80">
                <Flag code={setup.country} className="h-6 w-9" />
              </span>
            </div>

            {status === "found" && <span className="mm-flash" />}
          </div>

          <svg viewBox="0 0 100 100" className="absolute inset-0 size-full -rotate-90">
            <circle cx="50" cy="50" r="48" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="1.2" />
            <circle
              cx="50"
              cy="50"
              r="48"
              fill="none"
              stroke="#f97316"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray={RING}
              strokeDashoffset={RING * (status === "searching" ? elapsed / SEARCH_SECONDS : status === "timeout" ? 1 : 0)}
              style={{ filter: "drop-shadow(0 0 4px rgba(249,115,22,0.8))" }}
            />
          </svg>
        </div>

        {/* Status */}
        {status === "searching" && (
          <div className="text-center">
            <p className="font-mono text-5xl font-bold tabular-nums text-orange-300" aria-label={`${remaining} seconds left`}>
              00:{String(remaining).padStart(2, "0")}
            </p>
            <p aria-live="polite" className="mt-2 font-mono text-xs uppercase tracking-[0.2em] text-zinc-400">
              {phase}
            </p>
          </div>
        )}

        {status === "found" && opponent && (
          <div role="status" className="flex flex-col items-center gap-4">
            <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-400">Opponent found</p>
            <div className="flex items-center gap-8 border border-orange-500/40 bg-black/50 px-8 py-4 shadow-[0_0_30px_rgba(249,115,22,0.15)]">
              <Side code={setup.country} label="You" sub={`Rating ${PROFILE.rating.toLocaleString("en-US")}`} />
              <span className="font-mono text-2xl font-bold text-orange-500">VS</span>
              <Side
                code={opponent.country}
                label="Unknown trader"
                sub={`${countryName(opponent.country)} · ${opponent.rating.toLocaleString("en-US")}`}
              />
            </div>
            <button
              type="button"
              onClick={enterMatch}
              className="mm-cta border border-orange-400 bg-orange-500 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              [ Enter match ]
            </button>
          </div>
        )}

        {status === "timeout" && (
          <div role="status" className="flex max-w-md flex-col items-center gap-4 text-center">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.3em] text-red-400">No opponent found</p>
              <p className="mt-2 text-sm leading-6 text-zinc-400">
                Nobody matched your settings in {SEARCH_SECONDS} seconds. Few players may be online right now.
              </p>
            </div>
            <div className="flex flex-wrap justify-center gap-2">
              <button
                type="button"
                onClick={searchAgain}
                className="border border-orange-400 bg-orange-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
              >
                Search again
              </button>
              <button
                type="button"
                onClick={() => navigate(ROUTES.coach)}
                className="border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Play Vs Coach
              </button>
              <button
                type="button"
                onClick={cancel}
                className="border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
              >
                Change setup
              </button>
            </div>
          </div>
        )}
      </section>

      <footer className="flex shrink-0 flex-wrap items-center justify-center gap-2 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-3">
        {chips.map((chip) => (
          <span key={chip} className="border border-white/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-400">
            {chip}
          </span>
        ))}
        <span className="font-mono text-[10px] uppercase tracking-widest text-zinc-600">Virtual funds only</span>
      </footer>
    </main>
  );
}