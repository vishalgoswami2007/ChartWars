
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  Clock3,
  Code2,
  Download,
  FileSpreadsheet,
  FileText,
  LockKeyhole,
  LockKeyholeOpen,
  Search,
  ShieldCheck,
  Swords,
  TrendingUp,
} from "lucide-react";
import logo from "../../../src/assets/logo.png";

const chambers = [
  {
    id: "blueprints",
    number: "01",
    title: "Strategy Blueprints",
    subtitle: "Know the rules. Master the system.",
    description:
      "Understand how ChartWars battles work, how scoring is calculated, and how to make disciplined decisions.",
    icon: Swords,
    label: "CORE KNOWLEDGE",
    resources: [
      {
        title: "Battle Rules & Scoring",
        description:
          "Learn the battle format, scoring basics, and how performance is evaluated.",
        type: "GAMEPLAY GUIDE",
        read: "4 min read",
        icon: BookOpen,
      },
      {
        title: "Risk Management Framework",
        description:
          "Explore position sizing, stop-loss concepts, and risk-to-reward planning.",
        type: "TRADING GUIDE",
        read: "6 min read",
        icon: ShieldCheck,
      },
      {
        title: "Position Sizing Basics",
        description:
          "Understand how trade size and risk tolerance fit into a trading plan.",
        type: "QUICK GUIDE",
        read: "3 min read",
        icon: TrendingUp,
      },
    ],
  },
  {
    id: "archive",
    number: "02",
    title: "The Archive",
    subtitle: "Learn from the moves that shaped markets.",
    description:
      "Explore historical market events, review past setups, and build a better understanding of market behavior.",
    icon: BookOpen,
    label: "HISTORICAL LIBRARY",
    resources: [
      {
        title: "The 2008 Financial Crisis",
        description:
          "Explore the market conditions and events surrounding the global financial crisis.",
        type: "CASE STUDY",
        read: "8 min read",
        icon: TrendingUp,
      },
      {
        title: "The 2020 Market Shock",
        description:
          "Review the volatility and recovery patterns around the COVID-era sell-off.",
        type: "HISTORICAL REVIEW",
        read: "7 min read",
        icon: FileText,
      },
      {
        title: "The 2022 Crypto Drawdown",
        description:
          "Study a difficult period for crypto markets and the importance of risk controls.",
        type: "CRYPTO CASE STUDY",
        read: "6 min read",
        icon: Code2,
      },
    ],
  },
  {
    id: "cheatsheets",
    number: "03",
    title: "Interactive Cheat Sheets",
    subtitle: "The right reference at the right moment.",
    description:
      "Quickly revisit common chart patterns, indicator basics, and trading concepts without digging through long guides.",
    icon: FileText,
    label: "QUICK REFERENCE",
    resources: [
      {
        title: "Candlestick Pattern Guide",
        description:
          "Review Doji, Hammer, Engulfing, and other commonly discussed patterns.",
        type: "PATTERN GUIDE",
        read: "3 min read",
        icon: TrendingUp,
      },
      {
        title: "Indicator Quick Reference",
        description:
          "A concise introduction to RSI, MACD, and moving averages.",
        type: "INDICATOR GUIDE",
        read: "4 min read",
        icon: Code2,
      },
      {
        title: "Chart Setup Checklist",
        description:
          "A repeatable checklist for reviewing a setup before making a decision.",
        type: "CHECKLIST",
        read: "2 min read",
        icon: Check,
      },
    ],
  },
  {
    id: "toolchest",
    number: "04",
    title: "The Tool Chest",
    subtitle: "Useful tools for your trading workflow.",
    description:
      "Find practical templates and resources for reviewing trades, tracking decisions, and organizing your learning.",
    icon: FileSpreadsheet,
    label: "TOOLS & TEMPLATES",
    resources: [
      {
        title: "Trading Journal Template",
        description:
          "A structured format for logging setups, decisions, and post-trade notes.",
        type: "JOURNAL TEMPLATE",
        read: "Template",
        icon: FileSpreadsheet,
      },
      {
        title: "Trade Review Worksheet",
        description:
          "Review the reasoning behind a trade and identify lessons for next time.",
        type: "WORKSHEET",
        read: "Template",
        icon: FileText,
      },
      {
        title: "Indicator Setup Notes",
        description:
          "Keep your preferred indicator settings and chart observations organized.",
        type: "REFERENCE",
        read: "2 min read",
        icon: Code2,
      },
    ],
  },
];

