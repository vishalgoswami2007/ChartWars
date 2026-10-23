
import { useEffect, useState } from "react";
import {  useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Bot,
  ChevronRight,
  CircleDot,
  EyeOff,
  Globe2,
  Maximize2,
  Minus,
  Plus,
  Radio,
  Swords,
  Users,
  Zap,
} from "lucide-react";

const MODES = [
  {
    id: "online",
    title: "Online Mode",
    subtitle: "GLOBAL MATCHMAKING",
    icon: Swords,
    accent: "#f97316",
    description: "Enter the global arena.",
    players: "2,410",
  },
  {
    id: "friends",
    title: "Friends Room",
    subtitle: "PRIVATE BATTLES",
    icon: Users,
    accent: "#38bdf8",
    description: "Challenge your circle.",
    players: "824",
  },
  {
    id: "blind",
    title: "Blind Room",
    subtitle: "HIDDEN CHALLENGE",
    icon: EyeOff,
    accent: "#a78bfa",
    description: "Trade without the clues.",
    players: "316",
  },
  {
    id: "coaches",
    title: "VS Bot / Coaches",
    subtitle: "AI TRAINING LAB",
    icon: Bot,
    accent: "#34d399",
    description: "Sharpen your strategy.",
    players: "592",
  },
];

const BATTLES = [
  { flagA: "🇮🇳", nameA: "Trader_A", flagB: "🇬🇧", nameB: "ChartFox" },
  { flagA: "🇺🇸", nameA: "BullRunner", flagB: "🇯🇵", nameB: "Kaito_X" },
  { flagA: "🇩🇪", nameA: "AlphaWolf", flagB: "🇮🇳", nameB: "Vikram_7" },
  { flagA: "🇧🇷", nameA: "CryptoLeo", flagB: "🇺🇸", nameB: "NovaTrade" },
];

const COUNTRIES = [
  { id: "india", flag: "🇮🇳", name: "India", x: 27, y: 40 },
  { id: "switzerland", flag: "🇨🇭", name: "Switzerland", x: 52, y: 27 },
  { id: "uae", flag: "🇦🇪", name: "UAE", x: 58, y: 43 },
  { id: "canada", flag: "🇨🇦", name: "Canada", x: 29, y: 25 },
  { id: "singapore", flag: "🇸🇬", name: "Singapore", x: 66, y: 58 },
  { id: "portugal", flag: "🇵🇹", name: "Portugal", x: 43, y: 34 },
  { id: "uk", flag: "🇬🇧", name: "United Kingdom", x: 46, y: 28 },
  { id: "usa", flag: "🇺🇸", name: "United States", x: 22, y: 47 },
  { id: "japan", flag: "🇯🇵", name: "Japan", x: 75, y: 39 },
  { id: "brazil", flag: "🇧🇷", name: "Brazil", x: 38, y: 67 },
  { id: "germany", flag: "🇩🇪", name: "Germany", x: 51, y: 32 },
  { id: "australia", flag: "🇦🇺", name: "Australia", x: 74, y: 72 },
];



