// DRAFT: replace every [PLACEHOLDER] and have a qualified lawyer review this before launch.
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

const LAST_UPDATED = "[LAST_UPDATED_DATE]";

const SECTIONS = [
  {
    id: "acceptance",
    title: "Accepting these terms",
    paras: ["By creating an account or using ChartWars you agree to these Terms of Use. If you do not agree, please do not use the service."],
  },
  {
    id: "service",
    title: "What ChartWars is",
    paras: [
      "ChartWars is an educational practice platform. All balances, orders and results use virtual funds that have no cash value and cannot be withdrawn.",
      "Nothing on ChartWars is investment, financial, legal or tax advice, or an offer or recommendation to buy or sell any asset. Practice results and historical data do not predict future results.",
    ],
  },
  {
    id: "accounts",
    title: "Eligibility and your account",
    list: [
      "You must be at least [MINIMUM_AGE] years old, or have the permission of a parent or guardian if you are under the age of majority where you live.",
      "Give accurate information and keep your sign-in details secure. You are responsible for activity on your account.",
      "One person, one account. Do not create extra accounts to gain an unfair advantage.",
    ],
  },
  {
    id: "use",
    title: "Acceptable use",
    paras: ["When you use ChartWars you agree not to:"],
    list: [
      "Cheat, exploit bugs, or try to see information that is meant to stay hidden, such as other players' positions.",
      "Harass, threaten or abuse other people, in rooms or in messages.",
      "Record, copy or share other people's voice, video or messages without their consent.",
      "Attack, overload or try to break into the service, or scrape it automatically.",
      "Use ChartWars to promote real-money trading, gambling or scams.",
    ],
  },
  {
    id: "rooms",
    title: "Friend Rooms, voice and video",
    paras: [
      "Hosts control who joins and what members can do. Members can leave, report or block others at any time. A microphone is required to take part in a room, and a camera is optional. We may remove people or rooms that break these terms.",
    ],
  },
  {
    id: "data",
    title: "Market data and third-party services",
    paras: [
      "Charts are powered by TradingView Lightweight Charts. Market data comes from third-party sources and may be delayed, incomplete or unavailable.",
      "Practice results can differ from real markets because they leave out real-world factors such as fees, slippage and liquidity.",
    ],
  },
  {
    id: "content",
    title: "Your content",
    paras: [
      "You keep ownership of what you create, such as your profile and messages. You give ChartWars permission to store and show it as needed to run the service. Do not post anything unlawful, hateful or that infringes someone else's rights.",
    ],
  },
  {
    id: "rights",
    title: "Our rights",
    paras: ["ChartWars, its design, code and branding belong to [LEGAL_ENTITY_NAME] or its licensors. These terms do not give you any right to use them beyond using the service as intended."],
  },
  {
    id: "early",
    title: "Early access and changes",
    paras: ["ChartWars is in early access. Features may change, be limited or be removed, and the service may be interrupted or unavailable at times."],
  },
  {
    id: "suspension",
    title: "Suspension and ending your account",
    paras: ["You can stop using ChartWars and ask us to delete your account at any time. We may suspend or end accounts that break these terms or put others at risk."],
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    paras: ["ChartWars is provided as is and as available. To the extent the law allows, we do not promise that it will be uninterrupted, error-free or suitable for your particular purpose."],
  },
  {
    id: "liability",
    title: "Limits on our liability",
    paras: ["To the extent the law allows, [LEGAL_ENTITY_NAME] is not liable for indirect or consequential losses, or for any decision you make based on practice results. Nothing in these terms limits liability that cannot be limited by law."],
  },
  {
    id: "law",
    title: "Governing law",
    paras: ["These terms are governed by the laws of [JURISDICTION]. Courts in [CITY] have jurisdiction, subject to any rights you have under mandatory law."],
  },
  {
    id: "changes",
    title: "Changes to these terms",
    paras: ["We may update these terms as ChartWars grows. When the changes are important we will tell you in the product or by email. Continuing to use ChartWars after a change means you accept it."],
  },
  {
    id: "contact",
    title: "Contact",
    paras: ["Questions about these terms? Reach us through the Contact page."],
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


export default function TermsOfUse() {
  return (
    <Shell>
      <section className={`${WRAP} pb-10 pt-16 sm:pt-20`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Legal</p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">Terms of Use</h1>
        <p className="mt-4 text-sm text-zinc-500">Last updated: {LAST_UPDATED}</p>
      </section>

      <div className={`${WRAP} grid gap-12 pb-24 lg:grid-cols-[240px_1fr]`}>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav aria-label="On this page" className="rounded-2xl border border-white/10 bg-white/3 p-5">
            <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.25em] text-zinc-500">On this page</p>
            <ol className="space-y-2 text-sm">
              {SECTIONS.map((s, i) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} className={`flex gap-2 rounded text-zinc-400 transition hover:text-orange-400 ${FOCUS}`}>
                    <span className="font-mono text-xs text-zinc-600">{String(i + 1).padStart(2, "0")}</span>
                    {s.title}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        </aside>

        <article className="max-w-3xl space-y-12">
          <div className="rounded-2xl border border-orange-500/30 bg-orange-500/5 p-5 text-sm leading-relaxed text-zinc-200">
            ChartWars uses virtual funds only. It is educational and is not investment advice.
          </div>
          {SECTIONS.map((s, i) => (
            <section key={s.id} id={s.id} className="scroll-mt-24">
              <h2 className="flex items-baseline gap-3 text-xl font-semibold text-white">
                <span className="font-mono text-sm text-orange-500">{String(i + 1).padStart(2, "0")}</span>
                {s.title}
              </h2>
              {s.paras?.map((p) => (
                <p key={p} className="mt-4 text-sm leading-7 text-zinc-400">
                  {p}
                </p>
              ))}
              {s.list && (
                <ul className="mt-4 space-y-3">
                  {s.list.map((item) => (
                    <li key={item} className="flex gap-3 text-sm leading-7 text-zinc-400">
                      <span aria-hidden="true" className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-orange-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              )}
            </section>
          ))}
          <p className="text-sm text-zinc-500">
            See also our{" "}
            <Link to={ROUTES.privacy} className="text-orange-400 underline-offset-4 hover:underline">
              Privacy Policy
            </Link>{" "}
            and{" "}
            <Link to={ROUTES.cookies} className="text-orange-400 underline-offset-4 hover:underline">
              Cookie Settings
            </Link>
            .
          </p>
        </article>
      </div>
    </Shell>
  );
}