function ResourceCard({ resource}) {
  const [unlocked, setUnlocked] = useState(false);
  const Icon = resource.icon;

  return (
    <article
      onMouseEnter={() => setUnlocked(true)}
      onMouseLeave={() => setUnlocked(false)}
      className="group flex h-full flex-col rounded-xl border border-white/10 bg-[#101010] p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-500/40 hover:bg-[#131313] sm:p-6"
    >
      <div className="flex items-start justify-between gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 bg-white/9 text-orange-400 transition group-hover:border-orange-500/30 group-hover:bg-orange-500/10">
          <Icon size={19} />
        </span>

        <span
          className="flex h-8 w-8 items-center justify-center rounded-lg text-gray-500 transition duration-300 group-hover:rotate-[-8deg] group-hover:text-orange-400"
          aria-label={unlocked ? "Preview unlocked" : "Preview locked"}
          title={unlocked ? "Preview unlocked" : "Hover to preview"}
        >
          {unlocked ? (
            <LockKeyholeOpen size={17} />
          ) : (
            <LockKeyhole size={17} />
          )}
        </span>
      </div>

      <p className="mt-5 text-[10px] font-bold tracking-[0.16em] text-orange-400">
        {resource.type}
      </p>

      <h3 className="mt-2 text-lg font-bold text-white">{resource.title}</h3>

      <p className="mt-3 flex-1 text-sm leading-6 text-gray-400">
        {resource.description}
      </p>

      <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/10 pt-4">
        <span className="flex items-center gap-1.5 text-xs text-gray-500">
          <Clock3 size={13} />
          {resource.read}
        </span>

        <button
          type="button"
          onClick={() => setUnlocked((value) => !value)}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-white transition hover:text-orange-400"
          aria-expanded={unlocked}
        >
          {unlocked ? "Preview open" : "Quick preview"}
          <ArrowUpRight size={14} />
        </button>
      </div>

      {unlocked && (
        <div className="mt-4 rounded-lg border border-orange-500/20 bg-orange-500/5 p-3">
          <p className="text-xs leading-5 text-gray-300">
            This resource is part of the Knowledge Vault library. Its full
            guide or downloadable file can be connected here when the content
            is ready.
          </p>
        </div>
      )}
    </article>
  );
}

