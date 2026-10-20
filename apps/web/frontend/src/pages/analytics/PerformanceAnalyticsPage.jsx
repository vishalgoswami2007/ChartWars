
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";
import Footer from "../../pages/landing/footer/Footer";

import { useMemo, useState } from "react";
import {
  ArrowUpRight,
  Award,
  ChevronDown,
  Download,
  Flame,
  Target,
  Trophy,
} from "lucide-react";

const periods = ["1D", "1W", "1M", "ALL"];

const chartData = {
  "1D": [24, 29, 26, 36, 33, 43, 39, 48, 45, 54, 50, 63, 59, 69],
  "1W": [18, 25, 22, 34, 29, 39, 35, 47, 42, 54, 49, 62, 57, 72],
  "1M": [12, 18, 15, 27, 24, 21, 36, 32, 43, 39, 48, 45, 60, 72],
  ALL: [8, 14, 11, 19, 16, 28, 24, 37, 32, 43, 39, 55, 49, 72],
};

const mistakes = [
  {
    setup: "Late breakout entry",
    type: "Breakout",
    frequency: 12,
    impact: "High",
    width: "w-[78%]",
  },
  {
    setup: "Counter-trend trades",
    type: "Trend",
    frequency: 8,
    impact: "High",
    width: "w-[56%]",
  },
  {
    setup: "Early stop placement",
    type: "Risk management",
    frequency: 6,
    impact: "Medium",
    width: "w-[40%]",
  },
  {
    setup: "Range misidentification",
    type: "Consolidation",
    frequency: 3,
    impact: "Low",
    width: "w-[22%]",
  },
];

const strategies = [
  "All strategies",
  "Breakout",
  "Trend following",
  "Reversal",
];

function SectionHeading({ eyebrow, title, detail }) {
  return (
    <div className="mb-5">
      <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-500">
        {eyebrow}
      </p>
      <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
        {title}
      </h2>
      {detail && (
        <p className="mt-1.5 text-xs leading-5 text-gray-500">{detail}</p>
      )}
    </div>
  );
}

function TrendChart({ period }) {
  const values = chartData[period];

  const points = values
    .map((value, index) => {
      const x = (index / (values.length - 1)) * 720;
      const y = 200 - value * 2.3;
      return `${x},${y}`;
    })
    .join(" ");

  const lastValue = values[values.length - 1];
  const lastY = 200 - lastValue * 2.3;

  return (
    <div className="relative">
      <div className="pointer-events-none absolute inset-0 flex flex-col justify-between pb-7 pt-3">
        {[0, 1, 2, 3, 4].map((line) => (
          <div key={line} className="border-t border-white/5.5" />
        ))}
      </div>

      <svg
        viewBox="0 0 720 230"
        preserveAspectRatio="none"
        role="img"
        aria-label={`Illustrative performance trend for ${period}`}
        className="relative h-56.25 w-full sm:h-68.75"
      >
        <defs>
          <linearGradient id="performanceArea" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#d4ad42" stopOpacity=".20" />
            <stop offset="100%" stopColor="#d4ad42" stopOpacity="0" />
          </linearGradient>
        </defs>

        <polygon
          points={`0,220 ${points} 720,220`}
          fill="url(#performanceArea)"
        />

        <polyline
          points={points}
          fill="none"
          stroke="#e2bd58"
          strokeWidth="2.2"
          strokeLinejoin="round"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />

        <circle
          cx="720"
          cy={lastY}
          r="4"
          fill="#e2bd58"
          stroke="#090a0c"
          strokeWidth="2"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <div className="flex justify-between border-t border-white/6 pt-3 text-[10px] text-gray-600">
        {(
          period === "1D"
            ? ["09:00", "11:00", "13:00", "15:00", "Now"]
            : period === "1W"
              ? ["Mon", "Tue", "Wed", "Thu", "Fri"]
              : period === "1M"
                ? ["Week 1", "Week 2", "Week 3", "Week 4", "Now"]
                : ["Start", "Month 2", "Month 4", "Month 6", "Now"]
        ).map((label) => (
          <span key={label}>{label}</span>
        ))}
      </div>
    </div>
  );
}

