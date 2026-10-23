
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BrainCircuit,
  CircleHelp,
  Clock3,
  Crosshair,
  GraduationCap,
  Radio,
  Shield,
  Swords,
  Trophy,
  Zap,
} from "lucide-react";

const marketPreview = [
  { symbol: "BTC", name: "Bitcoin", price: "—", change: 1.82, positive: true },
  { symbol: "SOL", name: "Solana", price: "—", change: 0.74, positive: true },
  { symbol: "DOGE", name: "Dogecoin", price: "—", change: -0.63, positive: false },
  { symbol: "XRP", name: "XRP", price: "—", change: -0.28, positive: false },
];

const modes = [
  {
    id: "online",
    title: "Online Mode",
    subtitle: "Enter the live arena",
    label: "LIVE ARENA",
    icon: Radio,
    accent: "orange",
    detail: "Enter the online practice arena and explore available rooms.",
  },
  {
    id: "friends",
    title: "Friend Battle",
    subtitle: "Challenge your circle",
    label: "SOCIAL",
    icon: Shield,
    accent: "orange",
    detail: "Enter a shared room and compete with friends.",
  },
  {
    id: "blind",
    title: "Blind Trading",
    subtitle: "Trust your instincts",
    label: "REACTION",
    icon: CircleHelp,
    accent: "silver",
    detail: "Make decisions without relying on visible indicators.",
  },
  {
    id: "coach",
    title: "Coach Mode",
    subtitle: "Learn as you play",
    label: "AI PRACTICE",
    icon: BrainCircuit,
    accent: "cyan",
    detail: "Explore guided practice and decision-making concepts.",
  },
];


const demoMatches = [
  { id: 1, result: "win", opponent: "Practice opponent 01", mode: "Friend Battle", score: "+18 ELO" },
  { id: 2, result: "loss", opponent: "Practice opponent 02", mode: "Blind Trading", score: "−12 ELO" },
  { id: 3, result: "win", opponent: "Practice opponent 03", mode: "Tournament", score: "+22 ELO" },
  { id: 4, result: "win", opponent: "Practice opponent 04", mode: "Coach Mode", score: "+14 ELO" },
  { id: 5, result: "loss", opponent: "Practice opponent 05", mode: "Friend Battle", score: "−9 ELO" },
  { id: 6, result: "win", opponent: "Practice opponent 06", mode: "Blind Trading", score: "+16 ELO" },
  { id: 7, result: "win", opponent: "Practice opponent 07", mode: "Tournament", score: "+20 ELO" },
  { id: 8, result: "loss", opponent: "Practice opponent 08", mode: "Coach Mode", score: "−11 ELO" },
  { id: 9, result: "win", opponent: "Practice opponent 09", mode: "Friend Battle", score: "+17 ELO" },
  { id: 10, result: "win", opponent: "Practice opponent 10", mode: "Tournament", score: "+24 ELO" },
];

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-orange-400">
          {eyebrow}
        </p>
        <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">
          {title}
        </h2>
      </div>
      {action ? (
        <span className="flex shrink-0 items-center gap-1 text-xs text-zinc-500">
          {action}
          <ArrowRight size={14} />
        </span>
      ) : null}
    </div>
  );
}

