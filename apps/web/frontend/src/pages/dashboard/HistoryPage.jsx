import { useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { HISTORY_DAYS, MODE_LABEL, RESULT_LABEL, clearHistory, dayLabel, formatPnl, pnlTone, useAccount } from "../../features/account/accountStore";
import { ConfirmDialog, EmptyState, PageShell, btnDanger, btnPrimary, card, useNow } from "../../features/account/ui";

const FILTERS = [{ id: "all", label: "All modes" }, ...Object.entries(MODE_LABEL).map(([id, label]) => ({ id, label }))];
const GOOD = new Set(["win", "pass"]);
const BAD = new Set(["loss", "fail"]);

function Summary({ label, value, className = "text-white" }) {
  return (
    <div className={`${card} p-3`}>
      <p className="text-[10px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`mt-1.5 text-xl font-semibold tabular-nums ${className}`}>{value}</p>
    </div>
  );
}

export default function HistoryPage() {
  const { history } = useAccount();
  const now = useNow();
  const [filter, setFilter] = useState("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const rows = useMemo(() => history.filter((h) => filter === "all" || h.mode === filter), [history, filter]);

  const summary = useMemo(() => {
    const withPnl = rows.filter((r) => r.pnl !== null);
    return {
      count: rows.length,
      good: rows.filter((r) => GOOD.has(r.result)).length,
      net: withPnl.reduce((sum, r) => sum + r.pnl, 0),
      best: withPnl.length ? Math.max(...withPnl.map((r) => r.pnl)) : null,
    };
  }, [rows]);

  const groups = useMemo(() => {
    const map = new Map();
    for (const row of rows) {
      const key = dayLabel(row.at, now);
      map.set(key, [...(map.get(key) ?? []), row]);
    }
    return [...map.entries()];
  }, [rows, now]);

  const chip = (active) =>
    `rounded-full border px-3.5 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60 ${
      active ? "border-[#e87524] bg-[#e87524] font-semibold text-black" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
    }`;

  return (
    <PageShell
      eyebrow="Your account"
      title="Match history"
      description={`Results from every mode for the last ${HISTORY_DAYS} days. Older matches are removed automatically. Your lifetime totals stay on your profile.`}
      right={
        history.length > 0 && (
          <button type="button" onClick={() => setConfirmClear(true)} className={btnDanger}>Clear history</button>
        )
      }
    >
      <div role="group" aria-label="Filter by mode" className="flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button key={f.id} type="button" aria-pressed={filter === f.id} onClick={() => setFilter(f.id)} className={chip(filter === f.id)}>{f.label}</button>
        ))}
      </div>

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        <Summary label="Results" value={summary.count} />
        <Summary label="Wins or passes" value={summary.good} />
        <Summary label="Net P&L" value={formatPnl(summary.net)} className={pnlTone(summary.net)} />
        <Summary label="Best result" value={summary.best === null ? "—" : formatPnl(summary.best)} className={summary.best === null ? "text-zinc-500" : pnlTone(summary.best)} />
      </div>

      {rows.length === 0 ? (
        <EmptyState
          title={history.length === 0 ? "No matches in the last 10 days" : "Nothing in this mode yet"}
          text={history.length === 0 ? "Play a match in any room and the result will be saved here." : "Pick another mode, or play one to see it here."}
        >
          <Link to="/dashboard/rooms" className={btnPrimary}>Go to rooms</Link>
        </EmptyState>
      ) : (
        <div className="space-y-5">
          {groups.map(([day, items]) => (
            <section key={day} aria-label={day}>
              <h2 className="mb-2 text-[11px] font-semibold uppercase tracking-[0.2em] text-zinc-500">{day}</h2>
              <ul className={`${card} divide-y divide-white/6`}>
                {items.map((m) => (
                  <li key={m.id} className="flex flex-wrap items-center gap-x-4 gap-y-1 px-4 py-3">
                    <span className="w-24 shrink-0 rounded-md border border-white/10 px-2 py-1 text-center text-[11px] text-zinc-300">{MODE_LABEL[m.mode]}</span>
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-sm text-zinc-100">{m.title}</span>
                      {m.detail && <span className="block truncate text-[11px] text-zinc-500">{m.detail}</span>}
                    </span>
                    <span className={`text-xs font-medium ${GOOD.has(m.result) ? "text-emerald-400" : BAD.has(m.result) ? "text-red-400" : "text-zinc-400"}`}>{RESULT_LABEL[m.result] ?? m.result}</span>
                    <span className={`w-24 text-right text-sm font-semibold tabular-nums ${m.pnl === null ? "text-zinc-600" : pnlTone(m.pnl)}`}>{m.pnl === null ? "—" : formatPnl(m.pnl)}</span>
                    <time dateTime={new Date(m.at).toISOString()} className="w-14 text-right text-[11px] text-zinc-600">
                      {new Date(m.at).toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit" })}
                    </time>
                  </li>
                ))}
              </ul>
            </section>
          ))}
        </div>
      )}

      <p className="text-[11px] leading-5 text-zinc-600">Saved on this device only. Virtual funds. Educational. Not investment advice.</p>

      {confirmClear && (
        <ConfirmDialog
          title="Clear your match history?"
          body="This removes the list on this page. Your lifetime stats and wallet balance stay as they are."
          confirmLabel="Clear history"
          danger
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            clearHistory();
            setConfirmClear(false);
          }}
        />
      )}
    </PageShell>
  );
}