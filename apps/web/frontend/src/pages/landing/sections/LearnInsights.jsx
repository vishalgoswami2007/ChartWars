
import { useMemo, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Bookmark,
  ChartCandlestick,
  Clock3,
  FileText,
  GraduationCap,
  Layers3,
  Lightbulb,
  Newspaper,
  Search,
  Sparkles,
  TrendingUp,
} from "lucide-react";

const marketCategories = ["All", "News", "IPOs", "Forex", "Crypto", "Stocks"];

const marketStories = [
  {
    category: "News",
    tag: "MARKET BRIEF",
    title: "What moves the market — and why it matters",
    description:
      "Understand the forces behind price action, sentiment, and market volatility.",
    time: "5 min read",
    symbol: "GLOBAL",
    accent: "orange",
  },
  {
    category: "Crypto",
    tag: "DIGITAL ASSETS",
    title: "Reading momentum without chasing the move",
    description:
      "Explore volume, volatility, and trend confirmation before entering a trade.",
    time: "6 min read",
    symbol: "BTC / USD",
    accent: "green",
  },
  {
    category: "Forex",
    tag: "CURRENCY WATCH",
    title: "Currency pairs, sessions, and volatility",
    description:
      "Learn how trading sessions and macroeconomic events can affect FX markets.",
    time: "4 min read",
    symbol: "EUR / USD",
    accent: "orange",
  },
  {
    category: "IPOs",
    tag: "IPO EXPLAINER",
    title: "A smarter checklist for studying an IPO",
    description:
      "Review valuation, business fundamentals, and risk before making a decision.",
    time: "7 min read",
    symbol: "PRIMARY",
    accent: "green",
  },
  {
    category: "Stocks",
    tag: "EQUITY INSIGHT",
    title: "Price action versus the bigger picture",
    description:
      "Connect chart patterns with company fundamentals and broader market context.",
    time: "5 min read",
    symbol: "EQUITIES",
    accent: "orange",
  },
];

const marketSnapshot = [
  { name: "NIFTY 50", value: "24,850.40", change: "+0.84%", up: true },
  { name: "S&P 500", value: "5,842.10", change: "+0.42%", up: true },
  { name: "EUR / USD", value: "1.0842", change: "-0.16%", up: false },
  { name: "BTC / USD", value: "$67,420", change: "+1.28%", up: true },
];

const resources = [
  {
    category: "Notes",
    number: "01",
    icon: FileText,
    title: "Trading Notes",
    description:
      "Capture observations, review past decisions, and turn mistakes into lessons.",
    meta: "PERSONAL WORKSPACE",
  },
  {
    category: "Strategies",
    number: "02",
    icon: ChartCandlestick,
    title: "Strategy Library",
    description:
      "Explore trend-following, breakout, and risk-management concepts.",
    meta: "TRADING PLAYBOOKS",
  },
  {
    category: "Roadmaps",
    number: "03",
    icon: GraduationCap,
    title: "Learning Roadmaps",
    description:
      "Follow a structured path from market basics to advanced chart reading.",
    meta: "STEP-BY-STEP LEARNING",
  },
  {
    category: "Glossary",
    number: "04",
    icon: BookOpen,
    title: "Market Glossary",
    description:
      "Understand essential market terms, indicators, and trading terminology.",
    meta: "QUICK REFERENCE",
  },
];

function SectionEyebrow({ children }) {
  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/6 px-3 py-1.5 text-[10px] font-semibold tracking-[0.18em] text-orange-400">
      <Sparkles size={12} />
      {children}
    </div>
  );
}

