
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
    id: "overview",
    title: "Overview",
    paras: [
      "This policy explains what personal information ChartWars collects, why we collect it and the choices you have. ChartWars is a practice platform that uses virtual funds only. We do not handle real money and we do not sell your personal information.",
      "[LEGAL_ENTITY_NAME] operates ChartWars and is responsible for your personal information.",
    ],
  },
  {
    id: "collect",
    title: "Information we collect",
    list: [
      "Account details: your name or username, email address and sign-in method (for example email or Google).",
      "Profile details you choose to add, such as a photo, a bio and your user ID.",
      "Practice activity: sessions you play, orders placed with virtual funds, results and the discipline reports generated from them.",
      "Social activity: friend requests, friend lists, room membership, room permissions and messages between friends.",
      "Messages you send us through the Contact page.",
      "Technical data: IP address, browser and device type, language, approximate location from IP and error logs, used to keep the service secure and working.",
      "Cookies and similar technologies, described under Cookie Settings.",
    ],
  },
  {
    id: "use",
    title: "How we use your information",
    list: [
      "To provide the service: create your account, run sessions and rooms, and show your history and reports.",
      "To keep ChartWars secure and prevent abuse, cheating and fraud.",
      "To reply to your messages and give support.",
      "To understand how features are used and improve them, using analytics only if you allow it.",
      "To meet legal obligations.",
    ],
  },
  {
    id: "legal",
    title: "Consent and applicable law",
    paras: [
      "We process your information to provide the service you asked for, with your consent where required, and to meet our legal duties. We aim to handle personal data in line with applicable law, including India's Digital Personal Data Protection Act, 2023, where it applies. You can withdraw your consent at any time, as described below.",
    ],
  },
  {
    id: "sharing",
    title: "Who we share it with",
    paras: [
      "We do not sell your personal information. We share it only with service providers who help us run ChartWars, and only as needed for that purpose:",
    ],
    list: [
      "Hosting, database and email delivery providers.",
      "Sign-in providers, such as Google, if you choose them.",
      "A real-time communications provider that carries voice and video in Friend Rooms.",
      "An analytics provider, only if analytics is switched on and you have allowed it.",
      "Authorities or advisers, where the law requires it or to protect our rights.",
    ],
  },
  {
    id: "voice",
    title: "Voice and video",
    paras: [
      "Voice and video in Friend Rooms pass through our communications provider in real time. ChartWars does not record calls. Please do not record other participants without their consent. Members can report or block anyone who breaks these rules.",
    ],
  },
  {
    id: "retention",
    title: "How long we keep it",
    paras: [
      "We keep account data while your account is active. After you delete your account we delete or anonymise your data within [RETENTION_PERIOD], unless the law requires us to keep some of it longer. Messages sent through the Contact page are kept for [CONTACT_RETENTION_PERIOD].",
    ],
  },
  {
    id: "rights",
    title: "Your choices and rights",
    list: [
      "Access the personal information we hold about you.",
      "Correct information that is wrong or out of date.",
      "Ask us to delete your account and data.",
      "Withdraw consent, including for optional cookies, at any time.",
      "Make a complaint or raise a grievance with us.",
    ],
    paras: ["To make a request, use the Contact page and choose Privacy request. We aim to respond within [RESPONSE_TIME]."],
  },
  {
    id: "children",
    title: "Children",
    paras: [
      "ChartWars is intended for people aged [MINIMUM_AGE] and over. If you are under the age of majority where you live, use it only with the permission of a parent or guardian. We do not knowingly collect personal information from children below [MINIMUM_AGE].",
    ],
  },
  {
    id: "security",
    title: "Security",
    paras: [
      "We use measures such as hashed passwords, secure cookies, access controls and encrypted connections. No system is perfectly secure, so please use a strong, unique password and tell us straight away if you suspect a problem.",
    ],
  },
  {
    id: "transfers",
    title: "Where your data is processed",
    paras: [
      "Our providers may process data in countries outside your own. Where that happens we take steps to protect it as required by applicable law.",
    ],
  },
  {
    id: "changes",
    title: "Changes to this policy",
    paras: ["We may update this policy as ChartWars grows. When we make important changes we will tell you in the product or by email, and update the date at the top."],
  },
  {
    id: "contact",
    title: "Contact us",
    paras: ["Questions about this policy or your data? Reach us through the Contact page. Registered address: [REGISTERED_ADDRESS]."],
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


export default function PrivacyPolicy() {
  return (
    <Shell>
      <section className={`${WRAP} pb-10 pt-16 sm:pt-20`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Legal</p>
        <h1 className="mt-5 text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">Privacy Policy</h1>
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
          <div className="rounded-2xl border border-white/10 bg-white/3 p-6 text-sm text-zinc-400">
            Manage optional cookies in{" "}
            <Link to={ROUTES.cookies} className="text-orange-400 underline-offset-4 hover:underline">
              Cookie Settings
            </Link>{" "}
            or write to us through the{" "}
            <Link to={ROUTES.contact} className="text-orange-400 underline-offset-4 hover:underline">
              Contact page
            </Link>
            .
          </div>
        </article>
      </div>
    </Shell>
  );
}