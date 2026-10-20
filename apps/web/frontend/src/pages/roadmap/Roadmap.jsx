
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  ArrowDownRight,
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  Circle,
  Clock3,
  GraduationCap,
  Layers3,
  RotateCcw,
  ShieldCheck,
  Target,
  TrendingUp,
  Trophy,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

const tracks = [
  {
    id: "foundation",
    number: "01",
    label: "Foundation",
    title: "Market Structure",
    subtitle: "Build your chart-reading foundation.",
    level: "BEGINNER",
    duration: "3–4 weeks",
    outcome: "Independent Chart Literacy",
    description:
      "Learn to read price action, understand market structure, and identify meaningful levels without depending on external noise.",
    icon: Layers3,
    milestones: [
      {
        title: "Price Action Fundamentals",
        description:
          "Understand support, resistance, trendlines, and key price levels.",
        duration: "45 min",
        lessons: [
          "Support and resistance zones",
          "Drawing meaningful trendlines",
          "Breakouts versus false breakouts",
        ],
      },
      {
        title: "Candlestick Mechanics",
        description:
          "Read candle bodies, wicks, price ranges, and volume context.",
        duration: "50 min",
        lessons: [
          "Candle bodies and wicks",
          "Bullish and bearish formations",
          "Volume and spread basics",
        ],
      },
      {
        title: "Market Structure",
        description:
          "Recognize trends through swing highs, swing lows, and structure shifts.",
        duration: "60 min",
        lessons: [
          "Higher highs and higher lows",
          "Lower highs and lower lows",
          "Trend continuation and reversals",
        ],
      },
      {
        title: "Chart Reading Practice",
        description:
          "Apply your knowledge to a clean chart and build a repeatable analysis routine.",
        duration: "60 min",
        lessons: [
          "Marking major market levels",
          "Identifying trend direction",
          "Writing a chart analysis",
        ],
      },
    ],
  },
  {
    id: "quantitative",
    number: "02",
    label: "Quantitative",
    title: "Indicators & Execution",
    subtitle: "Turn observations into repeatable rules.",
    level: "INTERMEDIATE",
    duration: "4–6 weeks",
    outcome: "Rule-Based Trading Systems",
    description:
      "Combine technical indicators, volume analysis, and execution principles to develop a structured, testable trading process.",
    icon: TrendingUp,
    milestones: [
      {
        title: "Indicator Mechanics",
        description:
          "Understand indicator calculations, limitations, and practical applications.",
        duration: "50 min",
        lessons: [
          "RSI and momentum",
          "MACD and moving averages",
          "Bollinger Bands and volatility",
        ],
      },
      {
        title: "Volume & Order Flow",
        description:
          "Explore traded volume, volume profiles, and the context behind order flow.",
        duration: "60 min",
        lessons: [
          "Volume Profile fundamentals",
          "Bid-ask and order flow concepts",
          "Liquidity zones and limitations",
        ],
      },
      {
        title: "Execution & Liquidity",
        description:
          "Learn how order types, liquidity, and slippage affect trade outcomes.",
        duration: "45 min",
        lessons: [
          "Market versus limit orders",
          "Spread and slippage",
          "Liquidity and execution risk",
        ],
      },
      {
        title: "Build a Rule-Based System",
        description:
          "Define objective entry, exit, and risk rules, then test them against historical data.",
        duration: "75 min",
        lessons: [
          "Writing measurable trading rules",
          "Backtesting and avoiding overfitting",
          "Recording and evaluating results",
        ],
      },
    ],
  },
  {
    id: "macro",
    number: "03",
    label: "Macro & Risk",
    title: "Macro & Risk Dynamics",
    subtitle: "Think in probabilities. Protect capital.",
    level: "ADVANCED",
    duration: "5–8 weeks",
    outcome: "Capital Management & Preservation",
    description:
      "Connect macroeconomic conditions with market behavior while developing disciplined position sizing and drawdown management.",
    icon: ShieldCheck,
    milestones: [
      {
        title: "Macro Fundamentals",
        description:
          "Understand how economic policy, rates, and liquidity can influence markets.",
        duration: "60 min",
        lessons: [
          "Interest rates and central banks",
          "DXY and inter-market relationships",
          "Liquidity cycles and economic data",
        ],
      },
      {
        title: "Quantitative Risk Models",
        description:
          "Study probability-based approaches to measuring and managing portfolio risk.",
        duration: "75 min",
        lessons: [
          "Position sizing and risk per trade",
          "Value at Risk (VaR) fundamentals",
          "Kelly Criterion assumptions and limitations",
        ],
      },
      {
        title: "Drawdown & Psychology",
        description:
          "Build a process for handling losing streaks and reducing emotional decisions.",
        duration: "45 min",
        lessons: [
          "Understanding drawdown",
          "Loss streaks and risk reduction",
          "Trading journals and decision discipline",
        ],
      },
      {
        title: "Portfolio Risk Framework",
        description:
          "Bring together exposure limits, scenario analysis, and a capital preservation plan.",
        duration: "75 min",
        lessons: [
          "Exposure and correlation risk",
          "Scenario and stress testing",
          "Documenting a risk management plan",
        ],
      },
    ],
  },
];