export default function KnowledgeVault() {
  const [query, setQuery] = useState("");
  const [activeChamber, setActiveChamber] = useState("all");

  const allResources = chambers.flatMap((chamber) =>
    chamber.resources.map((resource) => ({
      ...resource,
      chamberId: chamber.id,
      chamberTitle: chamber.title,
      chamberNumber: chamber.number,
    }))
  );

  const filteredResources = allResources.filter((resource) => {
    const matchesChamber =
      activeChamber === "all" || resource.chamberId === activeChamber;

    const searchText =
      `${resource.title} ${resource.description} ${resource.type} ${resource.chamberTitle}`.toLowerCase();

    return matchesChamber && searchText.includes(query.toLowerCase().trim());
  });

  return (
    <main className="min-h-screen bg-[#080808] text-white">
      {/* Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#080808]/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 sm:px-8">
          <Link
            to="/"
            aria-label="ChartWars home"
            className="flex items-center gap-3"
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

          <nav className="flex items-center gap-3 sm:gap-6">
            <Link
              to="/"
              className="hidden text-sm text-gray-400 transition hover:text-orange-400 sm:inline"
            >
              Home
            </Link>
            <Link
              to="/market-insight"
              className="hidden text-sm text-gray-400 transition hover:text-orange-400 md:inline"
            >
              Market Insights
            </Link>
            <span className="rounded-lg border border-orange-500/25 bg-orange-500/8 px-3 py-2 text-sm font-semibold text-orange-400">
              Knowledge Vault
            </span>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-white/5">
        <div className="pointer-events-none absolute -right-24 -top-20 h-80 w-80 rounded-full bg-orange-500/6 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-5 py-16 sm:px-8 sm:py-24">
          <div className="grid gap-12 lg:grid-cols-[1fr_300px] lg:items-center">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/6 px-3 py-1.5 text-xs font-medium text-orange-400">
                <LockKeyhole size={14} />
                YOUR TRADING KNOWLEDGE, ORGANIZED
              </div>

              <h1 className="mt-6 text-4xl font-extrabold leading-tight tracking-tight sm:text-6xl">
                Welcome to the
                <span className="block text-orange-400">Knowledge Vault.</span>
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-7 text-gray-400 sm:text-lg sm:leading-8">
                The permanent home for trading guides, historical breakdowns,
                quick references, and practical tools. Everything you need to
                learn, review, and prepare for your next battle.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a
                  href="#vault-library"
                  className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-bold text-black transition hover:bg-orange-400"
                >
                  Explore the Vault <ArrowRight size={17} />
                </a>
                <Link
                  to="/market-insight"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-5 py-3 font-semibold text-gray-200 transition hover:border-orange-500/40 hover:text-orange-400"
                >
                  Market Insights <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>

            {/* Vault summary visual */}
            <div className="relative mx-auto w-full max-w-xs">
              <div className="absolute inset-0 rounded-full bg-orange-500/[0.07] blur-3xl" />
              <div className="relative rounded-2xl border border-white/10 bg-[#101010] p-7">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-[0.2em] text-gray-500">
                    VAULT INDEX
                  </span>
                  <LockKeyhole size={18} className="text-orange-400" />
                </div>

                <div className="my-7 flex items-center justify-center">
                  <div className="flex h-32 w-32 items-center justify-center rounded-full border border-orange-500/25 bg-orange-500/5 shadow-[inset_0_0_35px_rgba(249,115,22,0.05)]">
                    <div className="flex h-24 w-24 items-center justify-center rounded-full border border-white/10 bg-[#0b0b0b]">
                      <ShieldCheck size={39} strokeWidth={1.5} className="text-orange-400" />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  {[
                    ["04", "Chambers"],
                    ["12", "Resources"],
                  ].map(([value, label]) => (
                    <div
                      key={label}
                      className="rounded-lg border border-white/10 bg-black/30 p-3"
                    >
                      <p className="text-xl font-bold text-white">{value}</p>
                      <p className="mt-1 text-xs text-gray-500">{label}</p>
                    </div>
                  ))}
                </div>

                <p className="mt-4 text-center text-xs text-gray-500">
                  Built for curious, disciplined traders.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Four chambers */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div>
          <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
            INSIDE THE VAULT
          </p>
          <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
            Four chambers. One knowledge hub.
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-7 text-gray-400 sm:text-base">
            Jump straight to the resource you need, whether you're learning
            the fundamentals or reviewing a strategy.
          </p>
        </div>

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {chambers.map((chamber) => {
            const Icon = chamber.icon;
            const count = chamber.resources.length;

            return (
              <button
                key={chamber.id}
                type="button"
                onClick={() => {
                  setActiveChamber(chamber.id);
                  document.getElementById("vault-library")?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className={`group rounded-xl border p-5 text-left transition duration-300 hover:-translate-y-1 ${
                  activeChamber === chamber.id
                    ? "border-orange-500/40 bg-orange-500/6"
                    : "border-white/10 bg-[#101010] hover:border-orange-500/30"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold tracking-widest text-orange-400">
                    {chamber.number}
                  </span>
                  <span className="text-gray-500 transition group-hover:text-orange-400">
                    <Icon size={20} />
                  </span>
                </div>

                <h3 className="mt-5 text-base font-bold text-white">
                  {chamber.title}
                </h3>
                <p className="mt-2 min-h-15 text-sm leading-6 text-gray-400">
                  {chamber.subtitle}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="text-xs text-gray-500">
                    {count} resources
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-500 transition group-hover:translate-x-1 group-hover:text-orange-400"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* Resource library */}
      <section
        id="vault-library"
        className="border-y border-white/5 bg-[#0c0c0c]"
      >
        <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-bold tracking-[0.2em] text-orange-400">
                THE RESOURCE LIBRARY
              </p>
              <h2 id="vault-library-heading" className="mt-3 text-3xl font-bold sm:text-4xl">
                Unlock your next lesson.
              </h2>
              <p className="mt-3 max-w-xl text-sm leading-6 text-gray-400">
                Browse the collection or filter by chamber to find what you
                need.
              </p>
            </div>

            <label className="flex w-full items-center gap-3 rounded-lg border border-white/10 bg-[#101010] px-4 py-3 transition focus-within:border-orange-500/50 md:max-w-sm">
              <Search size={17} className="shrink-0 text-gray-500" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search guides and resources..."
                className="w-full bg-transparent text-sm text-white outline-none placeholder:text-gray-600"
                aria-label="Search Knowledge Vault resources"
              />
            </label>
          </div>

          <div className="mt-7 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setActiveChamber("all")}
              className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                activeChamber === "all"
                  ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                  : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
              }`}
            >
              All resources
            </button>

            {chambers.map((chamber) => (
              <button
                key={chamber.id}
                type="button"
                onClick={() => setActiveChamber(chamber.id)}
                className={`rounded-lg border px-3 py-2 text-xs font-semibold transition ${
                  activeChamber === chamber.id
                    ? "border-orange-500/40 bg-orange-500/10 text-orange-400"
                    : "border-white/10 text-gray-400 hover:border-white/20 hover:text-white"
                }`}
              >
                {chamber.number}. {chamber.title}
              </button>
            ))}
          </div>

          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {filteredResources.map((resource, index) => (
              <ResourceCard
                key={`${resource.chamberId}-${resource.title}`}
                resource={resource}
                index={index}
              />
            ))}
          </div>

          {filteredResources.length === 0 && (
            <div className="mt-8 rounded-xl border border-white/10 bg-[#101010] px-5 py-12 text-center">
              <Search size={25} className="mx-auto text-gray-500" />
              <h3 className="mt-4 font-semibold text-white">No resources found</h3>
              <p className="mt-2 text-sm text-gray-500">
                Try a different search term or select another chamber.
              </p>
              <button
                type="button"
                onClick={() => {
                  setQuery("");
                  setActiveChamber("all");
                }}
                className="mt-5 text-sm font-semibold text-orange-400 hover:text-orange-300"
              >
                Clear filters
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Tool chest callout */}
      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:py-20">
        <div className="flex flex-col gap-7 rounded-2xl border border-white/10 bg-[#101010] p-6 sm:p-9 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-4">
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/8 text-orange-400">
              <Download size={23} />
            </span>
            <div>
              <p className="text-xs font-bold tracking-[0.18em] text-orange-400">
                THE TOOL CHEST
              </p>
              <h2 className="mt-2 text-xl font-bold sm:text-2xl">
                Make every trade a lesson.
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400">
                Trading journals, review worksheets, and reference templates
                can live here as downloadable assets when their files are
                ready.
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() =>
              document.getElementById("vault-library")?.scrollIntoView({
                behavior: "smooth",
              })
            }
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-orange-500 px-5 py-3 text-sm font-bold text-black transition hover:bg-orange-400"
          >
            Browse Resources <ArrowRight size={16} />
          </button>
        </div>
      </section>

      <Footer/>
    </main>
  );
}