function StyleRadar() {
  const axes = [
    { label: "Analysis", x: 110, y: 24 },
    { label: "Discipline", x: 180, y: 75 },
    { label: "Speed", x: 153, y: 159 },
    { label: "Risk control", x: 67, y: 159 },
    { label: "Consistency", x: 40, y: 75 },
  ];

  const values = [
    [110, 45],
    [157, 91],
    [138, 137],
    [76, 131],
    [57, 81],
  ];

  return (
    <div className="flex flex-col items-center">
      <svg
        viewBox="0 0 220 190"
        className="h-47.5 w-full max-w-67.5"
        role="img"
        aria-label="Illustrative battle style radar chart"
      >
        {[0.35, 0.65, 1].map((scale) => {
          const polygon = axes
            .map((axis) => {
              const x = 110 + (axis.x - 110) * scale;
              const y = 92 + (axis.y - 92) * scale;
              return `${x},${y}`;
            })
            .join(" ");

          return (
            <polygon
              key={scale}
              points={polygon}
              fill="none"
              stroke="rgba(255,255,255,0.12)"
              strokeWidth="1"
            />
          );
        })}

        {axes.map((axis) => (
          <line
            key={axis.label}
            x1="110"
            y1="92"
            x2={axis.x}
            y2={axis.y}
            stroke="rgba(255,255,255,0.12)"
          />
        ))}

        <polygon
          points={values.map(([x, y]) => `${x},${y}`).join(" ")}
          fill="rgba(212,173,66,0.10)"
          stroke="#d4ad42"
          strokeWidth="1.6"
          strokeLinejoin="round"
        />

        {values.map(([x, y], index) => (
          <circle
            key={index}
            cx={x}
            cy={y}
            r="3"
            fill="#d4ad42"
            stroke="#090a0c"
            strokeWidth="1"
          />
        ))}

        <g fill="#8c8c8c" fontSize="9">
          <text x="110" y="12" textAnchor="middle">Analysis</text>
          <text x="187" y="72" textAnchor="start">Discipline</text>
          <text x="155" y="174" textAnchor="middle">Speed</text>
          <text x="66" y="174" textAnchor="middle">Risk control</text>
          <text x="32" y="72" textAnchor="end">Consistency</text>
        </g>
      </svg>
      <p className="text-[10px] text-gray-600">
        Illustrative profile · Not calculated from account history
      </p>
    </div>
  );
}