const STORAGE_KEY = "chartwars-roadmap-progress-v1";

function readProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-2.5">
      <img
        src={logo}
        alt="ChartWars logo"
        className="h-9 w-9 object-contain"
      />
      <span className="text-lg font-black tracking-[0.16em] text-white">
        CHARTWARS
      </span>
    </Link>
  );
}

function SectionLabel({ children }) {
  return (
    <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-orange-400">
      {children}
    </p>
  );
}

export default function Rodmap() {
  const [activeTrack, setActiveTrack] = useState("foundation");
  const [completed, setCompleted] = useState(readProgress);
  const [selectedNode, setSelectedNode] = useState(null);
  const [showAdvancedNotice, setShowAdvancedNotice] = useState(false);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const track = tracks.find((item) => item.id === activeTrack) || tracks[0];

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(completed));
    } catch {
      // Progress still works for the current session if storage is unavailable.
    }
  }, [completed]);

  const allNodes = useMemo(
    () => tracks.flatMap((item) => item.milestones.map((node) => ({
      ...node,
      trackId: item.id,
    }))),
    []
  );

  const totalNodes = allNodes.length;
  const completedCount = allNodes.filter((node) =>
    completed[`${node.trackId}:${node.title}`]
  ).length;
  const overallProgress = Math.round((completedCount / totalNodes) * 100);

  const trackCompleted = track.milestones.filter((node) =>
    completed[`${track.id}:${node.title}`]
  ).length;
  const trackProgress = Math.round(
    (trackCompleted / track.milestones.length) * 100
  );

  function toggleNode(node) {
    const key = `${track.id}:${node.title}`;
    setCompleted((previous) => ({
      ...previous,
      [key]: !previous[key],
    }));
  }

  function chooseTrack(id) {
    setActiveTrack(id);
    setSelectedNode(null);
    setShowAdvancedNotice(id === "macro");
  }

  function resetProgress() {
    setCompleted({});
    setSelectedNode(null);
    setShowResetConfirm(false);
  }

   selectedNode
    ? Boolean(completed[`${track.id}:${selectedNode.title}`])
    : false;

  return (
    <div className="min-h-screen bg-[#08090b] text-white selection:bg-orange-500/30">
    
          {/* Header */}
            <header className="sticky top-0 z-40 border-b border-white/10 bg-[#08090b]/90 backdrop-blur-xl">
            <div className="mx-auto flex h-18 max-w-360 items-center justify-start px-5 sm:px-8 xl:px-12">
                <Brand />
            </div>
            </header>

      <main className="mx-auto max-w-360 px-5 pb-20 pt-9 sm:px-8 sm:pt-12 xl:px-12">
        {/* Breadcrumb */}
        <Link
          to="/"
          className="mb-9 inline-flex items-center gap-2 text-xs text-zinc-500 transition hover:text-orange-400"
        >
          <ArrowLeft size={14} />
          Back to Home
        </Link>

        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-white/9 bg-[#101114] p-6 sm:p-10 lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-orange-500/10 blur-[100px]" />
          <div className="pointer-events-none absolute -bottom-36 left-[38%] h-64 w-64 rounded-full bg-orange-600/6 blur-[90px]" />

          <div className="relative grid gap-10 lg:grid-cols-[1fr_330px] lg:items-center">
            <div className="max-w-3xl">
              <SectionLabel>CHARTWARS / LEARNING SYSTEM</SectionLabel>

              <h1 className="mt-5 text-4xl font-semibold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl">
                Your edge starts
                <br />
                with a <span className="text-orange-400">clear path.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
                Three professional learning tracks. One milestone at a time.
                Build your market knowledge, sharpen execution, and learn to
                manage risk with a structured process.
              </p>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="#tracks"
                  className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
                >
                  Explore the tracks <ArrowRight size={16} />
                </a>
                <a
                  href="#learning-path"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-white transition hover:border-orange-400/50 hover:bg-white/3"
                >
                  View milestones <ArrowDownRight size={16} />
                </a>
              </div>
            </div>

            <div className="relative rounded-2xl border border-white/10 bg-black/30 p-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-zinc-400">
                  YOUR LEARNING PROGRESS
                </span>
                <Target size={17} className="text-orange-400" />
              </div>

              <div className="mt-6 flex items-end gap-2">
                <span className="text-5xl font-semibold tracking-tight">
                  {overallProgress}
                </span>
                <span className="mb-1.5 text-xl text-zinc-500">%</span>
              </div>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-zinc-800">
                <div
                  className="h-full rounded-full bg-emerald-400 transition-all duration-500"
                  style={{ width: `${overallProgress}%` }}
                />
              </div>

              <div className="mt-3 flex items-center justify-between text-xs text-zinc-500">
                <span>{completedCount} of {totalNodes} milestones</span>
                <span>All tracks</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/8 pt-5">
                {tracks.map((item) => {
                  const count = item.milestones.filter((node) =>
                    completed[`${item.id}:${node.title}`]
                  ).length;

                  return (
                    <div key={item.id}>
                      <p className="text-lg font-semibold">{count}/{item.milestones.length}</p>
                      <p className="mt-1 text-[10px] text-zinc-500">{item.label}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Track overview */}
        <section id="tracks" className="scroll-mt-28 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>CHOOSE YOUR DIRECTION</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                Three tracks. <span className="text-zinc-500">One stronger trader.</span>
              </h2>
            </div>
            <p className="max-w-md text-sm leading-6 text-zinc-500">
              Select a track to load its milestones. Start with the level that
              matches your current knowledge.
            </p>
          </div>

          <div className="mt-7 grid gap-4 lg:grid-cols-3">
            {tracks.map((item) => {
              const Icon = item.icon;
              const active = item.id === activeTrack;
              const done = item.milestones.filter((node) =>
                completed[`${item.id}:${node.title}`]
              ).length;
              const progress = Math.round((done / item.milestones.length) * 100);

              return (
                <button
                  key={item.id}
                  onClick={() => chooseTrack(item.id)}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition duration-200 sm:p-6 ${
                    active
                      ? "border-orange-400/60 bg-orange-500/[0.07]"
                      : "border-white/9 bg-[#101114] hover:border-white/20 hover:bg-[#141518]"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-x-0 top-0 h-px bg-orange-400" />
                  )}

                  <div className="flex items-start justify-between gap-3">
                    <div className={`rounded-xl border p-3 ${
                      active
                        ? "border-orange-400/30 bg-orange-400/10 text-orange-400"
                        : "border-white/10 bg-white/3 text-zinc-300"
                    }`}>
                      <Icon size={22} />
                    </div>
                    <span className={`rounded-md px-2.5 py-1 text-[9px] font-bold tracking-[0.15em] ${
                      active
                        ? "bg-orange-400/10 text-orange-300"
                        : "bg-white/5 text-zinc-500"
                    }`}>
                      {item.level}
                    </span>
                  </div>

                  <p className="mt-6 text-xs font-semibold tracking-[0.12em] text-zinc-500">
                    TRACK {item.number}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold">{item.title}</h3>
                  <p className="mt-2 min-h-10 text-sm leading-6 text-zinc-400">
                    {item.subtitle}
                  </p>

                  <div className="mt-5 flex items-center justify-between text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <Clock3 size={13} /> {item.duration}
                    </span>
                    <span>{done}/{item.milestones.length} complete</span>
                  </div>

                  <div className="mt-3 h-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        progress === 100 ? "bg-emerald-400" : "bg-orange-400"
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>

                  <div className={`mt-5 flex items-center justify-between border-t pt-4 text-sm ${
                    active ? "border-orange-400/15 text-orange-300" : "border-white/[0.07] text-zinc-400"
                  }`}>
                    <span>{active ? "Currently selected" : "Explore track"}</span>
                    <ChevronRight
                      size={17}
                      className="transition group-hover:translate-x-1"
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Prerequisite recommendation */}
        {showAdvancedNotice && (
          <div className="mt-6 flex gap-3 rounded-xl border border-orange-400/20 bg-orange-400/6 p-4">
            <GraduationCap className="mt-0.5 shrink-0 text-orange-400" size={20} />
            <div className="flex-1">
              <p className="text-sm font-semibold text-orange-200">
                Recommended prerequisite
              </p>
              <p className="mt-1 text-sm leading-6 text-zinc-400">
                Recommended: Completion of Quantitative Indicators track first.
                This advanced track assumes familiarity with technical analysis
                and basic trading risk concepts. You can still explore it now.
              </p>
              <button
                onClick={() => chooseTrack("quantitative")}
                className="mt-3 text-xs font-bold text-orange-300 hover:text-orange-200"
              >
                Explore Quantitative first <ArrowRight className="ml-1 inline" size={13} />
              </button>
            </div>
            <button
              onClick={() => setShowAdvancedNotice(false)}
              aria-label="Dismiss prerequisite notice"
              className="h-fit text-zinc-500 hover:text-white"
            >
              <X size={17} />
            </button>
          </div>
        )}

        {/* Selected track pipeline */}
        <section id="learning-path" className="scroll-mt-28 pt-16">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <SectionLabel>YOUR MILESTONE PIPELINE</SectionLabel>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                <span className="text-orange-400">{track.number}.</span>{" "}
                {track.title}
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                {track.description}
              </p>
            </div>

            <div className="rounded-xl border border-white/8 bg-[#101114] px-4 py-3">
              <p className="text-[10px] font-semibold tracking-[0.16em] text-zinc-500">
                TRACK COMPLETION
              </p>
              <div className="mt-1.5 flex items-center gap-3">
                <span className="text-2xl font-semibold">{trackProgress}%</span>
                <span className="text-xs text-zinc-500">
                  {trackCompleted} / {track.milestones.length} nodes
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="mt-8 rounded-2xl border border-white/8 bg-[#101114] p-5 sm:p-8">
            <div className="mb-8 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <span className="h-2 w-2 rounded-full bg-orange-400" />
                Learning sequence
              </div>
              <span className="text-xs text-zinc-500">
                {track.milestones.length} milestones
              </span>
            </div>

            <div className="relative">
              {track.milestones.map((node, index) => {
                const key = `${track.id}:${node.title}`;
                const isDone = Boolean(completed[key]);
                const isSelected = selectedNode?.title === node.title;
                const isLast = index === track.milestones.length - 1;

                return (
                  <div
                    key={key}
                    className="relative grid grid-cols-[36px_minmax(0,1fr)] gap-4 sm:grid-cols-[44px_minmax(0,1fr)] sm:gap-5"
                  >
                    {/* Vertical progress line */}
                    <div className="relative flex justify-center">
                      {!isLast && (
                        <div className="absolute bottom-0 top-9 w-px bg-zinc-800">
                          <div
                            className={`w-full transition-all duration-500 ${
                              isDone ? "h-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.22)]" : "h-0"
                            }`}
                          />
                        </div>
                      )}
                      <div
                        className={`relative z-10 flex h-9 w-9 items-center justify-center rounded-full border transition-all duration-300 sm:h-10 sm:w-10 ${
                          isDone
                            ? "border-emerald-400/60 bg-emerald-400/10 text-emerald-300 shadow-[0_0_16px_rgba(52,211,153,0.10)]"
                            : isSelected
                              ? "border-orange-400 bg-orange-400/10 text-orange-300"
                              : "border-zinc-700 bg-[#101114] text-zinc-500"
                        }`}
                      >
                        {isDone ? <Check size={17} /> : <span className="text-xs font-bold">{String(index + 1).padStart(2, "0")}</span>}
                      </div>
                    </div>

                    <div className={`mb-5 min-w-0 rounded-xl border p-4 transition sm:p-5 ${
                      isSelected
                        ? "border-orange-400/35 bg-orange-400/[0.035]"
                        : "border-white/[0.07] bg-black/10 hover:border-white/[0.14]"
                    }`}>
                      <button
                        onClick={() => setSelectedNode(isSelected ? null : node)}
                        className="flex w-full items-start justify-between gap-3 text-left"
                      >
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[10px] font-bold tracking-[0.15em] text-zinc-500">
                              MILESTONE {String(index + 1).padStart(2, "0")}
                            </span>
                            {isDone && (
                              <span className="rounded-md bg-emerald-400/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300">
                                Completed
                              </span>
                            )}
                          </div>
                          <h3 className="mt-2 text-base font-semibold sm:text-lg">
                            {node.title}
                          </h3>
                          <p className="mt-1.5 text-sm leading-6 text-zinc-400">
                            {node.description}
                          </p>
                        </div>
                        <ChevronRight
                          size={18}
                          className={`mt-1 shrink-0 text-zinc-500 transition ${
                            isSelected ? "rotate-90 text-orange-400" : ""
                          }`}
                        />
                      </button>

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] pt-4">
                        <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                          <Clock3 size={13} /> {node.duration}
                        </span>

                        <button
                          onClick={() => toggleNode(node)}
                          className={`inline-flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold transition ${
                            isDone
                              ? "border border-emerald-400/20 bg-emerald-400/6 text-emerald-300 hover:bg-emerald-400/10"
                              : "bg-orange-500 text-black hover:bg-orange-400"
                          }`}
                        >
                          {isDone ? <CheckCircle2 size={14} /> : <Check size={14} />}
                          {isDone ? "Mark incomplete" : "Mark complete"}
                        </button>
                      </div>

                      {isSelected && (
                        <div className="mt-5 border-t border-white/[0.07] pt-5">
                          <p className="text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                            Learning objectives
                          </p>
                          <ul className="mt-3 space-y-3">
                            {node.lessons.map((lesson) => (
                              <li key={lesson} className="flex items-start gap-2.5 text-sm text-zinc-300">
                                <Circle size={7} className="mt-1.5 shrink-0 text-orange-400" />
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-4 text-xs leading-5 text-zinc-500">
                            Tip: Practice the concept on historical charts and
                            record what you observe before moving to the next node.
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {trackProgress === 100 && (
              <div className="mt-2 flex items-start gap-3 rounded-xl border border-emerald-400/20 bg-emerald-400/5 p-4">
                <Trophy className="shrink-0 text-emerald-300" size={20} />
                <div>
                  <p className="text-sm font-semibold text-emerald-200">
                    Track completed
                  </p>
                  <p className="mt-1 text-xs leading-5 text-zinc-400">
                    You have marked every milestone in this track complete.
                    Review your notes and practice before moving to new concepts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Executive outcome */}
        <section className="mt-8 grid gap-5 rounded-2xl border border-white/8 bg-[#101114] p-6 sm:p-8 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex items-start gap-4">
            <div className="rounded-xl border border-orange-400/20 bg-orange-400/8 p-3 text-orange-400">
              <GraduationCap size={23} />
            </div>
            <div>
              <SectionLabel>THE EXECUTIVE OUTCOME</SectionLabel>
              <h3 className="mt-2 text-xl font-semibold">{track.outcome}</h3>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-400">
                Each milestone is designed to help you build a repeatable
                learning process. Progress is not a guarantee of trading
                performance or profitability.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-semibold text-zinc-400 transition hover:border-red-400/30 hover:text-red-300"
          >
            <RotateCcw size={14} /> Reset progress
          </button>
        </section>

        {/* Reset confirmation */}
        {showResetConfirm && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-5 backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl border border-white/10 bg-[#121316] p-6 shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-red-400/10 p-2.5 text-red-300">
                  <RotateCcw size={20} />
                </div>
                <h3 className="text-lg font-semibold">Reset all progress?</h3>
              </div>
              <p className="mt-4 text-sm leading-6 text-zinc-400">
                This clears all completed milestones across the three tracks on
                this browser. This action cannot be undone.
              </p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setShowResetConfirm(false)}
                  className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/4"
                >
                  Cancel
                </button>
                <button
                  onClick={resetProgress}
                  className="rounded-lg bg-red-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-red-400"
                >
                  Reset progress
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer/>
    </div>
  );
}
