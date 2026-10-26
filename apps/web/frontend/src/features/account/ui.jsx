import { useEffect, useState } from "react";

/* Shared look for the account pages. Same theme as Markets and News. */

export const card = "rounded-xl border border-white/8 bg-[#0d0d0d]";
export const inputClass =
  "h-10 w-full rounded-lg border border-white/9 bg-[#080808] px-3 text-sm text-white outline-none placeholder:text-zinc-600 focus:border-[#e87524]/60";
export const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-lg bg-[#e87524] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#f59a55] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#f59a55] disabled:cursor-not-allowed disabled:opacity-50";
export const btnGhost =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#e87524]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60 disabled:cursor-not-allowed disabled:opacity-50";
export const btnDanger =
  "inline-flex items-center justify-center gap-2 rounded-lg border border-red-500/40 px-4 py-2.5 text-xs font-medium text-red-300 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 disabled:cursor-not-allowed disabled:opacity-50";

export function PageShell({ eyebrow, title, description, right, children }) {
  return (
    <main className="mx-auto w-full max-w-300 space-y-6 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e87524]">{eyebrow}</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">{title}</h1>
          {description && <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500 sm:text-sm">{description}</p>}
        </div>
        {right}
      </section>
      {children}
    </main>
  );
}

export function SectionCard({ title, description, children, className = "" }) {
  return (
    <section className={`${card} p-4 sm:p-5 ${className}`}>
      {title && <h2 className="text-sm font-semibold text-white">{title}</h2>}
      {description && <p className="mt-1 text-xs leading-5 text-zinc-500">{description}</p>}
      <div className={title ? "mt-4" : ""}>{children}</div>
    </section>
  );
}

export function Toggle({ checked, onChange, label, description }) {
  return (
    <div className="flex items-start justify-between gap-4 py-3">
      <div className="min-w-0">
        <p className="text-sm font-medium text-zinc-100">{label}</p>
        {description && <p className="mt-0.5 text-xs leading-5 text-zinc-500">{description}</p>}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={`relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/70 ${
          checked ? "bg-[#e87524]" : "bg-zinc-700"
        }`}
      >
        <span className={`absolute top-0.5 size-5 rounded-full bg-white transition-all ${checked ? "left-5.5" : "left-0.5"}`} />
      </button>
    </div>
  );
}

export function EmptyState({ title, text, children }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-white/12 px-6 py-12 text-center">
      <p className="text-sm font-medium text-zinc-200">{title}</p>
      <p className="mt-1 max-w-sm text-xs leading-5 text-zinc-500">{text}</p>
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}

export function ConfirmDialog({ title, body, confirmLabel, danger = false, disabled = false, onConfirm, onCancel, children }) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onCancel]);

  return (
    <div
      className="fixed inset-0 z-80 flex items-center justify-center bg-black/80 p-4"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="confirm-title"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onCancel();
      }}
    >
      <div className={`${card} w-full max-w-sm p-5`}>
        <h2 id="confirm-title" className="text-sm font-semibold text-white">{title}</h2>
        <p className="mt-2 text-xs leading-5 text-zinc-400">{body}</p>
        {children}
        <div className="mt-4 flex justify-end gap-2">
          <button type="button" autoFocus onClick={onCancel} className={btnGhost}>Cancel</button>
          <button type="button" disabled={disabled} onClick={onConfirm} className={danger ? btnDanger : btnPrimary}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

/** Closes a popover on outside click or Escape. `onClose` must be stable (useCallback). */
// eslint-disable-next-line react-refresh/only-export-components
export function useDismiss(ref, open, onClose) {
  useEffect(() => {
    if (!open) return undefined;
    const onDown = (event) => {
      if (!ref.current?.contains(event.target)) onClose();
    };
    const onKey = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [ref, open, onClose]);
}

/** The current time, refreshed every minute, so "5m ago" labels stay correct. */
// eslint-disable-next-line react-refresh/only-export-components
export function useNow(intervalMs = 60000) {
  const [now, setNow] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return now;
}