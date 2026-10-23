
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  Brain,
  CheckCircle2,
  ChevronDown,
  Clock3,
  GraduationCap,
  Layers3,
  Search,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";

const TABS = [
  { id: "learn", label: "Learning Hub" },
  { id: "roadmap", label: "Trading Roadmap" },
  { id: "glossary", label: "Glossary" },
];

const CONCEPTS = [
  {
    level: "BEGINNER",
    title: "Technical Analysis",
    description:
      "Understand price action, candlestick patterns, support, resistance and common indicators.",
    topics: ["Candlesticks", "Moving averages", "RSI & MACD"],
    icon: TrendingUp,
    time: "15 min read",
    color: "orange",
  },
  {
    level: "INTERMEDIATE",
    title: "Fundamental Analysis",
    description:
      "Study earnings, economic releases, interest rates and the events that can move markets.",
    topics: ["Economic data", "Company earnings", "Macro events"],
    icon: Layers3,
    time: "18 min read",
    color: "neutral",
  },
  {
    level: "ESSENTIAL",
    title: "Risk & Money Management",
    description:
      "Learn position sizing, stop-loss planning, drawdown and risk-to-reward calculations.",
    topics: ["Position sizing", "Stop-loss", "Risk-to-reward"],
    icon: ShieldCheck,
    time: "20 min read",
    color: "orange",
  },
  {
    level: "ESSENTIAL",
    title: "Trading Psychology",
    description:
      "Build a repeatable process and recognize fear, greed, FOMO and revenge trading.",
    topics: ["Trading journal", "Emotional control", "Discipline"],
    icon: Brain,
    time: "12 min read",
    color: "neutral",
  },
];

const STRATEGIES = [
  {
    title: "Trend Trading",
    description:
      "Study higher highs and higher lows in uptrends, and lower highs and lower lows in downtrends.",
    tag: "Trend & momentum",
  },
  {
    title: "Breakout Trading",
    description:
      "Study price moving beyond a defined range or key level. Learn to assess volume and false breakouts.",
    tag: "Range expansion",
  },
  {
    title: "Range Trading",
    description:
      "Study how price behaves between support and resistance in sideways markets.",
    tag: "Mean reversion",
  },
  {
    title: "Scalping & Day Trading",
    description:
      "Explore short holding periods, execution costs and the discipline required for intraday trading.",
    tag: "Short-term",
  },
  {
    title: "Swing Trading",
    description:
      "Study multi-day price swings, broader trends and planning trades around invalidation levels.",
    tag: "Multi-day",
  },
];

const ROADMAP = [
  {
    number: "01",
    level: "BEGINNER",
    title: "Market Mechanics",
    subtitle: "Understand how markets work before studying setups.",
    topics: [
      "Order book and market orders",
      "Auction theory and supply versus demand",
      "Volume and volume-by-price",
      "Candlesticks and market sessions",
    ],
    exercise:
      "Identify support, resistance and major price swings on a historical chart.",
    risk: "Practice only — no live capital required.",
  },
  {
    number: "02",
    level: "INTERMEDIATE",
    title: "Strategy & Market Structure",
    subtitle: "Learn to describe market behavior using clear rules.",
    topics: [
      "Trend structure and break of structure (BOS)",
      "Change of character (CHoCH)",
      "Liquidity and stop placement",
      "Fair Value Gaps (FVG) and order blocks",
    ],
    exercise:
      "Document a setup, its entry conditions and the price level that invalidates it.",
    risk: "Backtest first; concepts do not guarantee a reaction.",
  },
  {
    number: "03",
    level: "ADVANCED",
    title: "Risk Architecture",
    subtitle: "Treat each trade as one outcome in a series of probabilities.",
    topics: [
      "Position sizing and maximum drawdown",
      "R-multiples and risk-to-reward",
      "Win rate and expectancy",
      "Exposure and losing-streak management",
    ],
    exercise:
      "Calculate hypothetical trade risk and review a sample series of outcomes.",
    risk: "Use predefined limits; never risk money you cannot afford to lose.",
  },
  {
    number: "04",
    level: "PRACTITIONER",
    title: "Execution & Statistical Review",
    subtitle: "Build a repeatable process and measure it honestly.",
    topics: [
      "A written trading playbook",
      "Pre-trade and post-trade journal",
      "Emotional and rule-adherence tracking",
      "Monthly performance and drawdown review",
    ],
    exercise:
      "Review a sample of historical trades and identify rule violations and patterns.",
    risk: "Scale exposure only when evidence and risk limits support it.",
  },
];

