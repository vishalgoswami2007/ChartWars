
import { Link } from "react-router-dom";
import Footer from "./Footer";
import logo from "../../../assets/logo.png";

const ROUTES = {
  home: "/",
  help: "/help",
  contact: "/contact",
  privacy: "/privacy",
  cookies: "/cookies",
  cookieSettings: "/cookieSetting",
  terms: "/terms",
  security: "/security",
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const SECURITY_PRACTICES = [
  {
    number: "01",
    title: "Account Protection",
    text: "ChartWars is designed to protect accounts through secure authentication, password hashing and controlled access. Passwords should never be stored as plain text.",
  },
  {
    number: "02",
    title: "Secure Sessions",
    text: "Authentication sessions should use appropriately configured cookies, secure token handling, expiration and logout controls. Session protections depend on the authentication features implemented in the application.",
  },
  {
    number: "03",
    title: "Data Privacy",
    text: "We aim to collect only the information needed to operate and improve ChartWars. Access to personal information should be limited to authorized purposes.",
  },
  {
    number: "04",
    title: "API Security",
    text: "The backend should validate incoming data, enforce authentication and authorization, apply rate limits where appropriate, and return safe error messages.",
  },
  {
    number: "05",
    title: "Room Permissions",
    text: "Multiplayer rooms require server-side permission checks for actions such as drawing, placing practice orders, inviting members and removing participants. Hiding a button in the interface is not sufficient security.",
  },
  {
    number: "06",
    title: "Practice Data Integrity",
    text: "Replay and Blind Round features are designed to prevent future candles or hidden player positions from being exposed before the appropriate time. These protections must be enforced and tested on the server.",
  },
];

const USER_TIPS = [
  "Use a strong, unique password for your ChartWars account.",
  "Never share passwords, login codes or authentication tokens.",
  "Sign out on shared or public devices.",
  "Keep your browser and operating system updated.",
  "Be careful with links or messages requesting your account details.",
  "Report suspicious activity or unexpected account access.",
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

      <main className="relative">{children}</main>

      <Footer />
    </div>
  );
}

function SecurityCard({ number, title, text }) {
  return (
    <article className="rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-orange-500/40 sm:p-8">
      <span className="font-mono text-xs text-orange-500">{number}</span>

      <h3 className="mt-3 text-lg font-semibold">{title}</h3>

      <p className="mt-3 text-sm leading-7 text-zinc-400">{text}</p>
    </article>
  );
}

export default function Security() {
  return (
    <Shell>
      <section className={`${WRAP} pb-14 pt-16 sm:pt-24`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          Trust & Safety
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Security at <span className="text-orange-500">ChartWars.</span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">
          Your account, your practice sessions and your multiplayer experience
          deserve careful protection. We design ChartWars with security in
          mind and work to identify and fix vulnerabilities as the platform
          evolves.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.privacy}
            className={`inline-flex h-11 items-center rounded-full border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}
          >
            Privacy Policy
          </Link>

          <Link
            to={ROUTES.contact}
            className={`inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}
          >
            Contact Us
          </Link>
        </div>
      </section>

      <section className={`${WRAP} pb-20`} aria-labelledby="approach">
        <h2
          id="approach"
          className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500"
        >
          Our Security Approach
        </h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          {SECURITY_PRACTICES.map((item) => (
            <SecurityCard key={item.number} {...item} />
          ))}
        </div>
      </section>

      <section
        className="border-t border-white/10 bg-white/2"
        aria-labelledby="your-account"
      >
        <div className={`${WRAP} py-20`}>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-orange-500">
            Stay protected
          </p>

          <h2
            id="your-account"
            className="mt-4 max-w-2xl text-3xl font-semibold tracking-tight"
          >
            Help keep your account secure
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Security is a shared responsibility. These simple steps can help
            reduce the risk of unauthorized access to your account.
          </p>

          <div className="mt-8 rounded-2xl border border-white/10 bg-black/40 p-6 sm:p-8">
            <ul className="space-y-5">
              {USER_TIPS.map((tip) => (
                <li key={tip} className="flex gap-3 text-sm leading-relaxed text-zinc-300">
                  <svg
                    viewBox="0 0 20 20"
                    className="mt-0.5 h-5 w-5 shrink-0 text-orange-500"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    aria-hidden="true"
                  >
                    <path
                      d="M4 10.5l4 4 8-9"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>

                  <span>{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className={`${WRAP} py-20`}>
        <div className="rounded-3xl border border-orange-500/30 bg-linear-to-br from-orange-500/10 via-transparent to-transparent p-8 sm:p-12">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Found a security issue?
          </h2>

          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-zinc-400">
            If you discover a possible vulnerability or suspicious activity
            involving ChartWars, please contact us with a clear description
            of the issue. Do not include passwords, private keys or active
            authentication tokens in your report.
          </p>

          <Link
            to={ROUTES.contact}
            className={`mt-6 inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}
          >
            Report an Issue
          </Link>
        </div>

        <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-zinc-500">
          <Link
            to={ROUTES.privacy}
            className={`transition hover:text-orange-400 ${FOCUS}`}
          >
            Privacy Policy
          </Link>

          <Link
            to={ROUTES.cookies}
            className={`transition hover:text-orange-400 ${FOCUS}`}
          >
            Cookie Policy
          </Link>

          <Link
            to={ROUTES.help}
            className={`transition hover:text-orange-400 ${FOCUS}`}
          >
            Help Center
          </Link>
        </div>
      </section>
    </Shell>
  );
}
