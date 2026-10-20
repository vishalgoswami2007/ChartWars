
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  ChevronDown,
  Clock3,
  Flame,
  Gauge,
  Menu,
  Newspaper,
  Search,
  ShieldCheck,
  Swords,
  TrendingUp,
  X,
} from "lucide-react";
import logo from "../../../src/assets/logo.png";

const marketGroups = [
  {
    title: "MARKET PULSE",
    subtitle: "What's happening now",
    items: [
      {
        title: "Daily Macro Breakdown",
        description: "The bigger picture behind today's market moves.",
        tag: "2 min read",
        icon: TrendingUp,
        preview: "macro",
      },
      {
        title: "Chart of the Day",
        description: "One chart. One setup worth watching.",
        tag: "Hot topic",
        icon: Newspaper,
        preview: "chart",
      },
      {
        title: "Sentiment Radar",
        description: "Get a feel for the market mood.",
        tag: "Live snapshot",
        icon: Gauge,
        preview: "sentiment",
      },
    ],
  },
  {
    title: "TRADE CRAFT",
    subtitle: "Learn the skills",
    items: [
      {
        title: "Pattern Playbook",
        description: "Learn candlestick and chart patterns.",
        tag: "4 min read",
        icon: BookOpen,
        preview: "patterns",
      },
      {
        title: "Indicator Masterclass",
        description: "Understand RSI, MACD, and moving averages.",
        tag: "6 min read",
        icon: TrendingUp,
        preview: "indicators",
      },
      {
        title: "Risk Management 101",
        description: "Position sizing, stop-losses, and discipline.",
        tag: "3 min read",
        icon: ShieldCheck,
        preview: "risk",
      },
    ],
  },
  {
    title: "BATTLE PREP",
    subtitle: "Practice & strategy",
    items: [
      {
        title: "Arena Meta",
        description: "Explore strategies and match performance.",
        tag: "Weekly",
        icon: Swords,
        preview: "arena",
      },
      {
        title: "Community Case Studies",
        description: "Break down the decisions behind great trades.",
        tag: "5 min read",
        icon: Flame,
        preview: "community",
      },
    ],
  },
];

