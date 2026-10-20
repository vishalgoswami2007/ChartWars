
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  ChevronDown,
  Clock3,
  Crosshair,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";

const modes = [
  {
    id: "basics",
    name: "Market Basics",
    category: "Foundations",
    level: "Beginner",
    duration: "10 min",
    description: "Understand price movement and market structure.",
  },
  {
    id: "patterns",
    name: "Chart Patterns",
    category: "Technical Analysis",
    level: "Beginner",
    duration: "15 min",
    description: "Learn to recognise common price patterns.",
  },
  {
    id: "trends",
    name: "Trend Analysis",
    category: "Technical Analysis",
    level: "Intermediate",
    duration: "20 min",
    description: "Study trends, breakouts and market structure.",
  },
  {
    id: "risk",
    name: "Risk Management",
    category: "Strategy",
    level: "Intermediate",
    duration: "15 min",
    description: "Practise risk-to-reward and position planning.",
  },
  {
    id: "strategy",
    name: "Strategy Practice",
    category: "Strategy",
    level: "Advanced",
    duration: "25 min",
    description: "Evaluate hypothetical setups and trading decisions.",
  },
  {
    id: "scenarios",
    name: "Market Scenarios",
    category: "Challenges",
    level: "Advanced",
    duration: "20 min",
    description: "Work through challenging hypothetical market situations.",
  },
];

const levels = ["All levels", "Beginner", "Intermediate", "Advanced"];

function PriceChart() {
  const candles = [
    [44, 70, 34, 58],
    [58, 49, 42, 77],
    [49, 57, 32, 64],
    [57, 38, 29, 69],
    [38, 44, 25, 54],
    [44, 27, 19, 51],
    [27, 35, 15, 46],
    [35, 21, 12, 42],
    [21, 30, 10, 37],
    [30, 15, 8, 40],
    [15, 23, 5, 33],
    [23, 12, 4, 36],
    [12, 18, 2, 28],
    [18, 8, 0, 30],
    [8, 16, 1, 25],
    [16, 7, 0, 26],
    [7, 13, 0, 21],
    [13, 4, 0, 24],
    [4, 11, 0, 19],
    [11, 3, 0, 20],
  ];

  return (
    <div className="relative h-67.5 w-full overflow-hidden sm:h-85">
      <div className="absolute inset-0 flex flex-col justify-between">
        {[0, 1, 2, 3, 4].map((line) => (
          <div
            key={line}
            className="w-full border-t border-white/5.5"
          />
        ))}
      </div>

      <svg
        viewBox="0 0 640 240"
        preserveAspectRatio="none"
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Illustrative candlestick chart for practice"
      >
        <defs>
          <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4a72c" stopOpacity=".16" />
            <stop offset="100%" stopColor="#d4a72c" stopOpacity="0" />
          </linearGradient>
        </defs>

        <path
          d="M 0 178 L 32 160 L 64 170 L 96 135 L 128 145 L 160 112 L 192 127 L 224 92 L 256 104 L 288 76 L 320 94 L 352 63 L 384 72 L 416 49 L 448 61 L 480 36 L 512 48 L 544 25 L 576 35 L 608 18 L 640 27 L 640 240 L 0 240 Z"
          fill="url(#chartFill)"
        />

        <path
          d="M 0 178 L 32 160 L 64 170 L 96 135 L 128 145 L 160 112 L 192 127 L 224 92 L 256 104 L 288 76 L 320 94 L 352 63 L 384 72 L 416 49 L 448 61 L 480 36 L 512 48 L 544 25 L 576 35 L 608 18 L 640 27"
          fill="none"
          stroke="#d4a72c"
          strokeWidth="1.6"
          vectorEffect="non-scaling-stroke"
        />

        {candles.map(([y, close, high, low], index) => {
          const x = 12 + index * 31;
          const bullish = close < y;
          const top = Math.min(y, close);
          const height = Math.max(Math.abs(close - y), 3);

          return (
            <g key={index} opacity=".88">
              <line
                x1={x + 5}
                y1={high * 2 + 10}
                x2={x + 5}
                y2={low * 2 + 10}
                stroke={bullish ? "#b5b9c2" : "#d4a72c"}
                strokeWidth="1"
              />
              <rect
                x={x}
                y={top * 2 + 10}
                width="10"
                height={height * 2}
                fill={bullish ? "#b5b9c2" : "#d4a72c"}
                rx="1"
              />
            </g>
          );
        })}
      </svg>

      <div className="absolute right-0 top-[13%] border border-yellow-500/30 bg-[#19170f] px-2 py-1 font-mono text-[10px] text-yellow-400">
        PRACTICE
      </div>

      <div className="absolute bottom-2 left-2 font-mono text-[10px] text-gray-600">
        ILLUSTRATIVE DATA
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.16em] text-gray-500">
      {children}
    </p>
  );
}

