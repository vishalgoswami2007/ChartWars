import { ArrowLeft } from "lucide-react";

import "../coach.css";

export function Panel({ title, right, children, className = "" }) {
  return (
    <section className={`cc-panel p-3 ${className}`}>
      {title && (
        <h2 className="mb-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          <span>{title}</span>
          {right}
        </h2>
      )}
      {children}
    </section>
  );
}

export function Meter({ label, value, max, color = "bg-orange-400", text }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, (value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-200">{text ?? value}</span>
      </div>
      <div className="mt-1 h-1.5 bg-white/8">
        <div className={`cc-bar h-full ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export const btnPrimary =
  "border border-orange-400 bg-orange-500 font-mono font-bold uppercase text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40";

// eslint-disable-next-line react-refresh/only-export-components
export const btnGhost =
  "border border-white/15 font-mono uppercase text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-40";

// eslint-disable-next-line react-refresh/only-export-components
export const chip = (active) =>
  `border px-2.5 py-1.5 font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
    active ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-400 hover:text-white"
  }`;

/** Fullscreen page frame with a header, so the dashboard sidebar is hidden. */
export function CoachShell({ title, backLabel = "Back", onBack, children }) {
  return (
    <main className="cc-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          {backLabel}
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Rooms <span className="text-orange-500">/</span> {title}
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">Virtual practice only</span>
      </header>
      {children}
      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-2 text-center font-mono text-[10px] text-zinc-600">
        Sample markets, rule-based coach bot. Virtual funds only. Educational. Not investment advice.
      </footer>
    </main>
  );
}