function MiniChart() {
  return (
    <svg
      viewBox="0 0 320 140"
      className="mt-5 h-36 w-full"
      fill="none"
      preserveAspectRatio="none"
      role="img"
      aria-label="Illustrative market price chart"
    >
      {[25, 55, 85, 115].map((y) => (
        <line
          key={y}
          x1="0"
          y1={y}
          x2="320"
          y2={y}
          stroke="#292929"
          strokeDasharray="4 5"
        />
      ))}
      <path
        d="M0 105 L20 92 L38 101 L55 76 L73 85 L90 61 L108 74 L126 48 L145 65 L164 55 L183 72 L203 39 L222 47 L241 29 L260 42 L278 20 L300 30 L320 12"
        stroke="#F97316"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M0 105 L20 92 L38 101 L55 76 L73 85 L90 61 L108 74 L126 48 L145 65 L164 55 L183 72 L203 39 L222 47 L241 29 L260 42 L278 20 L300 30 L320 12 V140 H0 Z"
        fill="url(#marketGradient)"
      />
      <defs>
        <linearGradient id="marketGradient" x1="160" y1="10" x2="160" y2="140">
          <stop stopColor="#F97316" stopOpacity=".23" />
          <stop offset="1" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}

function PreviewPanel({ item }) {
  if (!item) {
    return (
      <div className="flex min-h-85 flex-col justify-between rounded-xl border border-white/10 bg-[#111111] p-6">
        <div>
          <span className="text-xs font-semibold tracking-[0.2em] text-orange-400">
            THE CHARTWARS EDGE
          </span>
          <h3 className="mt-5 text-2xl font-bold text-white">
            Read the market.
            <span className="block text-orange-400">Know your next move.</span>
          </h3>
          <p className="mt-4 text-sm leading-6 text-gray-400">
            Market context, practical trading education, and strategies to
            prepare you for your next battle.
          </p>
        </div>
        <div className="mt-8 rounded-lg border border-white/10 bg-black p-4">
          <div className="flex items-center gap-2 text-sm text-gray-300">
            <span className="h-2 w-2 rounded-full bg-orange-400" />
            Your next insight starts here
          </div>
          <p className="mt-2 text-xs leading-5 text-gray-500">
            Hover over a topic to explore its preview.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-85 rounded-xl border border-white/10 bg-[#111111] p-6">
      <div className="flex items-center justify-between gap-3">
        <span className="rounded-md border border-orange-400/20 bg-orange-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-orange-400">
          {item.tag}
        </span>
        <span className="text-xs text-gray-500">CHARTWARS INSIGHTS</span>
      </div>

      <h3 className="mt-5 text-xl font-bold text-white">{item.title}</h3>
      <p className="mt-2 text-sm leading-6 text-gray-400">
        {item.description}
      </p>

      {item.preview === "chart" ? (
        <>
          <div className="mt-5 flex items-end justify-between">
            <div>
              <p className="text-xs text-gray-500">Illustrative market setup</p>
              <p className="mt-1 text-lg font-bold text-white">BTC / USD</p>
            </div>
            <span className="flex items-center gap-1 text-sm font-semibold text-green-400">
              <ArrowUpRight size={16} /> Breakout watch
            </span>
          </div>
          <MiniChart />
          <p className="mt-3 text-xs leading-5 text-gray-500">
            Example chart for UI preview only, not a live market feed or
            financial recommendation.
          </p>
        </>
      ) : item.preview === "sentiment" ? (
        <div className="mt-8">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">Market sentiment</span>
            <span className="text-sm font-semibold text-orange-400">
              Illustrative
            </span>
          </div>
          <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-[58%] rounded-full bg-orange-400" />
          </div>
          <div className="mt-3 flex justify-between text-xs text-gray-500">
            <span>Fear</span>
            <span>Neutral</span>
            <span>Greed</span>
          </div>
          <p className="mt-6 text-xs leading-5 text-gray-500">
            Visual placeholder. Connect a market sentiment data source for
            live values.
          </p>
        </div>
      ) : (
        <div className="mt-6 rounded-lg border border-white/10 bg-black p-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
            Inside this guide
          </p>
          <div className="mt-4 space-y-3">
            {[
              "Understand the setup",
              "Know what to look for",
              "Apply it to your next battle",
            ].map((line, index) => (
              <div key={line} className="flex items-center gap-3 text-sm text-gray-300">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/5 text-xs text-orange-400">
                  {index + 1}
                </span>
                {line}
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 flex items-center gap-2 text-xs text-gray-500">
        <Clock3 size={14} />
        Curated for curious traders
      </div>
    </div>
  );
}

export default function MarketInsight() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeItem, setActiveItem] = useState(marketGroups[0].items[1]);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Header and interactive mega menu */}
      <header className="relative z-30 border-b border-white/10 bg-[#080808]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/"
            className="flex items-center gap-3"
            aria-label="ChartWars home"
          >
            <img
              src={logo}
              alt="ChartWars"
              className="h-9 w-9 shrink-0 object-contain"
            />
            <span className="whitespace-nowrap text-lg font-extrabold tracking-wider text-white">
              CHARTWARS
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            <Link
              to="/"
              className="text-sm text-gray-300 transition hover:text-orange-400"
            >
              Home
            </Link>

            <button
              type="button"
              onMouseEnter={() => setMenuOpen(true)}
              onClick={() => setMenuOpen((open) => !open)}
              aria-expanded={menuOpen}
              className={`flex items-center gap-2 text-sm transition ${
                menuOpen ? "text-orange-400" : "text-white hover:text-orange-400"
              }`}
            >
              Market Insights
              <ChevronDown
                size={15}
                className={`transition-transform duration-200 ${menuOpen ? "rotate-180" : ""}`}
              />
            </button>

            <Link
              to="/performance-analytics"
              className="text-sm text-gray-300 transition hover:text-orange-400"
            >
              Performance Analytics
            </Link>

            <Link
              to="/signup"
              className="rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-bold text-black transition hover:bg-orange-400"
            >
              Join ChartWars
            </Link>
          </nav>

          <button
            type="button"
            className="rounded-lg border border-white/10 p-2 text-white md:hidden"
            onClick={() => setMobileNavOpen((open) => !open)}
            aria-label={mobileNavOpen ? "Close navigation" : "Open navigation"}
          >
            {mobileNavOpen ? <X size={21} /> : <Menu size={21} />}
          </button>
        </div>

        {mobileNavOpen && (
          <div className="border-t border-white/10 bg-[#0d0d0d] p-5 md:hidden">
            <div className="flex flex-col gap-4">
              <Link to="/" onClick={() => setMobileNavOpen(false)} className="text-sm text-gray-300">
                Home
              </Link>
              <button
                type="button"
                onClick={() => setMenuOpen((open) => !open)}
                className="flex items-center justify-between text-left text-sm text-orange-400"
              >
                Market Insights <ChevronDown size={16} />
              </button>
              {menuOpen && (
                <div className="space-y-4 border-l border-orange-400/30 pl-4">
                  {marketGroups.flatMap((group) => group.items).map((item) => (
                    <button
                      type="button"
                      key={item.title}
                      onClick={() => {
                        setActiveItem(item);
                        setMobileNavOpen(false);
                        document.getElementById("insights-library")?.scrollIntoView({
                          behavior: "smooth",
                        });
                      }}
                      className="block text-left text-sm text-gray-300"
                    >
                      {item.title}
                    </button>
                  ))}
                </div>
              )}
              <Link
                to="/performance-analytics"
                onClick={() => setMobileNavOpen(false)}
                className="text-sm text-gray-300"
              >
                Performance Analytics
              </Link>
              <Link
                to="/signup"
                onClick={() => setMobileNavOpen(false)}
                className="text-sm font-semibold text-orange-400"
              >
                Join ChartWars
              </Link>
            </div>
          </div>
        )}

        {menuOpen && (
          <div
            onMouseLeave={() => setMenuOpen(false)}
            className="absolute left-0 right-0 top-full border-b border-white/10 bg-[#090909]/95 shadow-2xl shadow-black/60 backdrop-blur-md animate-in fade-in slide-in-from-top-2 duration-200"
          >
            <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 sm:px-8 lg:grid-cols-[1fr_1fr_1fr_1.05fr]">
              {marketGroups.map((group) => (
                <section key={group.title}>
                  <p className="text-[11px] font-bold tracking-[0.18em] text-orange-400">
                    {group.title}
                  </p>
                  <p className="mt-2 text-xs text-gray-500">{group.subtitle}</p>
                  <div className="mt-4 space-y-1">
                    {group.items.map((item) => {
                      const Icon = item.icon;
                      const selected = activeItem.title === item.title;

                      return (
                        <button
                          type="button"
                          key={item.title}
                          onMouseEnter={() => setActiveItem(item)}
                          onFocus={() => setActiveItem(item)}
                          onClick={() => {
                            setActiveItem(item);
                            setMenuOpen(false);
                            document.getElementById("insights-library")?.scrollIntoView({
                              behavior: "smooth",
                            });
                          }}
                          className={`group flex w-full gap-3 rounded-lg p-3 text-left transition ${
                            selected
                              ? "bg-orange-400/10"
                              : "hover:bg-white/4"
                          }`}
                        >
                          <Icon
                            size={17}
                            className={`mt-0.5 shrink-0 ${
                              selected ? "text-orange-400" : "text-gray-500"
                            }`}
                          />
                          <span className="min-w-0">
                            <span className={`block text-sm font-medium ${
                              selected ? "text-orange-400" : "text-gray-200"
                            }`}>
                              {item.title}
                            </span>
                            <span className="mt-1 block text-xs leading-5 text-gray-500">
                              {item.description}
                            </span>
                            <span className="mt-2 inline-flex items-center gap-1 text-[10px] text-gray-500">
                              {item.tag === "Hot topic" && <Flame size={11} className="text-orange-400" />}
                              {item.tag === "Hot topic" ? "Hot Topic" : item.tag}
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </section>
              ))}

              <PreviewPanel item={activeItem} />
            </div>
          </div>
        )}
      </header>

      {/* Page hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -right-20 -top-24 h-80 w-80 rounded-full bg-orange-500/6 blur-3xl" />
        <div className="relative mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:py-28">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/6 px-3 py-1.5 text-xs font-medium text-orange-400">
              <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
              THE MARKET INSIGHTS DESK
            </span>

            <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
              Read the charts.
              <span className="block text-orange-400">Understand the game.</span>
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
              Market breakdowns, practical trading guides, and battle-ready
              strategies to help you think clearly before making your next move.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#insights-library"
                className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
              >
                Explore Insights <ArrowRight size={17} />
              </a>
              <Link
                to="/performance-analytics"
                className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-white transition hover:border-orange-400/50 hover:text-orange-400"
              >
                Your Performance
              </Link>
            </div>

            <div className="mt-9 flex flex-wrap gap-x-6 gap-y-3 text-xs text-gray-500">
              <span className="flex items-center gap-2"><BookOpen size={14} /> Practical guides</span>
              <span className="flex items-center gap-2"><TrendingUp size={14} /> Chart breakdowns</span>
              <span className="flex items-center gap-2"><Swords size={14} /> Battle strategies</span>
            </div>
          </div>
        </div>
      </section>

      {/* Featured insight */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
              START HERE
            </p>
            <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Better decisions start with better context.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
              Learn how market structure, price patterns, and risk management
              work together. Then bring that knowledge into your next ChartWars
              battle.
            </p>

            <div className="mt-7 space-y-4">
              {[
                "Understand the setup before you take a position.",
                "Build a strategy instead of chasing every move.",
                "Review your decisions and learn from each match.",
              ].map((line) => (
                <div key={line} className="flex items-start gap-3 text-sm text-gray-300">
                  <span className="mt-1 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-orange-400/10 text-orange-400">
                    <ArrowRight size={12} />
                  </span>
                  {line}
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-7">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold tracking-widest text-gray-500">CHART SPOTLIGHT</p>
                <h3 className="mt-2 text-xl font-bold">Price action in focus</h3>
              </div>
              <span className="rounded-lg border border-orange-400/20 bg-orange-400/10 p-3 text-orange-400">
                <TrendingUp size={21} />
              </span>
            </div>
            <MiniChart />
            <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-4">
              <div>
                <p className="text-sm font-semibold text-white">Breakout watchlist</p>
                <p className="mt-1 text-xs text-gray-500">Illustrative chart preview</p>
              </div>
              <span className="flex items-center gap-1 text-xs text-orange-400">
                Learn the setup <ArrowRight size={14} />
              </span>
            </div>
            <p className="mt-4 text-xs leading-5 text-gray-500">
              Example visualization only. Live prices and chart signals require
              a connected data provider.
            </p>
          </div>
        </div>
      </section>

      {/* Insights library */}
      <section id="insights-library" className="border-y border-white/5 bg-[#0c0c0c]">
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
                THE KNOWLEDGE HUB
              </p>
              <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                Find your next edge.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Pick a topic, explore the preview, and build your trading
                knowledge one concept at a time.
              </p>
            </div>
            <div className="flex items-center gap-2 self-start rounded-lg border border-white/10 bg-black px-3 py-2 text-xs text-gray-400 sm:self-auto">
              <Search size={14} />
              Curated topics
            </div>
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
            {marketGroups.map((group) => (
              <div key={group.title} className="rounded-2xl border border-white/10 bg-[#101010] p-5 sm:p-6">
                <p className="text-[11px] font-bold tracking-[0.18em] text-orange-400">
                  {group.title}
                </p>
                <h3 className="mt-2 text-xl font-bold">{group.subtitle}</h3>

                <div className="mt-5 space-y-3">
                  {group.items.map((item) => {
                    const Icon = item.icon;
                    const selected = activeItem.title === item.title;

                    return (
                      <button
                        key={item.title}
                        type="button"
                        onClick={() => setActiveItem(item)}
                        className={`w-full rounded-xl border p-4 text-left transition ${
                          selected
                            ? "border-orange-400/40 bg-orange-400/6"
                            : "border-white/5 bg-black/20 hover:border-white/15"
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <Icon
                            size={18}
                            className={`mt-0.5 shrink-0 ${selected ? "text-orange-400" : "text-gray-500"}`}
                          />
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-white">{item.title}</p>
                            <p className="mt-1 text-xs leading-5 text-gray-500">{item.description}</p>
                            <span className="mt-3 inline-flex items-center gap-1.5 text-[10px] text-gray-500">
                              {item.tag === "Hot topic" ? <Flame size={12} className="text-orange-400" /> : <Clock3 size={12} />}
                              {item.tag}
                            </span>
                          </div>
                          {selected && <ArrowUpRight size={16} className="shrink-0 text-orange-400" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-white/10 bg-[#101010] p-6 sm:p-8">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-400/10 text-orange-400">
                <BookOpen size={22} />
              </span>
              <h3 className="mt-5 text-xl font-bold">Knowledge into action.</h3>
              <p className="mt-3 text-sm leading-7 text-gray-400">
                Reading is the first step. Use your understanding to make
                thoughtful decisions, review outcomes, and improve with every
                battle.
              </p>
              <Link
                to="/signup"
                className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
              >
                Get ready to compete <ArrowRight size={16} />
              </Link>
            </div>
            <PreviewPanel item={activeItem} />
          </div>
        </div>
      </section>
      <Footer/>
    </main>
  );
}