function CyberGlobe({ activeMode, rotation, setRotation, zoom, setZoom }) {
  const [dragging, setDragging] = useState(false);
  const [lastX, setLastX] = useState(0);
  const [hoveredCountry, setHoveredCountry] = useState(null);

  const theme =
    activeMode === "blind"
      ? "blind"
      : activeMode === "coaches"
        ? "coaches"
        : activeMode === "friends"
          ? "friends"
          : "online";

  const handlePointerDown = (event) => {
    if (event.target.closest("button")) return;

    setDragging(true);
    setLastX(event.clientX);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    if (!dragging) return;

    const delta = event.clientX - lastX;
    setRotation((value) => value + delta * 0.55);
    setLastX(event.clientX);
  };

  const handlePointerUp = () => setDragging(false);

  return (
    <div className={`globe-scene theme-${theme}`}>
      <div className="globe-topline">
        <div className="flex items-center gap-2">
          <span className="live-dot" />
          <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-400">
            Global network
          </span>
        </div>

        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <Radio size={12} />
          LIVE SIMULATION
        </span>
      </div>

      <div
        className={`globe-stage ${dragging ? "is-dragging" : ""}`}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        role="group"
        aria-label="Interactive ChartWars global battle globe"
      >
        <div className="globe-aura" />
        <div className="globe-orbit orbit-one" />
        <div className="globe-orbit orbit-two" />

        <div
          className="globe-sphere"
          style={{ transform: `rotate(${rotation}deg) scale(${zoom})` }}
        >
          <div className="globe-grid globe-grid-one" />
          <div className="globe-grid globe-grid-two" />
          <div className="globe-land land-one" />
          <div className="globe-land land-two" />
          <div className="globe-land land-three" />
          <div className="globe-land land-four" />
          <div className="globe-shine" />
        </div>

        <svg
          className="global-route-map"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="global-route-gradient">
              <stop offset="0%" stopColor="#f97316" stopOpacity=".25" />
              <stop offset="55%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#38bdf8" stopOpacity=".8" />
            </linearGradient>

            <filter id="global-route-glow">
              <feGaussianBlur stdDeviation=".65" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {COUNTRIES.map((country, index) => {
            const centerX = 50;
            const centerY = 50;
            const midX = (centerX + country.x) / 2;
            const midY = Math.min(centerY, country.y) - 9 - (index % 3) * 2;

            return (
              <g key={country.id}>
                <path
                  d={`M ${centerX} ${centerY} Q ${midX} ${midY} ${country.x} ${country.y}`}
                  fill="none"
                  stroke="url(#global-route-gradient)"
                  strokeWidth={hoveredCountry === country.id ? "0.65" : "0.32"}
                  strokeDasharray="1.2 1.2"
                  filter="url(#global-route-glow)"
                  className="country-route"
                  style={{ animationDelay: `${index * -0.35}s` }}
                />

                <circle
                  cx={country.x}
                  cy={country.y}
                  r={hoveredCountry === country.id ? "1.15" : ".65"}
                  fill="#fb923c"
                  className="country-route-point"
                />
              </g>
            );
          })}
        </svg>

        {COUNTRIES.map((country, index) => (
          <button
            key={country.id}
            type="button"
            className={`country-flag ${hoveredCountry === country.id ? "country-flag-active" : ""}`}
            style={{
              left: `${country.x}%`,
              top: `${country.y}%`,
              animationDelay: `${index * -0.22}s`,
            }}
            onMouseEnter={() => setHoveredCountry(country.id)}
            onMouseLeave={() => setHoveredCountry(null)}
            onFocus={() => setHoveredCountry(country.id)}
            onBlur={() => setHoveredCountry(null)}
            title={country.name}
            aria-label={`${country.name} simulated battle location`}
          >
            <span>{country.flag}</span>
            <span className="country-flag-swords">⚔️</span>
          </button>
        ))}

        <div className="chartwars-hub">
          <div className="chartwars-hub-ring" />
          <span className="chartwars-hub-icon">
            <Swords size={17} />
          </span>
          <span className="chartwars-hub-name">CHARTWARS</span>
          <span className="chartwars-hub-status">
            <span className="live-dot" />
            GLOBAL HUB
          </span>
        </div>
      </div>

      {hoveredCountry && (
        <div className="country-hover-label">
          {COUNTRIES.find((country) => country.id === hoveredCountry)?.flag}
          <span>
            {COUNTRIES.find((country) => country.id === hoveredCountry)?.name}
          </span>
          <Swords size={13} className="text-orange-400" />
          <span className="text-orange-300">Battle route</span>
        </div>
      )}

      <div className="globe-controls">
        <button
          type="button"
          onClick={() => setZoom((value) => Math.max(0.85, value - 0.1))}
          aria-label="Zoom out globe"
          title="Zoom out"
        >
          <Minus size={15} />
        </button>

        <button
          type="button"
          onClick={() => setZoom((value) => Math.min(1.25, value + 0.1))}
          aria-label="Zoom in globe"
          title="Zoom in"
        >
          <Plus size={15} />
        </button>

        <button
          type="button"
          onClick={() => {
            setRotation(0);
            setZoom(1);
          }}
          aria-label="Reset globe view"
          title="Reset view"
        >
          <Maximize2 size={14} />
        </button>
      </div>

      <div className="globe-caption">
        <div>
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            Network status
          </p>
          <p className="mt-1 text-xs font-semibold text-zinc-200">
            {activeMode === "blind"
              ? "ENCRYPTED ZONE"
              : activeMode === "coaches"
                ? "AI TRAINING GRID"
                : activeMode === "friends"
                  ? "SOCIAL BATTLE ZONE"
                  : "GLOBAL ARENA ACTIVE"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-500">
            Connected countries
          </p>
          <p className="mt-1 text-xs font-semibold text-orange-400">
            12 LOCATIONS
          </p>
        </div>
      </div>
    </div>
  );
}


function ModeCard({ mode, active, onHover, onClick }) {
  const Icon = mode.icon;

  return (
    <button
      type="button"
      onMouseEnter={() => onHover(mode.id)}
      onFocus={() => onHover(mode.id)}
      onMouseLeave={() => onHover(null)}
      onBlur={() => onHover(null)}
      onClick={onClick}
      className={`mode-card ${active ? "mode-card-active" : ""}`}
      style={{ "--mode-accent": mode.accent }}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="mode-icon">
          <Icon size={21} strokeWidth={1.7} />
        </div>

        <ArrowUpRight
          size={17}
          className="mode-arrow text-zinc-600 transition"
        />
      </div>

      <div className="mt-5">
        <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-zinc-500">
          {mode.subtitle}
        </p>

        <h3 className="mt-2 text-[17px] font-semibold tracking-tight text-zinc-100">
          {mode.title}
        </h3>

        <p className="mt-1.5 text-xs text-zinc-500">{mode.description}</p>
      </div>

      <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-3">
        <span className="flex items-center gap-1.5 text-[10px] text-zinc-500">
          <span
            className="h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: mode.accent }}
          />
          {mode.players} active
        </span>

        <span className="flex items-center gap-1 text-[10px] font-semibold text-zinc-300">
          ENTER <ChevronRight size={13} />
        </span>
      </div>
    </button>
  );
}

function GlobalFeed() {
  const [feedIndex, setFeedIndex] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => {
      setFeedIndex((index) => (index + 1) % BATTLES.length);
    }, 3200);

    return () => window.clearInterval(interval);
  }, []);

  const battle = BATTLES[feedIndex];

  return (
    <div className="global-feed">
      <div className="flex shrink-0 items-center gap-2">
        <span className="live-dot" />
        <span className="text-[9px] font-bold uppercase tracking-[0.17em] text-zinc-400">
          Live feed
        </span>
      </div>

      <div className="feed-battle" key={feedIndex}>
        <span className="text-base">{battle.flagA}</span>
        <span className="feed-player">{battle.nameA}</span>
        <span className="text-[10px] text-zinc-600">VS</span>
        <span className="feed-player">{battle.nameB}</span>
        <span className="text-base">{battle.flagB}</span>
        <Swords size={13} className="text-orange-400" />
        <span className="text-[9px] font-semibold uppercase tracking-wider text-orange-400">
          LIVE
        </span>
      </div>

      <span className="hidden shrink-0 text-[9px] text-zinc-600 sm:block">
        SIMULATED MATCHES
      </span>
    </div>
  );
}