export default function PracticeModesPage() {
  const [activeMode, setActiveMode] = useState(modes[0]);
  const [difficulty, setDifficulty] = useState("All levels");
  const [search, setSearch] = useState("");
  const [showSession, setShowSession] = useState(false);
  const [direction, setDirection] = useState("Buy");
  const [showFilters, setShowFilters] = useState(false);

  const filteredModes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return modes.filter((mode) => {
      const matchesLevel =
        difficulty === "All levels" || mode.level === difficulty;

      const matchesQuery =
        !query ||
        mode.name.toLowerCase().includes(query) ||
        mode.category.toLowerCase().includes(query) ||
        mode.description.toLowerCase().includes(query);

      return matchesLevel && matchesQuery;
    });
  }, [difficulty, search]);

  function selectMode(mode) {
    setActiveMode(mode);
    setShowSession(false);
  }

  return (
    <main className="min-h-screen bg-[#090a0c] text-[#e7e7e7]">
      <div className="mx-auto max-w-[1600px] px-4 py-6 sm:px-7 lg:px-10">
        {/* Page heading */}
        <header className="mb-7 flex flex-wrap items-end justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[11px] text-gray-500">
             <Link to="/"> <span>CHARTWARS</span></Link>
              <span>/</span>
              <span className="text-gray-300">Practice</span>
            </div>

            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Practice workspace
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Build your understanding. Practise your decisions.
            </p>
          </div>

          <div className="flex items-center gap-2 rounded-lg border border-white/9 bg-[#101114] px-3 py-2 text-xs text-gray-400">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            Learning environment
          </div>
        </header>

        {/* Main workspace */}
        <div className="grid items-start gap-5 xl:grid-cols-[260px_minmax(0,1fr)_280px]">
          {/* Left: mode selector */}
          <aside className="min-w-0 rounded-xl border border-white/8 bg-[#0e0f12]">
            <div className="border-b border-white/[0.07] p-4">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Practice modes</h2>
                <span className="font-mono text-xs text-gray-600">
                  {filteredModes.length.toString().padStart(2, "0")}
                </span>
              </div>

              <label className="relative block">
                <Search
                  size={15}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
                />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Find a mode..."
                  className="w-full rounded-lg border border-white/8 bg-[#090a0c] py-2.5 pl-9 pr-3 text-xs outline-none placeholder:text-gray-600 focus:border-yellow-500/50"
                />
              </label>

              <button
                type="button"
                onClick={() => setShowFilters((value) => !value)}
                className="mt-3 flex w-full items-center justify-between text-xs text-gray-400 hover:text-white"
              >
                <span>Difficulty: {difficulty}</span>
                <ChevronDown
                  size={14}
                  className={showFilters ? "rotate-180" : ""}
                />
              </button>

              {showFilters && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {levels.map((level) => (
                    <button
                      key={level}
                      type="button"
                      onClick={() => setDifficulty(level)}
                      className={`rounded-md border px-2.5 py-2 text-[11px] transition ${
                        difficulty === level
                          ? "border-yellow-500/50 bg-yellow-500/10 text-yellow-400"
                          : "border-white/8 text-gray-400 hover:text-white"
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-2">
              {filteredModes.map((mode, index) => {
                const selected = activeMode.id === mode.id;

                return (
                  <button
                    key={mode.id}
                    type="button"
                    onClick={() => selectMode(mode)}
                    className={`mb-1 flex w-full items-start gap-3 rounded-lg border p-3 text-left transition ${
                      selected
                        ? "border-yellow-500/25 bg-yellow-500/5.5"
                        : "border-transparent hover:bg-white/[0.035]"
                    }`}
                  >
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-md border text-xs ${
                        selected
                          ? "border-yellow-500/25 text-yellow-400"
                          : "border-white/8 text-gray-500"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className={`block text-xs font-medium ${
                          selected ? "text-white" : "text-gray-300"
                        }`}
                      >
                        {mode.name}
                      </span>
                      <span className="mt-1.5 block text-[10px] text-gray-600">
                        {mode.level} · {mode.duration}
                      </span>
                    </span>

                    {selected && (
                      <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                    )}
                  </button>
                );
              })}

              {filteredModes.length === 0 && (
                <p className="px-3 py-8 text-center text-xs text-gray-500">
                  No modes match your search.
                </p>
              )}
            </div>

            <div className="border-t border-white/[0.07] p-4">
              <p className="text-xs font-medium text-gray-300">
                Learn at your own pace
              </p>
              <p className="mt-1.5 text-[11px] leading-5 text-gray-600">
                Start with fundamentals before moving to more complex topics.
              </p>
            </div>
          </aside>

          {/* Centre: chart workspace */}
          <section className="min-w-0 space-y-4">
            <div className="overflow-hidden rounded-xl border border-white/8 bg-[#0e0f12]">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.07] px-4 py-4 sm:px-5">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-medium uppercase tracking-wider text-gray-500">
                      SELECTED MODE
                    </span>
                    <span className="rounded border border-white/8 px-1.5 py-0.5 text-[9px] text-gray-500">
                      {activeMode.level}
                    </span>
                  </div>
                  <h2 className="mt-2 text-lg font-semibold">
                    {activeMode.name}
                  </h2>
                  <p className="mt-1 text-xs text-gray-500">
                    {activeMode.category}
                  </p>
                </div>

                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Clock3 size={14} />
                  {activeMode.duration}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/6 px-4 py-3 sm:px-5">
                <div className="flex items-center gap-2">
                  <BarChart3 size={16} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-300">
                    Illustrative price chart
                  </span>
                </div>
                <span className="text-[10px] text-gray-600">
                  DEMO VIEW · NOT LIVE MARKET DATA
                </span>
              </div>

              <div className="p-3 sm:p-5">
                <div className="mb-3 flex flex-wrap gap-4 text-[10px] text-gray-500">
                  <span>Price action</span>
                  <span>•</span>
                  <span>Trend observation</span>
                  <span>•</span>
                  <span>Chart reading</span>
                </div>

                <PriceChart />

                <div className="mt-3 flex items-center justify-between border-t border-white/6 pt-3 text-[10px] text-gray-600">
                  <span>Illustrative exercise chart</span>
                  <span>Learning preview</span>
                </div>
              </div>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#0e0f12] p-5 sm:p-6">
              <div className="flex items-start gap-3">
                <div className="rounded-lg border border-white/8 bg-white/2.5 p-2.5 text-gray-300">
                  <Crosshair size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold">About this exercise</h3>
                  <p className="mt-2 text-sm leading-6 text-gray-500">
                    {activeMode.description} Review the chart and consider
                    what the price movement may indicate. This preview uses
                    illustrative data and does not execute trades.
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                <span className="text-xs text-gray-600">
                  Exercise content preview
                </span>
                <button
                  type="button"
                  onClick={() => setShowSession(true)}
                  className="inline-flex items-center gap-2 rounded-lg bg-black px-4 py-2.5 text-xs font-semibold text-white transition "
                >
                  Open exercise preview
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </div>
          </section>

          {/* Right: controls */}
          <aside className="min-w-0 rounded-xl border border-white/8 bg-[#0e0f12]">
            <div className="border-b border-white/[0.07] p-4">
              <h2 className="text-sm font-semibold">Practice controls</h2>
              <p className="mt-1 text-xs text-gray-600">
                Explore a hypothetical decision
              </p>
            </div>

            <div className="space-y-6 p-4">
              <div>
                <SectionLabel>Market scenario</SectionLabel>
                <div className="flex items-center justify-between rounded-lg border border-white/8 bg-[#090a0c] px-3 py-3">
                  <span className="text-xs text-gray-300">
                    Illustrative chart
                  </span>
                  <Activity size={15} className="text-gray-500" />
                </div>
                <p className="mt-2 text-[10px] leading-5 text-gray-600">
                  No exchange connection or live prices.
                </p>
              </div>

              <div>
                <SectionLabel>Hypothetical direction</SectionLabel>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    aria-pressed={direction === "Buy"}
                    onClick={() => setDirection("Buy")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-xs font-semibold transition ${
                      direction === "Buy"
                        ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                        : "border-white/8 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <ArrowUpRight size={15} />
                    Buy
                  </button>

                  <button
                    type="button"
                    aria-pressed={direction === "Sell"}
                    onClick={() => setDirection("Sell")}
                    className={`flex items-center justify-center gap-2 rounded-lg border py-3 text-xs font-semibold transition ${
                      direction === "Sell"
                        ? "border-yellow-500/40 bg-yellow-500/10 text-yellow-400"
                        : "border-white/8 text-gray-500 hover:text-gray-300"
                    }`}
                  >
                    <ArrowDownRight size={15} />
                    Sell
                  </button>
                </div>
              </div>

              <div>
                <SectionLabel>Decision notes</SectionLabel>
                <textarea
                  rows={4}
                  placeholder="Why would you choose this direction?"
                  className="w-full resize-y rounded-lg border border-white/8 bg-[#090a0c] p-3 text-xs leading-5 text-gray-300 outline-none placeholder:text-gray-600 focus:border-yellow-500/40"
                />
              </div>

              <div className="border-t border-white/[0.07] pt-4">
                <div className="flex items-start gap-2.5">
                  <ShieldCheck
                    size={16}
                    className="mt-0.5 shrink-0 text-gray-500"
                  />
                  <p className="text-[11px] leading-5 text-gray-600">
                    This is a learning preview, not a real order. No money is
                    invested and no trade is executed.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowSession(true)}
                className="w-full rounded-lg bg-black px-4 py-3 text-xs font-semibold text-white transition "
              >
                Review my selection
              </button>
            </div>
          </aside>
        </div>

        <footer className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-gray-600">
          <span>CHARTWARS · PRACTICE WORKSPACE</span>
          <a href="/" className="transition hover:text-gray-300">
            Back to home
          </a>
        </footer>
      </div>

      {/* Selection review */}
      {showSession && (
        <div
          className="fixed inset-0 z-100 flex items-center justify-center bg-black/80 p-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowSession(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-title"
            className="w-full max-w-md rounded-xl border border-white/10 bg-[#101114] p-6 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-gray-500">
                  SELECTION REVIEW
                </p>
                <h2 id="review-title" className="mt-2 text-xl font-semibold">
                  Check your practice setup
                </h2>
              </div>

              <button
                type="button"
                aria-label="Close review"
                onClick={() => setShowSession(false)}
                className="rounded-md p-2 text-gray-500 transition hover:bg-white/5 hover:text-white"
              >
                <X size={18} />
              </button>
            </div>

            <div className="mt-6 divide-y divide-white/[0.07] rounded-lg border border-white/8 px-4">
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-gray-500">Practice mode</span>
                <span className="text-right text-xs font-medium">
                  {activeMode.name}
                </span>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-gray-500">Difficulty</span>
                <span className="text-xs">{activeMode.level}</span>
              </div>
              <div className="flex items-center justify-between gap-4 py-4">
                <span className="text-xs text-gray-500">Your selection</span>
                <span className="text-xs font-semibold text-yellow-400">
                  {direction}
                </span>
              </div>
            </div>

            <p className="mt-4 text-xs leading-5 text-gray-500">
              Your selection is only a local preview. Saving answers,
              calculating scores and running interactive exercises have not
              been connected yet.
            </p>

            <button
              type="button"
              onClick={() => setShowSession(false)}
              className="mt-5 w-full rounded-lg bg-black px-4 py-3 text-xs font-semibold text-white transition "
            >
              Back to workspace
            </button>
          </div>
        </div>
      )}

     <Footer/>

    </main>
  );
}
