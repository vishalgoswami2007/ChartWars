
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Search, ChevronDown, ArrowRight, ShieldCheck, Users, ChartCandlestick, Video, UserRound, CircleHelp, Mail } from "lucide-react";
import logo from "../../../assets/logo.png";
import Footer from "./Footer";

const ROUTES = {
  home: "/",
  contact: "/contact",
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const CATEGORIES = [
  {
    title: "Account & Login",
    description: "Sign-in, signup and account settings.",
    icon: UserRound,
    questions: [
      {
        q: "How do I create a ChartWars account?",
        a: "Open the signup page and follow the available registration steps. Use an email address you can access so you can complete any required verification.",
      },
      {
        q: "I cannot log in. What should I do?",
        a: "Check your login details and internet connection. If Google sign-in is available, make sure you select the correct Google account. If the problem continues, contact support with the error message.",
      },
      {
        q: "Is my account information secure?",
        a: "ChartWars should protect accounts using secure authentication, server-side validation and appropriate access controls. Never share your password or authentication tokens with anyone.",
      },
    ],
  },
  {
    title: "Friends & Rooms",
    description: "Connect with friends and join practice rooms.",
    icon: Users,
    questions: [
      {
        q: "How do I practise with friends?",
        a: "Use the friends feature to connect with other users. When multiplayer rooms are available, create a room and invite a friend or share its room code.",
      },
      {
        q: "How do room codes work?",
        a: "A room host can share a room code with invited players. Depending on the room rules, joining may send a request that the host must approve.",
      },
      {
        q: "Why can't I join a room?",
        a: "Check that the room code is correct, the room is still open and you have not reached its participant limit. If the room requires approval, wait for the host to respond.",
      },
      {
        q: "What do Admin and Member roles mean?",
        a: "The Admin manages the room and can control available permissions. Members can use only the features permitted to their role.",
      },
    ],
  },
  {
    title: "Trading Practice",
    description: "Orders, risk management and practice modes.",
    icon: ChartCandlestick,
    questions: [
      {
        q: "Does ChartWars use real money?",
        a: "ChartWars is designed for trading practice with virtual funds. Practice balances are not real money and cannot be treated as withdrawable funds.",
      },
      {
        q: "What is a stop-loss?",
        a: "A stop-loss is an order intended to limit a position's loss when the market reaches a specified price. In a simulator, the actual result depends on the platform's execution rules.",
      },
      {
        q: "What is Blind Round?",
        a: "Blind Round is a practice mode designed to hide historical market data and keep player positions hidden until the round ends, so participants can compare decisions afterward.",
      },
      {
        q: "Are practice results a guarantee of real trading profits?",
        a: "No. Simulated results do not guarantee future performance in real markets. ChartWars is an educational practice platform, not a source of investment advice.",
      },
    ],
  },
  {
    title: "Charts & Replay",
    description: "Candles, indicators and historical practice.",
    icon: ChartCandlestick,
    questions: [
      {
        q: "How do I change the chart timeframe?",
        a: "Use the timeframe selector on the chart to choose a supported interval. Available options depend on the chart mode and market data.",
      },
      {
        q: "What is Replay mode?",
        a: "Replay mode lets you practise using historical candles as they unfold. It is designed to help you make decisions without seeing future candles in advance.",
      },
      {
        q: "Why is a symbol or candle missing?",
        a: "The selected symbol or timeframe may not have available data for that period. Try another supported symbol or interval and check your connection.",
      },
    ],
  },
  {
    title: "Voice & Video",
    description: "Microphone, camera and call troubleshooting.",
    icon: Video,
    questions: [
      {
        q: "Why is my microphone not working?",
        a: "Check browser microphone permissions, your operating system's input settings and whether another app is using the microphone. Refresh the page after changing permissions.",
      },
      {
        q: "Can I turn off my camera?",
        a: "Use the in-call camera control when available. You can also deny camera permission in your browser, although some call features may be limited.",
      },
      {
        q: "What if I deny microphone or camera permission?",
        a: "The ability to join or participate may be limited depending on the room's rules and the call service. Follow the on-screen instructions or contact support.",
      },
    ],
  },
  {
    title: "Privacy & Security",
    description: "Account protection, blocking and privacy.",
    icon: ShieldCheck,
    questions: [
      {
        q: "How do I report or block a user?",
        a: "Use the reporting or blocking controls when available. Include relevant details about the issue, but do not share passwords or private authentication information.",
      },
      {
        q: "How can I protect my account?",
        a: "Use a strong, unique password, secure your Google account if you use Google sign-in, and never share login links or authentication codes.",
      },
      {
        q: "Where can I read the privacy policy?",
        a: "Visit the Privacy Policy page through the website footer to review how personal information is handled.",
      },
    ],
  },
];



function Accordion({ question, answer }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-white/10 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-4 py-5 text-left text-sm font-medium text-zinc-100 transition hover:text-orange-400 ${FOCUS}`}
      >
        <span>{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-zinc-500 transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <p className="max-w-3xl pb-5 text-sm leading-7 text-zinc-400">
          {answer}
        </p>
      )}
    </div>
  );
}

export default function HelpCenter() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All topics");

  const filteredCategories = useMemo(() => {
    const term = search.trim().toLowerCase();

    return CATEGORIES
      .filter((category) =>
        activeCategory === "All topics" ||
        category.title === activeCategory
      )
      .map((category) => ({
        ...category,
        questions: category.questions.filter((item) =>
          !term ||
          category.title.toLowerCase().includes(term) ||
          category.description.toLowerCase().includes(term) ||
          item.q.toLowerCase().includes(term) ||
          item.a.toLowerCase().includes(term)
        ),
      }))
      .filter((category) => !term || category.questions.length > 0);
  }, [search, activeCategory]);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#050505] text-zinc-100 antialiased selection:bg-orange-500/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-120 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.16),transparent_65%)]"
      />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-[#050505]/80 backdrop-blur">
        <div className={`${WRAP} flex h-16 items-center justify-between`}>
          <Link
            to={ROUTES.home}
            aria-label="ChartWars home"
            className={`flex items-center gap-3 rounded-md ${FOCUS}`}
          >
            <img
              src={logo}
              alt=""
              width={32}
              height={32}
              className="h-8 w-8 object-contain"
            />
            <span className="text-sm font-semibold tracking-[0.22em]">
              CHART<span className="text-orange-500">WARS</span>
            </span>
          </Link>

          <Link
            to={ROUTES.home}
            className={`rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-orange-500/60 hover:text-white ${FOCUS}`}
          >
            Back to home
          </Link>
        </div>
      </header>

      <main className="relative">
        <section className={`${WRAP} pb-12 pt-16 sm:pb-16 sm:pt-24`}>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
            Support & guidance
          </p>

          <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            How can we{" "}
            <span className="text-orange-500">help you?</span>
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
            Find answers about your account, practice rooms, charts and
            everything you need to get more out of ChartWars.
          </p>

          <form
            className="mt-8 flex max-w-2xl items-center gap-3 rounded-2xl border border-white/10 bg-white/3 p-2 focus-within:border-orange-500/50"
            onSubmit={(event) => event.preventDefault()}
            role="search"
          >
            <Search className="ml-3 shrink-0 text-zinc-500" size={20} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search help articles..."
              aria-label="Search help articles"
              className="min-w-0 flex-1 bg-transparent py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch("")}
                className={`rounded-xl px-3 py-2 text-sm text-zinc-400 transition hover:text-white ${FOCUS}`}
              >
                Clear
              </button>
            )}
          </form>

          <p className="mt-4 text-xs text-zinc-500">
            Search for login, room codes, replay, orders, microphone or privacy.
          </p>
        </section>

        <section className={`${WRAP} pb-14`}>
          <div className="flex flex-wrap gap-2">
            {["All topics", ...CATEGORIES.map((category) => category.title)].map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => setActiveCategory(category)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    activeCategory === category
                      ? "border-orange-500 bg-orange-500 text-black"
                      : "border-white/10 bg-white/2 text-zinc-400 hover:border-orange-500/50 hover:text-white"
                  } ${FOCUS}`}
                >
                  {category}
                </button>
              )
            )}
          </div>
        </section>

        <section className={`${WRAP} pb-20`}>
          {filteredCategories.length === 0 ? (
            <div className="rounded-2xl border border-white/10 bg-white/2 px-6 py-14 text-center">
              <CircleHelp
                size={32}
                className="mx-auto text-orange-500"
              />
              <h2 className="mt-4 text-xl font-semibold">
                No matching articles
              </h2>
              <p className="mt-2 text-sm text-zinc-400">
                Try another search, or contact our support team.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("All topics");
                }}
                className={`mt-5 rounded-full border border-white/15 px-5 py-2 text-sm transition hover:border-orange-500/60 ${FOCUS}`}
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid items-start gap-6 lg:grid-cols-2">
              {filteredCategories.map((category) => {
                const Icon = category.icon;

                return (
                  <article
                    key={category.title}
                    className="rounded-2xl border border-white/10 bg-white/2 p-5 sm:p-7"
                  >
                    <div className="flex items-start gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/20 bg-orange-500/8 text-orange-500">
                        <Icon size={21} />
                      </div>
                      <div>
                        <h2 className="text-lg font-semibold">
                          {category.title}
                        </h2>
                        <p className="mt-1 text-sm leading-relaxed text-zinc-400">
                          {category.description}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4">
                      {category.questions.map((item) => (
                        <Accordion
                          key={item.q}
                          question={item.q}
                          answer={item.a}
                        />
                      ))}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>

        <section className={`${WRAP} pb-20`}>
          <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-orange-500/20 bg-linear-to-br from-orange-500/10 via-transparent to-transparent p-7 sm:p-10 md:flex-row md:items-center">
            <div className="max-w-xl">
              <div className="flex items-center gap-2 text-orange-500">
                <Mail size={18} />
                <span className="text-xs font-semibold uppercase tracking-[0.2em]">
                  Still need help?
                </span>
              </div>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight sm:text-3xl">
                We’re here to help you move forward.
              </h2>
              <p className="mt-3 text-sm leading-relaxed text-zinc-400">
                Tell us what happened and include the steps to reproduce the
                issue. Never send your password or authentication tokens.
              </p>
            </div>

            <Link
              to={ROUTES.contact}
              className={`inline-flex h-11 shrink-0 items-center gap-2 rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}
            >
              Contact support
              <ArrowRight size={16} />
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