const GLOSSARY = [
  {
    term: "Bullish",
    level: "Basic",
    category: "Market Direction",
    definition: "A market condition or view that anticipates rising prices.",
    example: "A series of higher highs may indicate a bullish structure.",
  },
  {
    term: "Bearish",
    level: "Basic",
    category: "Market Direction",
    definition: "A market condition or view that anticipates falling prices.",
    example: "Lower highs and lower lows can indicate a bearish structure.",
  },
  {
    term: "Long Position",
    level: "Basic",
    category: "Positions",
    definition: "A position that generally benefits when the asset price rises.",
    example: "Buying an asset with the expectation that its price will increase.",
  },
  {
    term: "Short Position",
    level: "Basic",
    category: "Positions",
    definition:
      "A position designed to benefit from a price decline; mechanics and risks depend on the instrument.",
    example: "Short selling may involve borrowing an asset or using a derivative.",
  },
  {
    term: "Support",
    level: "Basic",
    category: "Market Structure",
    definition:
      "A price area where buying interest has previously helped slow a decline.",
    example: "Price may bounce near support, but it can also break below it.",
  },
  {
    term: "Resistance",
    level: "Basic",
    category: "Market Structure",
    definition:
      "A price area where selling pressure has previously helped slow a rise.",
    example: "Price may reject resistance or break above it.",
  },
  {
    term: "Stop-Loss",
    level: "Basic",
    category: "Risk Management",
    definition:
      "An order or exit rule intended to limit a trade's loss. Execution price is not always guaranteed.",
    example: "A stop order may execute at a worse price during a fast market.",
  },
  {
    term: "Take-Profit",
    level: "Basic",
    category: "Orders",
    definition: "A planned exit level intended to realize a gain.",
    example: "A limit order can be placed near a predefined profit target.",
  },
  {
    term: "Market Order",
    level: "Intermediate",
    category: "Orders",
    definition:
      "An instruction to buy or sell promptly at the best available prices.",
    example: "The final execution price may differ from the displayed quote.",
  },
  {
    term: "Limit Order",
    level: "Intermediate",
    category: "Orders",
    definition:
      "An order specifying the worst price at which you are willing to buy or sell.",
    example: "A buy limit is placed at the specified price or lower; execution is not guaranteed.",
  },
  {
    term: "Leverage",
    level: "Intermediate",
    category: "Risk Management",
    definition:
      "Exposure larger than the capital committed, which can amplify both gains and losses.",
    example: "Small adverse price moves can cause large losses relative to margin.",
  },
  {
    term: "Liquidity",
    level: "Intermediate",
    category: "Market Mechanics",
    definition:
      "How easily an asset can be traded without substantially affecting its price.",
    example: "A wide bid-ask spread can increase the cost of entering and exiting.",
  },
  {
    term: "Volatility",
    level: "Intermediate",
    category: "Market Mechanics",
    definition: "A measure of how much or how quickly prices fluctuate.",
    example: "Higher volatility can mean larger price swings and greater uncertainty.",
  },
  {
    term: "Drawdown",
    level: "Intermediate",
    category: "Risk Management",
    definition:
      "A decline in account value from a previous peak to a subsequent low.",
    example: "A fall from ₹100,000 to ₹90,000 is a 10% peak-to-trough drawdown.",
  },
  {
    term: "Risk-to-Reward",
    level: "Intermediate",
    category: "Risk Management",
    definition:
      "A comparison between the planned loss if a trade fails and the potential gain if it succeeds.",
    example: "Risking ₹1,000 for a potential ₹2,000 gain is a 1:2 risk-to-reward plan.",
  },
  {
    term: "Break of Structure (BOS)",
    level: "Advanced",
    category: "Market Structure",
    definition:
      "A term used in some price-action frameworks when price breaks a significant prior swing.",
    example: "Traders may look for a break above a previous swing high.",
  },
  {
    term: "Change of Character (CHoCH)",
    level: "Advanced",
    category: "Market Structure",
    definition:
      "A price-action label for a possible change in the previous market structure.",
    example: "A break against the prior swing sequence may prompt further analysis.",
  },
  {
    term: "Fair Value Gap (FVG)",
    level: "Advanced",
    category: "Price Action",
    definition:
      "A three-candle price-action pattern often interpreted as an imbalance by some traders.",
    example: "Some traders monitor whether price revisits the zone; this is not guaranteed.",
  },
  {
    term: "Liquidity Sweep",
    level: "Advanced",
    category: "Price Action",
    definition:
      "A move beyond a visible high or low that reverses back through the level.",
    example: "A brief move above a prior high followed by a close back below it.",
  },
  {
    term: "Order Block",
    level: "Advanced",
    category: "Price Action",
    definition:
      "A chart zone identified by some trading methodologies as potentially relevant before a strong move.",
    example: "Traders may study the zone on a return, but a bounce is not assured.",
  },
  {
    term: "Trading Edge",
    level: "Advanced",
    category: "Strategy",
    definition:
      "A repeatable approach with evidence of positive expected results after costs and risk.",
    example: "A strategy is evaluated over a meaningful sample, not one winning trade.",
  },
  {
    term: "Expectancy",
    level: "Advanced",
    category: "Statistics",
    definition:
      "The average expected outcome per trade based on win probability, average win and average loss.",
    example: "Positive historical expectancy can still change as market conditions change.",
  },
  {
    term: "R-Multiple",
    level: "Advanced",
    category: "Statistics",
    definition:
      "A trade outcome expressed as a multiple of its initial planned risk.",
    example: "A ₹3,000 gain on a trade with ₹1,000 initial risk is +3R before costs.",
  },
];