function MarketOrb({ coin }) {
  const ChangeIcon = coin.positive ? ArrowUpRight : ArrowDownRight;

  return (
    <article
      className={`market-orb-card group relative overflow-hidden rounded-2xl border p-4 ${
        coin.positive
          ? "border-emerald-400/15"
          : "border-red-400/15"
      }`}
    >
      <div
        className={`orb-glow ${
          coin.positive ? "orb-glow-up" : "orb-glow-down"
        }`}
      />

      <div className="relative z-10 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-semibold text-white">{coin.symbol}</p>
          <p className="mt-1 text-xs text-zinc-500">{coin.name}</p>
        </div>
        <span
          className={`flex items-center gap-1 text-xs font-medium ${
            coin.positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <ChangeIcon size={14} />
          {Math.abs(coin.change).toFixed(2)}%
        </span>
      </div>

      <div className="relative z-10 flex min-h-32 items-center justify-center">
        <div
          className={`crypto-orb ${
            coin.positive ? "crypto-orb-up" : "crypto-orb-down"
          }`}
        >
          <div className="orb-ring orb-ring-one" />
          <div className="orb-ring orb-ring-two" />
          <div className="orb-core">
            <span className="text-sm font-bold tracking-widest text-white">
              {coin.symbol}
            </span>
            <span className="mt-1 text-xs text-white/60">{coin.price}</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between border-t border-white/10 pt-3">
        <span className="text-xs text-zinc-500">Market preview</span>
        <span
          className={`h-1.5 w-1.5 rounded-full ${
            coin.positive ? "bg-emerald-400" : "bg-red-400"
          }`}
        />
      </div>
    </article>
  );
}

function ModeModule({ mode, index, selected, onSelect }) {
  

  return (
    <button
      type="button"
      onClick={() => onSelect(selected ? null : mode.id)}
      aria-pressed={selected}
      className={`mode-module group relative min-h-64 overflow-hidden rounded-2xl border p-5 text-left transition duration-300 ${
        selected
          ? "border-orange-400/50 bg-orange-400/[0.07]"
          : "border-white/10 bg-[#0b0b0d] hover:border-orange-400/30"
      }`}
    >
      <div className={`mode-art mode-art-${mode.accent}`}>

        
          {mode.id === "online" && (
            <div className="online-core">
              <div className="online-ring online-ring-one" />
              <div className="online-ring online-ring-two" />
              <div className="online-ring online-ring-three" />
              <div className="online-signal">
                <Radio size={42} strokeWidth={1.3} />
              </div>
              <span className="online-status-dot" />
            </div>
          )}

        {mode.id === "friends" && (
          <>
            <div className="shield-shape shield-left">
              <Shield size={43} strokeWidth={1} />
            </div>
            <div className="shield-shape shield-right">
              <Shield size={43} strokeWidth={1} />
            </div>
            <span className="spark spark-one" />
            <span className="spark spark-two" />
            <span className="spark spark-three" />
          </>
        )}

        {mode.id === "blind" && (
          <div className="mystery-cube">
            <div className="cube-face cube-front">
              <CircleHelp size={42} strokeWidth={1.2} />
            </div>
            <div className="cube-face cube-back" />
          </div>
        )}

        {mode.id === "coach" && (
          <div className="ai-core">
            <div className="ai-core-ring ai-core-ring-one" />
            <div className="ai-core-ring ai-core-ring-two" />
            <BrainCircuit size={48} strokeWidth={1.1} />
            <span className="ai-core-dot" />
          </div>
        )}
        
      </div>

      <div className="relative z-10">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            {mode.label}
          </span>
          <span className="text-xs text-zinc-600">0{index + 1}</span>
        </div>

        <h3 className="mt-3 text-base font-semibold text-white">
          {mode.title}
        </h3>
        <p className="mt-1 text-sm text-zinc-500">{mode.subtitle}</p>

        <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
          <span className="text-xs text-zinc-400">
            {selected ? "Selected" : "Explore mode"}
          </span>
          <ArrowRight
            size={15}
            className="text-zinc-500 transition group-hover:translate-x-1 group-hover:text-orange-400"
          />
        </div>
      </div>
    </button>
  );
}

function MatchTimeline() {
  const [activeMatch, setActiveMatch] = useState(10);

  const selectedMatch = demoMatches.find((match) => match.id === activeMatch);

  return (
    <section className="rounded-2xl border border-white/10 bg-[#0b0b0d] p-5 sm:p-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
            Match telemetry
          </p>
          <h2 className="mt-2 text-xl font-semibold text-white">
            Your battle trajectory
          </h2>
          <p className="mt-1 text-sm text-zinc-500">
            An illustrative match timeline for the dashboard preview.
          </p>
        </div>
        <span className="rounded-md border border-orange-400/20 bg-orange-400/6 px-2.5 py-1.5 text-xs text-orange-300">
          DEMO DATA
        </span>
      </div>

      <div className="mt-8 rounded-xl border border-white/[0.07] bg-black/30 p-4 sm:p-6">
        <div className="mb-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs text-zinc-500">Illustrative rating curve</p>
            <p className="mt-1 text-2xl font-semibold text-white">
              <span className="text-orange-400">1,248</span>
              <span className="ml-2 text-xs font-normal text-zinc-500">
                sample ELO
              </span>
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-zinc-500">Recent form</p>
            <p className="mt-1 text-sm font-semibold text-emerald-400">7W / 3L</p>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute inset-0 flex flex-col justify-between">
            <span className="border-t border-dashed border-white/[0.07]" />
            <span className="border-t border-dashed border-white/[0.07]" />
            <span className="border-t border-dashed border-white/[0.07]" />
            <span className="border-t border-dashed border-white/[0.07]" />
          </div>

          <svg
            viewBox="0 0 600 150"
            role="img"
            aria-label="Illustrative match rating line"
            className="relative z-10 h-36 w-full overflow-visible"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="trajectoryFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#e87524" stopOpacity="0.24" />
                <stop offset="100%" stopColor="#e87524" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path
              d="M 10 112 L 74 88 L 138 100 L 202 62 L 266 76 L 330 44 L 394 59 L 458 30 L 522 42 L 590 12 L 590 150 L 10 150 Z"
              fill="url(#trajectoryFill)"
            />
            <path
              d="M 10 112 L 74 88 L 138 100 L 202 62 L 266 76 L 330 44 L 394 59 L 458 30 L 522 42 L 590 12"
              fill="none"
              stroke="#e87524"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            {demoMatches.map((match, index) => {
              const x = [10, 74, 138, 202, 266, 330, 394, 458, 522, 590][index];
              const y = [112, 88, 100, 62, 76, 44, 59, 30, 42, 12][index];
              const isWin = match.result === "win";

              return (
                <g
                  key={match.id}
                  className="timeline-point"
                  onMouseEnter={() => setActiveMatch(match.id)}
                  onFocus={() => setActiveMatch(match.id)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r="11"
                    fill="transparent"
                    stroke="transparent"
                    tabIndex="0"
                    role="button"
                    aria-label={`Match ${match.id}: ${match.result}`}
                    className="timeline-hit-area"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r={activeMatch === match.id ? 6 : 4}
                    fill={isWin ? "#34d399" : "#f87171"}
                    stroke="#09090b"
                    strokeWidth="2"
                    className="timeline-dot"
                  />
                </g>
              );
            })}
          </svg>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-zinc-500">
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-emerald-400" />
            Win
          </span>
          <span className="flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-red-400" />
            Loss
          </span>
          <span className="ml-auto">Select a match point to inspect</span>
        </div>
      </div>

      {selectedMatch && (
        <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-white/8 bg-white/2 p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                selectedMatch.result === "win"
                  ? "bg-emerald-400/10 text-emerald-400"
                  : "bg-red-400/10 text-red-400"
              }`}
            >
              {selectedMatch.result === "win" ? (
                <Trophy size={18} />
              ) : (
                <Swords size={18} />
              )}
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Match {selectedMatch.id} · {selectedMatch.mode}
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {selectedMatch.opponent} · {selectedMatch.result.toUpperCase()}
              </p>
            </div>
          </div>
          <span
            className={`text-sm font-semibold ${
              selectedMatch.result === "win"
                ? "text-emerald-400"
                : "text-red-400"
            }`}
          >
            {selectedMatch.score}
          </span>
        </div>
      )}
    </section>
  );
}

