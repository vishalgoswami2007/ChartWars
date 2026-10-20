
import { useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Building2,
  ChevronDown,
  Code2,
  GraduationCap,
  LayoutDashboard,
  Menu,
  Sparkles,
  Target,
  TrendingUp,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const navigation = [
  {
    label: "Platform",
    description: "Your market learning workspace",
    icon: LayoutDashboard,
    featured: {
      eyebrow: "THE CHARTWARS PLATFORM",
      title: "Practice. Analyze. Improve.",
      description:
        "Explore tools designed to help you build market knowledge and practice with purpose.",
      href: "#features",
      action: "Explore platform",
    },
    links: [
      {
        title: "Practice Modes",
        description: "Explore different ways to practice",
        href: "/practice-modes",
        icon: Target,
      },
      {
        title: "Performance Analytics",
        description: "Review your progress",
        href: "/performance-analytics",
        icon: BarChart3,
      },
      {
        title: "How It Works",
        description: "Get to know the platform",
        href: "/howItsWorkPage",
        icon: Sparkles,
      },
    ],
  },
  {
    label: "Learn",
    description: "Build your market knowledge",
    icon: GraduationCap,
    featured: {
      eyebrow: "LEARN AT YOUR PACE",
      title: "Knowledge creates confidence.",
      description:
        "Discover educational resources to support your market learning journey.",
      href: "#learn",
      action: "Explore learning",
    },
    links: [
      {
        title: "Market Insights",
        description: "Explore market-related content",
        href: "/marketInsight",
        icon: TrendingUp,
      },
      {
        title: "Knowledge Vault",
        description: "Explore notes and resources",
        href: "/knowledgeVault",
        icon: BookOpen,
      },
      {
        title: "Learning Roadmap",
        description: "Build your knowledge step by step",
        href: "/roadmap",
        icon: ArrowDownRight,
      },
    ],
  },
  {
    label: "Developers",
    description: "Explore technical collaboration",
    icon: Code2,
    featured: {
      eyebrow: "BUILT FOR BUILDERS",
      title: "Let's build what's next.",
      description:
        "Explore potential integrations and discuss developer-focused collaboration with ChartWars.",
      href: "#growth-engine",
      action: "Explore opportunities",
    },
    links: [
      {
        title: "API & Integrations",
        description: "Discuss integration possibilities",
        href:  "/developerSandbox",
        icon: Code2,
      },
      {
        title: "Technical Collaboration",
        description: "Explore a project together",
        href: "#growth-engine",
        icon: Sparkles,
      },
      {
        title: "Business Inquiry",
        description: "Talk to us about your use case",
        href: "#growth-engine",
        icon: ArrowUpRight,
      },
    ],
  },
  {
    label: "For Business",
    description: "Ideas, partnerships and opportunities",
    icon: Building2,
    featured: {
      eyebrow: "CHARTWARS FOR BUSINESS",
      title: "Let's grow together.",
      description:
        "Discuss potential partnerships, market-learning solutions and enterprise opportunities.",
      href: "#growth-engine",
      action: "Explore partnerships",
    },
    links: [
      {
        title: "Enterprise Solutions",
        description: "Discuss your team's needs",
        href: "#growth-engine",
        icon: Building2,
      },
      {
        title: "Strategic Partnerships",
        description: "Explore collaboration opportunities",
        href: "#growth-engine",
        icon: TrendingUp,
      },
      {
        title: "Contact Business Team",
        description: "Share your business inquiry",
        href: "#growth-engine",
        icon: ArrowRight,
      },
    ],
  },
];

function MegaMenu({ item, onNavigate }) {
  const FeaturedIcon = item.icon;

  return (
    <div className="absolute left-1/2 top-full w-[min(900px,calc(100vw-40px))] -translate-x-1/2 pt-4">
      <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0b]/98 shadow-[0_24px_80px_rgba(0,0,0,0.65)] backdrop-blur-2xl">
        <div className="grid md:grid-cols-[0.85fr_1.15fr]">
          <div className="relative overflow-hidden border-b border-white/8 bg-[#11100b] p-7 md:border-b-0 md:border-r">
            <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-yellow-400/9 blur-[70px]" />

            <div className="relative">
              <span className="inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.2em] text-yellow-400">
                <span className="h-1.5 w-1.5 rounded-full bg-yellow-400" />
                {item.featured.eyebrow}
              </span>

              <div className="mt-7 flex h-12 w-12 items-center justify-center rounded-xl border border-yellow-400/20 bg-yellow-400/8 text-yellow-400">
                <FeaturedIcon size={24} strokeWidth={1.6} />
              </div>

              <h3 className="mt-5 max-w-xs text-2xl font-semibold leading-tight tracking-tight text-white">
                {item.featured.title}
              </h3>

              <p className="mt-3 max-w-sm text-sm leading-6 text-gray-400">
                {item.featured.description}
              </p>

              <Link
                to={item.featured.href}
                onClick={onNavigate}
                className="group mt-6 inline-flex items-center gap-2 text-sm font-semibold text-yellow-400 transition hover:text-yellow-300"
              >
                {item.featured.action}
                <ArrowUpRight
                  size={16}
                  className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                />
              </Link>
            </div>
          </div>

          <div className="p-4 sm:p-6">
            <div className="mb-3 flex items-center justify-between px-2">
              <p className="text-[10px] font-bold tracking-[0.2em] text-gray-500">
                EXPLORE {item.label.toUpperCase()}
              </p>
              <span className="text-xs text-gray-600">
                {String(item.links.length).padStart(2, "0")} resources
              </span>
            </div>

            <div className="grid gap-1">
              {item.links.map((link) => {
                const Icon = link.icon;

                return (
                  <a
                    key={link.title}
                    href={link.href}
                    onClick={onNavigate}
                    className="group flex items-start gap-3 rounded-xl border border-transparent p-3 transition duration-200 hover:border-white/8 hover:bg-white/4"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-gray-400 transition group-hover:border-yellow-400/20 group-hover:bg-yellow-400/8 group-hover:text-yellow-400">
                      <Icon size={18} strokeWidth={1.7} />
                    </span>

                    <span className="min-w-0 flex-1 pt-0.5">
                      <span className="block text-sm font-medium text-gray-200 transition group-hover:text-yellow-400">
                        {link.title}
                      </span>
                      <span className="mt-1 block text-xs leading-5 text-gray-500">
                        {link.description}
                      </span>
                    </span>

                    <ArrowUpRight
                      size={15}
                      className="mt-1 shrink-0 text-gray-600 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-yellow-400"
                    />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/8 bg-white/1.5 px-6 py-3">
          <span className="text-xs text-gray-500">
            Explore the ChartWars ecosystem
          </span>
          <a
            href="#growth-engine"
            onClick={onNavigate}
            className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-300 transition hover:text-orange-600"
          >
            Early access <ArrowRight size={13} />
          </a>
        </div>
      </div>
    </div>
  );
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeMenu, setActiveMenu] = useState(null);
  const [mobileExpanded, setMobileExpanded] = useState(null);

  const closeMenu = () => {
    setMenuOpen(false);
    setActiveMenu(null);
    setMobileExpanded(null);
  };

  return (
    <header
      className="sticky top-0 z-50 w-full border-b border-white/8 bg-[#070707]/90 backdrop-blur-xl"
      onKeyDown={(event) => {
        if (event.key === "Escape") closeMenu();
      }}
    >
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-18 w-full max-w-screen-2xl items-center justify-between gap-4 px-5 sm:px-8 lg:px-12"
      >
        <Link
          to="/"
          aria-label="ChartWars home"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-2.5"
        >
          <img
            src={logo}
            alt=""
            className="h-9 w-9 shrink-0 object-contain sm:h-10 sm:w-10"
          />

          <span className="text-base font-bold tracking-[0.16em] text-white sm:text-lg">
            CHART<span className="text-yellow-400">WARS</span>
          </span>
        </Link>

        {/* Desktop mega menu navigation */}
        <div className="hidden h-full items-center gap-1 lg:flex">
          <Link
            to="/"
            onClick={closeMenu}
            className="rounded-full px-4 py-2.5 text-sm font-medium text-white/75 transition hover:bg-white/5 hover:text-yellow-400"
          >
            Home
          </Link>

          {navigation.map((item) => {
            const isOpen = activeMenu === item.label;

            return (
              <div
                key={item.label}
                className="relative flex h-18 items-center"
                onMouseEnter={() => setActiveMenu(item.label)}
                onMouseLeave={() => setActiveMenu(null)}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  aria-haspopup="true"
                  onClick={() =>
                    setActiveMenu(isOpen ? null : item.label)
                  }
                  onFocus={() => setActiveMenu(item.label)}
                  className={`relative inline-flex items-center gap-2 rounded-full px-3.5 py-2.5 text-sm font-medium transition duration-200 ${
                    isOpen
                      ? "bg-yellow-400/8 text-yellow-400"
                      : "text-white/70 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  {item.label}
                  <ChevronDown
                    size={14}
                    className={`transition-transform duration-200 ${
                      isOpen ? "rotate-180 text-yellow-400" : ""
                    }`}
                  />
                  <span
                    className={`absolute bottom-0 left-4 right-4 h-px bg-yellow-400 transition-opacity ${
                      isOpen ? "opacity-100" : "opacity-0"
                    }`}
                  />
                </button>

                {isOpen && (
                  <MegaMenu
                    item={item}
                    onNavigate={() => setActiveMenu(null)}
                  />
                )}
              </div>
            );
          })}
        </div>

        {/* Desktop account actions */}
        <div className="hidden shrink-0 items-center gap-4 lg:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-white/70 transition hover:text-yellow-400"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-orange-600 px-5 py-3 text-sm font-bold text-black transition duration-200 hover:bg-orange-300 hover:shadow-[0_0_24px_rgba(250,204,21,0.15)]"
          >
            Get Early Access
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile menu controls */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link
            to="/signup"
            className="hidden rounded-full bg-yellow-400 px-4 py-2.5 text-xs font-bold text-black transition hover:bg-yellow-300 sm:inline-flex"
          >
            Get Early Access
          </Link>

          <button
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="mobile-navigation"
            onClick={() => setMenuOpen((open) => !open)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/3 text-white transition hover:border-yellow-400/40 hover:text-yellow-400"
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile expandable navigation */}
      {menuOpen && (
        <div
          id="mobile-navigation"
          className="max-h-[calc(100dvh-72px)] overflow-y-auto border-t border-white/8 bg-[#080808] px-5 pb-6 pt-4 shadow-2xl lg:hidden sm:px-8"
        >
          <div className="mx-auto flex max-w-screen-2xl flex-col">
            <Link
              to="/"
              onClick={closeMenu}
              className="rounded-xl px-4 py-3.5 text-sm font-medium text-white/80 transition hover:bg-white/4 hover:text-yellow-400"
            >
              Home
            </Link>

            {navigation.map((item) => {
              const Icon = item.icon;
              const isExpanded = mobileExpanded === item.label;

              return (
                <div
                  key={item.label}
                  className="border-t border-white/6"
                >
                  <button
                    type="button"
                    aria-expanded={isExpanded}
                    onClick={() =>
                      setMobileExpanded(isExpanded ? null : item.label)
                    }
                    className={`flex w-full items-center gap-3 rounded-xl px-4 py-4 text-left transition ${
                      isExpanded ? "text-yellow-400" : "text-white/80"
                    }`}
                  >
                    <Icon size={18} />
                    <span className="flex-1 text-sm font-medium">
                      {item.label}
                    </span>
                    <ChevronDown
                      size={16}
                      className={`transition-transform ${
                        isExpanded ? "rotate-180" : ""
                      }`}
                    />
                  </button>

                  {isExpanded && (
                    <div className="mb-3 ml-4 border-l border-yellow-400/25 pl-3">
                      <p className="px-3 pb-3 text-xs leading-5 text-gray-500">
                        {item.description}
                      </p>

                      <a
                        href={item.featured.href}
                        onClick={closeMenu}
                        className="mb-2 flex items-center gap-2 rounded-lg bg-yellow-400/[0.07] px-3 py-3 text-sm font-medium text-yellow-400"
                      >
                        {item.featured.action}
                        <ArrowUpRight size={15} />
                      </a>

                      {item.links.map((link) => {
                        const LinkIcon = link.icon;

                        return (
                          <a
                            key={link.title}
                            href={link.href}
                            onClick={closeMenu}
                            className="flex items-start gap-3 rounded-lg px-3 py-3 transition hover:bg-white/4"
                          >
                            <LinkIcon
                              size={17}
                              className="mt-0.5 shrink-0 text-gray-500"
                            />
                            <span>
                              <span className="block text-sm text-gray-200">
                                {link.title}
                              </span>
                              <span className="mt-1 block text-xs leading-5 text-gray-500">
                                {link.description}
                              </span>
                            </span>
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}

            <div className="mt-4 grid grid-cols-2 gap-3 border-t border-white/8 pt-5">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-white transition hover:border-yellow-400/30 hover:text-yellow-400"
              >
                Log in
              </Link>

              <Link
                to="/signup"
                onClick={closeMenu}
                className="flex items-center justify-center gap-2 rounded-xl bg-yellow-400 px-4 py-3 text-sm font-bold text-black transition hover:bg-yellow-300"
              >
                Get Started <ArrowUpRight size={16} />
              </Link>
            </div>

            <p className="mt-5 text-center text-[10px] tracking-[0.16em] text-gray-600">
              CHART<span className="text-yellow-400">WARS</span> · MARKET LEARNING
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