function SectionLabel({ children }) {
  return (
    <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-orange-500">
      {children}
    </p>
  );
}

function LearningHub({ onRoadmap, onGlossary }) {
  return (
    <>
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Learning paths",
            value: "04",
            detail: "Build your foundation",
            icon: BookOpen,
          },
          {
            label: "Core strategies",
            value: "05",
            detail: "Study different approaches",
            icon: Target,
          },
          {
            label: "Glossary terms",
            value: String(GLOSSARY.length).padStart(2, "0"),
            detail: "Learn market terminology",
            icon: GraduationCap,
          },
          {
            label: "Main priority",
            value: "Risk",
            detail: "Protect capital first",
            icon: ShieldCheck,
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="text-sm text-neutral-400">{item.label}</span>
                <Icon size={18} className="text-orange-400" />
              </div>
              <p className="text-2xl font-semibold text-white">{item.value}</p>
              <p className="mt-1 text-xs text-neutral-500">{item.detail}</p>
            </div>
          );
        })}
      </section>

      <section className="mt-10">
        <SectionLabel>Build your foundation</SectionLabel>
        <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <h2 className="text-2xl font-semibold text-white">
            Core trading concepts
          </h2>
          <p className="max-w-xl text-sm text-neutral-500">
            Learn how markets work, how strategies are evaluated, and how to
            manage uncertainty.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          {CONCEPTS.map((concept) => {
            const Icon = concept.icon;

            return (
              <article
                key={concept.title}
                className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5 transition hover:border-orange-500/30 sm:p-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/8">
                    <Icon size={20} className="text-orange-400" />
                  </div>
                  <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] font-semibold tracking-wider text-neutral-400">
                    {concept.level}
                  </span>
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  {concept.title}
                </h3>
                <p className="mt-2 text-sm leading-6 text-neutral-400">
                  {concept.description}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {concept.topics.map((topic) => (
                    <span
                      key={topic}
                      className="rounded-md bg-white/4 px-2.5 py-1.5 text-xs text-neutral-400"
                    >
                      {topic}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="flex items-center gap-1.5 text-xs text-neutral-500">
                    <Clock3 size={13} />
                    {concept.time}
                  </span>
                  <span className="text-xs text-neutral-600">
                    Study guide preview
                  </span>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="mt-10">
        <SectionLabel>Explore trading approaches</SectionLabel>
        <h2 className="mb-5 text-2xl font-semibold text-white">
          Core trading strategies
        </h2>

        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {STRATEGIES.map((strategy, index) => (
            <article
              key={strategy.title}
              className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5"
            >
              <span className="text-xs font-semibold text-orange-400">
                STRATEGY 0{index + 1}
              </span>
              <h3 className="mt-3 font-semibold text-white">
                {strategy.title}
              </h3>
              <p className="mt-2 text-sm leading-6 text-neutral-400">
                {strategy.description}
              </p>
              <p className="mt-4 text-xs text-neutral-500">{strategy.tag}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-10 grid gap-4 lg:grid-cols-2">
        <button
          type="button"
          onClick={onRoadmap}
          className="flex items-center justify-between gap-4 rounded-xl border border-orange-500/20 bg-orange-500/6 p-6 text-left transition hover:bg-orange-500/10"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-orange-400">
              Your learning journey
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Follow the advanced roadmap
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              Move from market mechanics to risk and statistical review.
            </p>
          </div>
          <ArrowRight className="shrink-0 text-orange-400" />
        </button>

        <button
          type="button"
          onClick={onGlossary}
          className="flex items-center justify-between gap-4 rounded-xl border border-white/8 bg-[#0c0c0c] p-6 text-left transition hover:border-orange-500/30"
        >
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-neutral-500">
              Learn the language
            </p>
            <h3 className="mt-2 text-lg font-semibold text-white">
              Explore trading glossary
            </h3>
            <p className="mt-2 text-sm text-neutral-400">
              Search definitions, examples and difficulty levels.
            </p>
          </div>
          <ArrowRight className="shrink-0 text-orange-400" />
        </button>
      </section>
    </>
  );
}

function RoadmapHub() {
  return (
    <section>
      <SectionLabel>Progressive learning framework</SectionLabel>
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">
        From market basics to systematic execution
      </h2>
      <p className="mt-3 max-w-3xl text-sm leading-6 text-neutral-400">
        Follow these phases in order. Advanced terminology is useful only when
        supported by sound market knowledge, risk controls and evidence.
      </p>

      <div className="mt-8 space-y-4">
        {ROADMAP.map((phase) => (
          <details
            key={phase.number}
            className="group rounded-xl border border-white/8 bg-[#0c0c0c]"
            open={phase.number === "01"}
          >
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 sm:p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/8 font-semibold text-orange-400">
                {phase.number}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[10px] font-semibold tracking-[0.18em] text-orange-400">
                  {phase.level}
                </p>
                <h3 className="mt-1 text-base font-semibold text-white sm:text-lg">
                  {phase.title}
                </h3>
                <p className="mt-1 text-sm text-neutral-500">
                  {phase.subtitle}
                </p>
              </div>
              <ChevronDown
                size={18}
                className="shrink-0 text-neutral-500 transition group-open:rotate-180"
              />
            </summary>

            <div className="border-t border-white/[0.07] px-5 pb-5 pt-4 sm:px-6 sm:pb-6">
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-neutral-500">
                Learning objectives
              </p>
              <ul className="grid gap-3 sm:grid-cols-2">
                {phase.topics.map((topic) => (
                  <li
                    key={topic}
                    className="flex items-start gap-2 text-sm leading-5 text-neutral-300"
                  >
                    <CheckCircle2
                      size={16}
                      className="mt-0.5 shrink-0 text-orange-400"
                    />
                    {topic}
                  </li>
                ))}
              </ul>

              <div className="mt-5 rounded-lg border border-white/[0.07] bg-black/30 p-4">
                <p className="text-xs font-semibold text-orange-400">
                  PRACTICAL EXERCISE
                </p>
                <p className="mt-2 text-sm leading-6 text-neutral-300">
                  {phase.exercise}
                </p>
                <p className="mt-3 text-xs leading-5 text-neutral-500">
                  {phase.risk}
                </p>
              </div>
            </div>
          </details>
        ))}
      </div>

      <div className="mt-6 rounded-xl border border-orange-500/20 bg-orange-500/5 p-5">
        <h3 className="font-semibold text-white">The professional mindset</h3>
        <p className="mt-2 text-sm leading-6 text-neutral-400">
          Knowledge Stage → Focus → Objective → Risk Metric. Beginners should
          prioritize learning and paper trading. Intermediate learners should
          document rules and control exposure. Advanced learners should
          evaluate expectancy, drawdown and strategy performance after costs.
        </p>
      </div>
    </section>
  );
}

function GlossaryHub() {
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("All");

  const filteredTerms = useMemo(() => {
    const normalized = query.trim().toLowerCase();

    return GLOSSARY.filter((item) => {
      const matchesLevel = level === "All" || item.level === level;
      const searchable =
        `${item.term} ${item.category} ${item.definition} ${item.example}`.toLowerCase();

      return matchesLevel && searchable.includes(normalized);
    });
  }, [query, level]);

  return (
    <section>
      <SectionLabel>Trading language, simplified</SectionLabel>
      <h2 className="text-2xl font-semibold text-white sm:text-3xl">
        Trading glossary
      </h2>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400">
        Search essential terminology, understand the definition and see how a
        term is used in context.
      </p>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <label className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-[#0c0c0c] px-4">
          <Search size={18} className="shrink-0 text-neutral-500" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search terms, e.g. liquidity, FVG..."
            className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-600"
          />
        </label>

        <select
          value={level}
          onChange={(event) => setLevel(event.target.value)}
          className="rounded-xl border border-white/10 bg-[#0c0c0c] px-4 py-3 text-sm text-white outline-none focus:border-orange-500/50"
          aria-label="Filter glossary by level"
        >
          <option>All</option>
          <option>Basic</option>
          <option>Intermediate</option>
          <option>Advanced</option>
        </select>
      </div>

      <p className="mt-4 text-xs text-neutral-500">
        {filteredTerms.length} terms found
      </p>

      <div className="mt-4 grid gap-3 lg:grid-cols-2">
        {filteredTerms.map((item) => (
          <article
            key={item.term}
            className="rounded-xl border border-white/8 bg-[#0c0c0c] p-5"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <h3 className="font-semibold text-white">{item.term}</h3>
              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-neutral-400">
                {item.level}
              </span>
            </div>

            <p className="mt-2 text-xs text-orange-400">{item.category}</p>
            <p className="mt-3 text-sm leading-6 text-neutral-300">
              {item.definition}
            </p>

            <div className="mt-4 rounded-lg bg-white/[0.035] p-3">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-neutral-500">
                Example
              </p>
              <p className="mt-1.5 text-sm leading-5 text-neutral-400">
                {item.example}
              </p>
            </div>
          </article>
        ))}
      </div>

      {filteredTerms.length === 0 && (
        <div className="mt-5 rounded-xl border border-white/8 bg-[#0c0c0c] p-8 text-center">
          <Search className="mx-auto mb-3 text-neutral-600" size={24} />
          <h3 className="font-medium text-white">No matching terms</h3>
          <p className="mt-2 text-sm text-neutral-500">
            Try another search or change the difficulty filter.
          </p>
        </div>
      )}
    </section>
  );
}

export default function LearnPage({ initialTab = "learn" }) {
  const [activeTab, setActiveTab] = useState(initialTab);

  const tabContent = {
    learn: (
      <LearningHub
        onRoadmap={() => setActiveTab("roadmap")}
        onGlossary={() => setActiveTab("glossary")}
      />
    ),
    roadmap: <RoadmapHub />,
    glossary: <GlossaryHub />,
  };

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">

        <nav
          aria-label="Learning sections"
          className="mb-8 flex justify-start overflow-x-auto border-y border-white/8 py-3 md:justify-center"
        >
          <div className="flex min-w-max items-center gap-2">
            {TABS.map((tab) => {
              const active = activeTab === tab.id;

              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  aria-pressed={active}
                  className={`rounded-full border px-5 py-2.5 text-sm font-medium transition ${
                    active
                      ? "border-orange-500 bg-orange-500 text-white"
                      : "border-white/10 bg-[#0c0c0c] text-neutral-400 hover:border-white/20 hover:text-white"
                  }`}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>
        </nav>

        {tabContent[activeTab]}

        <footer className="mt-12 border-t border-white/8 py-6 text-xs leading-5 text-neutral-600">
          Educational content only — not investment advice or a promise of
          trading results. Trading involves risk. Examples are illustrative;
          test strategies carefully before considering real capital.
        </footer>
      </div>
    </main>
  );
}
