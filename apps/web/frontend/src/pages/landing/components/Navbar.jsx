import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowUpRight, Menu } from "lucide-react";
import Container from "../../../components/ui/Container";
import MobileMenu from "./MobileMenu";

const links = [
  { label: "Modes", href: "#modes" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Learn", href: "#learn" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[#202a33] bg-[#07090c]/95 backdrop-blur-xl">
      <Container>
        <div className="relative flex cw-navbar items-center justify-between gap-5">
          <Link
            to="/"
            aria-label="ChartWars home"
            className="flex shrink-0 items-center gap-3"
          >
            <span className="flex h-8 w-8 items-center justify-center border border-[#00e887]/40 bg-[#00e887]/10 text-lg font-black text-[#00e887]">
              C
            </span>

            <span className="text-sm font-extrabold tracking-[0.15em] text-white sm:text-base">
              CHARTWARS
            </span>
          </Link>

          <nav className="hidden items-center gap-7 md:flex">
            {links.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="text-sm text-[#8c9bad] transition hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="hidden items-center gap-5 md:flex">
            <Link
              to="/login"
              className="text-sm font-medium text-[#c3cfda] hover:text-white"
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="inline-flex min-h-10 items-center gap-2 bg-[#00e887] px-4 text-sm font-bold text-[#04110b] transition hover:bg-[#5bf5b0]"
            >
              Start practising <ArrowUpRight size={16} />
            </Link>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className="flex h-10 w-10 items-center justify-center border border-[#26313b] text-white md:hidden"
          >
            <Menu size={20} />
          </button>

          {menuOpen && (
            <MobileMenu onClose={() => setMenuOpen(false)} />
          )}
        </div>
      </Container>
    </header>
  );
}