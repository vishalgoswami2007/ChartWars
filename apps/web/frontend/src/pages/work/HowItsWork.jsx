
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import logo from "../../../src/assets/logo.png";
import {
  ArrowRight,
  Swords,
  ChartNoAxesCombined,
  Trophy,
  MessageCircle,
  RotateCcw,
  ShieldCheck,
  Clock3,
  Users,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Create Your Battleground",
    subtitle: "SET THE ARENA",
    description:
      "Set up your arena, invite your friends, and get ready to compete.",
    points: [
      "Create a room and share the invite link.",
      "Choose 1-minute, 5-minute, or daily macro battles.",
      "Pick your market: Crypto, Stocks, or Forex.",
    ],
    icon: Swords,
    visual: "arena",
  },
  {
    number: "02",
    title: "Make Your Move",
    subtitle: "THE LIVE SHOWDOWN",
    description:
      "Read the charts, trust your analysis, and make every move count.",
    points: [
      "Analyze historical or real-time market charts.",
      "Make your BUY or SELL decisions.",
      "Track friends' positions and P&L during the battle.",
    ],
    icon: ChartNoAxesCombined,
    visual: "chart",
  },
  {
    number: "03",
    title: "Dominate the Leaderboard",
    subtitle: "CLAIM THE THRONE",
    description:
      "Put your strategy to the test and show everyone who's on top.",
    points: [
      "Earn points based on your final battle P&L.",
      "Compare performance and prove your trading skills.",
      "Climb global rankings and build winning streaks.",
    ],
    icon: Trophy,
    visual: "leaderboard",
  },
];

const features = [
  {
    icon: MessageCircle,
    title: "Battle Together",
    description:
      "Stay connected with your friends through in-game chat and reactions while the competition unfolds.",
  },
  {
    icon: RotateCcw,
    title: "Strategy Replay",
    description:
      "Review completed battles, revisit key market moments, and learn from the decisions made along the way.",
  },
  {
    icon: ShieldCheck,
    title: "Zero Risk, Max Learning",
    description:
      "Practice market analysis, sharpen your price-action skills, and learn through competition without risking real money.",
  },
];

