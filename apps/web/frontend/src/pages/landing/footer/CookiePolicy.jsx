
import { Link } from "react-router-dom";
import Footer from "./Footer";
import logo from "../../../assets/logo.png";

const ROUTES = {
  home: "/",
  help: "/help",
  contact: "/contact",
  privacy: "/privacyPolicy",
  cookies: "/cookies",
  cookieSettings: "/cookieSetting",
  terms: "/terms",
  accessibility: "/accessibility",
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";

const WRAP = "mx-auto w-full max-w-6xl px-5 sm:px-8";

const SECTIONS = [
  {
    title: "1. Introduction",
    text: [
      "This Cookie Policy explains how ChartWars uses cookies and similar technologies when you visit or use our website and practice platform.",
      "Cookies are small text files stored on your device. They can help a website remember your session, maintain security and save your preferences.",
      "ChartWars is a virtual trading practice platform. Cookies do not turn practice activity into real-money trading.",
    ],
  },
  {
    title: "2. Strictly Necessary Cookies",
    text: [
      "These cookies and similar storage mechanisms support essential functions such as authentication, session management and security.",
      "They may be used to keep you signed in, protect requests and maintain the basic operation of the platform.",
      "Strictly necessary technologies cannot be disabled through optional cookie preferences when they are genuinely required to provide a service you request.",
    ],
  },
  {
    title: "3. Preference Cookies",
    text: [
      "Preference cookies can remember choices such as chart timeframe, chart layout and interface settings, so you do not have to set them again.",
      "These technologies are optional and should only be enabled when you choose to allow them, where consent is required.",
    ],
  },
  {
    title: "4. Analytics Cookies",
    text: [
      "If analytics features are implemented and enabled, optional analytics cookies or similar technologies may help us understand visits and feature usage.",
      "This information can help us identify problems and improve ChartWars. Analytics should remain disabled unless you choose to allow it, where consent is required.",
      "We will describe the analytics tools actually in use and their relevant data practices in our privacy information.",
    ],
  },
  {
    title: "5. Third-Party Services",
    text: [
      "Some features, such as Google sign-in or embedded third-party services, may involve technologies controlled by another provider.",
      "Those providers may process information according to their own privacy and cookie policies. Their technologies should only be used as applicable to the features you access and the choices you make.",
      "ChartWars does not claim that every third-party service uses cookies on every visit.",
    ],
  },
  {
    title: "6. Managing Your Cookie Preferences",
    text: [
      "You can use ChartWars Cookie Settings to accept all optional categories, reject optional cookies, or save your individual preferences.",
      "Strictly necessary cookies remain enabled because they support essential platform functions.",
      "You can revisit your preferences and change or withdraw your consent at any time through Cookie Settings, where that feature is available.",
      "You can also manage cookies through your browser settings. Blocking essential cookies may affect sign-in or other platform features.",
    ],
  },
  {
    title: "7. Cookie Duration",
    text: [
      "Session cookies are generally removed when your browser session ends. Persistent cookies remain on your device for a defined period or until you delete them.",
      "The actual duration depends on the cookie or technology used. We aim to identify the applicable durations in our Cookie Settings when those details are available.",
    ],
  },
  {
    title: "8. Changes to This Policy",
    text: [
      "We may update this Cookie Policy when our platform, technologies or legal requirements change.",
      "The updated version will be published on this page with a revised effective date when appropriate.",
    ],
  },
  {
    title: "9. Contact Us",
    text: [
      "If you have questions about this Cookie Policy or how ChartWars uses cookies, please contact our team through the Contact page.",
    ],
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

export default function CookiePolicy() {
  return (
    <Shell>
      <section className={`${WRAP} pb-12 pt-16 sm:pt-24`}>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">
          Legal
        </p>

        <h1 className="mt-5 max-w-4xl text-4xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
          Cookie <span className="text-orange-500">Policy</span>
        </h1>

        <p className="mt-6 max-w-3xl text-lg leading-relaxed text-zinc-400">
          Learn how ChartWars uses cookies to support secure sessions,
          remember your preferences and improve your practice experience.
          You stay in control of optional cookies.
        </p>

        <p className="mt-5 text-sm text-zinc-500">
          Effective date: October 21, 2026
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to={ROUTES.cookieSettings}
            className={`inline-flex h-11 items-center rounded-full bg-orange-500 px-6 text-sm font-semibold text-black transition hover:bg-orange-400 ${FOCUS}`}
          >
            Manage Cookie Settings
          </Link>

          <Link
            to={ROUTES.privacy}
            className={`inline-flex h-11 items-center rounded-full border border-white/15 px-6 text-sm font-medium text-zinc-200 transition hover:border-orange-500/60 ${FOCUS}`}
          >
            Privacy Policy
          </Link>
        </div>
      </section>

      <section className={`${WRAP} pb-20`}>
        <div className="grid gap-4">
          {SECTIONS.map((section) => (
            <article
              key={section.title}
              className="rounded-2xl border border-white/10 bg-white/3 p-6 transition hover:border-orange-500/30 sm:p-8"
            >
              <h2 className="text-lg font-semibold tracking-tight sm:text-xl">
                {section.title}
              </h2>

              <div className="mt-4 space-y-3">
                {section.text.map((paragraph) => (
                  <p
                    key={paragraph}
                    className="text-sm leading-7 text-zinc-400 sm:text-base"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-orange-500/30 bg-orange-500/4 p-6 sm:p-8">
          <h2 className="text-lg font-semibold">
            Your preferences, your choice.
          </h2>

          <p className="mt-3 text-sm leading-relaxed text-zinc-400">
            Review your optional cookie preferences whenever you need to.
            Essential technologies may still be used to keep ChartWars secure
            and working properly.
          </p>

          <Link
            to={ROUTES.cookieSettings}
            className={`mt-5 inline-flex h-11 items-center rounded-full border border-orange-500/50 px-6 text-sm font-medium text-orange-400 transition hover:bg-orange-500/10 ${FOCUS}`}
          >
            Open Cookie Settings
          </Link>
        </div>

        <div className="mt-10 text-sm text-zinc-500">
          Need help?{" "}
          <Link
            to={ROUTES.contact}
            className={`text-orange-400 transition hover:text-orange-300 ${FOCUS}`}
          >
            Contact ChartWars
          </Link>
        </div>
      </section>
    </Shell>
  );
}