export default function PerformanceAnalyticsPage() {
  const [period, setPeriod] = useState("1W");
  const [strategy, setStrategy] = useState("All strategies");
  const [showStrategy, setShowStrategy] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  const filteredMistakes = useMemo(() => {
    if (strategy === "All strategies") return mistakes;

    const categoryMap = {
      Breakout: "Breakout",
      "Trend following": "Trend",
      Reversal: "Consolidation",
    };

    return mistakes.filter(
      (mistake) => mistake.type === categoryMap[strategy]
    );
  }, [strategy]);

  return (
    <main className="min-h-screen bg-[#090a0c] text-white">
      {/* ChartWars header - back to landing page */}
      <header className="border-b border-white/10 bg-[#070707]">
        <div className="mx-auto flex max-w-screen-2xl items-center justify-between px-5 py-4 sm:px-8 lg:px-12">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ChartWars" className="h-9 w-9 object-contain" />
            <span className="text-lg font-bold tracking-widest text-white">
              CHART<span className="text-yellow-400">WARS</span>
            </span>
          </Link>

          <Link
            to="/"
            className="rounded-full border border-white/15 px-4 py-2.5 text-sm font-medium text-white transition hover:border-yellow-400 hover:text-yellow-400"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-[1600px] px-4 py-7 sm:px-7 lg:px-10">
        {/* Header */}
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-white/8 pb-6">
          <div>
            <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-widest text-gray-600">
              <Link to="/" className="transition hover:text-white">ChartWars</Link>
              <span>/</span>
              <span className="text-gray-400">Analytics</span>
            </div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Performance analytics
            </h1>
            <p className="mt-2 text-sm text-gray-500">
              Your decisions, patterns and areas to improve.
            </p>
          </div>

          <button
            type="button"
            onClick={() => window.print()}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3.5 py-2.5 text-xs font-medium text-gray-300 transition hover:border-white/20 hover:text-white"
          >
            <Download size={15} />
            Export / Print
          </button>
        </header>

        {/* Snapshot hero */}
        <section className="mb-7 grid gap-5 lg:grid-cols-[1fr_300px]">
          <div className="flex flex-col justify-between rounded-xl border border-white/8 bg-[#0e0f12] p-5 sm:p-7">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs text-gray-500">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-500" />
                YOUR PERFORMANCE SNAPSHOT
              </div>
              <h2 className="text-2xl font-semibold tracking-tight sm:text-4xl">
                Measure progress.
                <br />
                <span className="text-gray-500">Find your edge.</span>
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-500">
                A closer look at your practice history, decision patterns and
                opportunities to improve.
              </p>
            </div>

            <div className="mt-8 grid grid-cols-2 gap-5 border-t border-white/[0.07] pt-5 sm:grid-cols-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Win rate
                </p>
                <div className="mt-2 flex items-baseline gap-1.5">
                  <span className="text-3xl font-semibold tracking-tight">68.4%</span>
                  <ArrowUpRight size={15} className="text-green-500" />
                </div>
                <p className="mt-1 text-[10px] text-gray-600">
                  Sample metric · illustrative
                </p>
              </div>

              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Battles fought
                </p>
                <p className="mt-2 text-3xl font-semibold tracking-tight">248</p>
                <p className="mt-1 text-[10px] text-gray-600">Sample count</p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Current streak
                </p>
                <div className="mt-2 flex items-center gap-2">
                  <Flame size={20} className="text-yellow-500" />
                  <span className="text-3xl font-semibold tracking-tight">5 wins</span>
                </div>
                <p className="mt-1 text-[10px] text-gray-600">Example streak</p>
              </div>
            </div>
          </div>

          {/* Premium badge */}
          <div className="relative flex flex-col justify-between overflow-hidden rounded-xl border border-[#8b7438]/40 bg-[#100f0b] p-5 sm:p-6">
            <div className="absolute right-0 top-0 h-px w-2/3 bg-yellow-500/60" />

            <div className="flex items-center justify-between">
              <span className="text-[10px] font-semibold tracking-[0.18em] text-yellow-500">
                PERFORMANCE RECORD
              </span>
              <Award size={19} className="text-yellow-500" />
            </div>

            <div className="my-7 border-y border-yellow-500/15 py-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-yellow-500/35">
                <Trophy size={25} className="text-yellow-500" />
              </div>
              <p className="mt-4 text-[10px] tracking-[0.22em] text-gray-500">
                CHARTWARS
              </p>
              <h3 className="mt-1 text-xl font-semibold tracking-wide">
                Performance
              </h3>
              <p className="mt-1 text-xs text-yellow-500">Practice record</p>
            </div>

            <div className="flex items-end justify-between gap-3">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Weekly standing
                </p>
                <p className="mt-1 text-sm font-medium text-gray-200">
                  Top 5% <span className="text-gray-600">· example only</span>
                </p>
              </div>
              <span className="font-mono text-[10px] text-gray-600">
                DEMO / 001
              </span>
            </div>
          </div>
        </section>

        {/* Asymmetric analytics */}
        <section className="mb-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1.85fr)_minmax(300px,0.85fr)]">
          {/* Trend */}
          <div className="min-w-0 rounded-xl border border-white/8 bg-[#0e0f12] p-4 sm:p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <SectionHeading
                  eyebrow="Performance history"
                  title="Consistency over time"
                  detail="Illustrative practice-performance index"
                />
                <div className="mb-4 flex items-baseline gap-2">
                  <span className="text-3xl font-semibold">72.0</span>
                  <span className="text-xs text-green-500">+8.6% example</span>
                </div>
              </div>

              <div className="flex rounded-lg border border-white/8 bg-[#090a0c] p-1">
                {periods.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setPeriod(item)}
                    aria-pressed={period === item}
                    className={`rounded-md px-3 py-2 text-[10px] font-semibold transition ${
                      period === item
                        ? "bg-yellow-500 text-black"
                        : "text-gray-500 hover:text-white"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <span className="h-2 w-2 rounded-full bg-yellow-500" />
                Performance index
              </div>

              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowStrategy((value) => !value)}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/8 px-3 py-2 text-xs text-gray-400 transition hover:text-white"
                >
                  {strategy}
                  <ChevronDown size={13} />
                </button>

                {showStrategy && (
                  <div className="absolute right-0 top-full z-20 mt-2 min-w-44 rounded-lg border border-white/10 bg-[#151619] p-1 shadow-xl">
                    {strategies.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() => {
                          setStrategy(item);
                          setShowStrategy(false);
                        }}
                        className={`block w-full rounded-md px-3 py-2.5 text-left text-xs transition ${
                          strategy === item
                            ? "bg-yellow-500/10 text-yellow-400"
                            : "text-gray-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <TrendChart period={period} />

            <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-white/6 pt-4 text-[10px] text-gray-600">
              <span>Period: {period}</span>
              <span>Sample visualization · not account data</span>
            </div>
          </div>

          {/* Battle style */}
          <div className="min-w-0 rounded-xl border border-white/8 bg-[#0e0f12] p-5 sm:p-6">
            <SectionHeading
              eyebrow="Decision profile"
              title="Battle style DNA"
              detail="A sample profile of practice tendencies."
            />

            <div className="mb-5 flex items-center justify-between border-b border-white/[0.07] pb-4">
              <div>
                <p className="text-[10px] uppercase tracking-wider text-gray-600">
                  Profile
                </p>
                <p className="mt-1 text-lg font-semibold">Analytical</p>
              </div>
              <span className="rounded-md border border-yellow-500/20 px-2.5 py-1.5 text-[10px] text-yellow-500">
                SAMPLE
              </span>
            </div>

            <StyleRadar />

            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <div className="mb-3 flex items-center justify-between">
                <span className="text-xs text-gray-500">Win / loss split</span>
                <span className="text-xs text-gray-300">68 / 32</span>
              </div>

              <div className="flex h-2 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="w-[68%] bg-green-500" />
                <div className="w-[32%] bg-red-500" />
              </div>

              <div className="mt-3 flex items-center justify-between text-[10px]">
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                  Wins · 68%
                </span>
                <span className="flex items-center gap-1.5 text-gray-500">
                  <span className="h-1.5 w-1.5 rounded-full bg-red-500" />
                  Losses · 32%
                </span>
              </div>
            </div>
          </div>
        </section>

        {/* Mistake log */}
        <section className="mb-7 grid items-start gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(300px,0.8fr)]">
          <div className="min-w-0 rounded-xl border border-white/8 bg-[#0e0f12]">
            <div className="flex flex-wrap items-end justify-between gap-3 border-b border-white/[0.07] p-5 sm:px-6">
              <SectionHeading
                eyebrow="Review your decisions"
                title="Mistake log & blind spots"
                detail="Example categories to review during practice."
              />

              <span className="mb-5 text-[10px] text-gray-600">
                {filteredMistakes.length} categories
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-130 text-left">
                <thead>
                  <tr className="border-b border-white/[0.07] text-[10px] uppercase tracking-wider text-gray-600">
                    <th className="px-5 py-3 font-medium sm:px-6">Chart setup</th>
                    <th className="px-4 py-3 font-medium">Frequency</th>
                    <th className="px-4 py-3 font-medium">Impact score</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredMistakes.map((mistake) => (
                    <tr
                      key={mistake.setup}
                      className="border-b border-white/4.5 last:border-0 hover:bg-white/[0.018]"
                    >
                      <td className="px-5 py-4 sm:px-6">
                        <p className="text-xs font-medium text-gray-200">
                          {mistake.setup}
                        </p>
                        <p className="mt-1 text-[10px] text-gray-600">
                          {mistake.type}
                        </p>
                      </td>

                      <td className="px-4 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-4 text-xs text-gray-400">
                            {mistake.frequency}
                          </span>
                          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-white/[0.07]">
                            <div
                              className={`h-full rounded-full ${
                                mistake.impact === "High"
                                  ? "bg-red-500"
                                  : mistake.impact === "Medium"
                                    ? "bg-yellow-500"
                                    : "bg-green-500"
                              } ${mistake.width}`}
                            />
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] ${
                            mistake.impact === "High"
                              ? "text-red-400"
                              : mistake.impact === "Medium"
                                ? "text-yellow-500"
                                : "text-green-500"
                          }`}
                        >
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {mistake.impact}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="border-t border-white/[0.07] px-5 py-3.5 sm:px-6">
              <p className="text-[10px] leading-5 text-gray-600">
                Frequencies and impact labels are sample values. Real blind
                spots require saved practice results.
              </p>
            </div>
          </div>

          {/* Recommendation */}
          <aside className="rounded-xl border border-white/9 bg-[#11110e] p-5 sm:p-6">
            <div className="mb-5 flex items-center justify-between">
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-yellow-500">
                Coach's note
              </span>
              <Target size={18} className="text-yellow-500" />
            </div>

            <h2 className="text-xl font-medium leading-8 tracking-tight text-gray-100">
              Better decisions start with a better review.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-400">
              Your sample profile shows stronger results in candlestick
              exercises than line-chart exercises. Consider reviewing trend
              confirmation before your next practice session.
            </p>

            <div className="my-5 border-l-2 border-yellow-500/60 pl-4">
              <p className="text-sm leading-6 text-gray-300">
                Focus for next week
              </p>
              <p className="mt-1 text-xs leading-5 text-gray-500">
                Review breakout entries, confirm the broader trend, and
                document your reasoning before choosing a direction.
              </p>
            </div>

            <div className="flex items-center justify-between border-t border-white/8 pt-4">
              <span className="text-[10px] text-gray-600">
                Illustrative recommendation
              </span>
              <button
                type="button"
                onClick={() => setShowDetails((value) => !value)}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-yellow-500 transition hover:text-yellow-300"
              >
                {showDetails ? "Show less" : "Read note"}
                <ArrowUpRight size={13} />
              </button>
            </div>

            {showDetails && (
              <div className="mt-4 rounded-lg border border-white/[0.07] bg-black/20 p-4">
                <p className="text-xs leading-6 text-gray-400">
                  A useful review process records the setup, the reason for
                  the decision, the planned invalidation point, and the
                  outcome. Once ChartWars stores real session results, this
                  section can generate evidence-based recommendations instead
                  of sample observations.
                </p>
              </div>
            )}
          </aside>
        </section>

        <footer className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-5 text-[10px] text-gray-600">
          <span>CHARTWARS · PERFORMANCE ANALYTICS</span>
          <Link to="/" className="transition hover:text-gray-300">
            Back to home
          </Link>
        </footer>
      </div>

      {/* Existing site footer */}
      <Footer />
    </main>
  );
}