function StepVisual({ type }) {
  if (type === "arena") {
    return (
      <div className="relative flex h-48 items-center justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111111]">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-size-[24px_24px]" />
        <div className="relative w-64 rounded-xl border border-white/10 bg-[#191919] p-5 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-white">Friday Night Arena</span>
            <span className="rounded-full bg-yellow-400/10 px-2 py-1 text-[10px] font-semibold text-yellow-400">
              PRIVATE
            </span>
          </div>
          <div className="mt-5 flex items-center justify-between">
            {["VG", "AK", "RS"].map((name, i) => (
              <div key={name} className="flex flex-col items-center gap-2">
                <div className={`flex h-10 w-10 items-center justify-center rounded-full border text-xs font-bold ${
                  i === 0
                    ? "border-yellow-400/50 bg-yellow-400/10 text-yellow-400"
                    : "border-white/10 bg-white/5 text-gray-300"
                }`}>
                  {name}
                </div>
                <span className="text-xs text-gray-400">
                  {i === 0 ? "You" : `Player ${i + 1}`}
                </span>
              </div>
            ))}
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-dashed border-white/20 text-gray-500">
              +
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
            <Users size={14} />
            <span>Invite your crew</span>
          </div>
        </div>
      </div>
    );
  }

  if (type === "chart") {
    return (
      <div className="relative flex h-48 flex-col justify-between overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-white">BTC / USD</p>
            <p className="mt-1 text-xs text-gray-500">Live battle chart</p>
          </div>
          <span className="rounded-md bg-green-400/10 px-2 py-1 text-xs font-semibold text-green-400">
            +2.48%
          </span>
        </div>
        <svg
          viewBox="0 0 320 90"
          className="h-20 w-full"
          fill="none"
          preserveAspectRatio="none"
          aria-label="Illustrative market chart"
        >
          {[20, 45, 70].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="320"
              y2={y}
              stroke="#333333"
              strokeDasharray="4 5"
            />
          ))}
          <path
            d="M0 68 L25 58 L43 64 L63 39 L81 49 L103 28 L124 42 L146 22 L167 34 L187 15 L208 29 L228 12 L250 24 L270 8 L291 18 L320 4"
            stroke="#EAB308"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
          <path
            d="M0 68 L25 58 L43 64 L63 39 L81 49 L103 28 L124 42 L146 22 L167 34 L187 15 L208 29 L228 12 L250 24 L270 8 L291 18 L320 4 L320 90 L0 90 Z"
            fill="url(#chartFill)"
          />
          <defs>
            <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EAB308" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#EAB308" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Your position</span>
          <span className="font-semibold text-green-400">BUY · Active</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative flex h-48 flex-col justify-center overflow-hidden rounded-xl border border-white/10 bg-[#111111] p-5">
      <div className="absolute -right-8 -top-12 h-36 w-36 rounded-full bg-yellow-400/4 blur-2xl" />
      <div className="relative space-y-3">
        {[
          { rank: "01", name: "Alex Morgan", score: "+12.8%", active: true },
          { rank: "02", name: "You", score: "+9.4%", active: false },
          { rank: "03", name: "Sam Carter", score: "+6.2%", active: false },
        ].map((player) => (
          <div
            key={player.rank}
            className={`flex items-center gap-3 rounded-lg border p-3 ${
              player.active
                ? "border-yellow-400/30 bg-yellow-400/6"
                : "border-white/5 bg-white/2"
            }`}
          >
            <span className={`text-xs font-bold ${player.active ? "text-yellow-400" : "text-gray-500"}`}>
              {player.rank}
            </span>
            <span className="flex-1 text-sm text-white">{player.name}</span>
            <span className="text-sm font-semibold text-green-400">{player.score}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-[#080808]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-5 sm:px-8">
          
                <Link to="/" className="flex items-center gap-3" aria-label="ChartWars home">
                <img
                    src={logo}
                    alt="ChartWars"
                    className="h-9 w-9 shrink-0 object-contain"
                />
                <span className="whitespace-nowrap text-lg font-extrabold tracking-wider text-white">
                    CHARTWARS
                </span>
                </Link>

          <Link
            to="/"
            className="rounded-lg border border-white/15 px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-yellow-400/60 hover:text-yellow-400"
          >
            ← Back to Home
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="absolute left-1/2 top-0 h-72 w-150 -translate-x-1/2 rounded-full bg-yellow-400/[0.035] blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-5 py-24 text-center sm:px-8 sm:py-32">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs font-medium tracking-wide text-gray-300">
            <span className="h-2 w-2 rounded-full bg-yellow-400" />
            YOUR SKILL. YOUR SQUAD. YOUR BATTLE.
          </div>
          <h1 className="text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Analyze. Predict.
            <span className="block text-yellow-400">Conquer.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
            No real money. Pure skill. Challenge your friends in trading
            battles, read the charts, and prove who really knows the market.
          </p>
          <div className="mt-9 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              to="/signup"
              className="inline-flex items-center justify-center gap-2 rounded-lg bg-orange-600 px-6 py-3.5 font-bold text-black transition hover:bg-orange-300"
            >
              Create an Arena Now <ArrowRight size={18} />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-lg border border-white/15 px-6 py-3.5 font-semibold text-white transition hover:border-yellow-400/50 hover:text-yellow-400"
            >
              See How It Works
            </a>
          </div>
          <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-500 sm:text-sm">
            <span className="flex items-center gap-2"><ShieldCheck size={15} /> No real-money risk</span>
            <span className="flex items-center gap-2"><Users size={15} /> Compete with friends</span>
            <span className="flex items-center gap-2"><Clock3 size={15} /> Real-time battles</span>
          </div>
        </div>
      </section>

      {/* Three-step flow */}
      <section id="how-it-works" className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
        <div className="mb-12 max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-400">
            HOW THE BATTLE WORKS
          </p>
          <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
            Three steps. One winner.
          </h2>
          <p className="mt-4 leading-7 text-gray-400">
            From setting up your arena to taking the top spot, every battle is
            about your decisions and your strategy.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <article
                key={step.number}
                className="group rounded-2xl border border-white/10 bg-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-yellow-400/30 hover:shadow-[0_12px_40px_rgba(234,179,8,0.06)] sm:p-6"
              >
                <div className="mb-5 flex items-center justify-between">
                  <span className="text-sm font-bold tracking-widest text-yellow-400">
                    STEP {step.number}
                  </span>
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/3 text-yellow-400">
                    <Icon size={20} />
                  </span>
                </div>
                <StepVisual type={step.visual} />
                <p className="mt-6 text-[10px] font-bold tracking-[0.2em] text-gray-500">
                  {step.subtitle}
                </p>
                <h3 className="mt-2 text-xl font-bold">{step.title}</h3>
                <p className="mt-3 text-sm leading-6 text-gray-400">
                  {step.description}
                </p>
                <ul className="mt-5 space-y-3 border-t border-white/10 pt-5">
                  {step.points.map((point) => (
                    <li key={point} className="flex gap-3 text-sm leading-6 text-gray-300">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-yellow-400" />
                      {point}
                    </li>
                  ))}
                </ul>
              </article>
            );
          })}
        </div>
      </section>

      {/* Feature highlights */}
      <section className="border-y border-white/5 bg-[#0c0c0c]">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-24">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-yellow-400">
              BUILT FOR FRIENDLY COMPETITION
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Why ChartWars?
            </h2>
            <p className="mt-4 leading-7 text-gray-400">
              More than charts. It’s your trading skills, put to the test
              against your friends.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <article
                  key={feature.title}
                  className="rounded-2xl border border-white/10 bg-[#111111] p-6 transition duration-300 hover:border-yellow-400/30 hover:shadow-[0_12px_40px_rgba(234,179,8,0.05)] sm:p-8"
                >
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/[0.07] text-yellow-400">
                    <Icon size={23} />
                  </span>
                  <h3 className="mt-6 text-lg font-bold">{feature.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-gray-400">
                    {feature.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="mx-auto max-w-5xl px-5 py-20 text-center sm:px-8 lg:py-24">
        <div className="rounded-2xl border border-white/10 bg-[#101010] px-6 py-12 sm:px-12 sm:py-16">
          <Trophy className="mx-auto text-yellow-400" size={34} />
          <h2 className="mt-5 text-3xl font-bold tracking-tight sm:text-4xl">
            Ready to settle the score?
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-7 text-gray-400">
            Bring your friends. Bring your strategy. Let the charts decide.
          </p>
          <Link
            to="/signup"
            className="mt-8 inline-flex items-center gap-2 rounded-lg bg-orange-600 px-6 py-3.5 font-bold text-black transition hover:bg-orange-300"
          >
            Start Your First Battle <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      <footer className="border-t border-white/10 px-5 py-6 text-center text-xs text-gray-500">
        © {new Date().getFullYear()} ChartWars. Compete with skill.
      </footer>
      <Footer/>
    </main>
  );
}
