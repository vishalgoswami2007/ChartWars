
import { useState } from "react";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const navigation = [
  { label: "Home", href: "#home" },
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Learn", href: "#learn" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="relative z-50 w-full border-b border-white/10 bg-transparent">
      <nav
        aria-label="Main navigation"
        className="mx-auto flex min-h-18 w-full max-w-screen-2xl items-center justify-between gap-6 px-5 sm:px-8 lg:px-12"
      >
        {/* Logo: apna logo yahan add karna */}
        <Link
          to="/"
          aria-label="ChartWars home"
          onClick={closeMenu}
          className="flex shrink-0 items-center gap-3"
        >
          {/* Replace this placeholder with your logo image */}
          <img
           src={logo}
           alt="ChartWars logo"
           className="h-10 w-10 shrink-0 object-contain"
          />

          <span className="text-base font-bold tracking-[0.2em] text-white sm:text-lg">
            CHARTWARS
          </span>
        </Link>

        {/* Desktop navigation */}
        <div className="hidden items-center gap-1 md:flex">
          {navigation.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                item.label === "Home"
                  ? "bg-white/10 text-white"
                  : "text-white/65 hover:bg-white/5 hover:text-white"
              }`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Desktop actions */}
        <div className="hidden shrink-0 items-center gap-5 md:flex">
          <Link
            to="/login"
            className="text-sm font-medium text-white/80 transition-colors hover:text-white"
          >
            Log in
          </Link>

          <Link
            to="/signup"
            className="group inline-flex items-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
          >
            Get started
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          type="button"
          aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
          className="flex size-10 items-center justify-center rounded-full border border-white/15 bg-black/30 text-white transition-colors hover:border-orange-500/50 md:hidden"
        >
          {menuOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {/* Mobile navigation */}
      {menuOpen && (
        <div className="absolute inset-x-0 top-full border-b border-white/10 bg-[#090909]/95 px-5 py-5 shadow-2xl backdrop-blur-xl md:hidden">
          <div className="mx-auto flex max-w-screen-2xl flex-col gap-1">
            {navigation.map((item) => (
              <a
                key={item.label}
                href={item.href}
                onClick={closeMenu}
                className="rounded-lg px-4 py-3 text-sm text-white/75 transition-colors hover:bg-white/5 hover:text-white"
              >
                {item.label}
              </a>
            ))}

            <div className="my-3 border-t border-white/10" />

            <Link
              to="/login"
              onClick={closeMenu}
              className="rounded-lg px-4 py-3 text-sm text-white/80 hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              onClick={closeMenu}
              className="mt-1 flex items-center justify-center gap-2 rounded-full bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-400"
            >
              Get started
              <ArrowUpRight size={16} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