function MarketPulse() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");

  const filteredStories = useMemo(() => {
    const query = search.trim().toLowerCase();

    return marketStories.filter((story) => {
      const matchesCategory =
        category === "All" || story.category === category;
      const matchesSearch =
        !query ||
        `${story.title} ${story.description} ${story.category}`
          .toLowerCase()
          .includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <div>
     
      <div className="mb-10 flex flex-col items-center gap-6 text-center">
        <div className="w-full">
          <SectionEyebrow>01 / REAL-TIME MARKET PULSE</SectionEyebrow>

          <h3 className="mt-5 text-2xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
            The market moves.
            <br className="hidden sm:block" />{" "}
            <span className="text-orange-500">Stay informed.</span>
          </h3>

          <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-400">
            Market explainers, asset-class insights, and stories to help you
            understand the bigger picture.
          </p>
        </div>

        <div className="relative w-full max-w-md">
          <Search
            size={15}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search market insights..."
            aria-label="Search market insights"
            className="h-11 w-full rounded-xl border border-white/10 bg-white/3 pl-9 pr-3 text-xs text-white outline-none placeholder:text-neutral-600 transition-colors focus:border-orange-400/50"
          />
        </div>
      </div>


      <div className="mb-6 flex justify-center gap-2 overflow-x-auto pb-2">
        {marketCategories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
              category === item
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-white/10 bg-white/2 text-neutral-400 hover:border-white/25 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.15fr_0.85fr]">
        <article className="group relative flex min-h-85 flex-col justify-between overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b] p-5 sm:p-7">
          <div className="pointer-events-none absolute -right-12 -top-12 h-52 w-52 rounded-full bg-orange-500/10 blur-[75px] transition duration-500 group-hover:bg-orange-500/16" />

          <div className="relative">
            <div className="flex items-center justify-between gap-3">
              <span className="rounded-md border border-orange-400/25 bg-orange-400/6 px-2.5 py-1.5 text-[9px] font-semibold tracking-wider text-orange-400">
                EDITOR'S PICK
              </span>
              <Newspaper size={18} className="text-neutral-600" />
            </div>

            <div className="mt-10 max-w-lg">
              <p className="text-[10px] tracking-[0.18em] text-neutral-500">
                MARKET EDUCATION / FEATURED
              </p>
              <h4 className="mt-3 text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl">
                Better context.
                <br />
                <span className="text-orange-500">Smarter decisions.</span>
              </h4>
              <p className="mt-3 max-w-md text-sm leading-6 text-neutral-400">
                Build a habit of understanding what moves markets before
                focusing on the next price move.
              </p>
            </div>
          </div>

          <div className="relative mt-8 flex items-center justify-between gap-3 border-t border-white/8 pt-4">
            <div className="flex items-center gap-2 text-[10px] text-neutral-500">
              <Clock3 size={13} />
              5 min read
              <span className="text-neutral-700">/</span>
              Learning series
            </div>
            <a
              href="#knowledge-vault"
              className="inline-flex items-center gap-2 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
            >
              Explore insights <ArrowRight size={14} />
            </a>
          </div>
        </article>

        <div className="rounded-2xl border border-white/10 bg-[#090909] p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h4 className="text-sm font-semibold text-white">
                Market snapshot
              </h4>
              <p className="mt-1 text-[10px] text-neutral-500">
                Illustrative sample values
              </p>
            </div>
            <TrendingUp size={17} className="text-orange-400" />
          </div>

          <div className="space-y-1">
            {marketSnapshot.map((market) => {
              const ChangeIcon = market.up ? ArrowUpRight : ArrowDownRight;

              return (
                <div
                  key={market.name}
                  className="flex items-center justify-between gap-3 rounded-xl px-3 py-4 transition hover:bg-white/[0.035]"
                >
                  <div className="min-w-0">
                    <p className="text-xs font-medium text-neutral-200">
                      {market.name}
                    </p>
                    <p className="mt-1 text-sm text-white">{market.value}</p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1 text-[11px] ${
                      market.up ? "text-emerald-400" : "text-rose-400"
                    }`}
                  >
                    <ChangeIcon size={13} />
                    {market.change}
                  </span>
                </div>
              );
            })}
          </div>

          <p className="mt-3 border-t border-white/[0.07] pt-3 text-[10px] leading-5 text-neutral-600">
            Demo figures only — not live prices or investment advice.
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredStories.map((story) => (
          <article
            key={story.category}
            className="group flex min-w-0 flex-col rounded-2xl border border-white/8 bg-[#090909] p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-400/25"
          >
            <div className="flex items-center justify-between gap-2">
              <span className="text-[9px] font-semibold tracking-[0.15em] text-orange-400">
                {story.tag}
              </span>
              <ArrowUpRight
                size={15}
                className="text-neutral-600 transition group-hover:text-orange-400"
              />
            </div>
            <h4 className="mt-5 text-base font-semibold leading-6 text-white">
              {story.title}
            </h4>
            <p className="mt-2 flex-1 text-xs leading-6 text-neutral-500">
              {story.description}
            </p>
            <div className="mt-5 flex items-center justify-between gap-2 border-t border-white/[0.07] pt-4">
              <span className="text-[10px] text-neutral-600">
                {story.time}
              </span>
              <span className="text-[9px] tracking-wider text-neutral-500">
                {story.category.toUpperCase()}
              </span>
            </div>
          </article>
        ))}

        {filteredStories.length === 0 && (
          <div className="rounded-2xl border border-white/10 p-6 text-sm text-neutral-400 sm:col-span-2 xl:col-span-4">
            No insights match your search. Try another keyword or category.
          </div>
        )}
      </div>
    </div>
  );
}

function KnowledgeVault() {
  const [category, setCategory] = useState("All");
  const [saved, setSaved] = useState([]);

  const categories = ["All", "Notes", "Strategies", "Roadmaps", "Glossary"];
  const filteredResources =
    category === "All"
      ? resources
      : resources.filter((resource) => resource.category === category);

  const toggleSaved = (title) => {
    setSaved((current) =>
      current.includes(title)
        ? current.filter((item) => item !== title)
        : [...current, title]
    );
  };

  return (
  
<div id="knowledge-vault" className="scroll-mt-24">
  <div className="mb-10 flex flex-col items-center gap-5 text-center">
    <div className="w-full">
      <SectionEyebrow>02 / KNOWLEDGE VAULT</SectionEyebrow>

      <h3 className="mt-5 text-6xl font-semibold tracking-tight text-white sm:text-3xl lg:text-4xl">
        Knowledge is your
        <br className="hidden sm:block" />{" "}
        <span className="text-orange-500">real edge.</span>
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-neutral-400">
        A structured learning space to organize ideas, sharpen strategies,
        and build your market knowledge.
      </p>
    </div>

    <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/3 px-4 py-2 text-xs text-neutral-400">
      <Layers3 size={15} className="text-orange-400" />
      <span>
        {resources.length} learning collections
      </span>
    </div>
  </div>

      <div className="mb-6 flex justify-center gap-2 overflow-x-auto pb-2">
        {categories.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setCategory(item)}
            aria-pressed={category === item}
            className={`shrink-0 rounded-full border px-4 py-2 text-xs transition ${
              category === item
                ? "border-orange-500 bg-orange-500 text-black"
                : "border-white/10 bg-white/2 text-neutral-400 hover:border-white/25 hover:text-white"
            }`}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {filteredResources.map((resource) => {
          const Icon = resource.icon;
          const isSaved = saved.includes(resource.title);

          return (
            <article
              key={resource.number}
              className="group flex min-w-0 flex-col rounded-2xl border border-white/8 bg-[#090909] p-5 transition duration-300 hover:-translate-y-1 hover:border-orange-400/30 hover:bg-[#0d0d0d] sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-400/20 bg-orange-400/6">
                  <Icon size={19} className="text-orange-400" />
                </div>
                <button
                  type="button"
                  onClick={() => toggleSaved(resource.title)}
                  aria-label={`${isSaved ? "Unsave" : "Save"} ${resource.title}`}
                  aria-pressed={isSaved}
                  className={`rounded-lg border p-2 transition ${
                    isSaved
                      ? "border-orange-400/30 bg-orange-400/10 text-orange-400"
                      : "border-white/8 text-neutral-600 hover:text-white"
                  }`}
                >
                  <Bookmark size={15} fill={isSaved ? "currentColor" : "none"} />
                </button>
              </div>

              <p className="mt-6 text-[9px] font-semibold tracking-[0.16em] text-neutral-600">
                COLLECTION {resource.number}
              </p>
              <h4 className="mt-2 text-lg font-semibold text-white">
                {resource.title}
              </h4>
              <p className="mt-3 flex-1 text-xs leading-6 text-neutral-500">
                {resource.description}
              </p>

              <div className="mt-6 border-t border-white/[0.07] pt-4">
                <p className="text-[9px] tracking-[0.12em] text-neutral-600">
                  {resource.meta}
                </p>
                <button
                  type="button"
                  onClick={() => toggleSaved(resource.title)}
                  className="mt-3 inline-flex items-center gap-2 text-xs font-semibold text-orange-400 transition hover:text-orange-300"
                >
                  {isSaved ? "Saved to your list" : "Save collection"}
                  {isSaved ? <Bookmark size={13} fill="currentColor" /> : <ArrowRight size={14} />}
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/8 bg-[#090909] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-orange-400/8">
            <Lightbulb size={18} className="text-orange-400" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-white">
              Build your own knowledge system
            </h4>
            <p className="mt-1 text-xs leading-5 text-neutral-500">
              Save the resources you want to revisit as you learn.
            </p>
          </div>
        </div>
        <p className="shrink-0 text-xs text-neutral-500">
          {saved.length} saved {saved.length === 1 ? "collection" : "collections"}
        </p>
      </div>
    </div>
  );
}

export default function LearnInsights() {
  return (
    <section
      id="learn"
      className="relative isolate overflow-hidden bg-[#050505] px-4 py-14 text-white sm:px-6 sm:py-16 lg:px-10 lg:py-20"
    >
      <div className="pointer-events-none absolute -left-40 top-28 -z-10 h-96 w-96 rounded-full bg-orange-500/4.5 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
       
        <MarketPulse />

        <div className="my-16 border-t border-white/8 sm:my-20" />

        <KnowledgeVault />
      </div>
    </section>
  );
}