function ModeEntry({ mode, onBack, onFindMatch }) {
  const Icon = mode.icon;
  const isOnline = mode.id === "online";

  return (
    <div className="mode-entry">
      <div className="mode-entry-glow" />

      <button
        type="button"
        onClick={onBack}
        className="relative z-10 flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to global rooms
      </button>

      <div className="relative z-10 mx-auto mt-16 max-w-xl text-center">
        <div
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border"
          style={{
            color: mode.accent,
            borderColor: `${mode.accent}55`,
            backgroundColor: `${mode.accent}12`,
            boxShadow: `0 0 45px ${mode.accent}15`,
          }}
        >
          <Icon size={30} strokeWidth={1.5} />
        </div>

        <p
          className="mt-8 text-[10px] font-semibold uppercase tracking-[0.3em]"
          style={{ color: mode.accent }}
        >
          {mode.subtitle}
        </p>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-white sm:text-5xl">
          {mode.title}
        </h1>

        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-zinc-400">
          {isOnline
            ? "Step into the global arena. Find opponents, test your market instincts, and compete in a simulated trading battle."
            : mode.id === "friends"
              ? "Create a private practice room and challenge your friends in a simulated market battle."
              : mode.id === "blind"
                ? "Enter a mystery trading challenge and test your decision-making without the usual visual clues."
                : "Train your trading instincts against a simulated opponent and sharpen your strategy round by round."}
        </p>

        {isOnline && (
          <div className="mx-auto mt-8 grid max-w-sm grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/10 bg-white/3 p-4 text-left">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                Match type
              </p>
              <p className="mt-2 text-sm font-semibold text-white">1v1 Duel</p>
            </div>

            <div className="rounded-xl border border-white/10 bg-white/3 p-4 text-left">
              <p className="text-[9px] uppercase tracking-widest text-zinc-500">
                Match duration
              </p>
              <p className="mt-2 text-sm font-semibold text-white">5 minutes</p>
            </div>
          </div>
        )}

        <button
          type="button"
          onClick={onFindMatch}
          className="mt-8 inline-flex items-center justify-center gap-2 rounded-xl px-7 py-3.5 text-sm font-bold text-black transition hover:brightness-110"
          style={{ backgroundColor: mode.accent }}
        >
          <Zap size={16} />
          {isOnline
            ? "Find a match"
            : mode.id === "friends"
              ? "Create a room"
              : mode.id === "blind"
                ? "Enter blind room"
                : "Start training"}
        </button>

        <p className="mt-4 text-[10px] text-zinc-600">
          Frontend prototype · No real matchmaking or live exchange orders
        </p>
      </div>
    </div>
  );
}

