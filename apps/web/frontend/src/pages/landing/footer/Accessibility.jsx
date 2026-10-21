import { Link } from "react-router-dom";
const ROUTES = {
  home: "/",
  help: "/help",
  contact: "/businessContact",
  privacy: "/privacyPolicy",
  cookies: "/cookies",
  terms: "/terms",
  accessibility: "/accessibility",
};
import logo from "../../../assets/logo.png";
import Footer from "./Footer";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const LAST_REVIEWED = "[LAST_REVIEWED_DATE]";

const PILLARS = [
  { title: "Keyboard friendly", text: "Menus, forms, rooms and controls should be reachable and usable without a mouse, with a clearly visible focus outline." },
  { title: "Readable", text: "Text and controls are designed for strong contrast on dark backgrounds, and pages are built to work when text is enlarged." },
  { title: "Screen reader aware", text: "We use semantic headings, landmarks, form labels and clear error messages so assistive technology can describe what is on the page." },
  { title: "Not colour alone", text: "Gains and losses use labels and signs as well as green and red, so meaning does not depend on colour." },
];

const LIMITS = [
  "Charts are visual. We are working on text summaries of candles, positions and results so that the same information is available without seeing the chart.",
  "Live voice and video in Friend Rooms depend on a third-party provider, and some of its controls may not be fully accessible yet.",
  "Some newer screens and early-access features may not meet our own standard yet. We fix reported problems as quickly as we can.",
];

const SECTIONS = [
  {
    title: "Our commitment",
    text: "We want ChartWars to be usable by as many people as possible, including people who use a keyboard, a screen reader, magnification or other assistive technology. Learning to manage risk should not depend on how you use a screen.",
  },
  {
    title: "The standard we work toward",
    text: "We are working toward the Web Content Accessibility Guidelines (WCAG) 2.2, level AA. This is our goal, not a claim that every page already meets it.",
  },
  {
    title: "Browsers and assistive technology",
    text: "ChartWars is built for current versions of major browsers on desktop and mobile. If something does not work with your browser or assistive tool, please let us know which one you use.",
  },
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
          <Link to={ROUTES.home} className={`flex items-center gap-3 rounded-md ${FOCUS}`} aria-label="ChartWars home">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
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
      <main className="relative">{children}</main>
      <Footer />
    </div>
  );
}

export default function Accessibility() {
  return (
    <Shell>
      <section className={`${WRAP} pb-12 pt-16 sm:pt-20`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Accessibility</p>
        <h1 className="mt-5 max-w-3xl text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          Built to be used by <span className="text-orange-500">everyone</span>.
        </h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
          Our accessibility statement: what we design for, where we still fall short, and how to reach us.
        </p>
        <p className="mt-4 text-sm text-zinc-500">Last reviewed: {LAST_REVIEWED}</p>
      </section>

      <section className={`${WRAP} pb-16`} aria-labelledby="design-for">
        <h2 id="design-for" className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">
          What we design for
        </h2>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {PILLARS.map((p) => (
            <article key={p.title} className="rounded-2xl border border-white/10 bg-white/3 p-6">
              <h3 className="text-base font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-zinc-400">{p.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="border-t border-white/10 bg-white/2">
        <div className={`${WRAP} grid gap-10 py-16 lg:grid-cols-2`}>
          <div className="space-y-8">
            {SECTIONS.map((s) => (
              <div key={s.title}>
                <h2 className="text-lg font-semibold text-white">{s.title}</h2>
                <p className="mt-2 text-sm leading-7 text-zinc-400">{s.text}</p>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/4 p-6">
            <h2 className="text-lg font-semibold text-white">Known limitations</h2>
            <p className="mt-2 text-sm text-zinc-400">We would rather tell you where we are not there yet.</p>
            <ul className="mt-5 space-y-4">
              {LIMITS.map((item) => (
                <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-300">
                  <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${WRAP} py-16`}>
        <div className="flex flex-col items-start justify-between gap-6 rounded-3xl border border-white/10 bg-linear-to-br from-orange-500/10 via-transparent to-transparent p-8 md:flex-row md:items-center">
          <div className="max-w-xl">
            <h2 className="text-xl font-semibold">Found a barrier? Tell us.</h2>
            <p className="mt-2 text-sm leading-relaxed text-zinc-400">
              Describe the page, what you were trying to do and the browser or assistive tool you use. If something is hard
              to use, we will look for another way to give you the same information.
            </p>
          </div>
          <Link to={ROUTES.contact} className={`inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}>
            Report an accessibility issue
          </Link>
        </div>
      </section>
    </Shell>
  );
}