export default function MainHome() {
  const [selectedMode, setSelectedMode] = useState(null);

  return (
    <main className="cw-home mx-auto w-full max-w-screen-2xl space-y-10 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
      <style>{`
        .cw-hero {
          background:
            radial-gradient(ellipse at 78% 40%, rgba(232,117,36,.13), transparent 38%),
            radial-gradient(ellipse at 35% 100%, rgba(30,64,175,.07), transparent 45%),
            #09090b;
        }
        .cw-grid {
          background-image: linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px);
          background-size: 34px 34px;
          mask-image: linear-gradient(to right, transparent, black 15%, black 85%, transparent);
        }
        .wave-line {
          fill: none;
          stroke: #e87524;
          stroke-width: 1.1;
          opacity: .7;
          vector-effect: non-scaling-stroke;
          animation: cw-wave-drift 8s ease-in-out infinite alternate;
        }
        .wave-line:nth-child(2n) { stroke: #f7a66c; opacity: .32; animation-delay: -3s; }
        .wave-line:nth-child(3n) { stroke: #7dd3fc; opacity: .2; animation-delay: -5s; }
        @keyframes cw-wave-drift {
          from { transform: translateY(-5px) scaleY(.94); }
          to { transform: translateY(5px) scaleY(1.06); }
        }
        .market-orb-card { background: linear-gradient(145deg, #121214, #080809 70%); }
        .orb-glow {
          position: absolute; width: 150px; height: 150px; border-radius: 999px;
          filter: blur(45px); opacity: .12; left: 50%; top: 42%;
          transform: translate(-50%, -50%); transition: opacity .3s ease;
        }
        .orb-glow-up { background: #34d399; }
        .orb-glow-down { background: #f87171; }
        .market-orb-card:hover .orb-glow { opacity: .24; }
        .crypto-orb {
          position: relative; display: grid; place-items: center; width: 94px; height: 94px;
          border-radius: 50%; isolation: isolate; transition: transform .35s ease;
        }
        .crypto-orb-up {
          background: radial-gradient(circle at 30% 25%, rgba(167,243,208,.5), rgba(16,185,129,.12) 40%, rgba(6,78,59,.08) 70%);
          border: 1px solid rgba(52,211,153,.5);
          box-shadow: inset -8px -10px 25px rgba(16,185,129,.12), 0 0 24px rgba(52,211,153,.1);
          animation: cw-orb-breathe 3s ease-in-out infinite;
        }
        .crypto-orb-down {
          background: radial-gradient(circle at 30% 25%, rgba(254,202,202,.35), rgba(239,68,68,.12) 42%, rgba(127,29,29,.08) 75%);
          border: 1px solid rgba(248,113,113,.5);
          box-shadow: inset -8px -10px 25px rgba(239,68,68,.1), 0 0 20px rgba(248,113,113,.08);
          animation: cw-orb-tighten 3.5s ease-in-out infinite;
        }
        .market-orb-card:hover .crypto-orb { transform: scale(1.07); }
        .orb-core { display: flex; flex-direction: column; align-items: center; }
        .orb-ring { position: absolute; inset: -7px; border: 1px solid currentColor; border-radius: 50%; opacity: .16; }
        .crypto-orb-up .orb-ring { color: #34d399; }
        .crypto-orb-down .orb-ring { color: #f87171; }
        .orb-ring-one { transform: rotateX(66deg) rotateZ(-18deg); }
        .orb-ring-two { transform: rotateY(66deg) rotateZ(18deg); }
        @keyframes cw-orb-breathe { 0%,100% { box-shadow: inset -8px -10px 25px rgba(16,185,129,.12), 0 0 18px rgba(52,211,153,.08); } 50% { box-shadow: inset -8px -10px 25px rgba(16,185,129,.18), 0 0 30px rgba(52,211,153,.18); } }
        @keyframes cw-orb-tighten { 0%,100% { transform: scale(1); } 50% { transform: scale(.96); } }
        .mode-module { background-image: radial-gradient(ellipse at 50% 25%, rgba(255,255,255,.035), transparent 55%); }
        .mode-art { position: relative; display: flex; height: 112px; align-items: center; justify-content: center; overflow: hidden; margin: -4px -4px 16px; }
        .mode-art::before { content: ""; position: absolute; width: 150px; height: 70px; border: 1px solid rgba(255,255,255,.08); border-radius: 50%; transform: rotate(-18deg); }
        .mode-art::after { content: ""; position: absolute; width: 120px; height: 48px; border: 1px solid rgba(255,255,255,.06); border-radius: 50%; transform: rotate(28deg); }
        .mode-art-orange { color: #f59a55; }
        .mode-art-silver { color: #d4d4d8; }
        .mode-art-cyan { color: #7dd3fc; }
        .shield-shape { position: absolute; display: grid; place-items: center; width: 72px; height: 82px; border: 1px solid rgba(245,154,85,.42); background: linear-gradient(145deg, rgba(232,117,36,.16), rgba(255,255,255,.015)); clip-path: polygon(50% 0, 94% 18%, 87% 70%, 50% 100%, 13% 70%, 6% 18%); transition: transform .35s ease; }
        .shield-left { transform: translateX(-25px) rotate(-12deg); }
        .shield-right { transform: translateX(25px) rotate(12deg); }
        .mode-module:hover .shield-left { transform: translateX(-32px) rotate(-20deg); }
        .mode-module:hover .shield-right { transform: translateX(32px) rotate(20deg); }
        .spark { position: absolute; width: 4px; height: 4px; border-radius: 50%; background: #fdba74; box-shadow: 0 0 12px #fb923c; opacity: 0; }
        .spark-one { top: 28px; left: 40%; }
        .spark-two { right: 30%; bottom: 28px; }
        .spark-three { right: 39%; top: 40px; }
        .mode-module:hover .spark { animation: cw-spark .8s ease-out infinite; }
        .spark-two { animation-delay: .2s; }
        .spark-three { animation-delay: .4s; }
        @keyframes cw-spark { 0% { opacity: 0; transform: scale(.4) translateY(5px); } 40% { opacity: 1; } 100% { opacity: 0; transform: scale(1.5) translateY(-8px); } }
        .mystery-cube { position: relative; width: 74px; height: 74px; transform-style: preserve-3d; animation: cw-cube-turn 10s linear infinite; }
        .cube-face { position: absolute; display: grid; place-items: center; inset: 0; border: 1px solid rgba(212,212,216,.55); background: linear-gradient(135deg, rgba(255,255,255,.1), rgba(255,255,255,.015)); box-shadow: inset 0 0 20px rgba(255,255,255,.04); }
        .cube-front { transform: translateZ(37px); }
        .cube-back { transform: rotateY(180deg) translateZ(37px); }
        @keyframes cw-cube-turn { from { transform: rotateX(-18deg) rotateY(0deg); } to { transform: rotateX(-18deg) rotateY(360deg); } }
        .ai-core { position: relative; display: grid; place-items: center; width: 76px; height: 76px; border: 1px solid rgba(125,211,252,.35); border-radius: 22px; background: rgba(125,211,252,.05); box-shadow: 0 0 28px rgba(125,211,252,.07); }
        .ai-core-ring { position: absolute; inset: -10px; border: 1px solid rgba(125,211,252,.22); border-radius: 26px; transform: rotate(25deg); animation: cw-ai-spin 12s linear infinite; }
        .ai-core-ring-two { inset: -18px; border-radius: 30px; transform: rotate(-25deg); animation-direction: reverse; }
        .ai-core-dot { position: absolute; right: 8px; top: 8px; width: 5px; height: 5px; border-radius: 50%; background: #7dd3fc; box-shadow: 0 0 12px #7dd3fc; }
        @keyframes cw-ai-spin { to { rotate: 360deg; } }
        .trophy-core { position: relative; display: grid; place-items: center; width: 80px; height: 80px; border: 1px solid rgba(245,154,85,.24); border-radius: 50%; background: rgba(232,117,36,.06); }
        .trophy-ring { position: absolute; inset: -9px; border: 1px solid rgba(245,154,85,.18); border-radius: 50%; }
        .trophy-ring-two { inset: -17px; border-style: dashed; animation: cw-ai-spin 22s linear infinite; }
        .timeline-point { cursor: pointer; outline: none; }
        .timeline-point:focus .timeline-dot { stroke: white; stroke-width: 2; }
        .timeline-dot { transition: r .15s ease; }
        @media (prefers-reduced-motion: reduce) {
          .wave-line, .crypto-orb, .mystery-cube, .ai-core-ring, .trophy-ring-two { animation: none !important; }
          .mode-module, .crypto-orb, .shield-shape { transition: none !important; }
        }
          .online-core {
            position: relative;
            display: grid;
            place-items: center;
            width: 76px;
            height: 76px;
            color: #f59a55;
          }

          .online-signal {
            display: grid;
            place-items: center;
            width: 68px;
            height: 68px;
            border: 1px solid rgba(245, 154, 85, 0.4);
            border-radius: 22px;
            background: rgba(232, 117, 36, 0.08);
            box-shadow: 0 0 26px rgba(232, 117, 36, 0.1);
          }

          .online-ring {
            position: absolute;
            inset: -5px;
            border: 1px solid rgba(245, 154, 85, 0.2);
            border-radius: 26px;
            animation: cw-ai-spin 14s linear infinite;
          }

          .online-ring-two {
            inset: -13px;
            border-style: dashed;
            animation-direction: reverse;
          }

          .online-ring-three {
            inset: -21px;
            border-color: rgba(245, 154, 85, 0.1);
            animation-duration: 20s;
          }

          .online-status-dot {
            position: absolute;
            top: 0;
            right: 0;
            width: 8px;
            height: 8px;
            border: 2px solid #09090b;
            border-radius: 50%;
            background: #34d399;
            box-shadow: 0 0 12px rgba(52, 211, 153, 0.7);
          }

      `}</style>

      <section className="cw-hero relative isolate overflow-hidden rounded-2xl border border-white/10">
        <div className="cw-grid pointer-events-none absolute inset-0 opacity-60" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-full opacity-80 sm:w-3/4">
          <svg
            viewBox="0 0 700 380"
            preserveAspectRatio="none"
            aria-hidden="true"
            className="h-full w-full"
          >
            {Array.from({ length: 19 }, (_, index) => {
              const y = 65 + index * 12;
              const points = Array.from({ length: 29 }, (_, pointIndex) => {
                const x = pointIndex * 25;
                const wave =
                  Math.sin(pointIndex * 0.42 + index * 0.16) * 24 +
                  Math.sin(pointIndex * 0.19 - index * 0.2) * 13;
                return `${x},${y + wave}`;
              }).join(" ");

              return <polyline key={index} points={points} className="wave-line" />;
            })}
          </svg>
        </div>

        <div className="relative z-10 grid min-h-72 items-center gap-7 p-6 sm:p-9 lg:grid-cols-2 lg:p-12">
          <div className="max-w-xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-black/40 px-3 py-1.5">
              <Zap size={13} className="text-orange-400" />
              <span className="text-xs font-medium uppercase tracking-widest text-zinc-300">
                ChartWars · Practice terminal
              </span>
            </div>

            <h1 className="max-w-lg text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
              Read the move.
              <span className="block text-zinc-400">Master the moment.</span>
            </h1>

            <p className="mt-4 max-w-md text-sm leading-6 text-zinc-400">
              A simulated arena to sharpen your market instincts, challenge
              friends, and learn from every decision.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={() => document.getElementById("cw-practice-modes")?.scrollIntoView({ behavior: "smooth" })}
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-3 text-sm font-semibold text-black transition hover:bg-orange-400"
              >
                <Crosshair size={16} />
                Enter practice
                <ArrowRight size={15} />
              </button>
              <span className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-black/30 px-4 py-3 text-xs text-zinc-400">
                <Radio size={14} className="text-orange-400" />
                Simulation environment
              </span>
            </div>
          </div>

          <div className="relative hidden min-h-52 items-center justify-center lg:flex">
            <div className="absolute h-48 w-48 rounded-full border border-orange-400/15" />
            <div className="absolute h-36 w-36 rounded-full border border-white/10" />
            <div className="absolute h-24 w-24 rounded-full border border-orange-400/20" />
            <div className="relative grid h-20 w-20 place-items-center rounded-2xl border border-orange-400/30 bg-black/60 text-orange-300 shadow-lg shadow-orange-500/10">
              <Swords size={33} strokeWidth={1.2} />
            </div>
            <span className="absolute right-10 top-8 rounded-md border border-white/10 bg-black/70 px-3 py-2 text-xs text-zinc-300">
              DECISION / 01
            </span>
            <span className="absolute bottom-5 left-5 rounded-md border border-white/10 bg-black/70 px-3 py-2 text-xs text-zinc-300">
              STRATEGY MODE
            </span>
            <span className="absolute right-10 bottom-8 h-2 w-2 rounded-full bg-orange-400 shadow-lg shadow-orange-400/60" />
          </div>
        </div>

        <div className="relative z-10 grid grid-cols-2 border-t border-white/10 bg-black/25 sm:grid-cols-3">
          <div className="border-r border-white/10 px-5 py-4 sm:px-8">
            <p className="text-xs text-zinc-500">Environment</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">Simulated markets</p>
          </div>
          <div className="px-5 py-4 sm:px-8">
            <p className="text-xs text-zinc-500">Designed for</p>
            <p className="mt-1 text-sm font-medium text-zinc-200">Practice & learning</p>
          </div>
          <div className="hidden border-l border-white/10 px-8 py-4 sm:block">
            <p className="text-xs text-zinc-500">Account telemetry</p>
            <p className="mt-1 text-sm font-medium text-zinc-400">Awaiting connection</p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading eyebrow="Market signals" title="Crypto pulse" action="Preview feed" />
        <div className="mb-4 flex items-center gap-2 text-xs text-zinc-500">
          <Radio size={13} className="text-orange-400" />
          Illustrative percentage changes · prices unavailable
          <span className="rounded border border-white/10 px-1.5 py-0.5 text-[9px] tracking-wider">
            DEMO
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {marketPreview.map((coin) => (
            <MarketOrb key={coin.symbol} coin={coin} />
          ))}
        </div>
      </section>

      <section id="cw-practice-modes" className="scroll-mt-6">
        <SectionHeading eyebrow="Choose your challenge" title="Tactical practice modes" />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modes.map((mode, index) => (
            <ModeModule
              key={mode.id}
              mode={mode}
              index={index}
              selected={selectedMode === mode.id}
              onSelect={setSelectedMode}
            />
          ))}
        </div>

        {selectedMode && (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-400/20 bg-orange-400/4 p-4">
            <div>
              <p className="text-sm font-medium text-white">
                {modes.find((mode) => mode.id === selectedMode)?.title}
              </p>
              <p className="mt-1 text-xs text-zinc-400">
                {modes.find((mode) => mode.id === selectedMode)?.detail}
              </p>
            </div>
            <span className="text-xs text-orange-300">Preview selection only</span>
          </div>
        )}
      </section>

      <MatchTimeline />

      <section className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0d] p-5 sm:p-7">
        <div className="pointer-events-none absolute -right-10 -top-16 h-48 w-48 rounded-full bg-orange-500/[0.07] blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-5">
          <div className="max-w-2xl">
            <p className="text-xs font-semibold uppercase tracking-widest text-orange-400">
              Built to improve
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white sm:text-xl">
              Every round is a chance to learn.
            </h2>
            <p className="mt-2 text-sm leading-6 text-zinc-500">
              Practice decisions, review outcomes, and build a repeatable
              strategy in a simulated environment. ChartWars is for education
              and practice, not real-money trading.
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/[0.07] text-orange-300">
            <GraduationCap size={24} />
          </div>
        </div>
      </section>

      <div className="flex items-center justify-center gap-2 pb-2 text-xs text-zinc-600">
        <Clock3 size={13} />
        Dashboard visuals are illustrative until account, market and match data are connected.
      </div>
    </main>
  );
}
