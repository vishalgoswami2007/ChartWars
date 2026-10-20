const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
  { label: "Cookie Policy", href: "/cookies" },
  { label: "Disclaimer", href: "/disclaimer" },
];

export default function FooterLegal() {
  return (
    <nav aria-label="Legal links" className="flex flex-wrap gap-x-5 gap-y-3">
      {legalLinks.map((link) => (
        <a
          key={link.label}
          href={link.href}
          className="text-xs text-[#8193a5] transition hover:text-white"
        >
          {link.label}
        </a>
      ))}
    </nav>
  );
}