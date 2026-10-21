
import logo from "../../../assets/logo.png";
import { Link } from "react-router-dom";
const footerGroups = [
  {
    title: "PLATFORM",
    links: [
      { label: "Home", href: "/" },
      { label: "How It Works", href: "/howItsWork" },
      { label: "Practice Modes", href: "/practiceModePage" },
      { label: "Performance Analytics", href: "/performanceAnalyticsPage" },
    ],
  },
  {
    title: "EXPLORE",
    links: [
      { label: "Market Insights", href: "/marketInsight"},
      { label: "Knowledge Vault", href: "/knowledgeVault" },
      { label: "Early Access", href: "/contact" },
      { label: "Business Partnerships", href: "/businessContact" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "Our Mission", href: "/ourMission" },
      { label: "Contact", href: "/contact" },
    ],
  },
];

function FooterLink({ label, href }) {
  return (
    <a
      href={href}
      className="group inline-flex w-fit items-center gap-2 text-sm text-gray-500 transition-colors duration-200 hover:text-orange-400"
    >
      <span className="h-1 w-1 rounded-full bg-orange-500/0 transition-colors group-hover:bg-orange-400" />
      {label}
    </a>
  );
}

export default function Footer() {
  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[#050505] text-white">
      {/* Subtle brand glow */}
      <div className="pointer-events-none absolute -bottom-40 left-1/4 h-72 w-72 rounded-full bg-orange-500/5 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[1.35fr_2fr] lg:gap-20 lg:py-20">
          {/* Brand */}
          <div className="max-w-sm">
            <a
              href="#home"
              aria-label="ChartWars home"
              className="inline-flex items-center gap-3"
            >
              <img
                src={logo}
                alt="ChartWars logo"
                className="h-12 w-12 rounded-xl object-contain"
              />
              <span className="text-2xl font-bold tracking-tight">
                Chart<span className="text-orange-400">Wars</span>
              </span>
            </a>

            <p className="mt-5 text-sm font-medium tracking-wide text-gray-300">
              Market Learning. Smarter Practice.
            </p>

            <p className="mt-3 max-w-xs text-sm leading-7 text-gray-500">
              Building a smarter way to explore markets, practise strategies
              and develop financial knowledge through technology.
            </p>

            <Link
              to="/faq"
              className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-orange-400 transition hover:text-orange-300"
            >
              Explore ChartWars
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          {/* Navigation */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-8">
            {footerGroups.map((group) => (
              <div key={group.title}>
                <h3 className="text-[10px] font-bold tracking-[0.2em] text-gray-300">
                  {group.title}
                </h3>

                <ul className="mt-5 space-y-4">
                  {group.links.map((link) => (
                    <li key={link.label}>
                      <FooterLink {...link} />
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Brand statement */}
        <div className="border-t border-white/8 py-8 sm:py-10">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-gray-600">
                The future of market learning
              </p>

              <p className="mt-2 text-4xl font-black tracking-[-0.06em] sm:text-6xl lg:text-7xl">
                Chart<span className="text-orange-400">Wars</span>
                <span className="ml-1 text-orange-400">.</span>
              </p>
            </div>

            <p className="max-w-xs text-sm leading-6 text-gray-500 sm:text-right">
              Learn the market.
              <br />
              Practice with purpose.
              <br />
              Grow with confidence.
            </p>
          </div>
        </div>

        
   {/* Help & Support Row */}
   <div className="border-t border-white/8 py-7 sm:py-8">
  <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
    <div className="shrink-0">
      <h3 className="text-sm font-semibold text-white">
        Help & Support
      </h3>
      <p className="mt-1 text-xs text-gray-500">
        Need help? We're here to help you.
      </p>
    </div>

    <nav
      aria-label="Help and legal links"
      className="flex flex-wrap gap-x-5 gap-y-4 lg:justify-end"
    >
      {[
        { label: "Help Center", href: "/helpCenter" },
        { label: "Contact Us", href: "/contact" },
        { label: "Security", href: "/security" },
        { label: "Privacy Policy", href: "/privacyPolicy" },
        { label: "Cookie Policy", href: "/cookies" },
        { label: "Cookie Settings", href: "/cookieSetting" },
        { label: "Terms of Use", href: "/termsOfUse" },
        { label: "Accessibility", href: "/accessibility" },
      ].map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="text-xs text-gray-500 transition-colors duration-200 hover:text-orange-400"
        >
          {item.label}
        </a>
      ))}
    </nav>
  </div>
</div>


        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-white/8 py-6 text-xs text-gray-600 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} ChartWars. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/privacy"
              className="transition hover:text-gray-300"
            >
              Privacy Policy
            </a>
            <a
              href="/termsOfUse"
              className="transition hover:text-gray-300"
            >
              Terms of Use
            </a>
            <span className="hidden h-3 w-px bg-white/10 sm:block" />
            <span className="text-gray-700">Built for better market learning.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
