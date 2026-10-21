import {  useState } from "react";
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

// Other code (analytics, preferences) should read this key before it runs anything optional.
const STORAGE_KEY = "chartwars.cookie-consent.v1";

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

// Edit these rows so they match what your app really sets.
const CATEGORIES = [
  {
    id: "necessary",
    title: "Strictly necessary",
    locked: true,
    text: "Needed to sign in and keep the service secure. These cannot be switched off.",
    items: [
      { name: "Sign-in session", purpose: "Keeps you signed in securely.", duration: "Session" },
      { name: "Refresh token", purpose: "Renews your session without asking you to sign in again.", duration: "[REFRESH_DURATION]" },
      { name: "Security token", purpose: "Protects forms and requests from forgery.", duration: "Session" },
      { name: "Your cookie choice", purpose: "Remembers the choices you make on this page.", duration: "[CHOICE_DURATION]" },
    ],
  },
  {
    id: "preferences",
    title: "Preferences",
    locked: false,
    text: "Remember your choices, such as chart timeframe and layout, so you do not set them again.",
    items: [{ name: "Interface choices", purpose: "Stores timeframe, layout and similar settings.", duration: "[PREFERENCE_DURATION]" }],
  },
  {
    id: "analytics",
    title: "Analytics",
    locked: false,
    text: "Off by default. Used only if analytics is switched on in the product, to count visits and see which features people use.",
    items: [{ name: "Anonymous usage statistics", purpose: "Helps us understand and improve ChartWars.", duration: "[ANALYTICS_DURATION]" }],
  },
];



function writeConsent(choice) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...choice, savedAt: new Date().toISOString() }));
    return true;
  } catch {
    return false;
  }
}

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


function Switch({ checked, locked, label, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      disabled={locked}
      onClick={onChange}
      className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition ${FOCUS} ${
        checked ? "bg-orange-500" : "bg-zinc-700"
      } ${locked ? "cursor-not-allowed opacity-60" : "cursor-pointer"}`}
    >
      <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? "translate-x-5.5" : "translate-x-0.5"}`} />
    </button>
  );
}

export default function CookieSettings() {
  const [choice, setChoice] = useState({ preferences: false, analytics: false });
  const [message, setMessage] = useState("");



  const commit = (next, text) => {
    setChoice(next);
    setMessage(writeConsent(next) ? text : "We could not save your choice. Please check that your browser allows site storage.");
  };

  const toggle = (id) => {
    setMessage("");
    setChoice((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Shell>
      <section className={`${WRAP} pb-10 pt-16 sm:pt-20`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Legal</p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">Cookie Settings</h1>
        <p className="mt-5 max-w-2xl text-base leading-relaxed text-zinc-400">
          Choose which optional cookies ChartWars can use. Necessary cookies are always on. You can change your mind at any
          time. Read more in our{" "}
          <Link to={ROUTES.privacy} className="text-orange-400 underline-offset-4 hover:underline">
            Privacy Policy
          </Link>
          .
        </p>
      </section>

      <section className={`${WRAP} max-w-4xl pb-24`}>
        <div className="space-y-4">
          {CATEGORIES.map((cat) => {
            const checked = cat.locked ? true : choice[cat.id];
            return (
              <article key={cat.id} className="rounded-2xl border border-white/10 bg-white/3 p-6">
                <div className="flex items-start justify-between gap-6">
                  <div>
                    <h2 className="text-base font-semibold text-white">
                      {cat.title}
                      {cat.locked && <span className="ml-3 rounded-full border border-orange-500/40 px-2 py-0.5 text-[11px] font-medium text-orange-400">Always on</span>}
                    </h2>
                    <p className="mt-2 max-w-xl text-sm leading-relaxed text-zinc-400">{cat.text}</p>
                  </div>
                  <Switch checked={checked} locked={cat.locked} label={`${cat.title} cookies`} onChange={() => toggle(cat.id)} />
                </div>
                <div className="mt-5 overflow-x-auto">
                  <table className="w-full min-w-120 text-left text-sm">
                    <thead>
                      <tr className="text-[11px] uppercase tracking-[0.18em] text-zinc-500">
                        <th scope="col" className="pb-2 pr-4 font-medium">Name</th>
                        <th scope="col" className="pb-2 pr-4 font-medium">Purpose</th>
                        <th scope="col" className="pb-2 font-medium">Duration</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5 text-zinc-400">
                      {cat.items.map((it) => (
                        <tr key={it.name}>
                          <td className="py-3 pr-4 text-zinc-200">{it.name}</td>
                          <td className="py-3 pr-4">{it.purpose}</td>
                          <td className="py-3 font-mono text-xs">{it.duration}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </article>
            );
          })}
        </div>

        <div className="mt-8 flex flex-wrap items-center gap-3">
          <button type="button" onClick={() => commit({ preferences: true, analytics: true }, "All cookies accepted.")} className={`h-11 rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}>
            Accept all
          </button>
          <button type="button" onClick={() => commit({ preferences: false, analytics: false }, "Optional cookies rejected.")} className={`h-11 rounded-full border border-white/15 px-6 text-sm text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}>
            Reject optional
          </button>
          <button type="button" onClick={() => commit(choice, "Your choices have been saved.")} className={`h-11 rounded-full border border-white/15 px-6 text-sm text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}>
            Save my choices
          </button>
          <button
            type="button"
            onClick={() => commit({ preferences: false, analytics: false }, "Consent withdrawn. Optional cookies are off.")}
            className={`h-11 rounded-full px-4 text-sm text-zinc-400 underline-offset-4 transition hover:text-white hover:underline ${FOCUS}`}
          >
            Withdraw consent
          </button>
        </div>
        <p role="status" aria-live="polite" className="mt-4 min-h-5 text-sm text-orange-400">
          {message}
        </p>
      </section>
    </Shell>
  );
}