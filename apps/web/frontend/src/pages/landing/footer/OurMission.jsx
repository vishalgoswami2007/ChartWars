
import { Link } from "react-router-dom";
import Footer from "./Footer";
const ROUTES = {
  home: "/",
  help: "/help",
  contact: "/contact",
  privacy: "/privacy",
  cookies: "/cookies",
  terms: "/terms",
  accessibility: "/accessibility",
};
import logo from "../../../assets/logo.png";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const PRINCIPLES = [
  {
    title: "Practice before risk",
    text: "Everyone deserves a place to make mistakes without losing real money. Virtual funds let you test an idea, see what happens and try again.",
  },
  {
    title: "Discipline over luck",
    text: "A lucky win teaches nothing. We reward stop-losses, sensible risk and consistency, so the habits you build are the ones that last.",
  },
  {
    title: "Learn together",
    text: "Markets can feel lonely. Private rooms let friends and study groups look at the same chart, ask why, and learn from each other.",
  },
  {
    title: "Honest by default",
    text: "We label sample data, say what is not built yet, and never present practice results as investment advice.",
  },
];

const IS = [
  "A practice platform that uses virtual funds only",
  "A place to build risk management and discipline",
  "A way to train with friends, on a shared chart",
  "An early-stage product we are building in the open",
];

const IS_NOT = [
  "A broker or an exchange",
  "A way to trade or withdraw real money",
  "A source of investment advice or trading signals",
  "A promise that practice results will repeat in real markets",
];

function Shell({ children }) {
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
            className={`flex items-center gap-3 rounded-md ${FOCUS}`}
            aria-label="ChartWars home"
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
        {children}
      </main>

      <Footer />
    </div>
  );
}


function Check({ tone }) {
  const color =
    tone === "yes" ? "text-orange-500" : "text-zinc-600";

  return (
    <svg
      viewBox="0 0 20 20"
      className={`mt-0.5 h-5 w-5 shrink-0 ${color}`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {tone === "yes" ? (
        <path
          d="M4 10.5l4 4 8-9"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5 5l10 10M15 5L5 15"
          strokeLinecap="round"
        />
      )}
    </svg>
  );
}

export default function OurMission() {
  return (
    <Shell>
      <section className={`${WRAP} pb-16 pt-16 sm:pt-24`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          Our mission
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Learn the market.{" "}
          <span className="text-orange-500">
            Practise with purpose.
          </span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-relaxed text-zinc-400">
          ChartWars exists to make trading education hands-on, social
          and honest. We want people to build real decision-making
          skills before real money is on the line, one decision at a time.
        </p>
      </section>

      <section
        className={`${WRAP} pb-20`}
        aria-labelledby="principles"
      >
        <h2
          id="principles"
          className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500"
        >
          What we believe
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PRINCIPLES.map((p, i) => (
            <article
              key={p.title}
              className="rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-orange-500/40"
            >
              <span className="font-mono text-xs text-orange-500">
                {String(i + 1).padStart(2, "0")}
              </span>

              <h3 className="mt-3 text-lg font-semibold">
                {p.title}
              </h3>

              <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                {p.text}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-white/2"
        aria-labelledby="clarity"
      >
        <div className={`${WRAP} py-20`}>
          <h2
            id="clarity"
            className="max-w-2xl text-3xl font-semibold tracking-tight"
          >
            Clear about what ChartWars is, and is not
          </h2>

          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="rounded-2xl border border-orange-500/30 bg-orange-500/4 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-orange-500">
                ChartWars is
              </h3>

              <ul className="mt-5 space-y-4">
                {IS.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-zinc-200"
                  >
                    <Check tone="yes" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/40 p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-zinc-400">
                ChartWars is not
              </h3>

              <ul className="mt-5 space-y-4">
                {IS_NOT.map((item) => (
                  <li
                    key={item}
                    className="flex gap-3 text-sm text-zinc-400"
                  >
                    <Check tone="no" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className={`${WRAP} py-20`}>
        <div className="flex flex-col items-start justify-between gap-8 rounded-3xl border border-white/10 bg-linear-to-br from-orange-500/10 via-transparent to-transparent p-8 sm:p-12 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              Help us shape what comes next
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-zinc-400">
              ChartWars is in early access. Tell us what works,
              what is confusing and what you want to practise next.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              to={ROUTES.contact}
              className={`inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}
            >
              Contact us
            </Link>

            <Link
              to={ROUTES.help}
              className={`inline-flex h-11 items-center rounded-full border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}
            >
              Visit Help Center
            </Link>
          </div>
        </div>
      </section>
    </Shell>
  );
}