export default function RoomPage() {

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedMode = searchParams.get("mode");
  const activeMode = MODES.find((mode) => mode.id === selectedMode);
  const [hoveredMode, setHoveredMode] = useState(null);
  const [rotation, setRotation] = useState(-15);
  const [zoom, setZoom] = useState(1);
  const [transitioning, setTransitioning] = useState(false);

  useEffect(() => {
    if (!transitioning) return undefined;

    const timeout = window.setTimeout(() => {
      setTransitioning(false);
    }, 650);

    return () => window.clearTimeout(timeout);
  }, [transitioning]);

  const enterMode = (modeId) => {
    setTransitioning(true);

    window.setTimeout(() => {
      setSearchParams({ mode: modeId });
    }, 260);
  };

  const goBack = () => {
    setSearchParams({});
    setTransitioning(false);
  };

  const handlePrimaryAction = () => {
    // The nested screens are UI prototypes for now.
    // Connect real matchmaking and room creation when the API is ready.
    if (activeMode?.id === "online") {
      setSearchParams({ mode: "online", stage: "matchmaking" });
      return;
    }

    if (activeMode?.id === "friends") {
      setSearchParams({ mode: "friends", stage: "create" });
      return;
    }

    if (activeMode?.id === "blind") {
      setSearchParams({ mode: "blind", stage: "challenge" });
      return;
    }

    if (activeMode?.id === "coaches") {
      setSearchParams({ mode: "coaches", stage: "training" });
    }
  };

  const stage = searchParams.get("stage");

  return (
    <div className="rooms-page relative min-h-full overflow-hidden rounded-2xl">
      <style>{`
        .rooms-page {
          --room-orange: #f97316;
          color: #f4f4f5;
          background:
            radial-gradient(ellipse at 20% 18%, rgba(249,115,22,.075), transparent 36%),
            radial-gradient(ellipse at 88% 76%, rgba(59,130,246,.045), transparent 32%),
            #090909;
        }

        .rooms-page * { box-sizing: border-box; }

        .rooms-grid-bg {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: .16;
          background-image:
            linear-gradient(rgba(255,255,255,.035) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.035) 1px, transparent 1px);
          background-size: 44px 44px;
          mask-image: linear-gradient(to bottom, black, transparent 80%);
        }

        .rooms-content { position: relative; z-index: 1; }

        .rooms-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          padding: 22px 24px 20px;
          border-bottom: 1px solid rgba(255,255,255,.07);
        }

        .network-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          border: 1px solid rgba(249,115,22,.22);
          background: rgba(249,115,22,.06);
          border-radius: 999px;
          padding: 7px 11px;
          color: #fdba74;
          font-size: 9px;
          font-weight: 700;
          letter-spacing: .15em;
          text-transform: uppercase;
        }

        .live-dot {
          display: inline-block;
          width: 6px;
          height: 6px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #fb923c;
          box-shadow: 0 0 12px rgba(249,115,22,.8);
          animation: roomPulse 1.7s ease-in-out infinite;
        }

        .rooms-layout {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(320px, .95fr);
          gap: 24px;
          padding: 24px;
        }

        .globe-panel {
          min-width: 0;
          overflow: hidden;
          border: 1px solid rgba(255,255,255,.08);
          border-radius: 20px;
          background: linear-gradient(145deg, rgba(255,255,255,.035), rgba(255,255,255,.008));
        }

        .globe-scene { --globe-accent: #f97316; }
        .theme-friends { --globe-accent: #38bdf8; }
        .theme-blind { --globe-accent: #a78bfa; }
        .theme-coaches { --globe-accent: #34d399; }

        .globe-topline {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          padding: 17px 18px 0;
        }

        .globe-stage {
          position: relative;
          display: grid;
          place-items: center;
          width: 100%;
          max-width: 540px;
          aspect-ratio: 1 / 1;
          margin: 0 auto;
          overflow: hidden;
          cursor: grab;
          touch-action: pan-y;
          user-select: none;
        }

        .globe-stage.is-dragging { cursor: grabbing; }

        .globe-aura {
          position: absolute;
          width: 72%;
          aspect-ratio: 1;
          border-radius: 50%;
          background: var(--globe-accent);
          filter: blur(75px);
          opacity: .12;
          transition: background .5s ease, opacity .5s ease;
        }

        .globe-orbit {
          position: absolute;
          width: 84%;
          aspect-ratio: 1;
          border: 1px solid rgba(249,115,22,.15);
          border-radius: 50%;
          transform: rotate(-24deg) scaleY(.34);
          pointer-events: none;
        }

        .orbit-two {
          width: 96%;
          border-color: rgba(255,255,255,.08);
          transform: rotate(52deg) scaleY(.45);
        }

        .globe-sphere {
          position: relative;
          width: 70%;
          aspect-ratio: 1;
          overflow: hidden;
          border-radius: 50%;
          background:
            radial-gradient(circle at 32% 26%, rgba(94,170,190,.16), transparent 24%),
            radial-gradient(circle at 65% 67%, rgba(0,0,0,.8), transparent 56%),
            radial-gradient(circle at 42% 38%, #17303a, #09171f 62%, #030609 100%);
          box-shadow:
            inset -22px -8px 42px rgba(0,0,0,.9),
            inset 6px 4px 20px rgba(120,220,255,.09),
            0 0 0 1px rgba(125,211,252,.2),
            0 0 36px color-mix(in srgb, var(--globe-accent) 22%, transparent);
          transition: transform .18s ease-out, filter .5s ease, background .5s ease;
          will-change: transform;
        }

        .theme-blind .globe-sphere {
          filter: grayscale(.82) hue-rotate(35deg) brightness(.67);
        }

        .theme-coaches .globe-sphere {
          filter: hue-rotate(35deg) saturate(.85);
        }

        .theme-friends .globe-sphere {
          filter: hue-rotate(25deg) saturate(.8);
        }

        .globe-grid {
          position: absolute;
          inset: -12%;
          border: 1px solid rgba(125,211,252,.22);
          border-radius: 50%;
        }

        .globe-grid-one {
          transform: scaleX(.38);
          box-shadow: 0 0 0 1px rgba(125,211,252,.07);
        }

        .globe-grid-two {
          transform: scaleX(.76);
          border-color: rgba(125,211,252,.13);
        }

        .globe-land {
          position: absolute;
          background: linear-gradient(135deg, #345b5d, #16383d 65%, #10262d);
          opacity: .8;
          filter: drop-shadow(0 0 4px rgba(103,232,249,.12));
        }

        .land-one {
          top: 19%;
          left: 18%;
          width: 31%;
          height: 23%;
          border-radius: 48% 28% 55% 30%;
          transform: rotate(-28deg);
          clip-path: polygon(8% 12%, 56% 0, 100% 30%, 80% 58%, 60% 100%, 33% 72%, 0 49%);
        }

        .land-two {
          top: 44%;
          left: 30%;
          width: 22%;
          height: 35%;
          border-radius: 40%;
          transform: rotate(-22deg);
          clip-path: polygon(10% 0, 86% 12%, 100% 39%, 63% 68%, 48% 100%, 21% 72%, 0 30%);
        }

        .land-three {
          top: 21%;
          right: 13%;
          width: 35%;
          height: 29%;
          border-radius: 45%;
          transform: rotate(16deg);
          clip-path: polygon(0 20%, 37% 0, 77% 15%, 100% 50%, 65% 65%, 55% 100%, 20% 70%);
        }

        .land-four {
          right: 22%;
          bottom: 21%;
          width: 25%;
          height: 20%;
          border-radius: 40%;
          transform: rotate(-12deg);
          clip-path: polygon(8% 0, 100% 16%, 78% 70%, 38% 100%, 0 54%);
        }

        .globe-shine {
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background: linear-gradient(115deg, rgba(255,255,255,.13), transparent 28%, transparent 70%, rgba(0,0,0,.5));
          box-shadow: inset -18px -5px 32px rgba(0,0,0,.65);
        }

        .globe-routes {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
        }

        .route-line { animation: routeFlow 4s linear infinite; }
        .route-two { animation-delay: -1.2s; }
        .route-three { animation-delay: -2.2s; }

        .globe-flag {
          position: absolute;
          z-index: 3;
          display: grid;
          width: 34px;
          height: 34px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.28);
          border-radius: 50%;
          background: rgba(12,12,12,.9);
          font-size: 17px;
          box-shadow: 0 0 0 4px rgba(249,115,22,.07), 0 0 24px var(--globe-accent);
          animation: flagPulse 2s ease-in-out infinite;
          pointer-events: none;
        }

        .flag-india { left: 18%; top: 35%; }
        .flag-uk { right: 18%; top: 32%; animation-delay: -.7s; }
        .flag-usa { left: 33%; bottom: 20%; animation-delay: -1.1s; }
        .flag-japan { right: 19%; bottom: 27%; animation-delay: -1.5s; }

        .globe-center-mark {
          position: absolute;
          bottom: 9%;
          left: 50%;
          display: grid;
          width: 31px;
          height: 31px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.1);
          border-radius: 50%;
          color: var(--globe-accent);
          background: rgba(8,8,8,.85);
          transform: translateX(-50%);
          transition: color .4s ease;
        }

        .globe-controls {
          display: flex;
          justify-content: center;
          gap: 7px;
          margin-top: -8px;
        }

        .globe-controls button {
          display: grid;
          width: 32px;
          height: 32px;
          place-items: center;
          border: 1px solid rgba(255,255,255,.09);
          border-radius: 9px;
          color: #a1a1aa;
          background: rgba(255,255,255,.025);
          transition: color .2s ease, border-color .2s ease;
        }

        .globe-controls button:hover {
          color: white;
          border-color: rgba(249,115,22,.4);
        }

        .globe-caption {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin: 17px 18px 18px;
          padding-top: 15px;
          border-top: 1px solid rgba(255,255,255,.07);
        }

        .mode-list { display: flex; min-width: 0; flex-direction: column; gap: 11px; }

        .mode-card {
          position: relative;
          width: 100%;
          overflow: hidden;
          padding: 17px;
          text-align: left;
          border: 1px solid rgba(255,255,255,.085);
          border-radius: 16px;
          background: linear-gradient(125deg, rgba(255,255,255,.04), rgba(255,255,255,.012));
          transition: transform .25s ease, border-color .25s ease, background .25s ease, box-shadow .25s ease;
        }

        .mode-card::after {
          content: "";
          position: absolute;
          right: -40px;
          top: -60px;
          width: 140px;
          height: 140px;
          border-radius: 50%;
          background: var(--mode-accent);
          opacity: 0;
          filter: blur(45px);
          transition: opacity .25s ease;
          pointer-events: none;
        }

        .mode-card:hover, .mode-card-active {
          transform: translateY(-2px);
          border-color: color-mix(in srgb, var(--mode-accent) 42%, transparent);
          background: linear-gradient(125deg, color-mix(in srgb, var(--mode-accent) 8%, #111), rgba(255,255,255,.012));
          box-shadow: 0 10px 35px rgba(0,0,0,.15);
        }

        .mode-card:hover::after, .mode-card-active::after { opacity: .12; }

        .mode-icon {
          position: relative;
          z-index: 1;
          display: grid;
          width: 42px;
          height: 42px;
          place-items: center;
          border: 1px solid color-mix(in srgb, var(--mode-accent) 32%, transparent);
          border-radius: 12px;
          color: var(--mode-accent);
          background: color-mix(in srgb, var(--mode-accent) 10%, transparent);
        }

        .mode-arrow { position: relative; z-index: 1; }
        .mode-card:hover .mode-arrow { color: var(--mode-accent); transform: translate(2px, -2px); }

        .global-feed {
          display: flex;
          align-items: center;
          gap: 18px;
          min-width: 0;
          margin: 0 24px 24px;
          padding: 14px 17px;
          border: 1px solid rgba(255,255,255,.075);
          border-radius: 14px;
          background: rgba(255,255,255,.02);
        }

        .feed-battle {
          display: flex;
          min-width: 0;
          flex: 1;
          align-items: center;
          justify-content: center;
          gap: 9px;
          animation: feedIn .3s ease;
        }

        .feed-player {
          max-width: 100px;
          overflow: hidden;
          color: #d4d4d8;
          font-size: 11px;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        .mode-entry {
          position: relative;
          min-height: 650px;
          overflow: hidden;
          padding: 24px;
          animation: entryFade .45s ease both;
        }

        .mode-entry-glow {
          position: absolute;
          top: 8%;
          left: 50%;
          width: 430px;
          height: 430px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(249,115,22,.12), transparent 68%);
          transform: translateX(-50%);
          pointer-events: none;
        }

        .rooms-transition {
          position: absolute;
          z-index: 20;
          inset: 0;
          background: radial-gradient(circle at 38% 45%, rgba(249,115,22,.24), #050505 65%);
          animation: zoomEntry .65s ease-in forwards;
          pointer-events: none;
        }

        @keyframes roomPulse {
          0%, 100% { opacity: 1; }
          50% { opacity: .35; }
        }

        @keyframes flagPulse {
          0%, 100% { box-shadow: 0 0 0 3px rgba(249,115,22,.06), 0 0 16px var(--globe-accent); }
          50% { box-shadow: 0 0 0 7px rgba(249,115,22,.035), 0 0 25px var(--globe-accent); }
        }

        @keyframes routeFlow { to { stroke-dashoffset: -36; } }

        @keyframes feedIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes entryFade {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes zoomEntry {
          0% { opacity: 0; transform: scale(.96); }
          45% { opacity: 1; transform: scale(1.02); }
          100% { opacity: 0; transform: scale(1.16); }
        }

        @media (min-width: 1200px) {
          .mode-card { padding: 19px; }
          .mode-list { gap: 13px; }
        }

        @media (max-width: 900px) {
          .rooms-layout { grid-template-columns: minmax(0, 1fr); }
          .globe-panel { max-width: 680px; width: 100%; margin: 0 auto; }
          .mode-list { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .mode-card { padding: 15px; }
        }

        @media (max-width: 560px) {
          .rooms-header { align-items: flex-start; padding: 18px 15px; }
          .rooms-layout { gap: 16px; padding: 15px; }
          .network-pill { font-size: 8px; letter-spacing: .08em; }
          .mode-list { grid-template-columns: minmax(0, 1fr); }
          .mode-card { padding: 15px; }
          .global-feed { flex-wrap: wrap; gap: 10px; margin: 0 15px 18px; padding: 12px; }
          .feed-battle { justify-content: flex-start; gap: 6px; }
          .feed-player { max-width: 70px; font-size: 10px; }
          .globe-flag { width: 29px; height: 29px; font-size: 14px; }
          .mode-entry { min-height: 600px; padding: 18px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .rooms-page *, .rooms-page *::before, .rooms-page *::after {
            animation-duration: .01ms !important;
            animation-iteration-count: 1 !important;
            scroll-behavior: auto !important;
            transition-duration: .01ms !important;
          }
        }
      `}</style>

      <div className="rooms-grid-bg" />

      {transitioning && <div className="rooms-transition" />}

      {activeMode ? (
        <div className="rooms-content">
          <ModeEntry
            mode={activeMode}
            onBack={goBack}
            onFindMatch={handlePrimaryAction}
          />

          {stage && (
            <div className="mx-5 mb-5 rounded-xl border border-orange-500/20 bg-orange-500/5 p-4 text-center text-xs text-orange-200">
              {stage === "matchmaking"
                ? "Matchmaking preview selected. Live opponent search will be connected to the backend later."
                : stage === "create"
                  ? "Room creation preview selected. Invite links and friend presence need backend integration."
                  : stage === "challenge"
                    ? "Blind challenge preview selected. Challenge rules will be implemented with the game engine."
                    : "Training preview selected. Bot behavior will be implemented in a later phase."}
            </div>
          )}
        </div>
      ) : (
        <div className="rooms-content">
          <header className="rooms-header">
            <div>
              <div className="network-pill">
                <CircleDot size={12} />
                ChartWars arena
              </div>

              <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Choose your battlefield<span className="text-orange-500">.</span>
              </h1>

              <p className="mt-2 text-xs text-zinc-500 sm:text-sm">
                One market. Global rivals. Your next move.
              </p>
            </div>

            <div className="hidden shrink-0 text-right sm:block">
              <p className="text-[9px] uppercase tracking-[0.2em] text-zinc-600">
                Arena status
              </p>
              <p className="mt-2 flex items-center justify-end gap-2 text-xs font-semibold text-zinc-300">
                <span className="live-dot" />
                Systems online
              </p>
            </div>
          </header>

          <div className="rooms-layout">
            <section className="globe-panel">
              <div className="flex items-center justify-between gap-3 px-5 pt-5">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    The world is your arena
                  </p>
                  <p className="mt-1.5 text-sm font-semibold text-zinc-100">
                    Global battle map
                  </p>
                </div>

                <span className="flex items-center gap-1.5 rounded-full border border-white/10 bg-black/20 px-2.5 py-1.5 text-[9px] text-zinc-400">
                  <Globe2 size={12} />
                  3D VIEW
                </span>
              </div>

              <CyberGlobe
                activeMode={hoveredMode}
                rotation={rotation}
                setRotation={setRotation}
                zoom={zoom}
                setZoom={setZoom}
              />
            </section>

            <section className="flex min-w-0 flex-col justify-center">
              <div className="mb-4 flex items-end justify-between gap-3">
                <div>
                  <p className="text-[9px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                    Select your mode
                  </p>
                  <h2 className="mt-1.5 text-lg font-semibold text-white">
                    Enter the arena
                  </h2>
                </div>

                <span className="pb-1 text-[10px] text-zinc-600">
                  04 MODES
                </span>
              </div>

              <div className="mode-list">
                {MODES.map((mode) => (
                  <ModeCard
                    key={mode.id}
                    mode={mode}
                    active={hoveredMode === mode.id}
                    onHover={setHoveredMode}
                    onClick={() => enterMode(mode.id)}
                  />
                ))}
              </div>
            </section>
          </div>

          <section className="mx-6 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-orange-500/15 bg-orange-500/[0.035] px-5 py-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="live-dot" />
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300">
                  Global activity
                </p>
              </div>

              
            <p className="mt-2 flex flex-wrap items-baseline gap-x-2 gap-y-1 text-xl font-semibold tracking-tight text-white sm:text-2xl">
                <span className="text-orange-400">32</span>
                <span className="text-xs font-semibold uppercase tracking-wider text-zinc-200 sm:text-sm">
                  Traders live
                </span>
                <span className="text-xs font-medium text-zinc-500">
                  across the global arena
                </span>
             </p>
            </div>

        
                <div className="flex flex-wrap items-center gap-2">
                    {["🇮🇳", "🇨🇭", "🇦🇪", "🇨🇦", "🇸🇬", "🇵🇹"].map((flag) => (
                      <span
                        key={flag}
                        className="grid h-8 w-8 place-items-center rounded-full border border-white/10 bg-white/[0.035] text-base"
                      >
                        {flag}
                      </span>
                    ))}
                    <span className="ml-1 flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-orange-300">
                      <Radio size={13} />
                      Demo network
                    </span>
              </div>

          </section>

          <GlobalFeed />

          <p className="px-6 pb-5 text-center text-[9px] leading-4 text-zinc-700">
            Concept preview · Country flags, player counts, battle routes and
            activity feed are simulated. No live player locations are shown.
          </p>
        </div>
      )}
    </div>
  );
}
