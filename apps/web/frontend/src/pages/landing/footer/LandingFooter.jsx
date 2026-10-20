import { ArrowUpRight } from "lucide-react";
import Container from "../../../components/ui/Container";
import FooterColumn from "./FooterColumn";
import FooterLegal from "./FooterLegal";
import BrandSignature from "./BrandSignature";
import EducationalDisclaimer from "./EducationalDisclaimer";

const columns = [
  {
    title: "Product",
    links: [
      { label: "Practice modes", href: "#modes" },
      { label: "How it works", href: "#how-it-works" },
      { label: "Performance", href: "#performance" },
      { label: "Learn & news", href: "#learn" },
    ],
  },
  {
    title: "Explore",
    links: [
      { label: "Markets", href: "/markets" },
      { label: "Friend rooms", href: "/rooms" },
      { label: "Learn", href: "/learn" },
      { label: "Frequently asked questions", href: "#faq" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About ChartWars", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "GitHub", href: "https://github.com/" },
    ],
  },
];

export default function LandingFooter() {
  return (
    <>
      <footer className="border-t border-[#202a33] bg-[#07090c]">
        <Container>
          <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.25fr_2fr] lg:gap-16 lg:py-16">
            <div>
              <a href="/" className="inline-flex items-center gap-3">
                <span className="flex h-9 w-9 items-center justify-center border border-[#00e887]/40 bg-[#00e887]/10 font-black text-[#00e887]">
                  C
                </span>

                <span className="text-sm font-extrabold tracking-[0.15em] text-white">
                  CHARTWARS
                </span>
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-[#8c9bad]">
                A place to practise market decisions, explore trading
                strategies, and build better risk awareness — without real
                capital at risk.
              </p>

              <a
                href="#modes"
                className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[#00e887]"
              >
                Explore the platform <ArrowUpRight size={16} />
              </a>
            </div>

            <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
              {columns.map((column) => (
                <FooterColumn key={column.title} {...column} />
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-4 border-t border-[#202a33] py-5 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-[#718194]">
              Built for learning, discipline, and better decisions.
            </p>

            <FooterLegal />
          </div>
        </Container>
      </footer>

      <BrandSignature />
      <EducationalDisclaimer />
    </>
  );
}