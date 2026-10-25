import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import { Flag } from "./FriendsVoicePanel";
import {
  CFG,
  ROUTES,
  SYMBOLS,
  clamp,
  fmtMoney,
  fmtPct,
  fmtPrice,
  insightsFor,
  loadHistory,
  matchStats,
  tone,
} from "./friendsData";
import "./friends-room.css";

const REASONS = { time: "Time is up", drawdown: "Max drawdown reached", left: "Match left" };

function Card({ label, value, sub, className = "" }) {
  return (
    <div className="fr-panel p-3">
      <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">{label}</p>
      <p className={`mt-1 font-mono text-xl font-bold tabular-nums ${className || "text-white"}`}>{value}</p>
      {sub && <p className="font-mono text-[10px] text-zinc-500">{sub}</p>}
    </div>
  );
}

function EquityCurve({ values }) {
  if (values.length < 2) return <p className="font-mono text-xs text-zinc-500">Not enough data for a curve.</p>;
  const min = Math.min(...values, CFG.capital);
  const max = Math.max(...values, CFG.capital);
  const range = max - min || 1;
  const x = (i) => (i / (values.length - 1)) * 100;
  const y = (v) => 46 - ((v - min) / range) * 42;
  const d = values.map((v, i) => `${i === 0 ? "M" : "L"}${x(i)} ${y(v)}`).join(" ");
  const up = values[values.length - 1] >= CFG.capital;
  return (
    <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-40 w-full" role="img" aria-label="Equity curve for the match">
      <line x1="0" x2="100" y1={y(CFG.capital)} y2={y(CFG.capital)} stroke="rgba(255,255,255,0.18)" strokeDasharray="1.5 1.5" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
      <path d={d} fill="none" stroke={up ? "#34d399" : "#f87171"} strokeWidth="1.6" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
    </svg>
  );
}

function PnlBars({ matches }) {
  const list = matches.slice(0, 10).reverse();
  const peak = Math.max(...list.map((m) => Math.abs(m.pnl)), 1);
  return (
    <div className="flex h-32 items-center gap-1.5" role="img" aria-label="Profit and loss of your last matches">
      {list.map((m) => {
        const h = clamp((Math.abs(m.pnl) / peak) * 50, 2, 50);
        return (
          <div key={m.id} className="relative flex h-full flex-1 items-center" title={`${fmtMoney(m.pnl, true)}`}>
            <span
              className={`absolute inset-x-0 ${m.pnl >= 0 ? "bottom-1/2 bg-emerald-400/80" : "top-1/2 bg-red-400/80"}`}
              style={{ height: `${h}%` }}
            />
          </div>
        );
      })}
    </div>
  );
}

export default function FriendsAnalytics() {
  const navigate = useNavigate();
  const location = useLocation();
  const [history] = useState(loadHistory);
  const [selectedId, setSelectedId] = useState(location.state?.matchId ?? history[0]?.id);

  const match = history.find((m) => m.id === selectedId) ?? history[0];

  const shell = (children) => (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button type="button" onClick={() => navigate(ROUTES.lobby)} className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          <ArrowLeft size={14} />
          Back to lobby
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Friends <span className="text-orange-500">/</span> Analytics
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">Virtual funds only</span>
      </header>
      {children}
      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-2 text-center font-mono text-[10px] text-zinc-600">
        Saved on this device only. Virtual funds. Educational. Not investment advice.
      </footer>
    </main>
  );

  if (!match) {
    return shell(
      <div className="flex flex-1 flex-col items-center justify-center gap-3 p-6 text-center">
        <p className="font-mono text-sm text-zinc-300">No matches yet.</p>
        <p className="max-w-sm text-sm text-zinc-500">Play a match in a friends room and your analytics will show up here.</p>
        <button type="button" onClick={() => navigate(ROUTES.lobby)} className="border border-orange-400 bg-orange-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400">
          Go to lobby
        </button>
      </div>
    );
  }

  const s = matchStats(match);
  const tips = insightsFor(match, s);
  const ticker = SYMBOLS.find((x) => x.id === match.symbol)?.ticker ?? match.symbol.toUpperCase();

  const total = history.reduce((sum, m) => sum + m.pnl, 0);
  const wins = history.filter((m) => m.pnl > 0).length;
  const best = history.reduce((a, b) => (b.pnl > a.pnl ? b : a));
  const worst = history.reduce((a, b) => (b.pnl < a.pnl ? b : a));
  const avgTrades = history.reduce((sum, m) => sum + m.trades.length, 0) / history.length;

  return shell(
    <div className="fr-scroll grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="flex min-w-0 flex-col gap-4">
        <section aria-labelledby="summary">
          <h2 id="summary" className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
            Match review <span className="text-zinc-600">· {ticker} · {match.players === 2 ? "2 players" : "4 players"} · {match.minutes} min · {REASONS[match.reason]}</span>
          </h2>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Card label="Room P&L" value={fmtMoney(match.pnl, true)} sub={fmtPct(match.pnlPct)} className={tone(match.pnl)} />
            <Card label="Trades" value={s.n} sub={`${(s.winRate * 100).toFixed(0)}% wins`} />
            <Card label="Max drawdown" value={`${(match.maxDd * 100).toFixed(2)}%`} sub={`limit ${(CFG.maxDrawdown * 100).toFixed(0)}%`} />
            <Card label="Profit factor" value={s.profitFactor === Infinity ? "No losses" : s.profitFactor.toFixed(2)} sub={`avg planned ${s.avgR ? `${s.avgR.toFixed(1)}R` : "none"}`} />
          </div>
        </section>

        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Equity curve</h2>
          <EquityCurve values={match.equity} />
        </section>

        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Who did what</h2>
          <table className="w-full text-left font-mono text-xs">
            <thead className="text-[10px] uppercase tracking-wider text-zinc-500">
              <tr><th scope="col" className="pb-1 font-medium">Player</th><th scope="col" className="pb-1 font-medium">Role</th><th scope="col" className="pb-1 text-right font-medium">Trades</th><th scope="col" className="pb-1 text-right font-medium">P&amp;L</th></tr>
            </thead>
            <tbody>
              {match.people.map((p) => (
                <tr key={p.name} className="border-t border-white/5">
                  <td className="py-1.5"><span className="flex items-center gap-2">{p.country && <Flag code={p.country} className="h-4 w-6" />}{p.name}</span></td>
                  <td className="py-1.5 text-zinc-400">{p.role}</td>
                  <td className="py-1.5 text-right tabular-nums">{p.trades}</td>
                  <td className={`py-1.5 text-right tabular-nums ${tone(p.pnl)}`}>{fmtMoney(p.pnl, true)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Trades</h2>
          {match.trades.length === 0 ? (
            <p className="font-mono text-xs text-zinc-500">No trades in this match.</p>
          ) : (
            <ul className="space-y-1">
              {match.trades.map((t) => (
                <li key={t.id} className="flex flex-wrap items-center gap-x-3 font-mono text-[11px]">
                  <span className={t.side === "buy" ? "text-emerald-300" : "text-red-300"}>{t.side.toUpperCase()}</span>
                  <span className="text-zinc-400">{t.by}</span>
                  <span className="text-zinc-500">{fmtPrice(t.entry)} to {fmtPrice(t.exit)}</span>
                  <span className="text-zinc-600">{t.reason}</span>
                  <span className={`ml-auto tabular-nums ${tone(t.pnl)}`}>{fmtMoney(t.pnl, true)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <aside className="flex min-w-0 flex-col gap-4">
        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Performance review</h2>
          <ul className="space-y-2">
            {tips.map((tip) => (
              <li key={tip} className="border-l-2 border-orange-500/60 pl-3 text-xs leading-5 text-zinc-300">{tip}</li>
            ))}
          </ul>
          <p className="mt-2 text-[10px] text-zinc-600">Rule-based tips from your trades. Not investment advice.</p>
        </section>

        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Across {history.length} {history.length === 1 ? "match" : "matches"}</h2>
          <div className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono text-[11px]">
            <div><p className="text-zinc-500">Net P&amp;L</p><p className={`text-sm font-semibold ${tone(total)}`}>{fmtMoney(total, true)}</p></div>
            <div><p className="text-zinc-500">Winning matches</p><p className="text-sm font-semibold text-white">{wins} of {history.length}</p></div>
            <div><p className="text-zinc-500">Best</p><p className="text-sm font-semibold text-emerald-300">{fmtMoney(best.pnl, true)}</p></div>
            <div><p className="text-zinc-500">Worst</p><p className="text-sm font-semibold text-red-300">{fmtMoney(worst.pnl, true)}</p></div>
            <div className="col-span-2"><p className="text-zinc-500">Average trades per match</p><p className="text-sm font-semibold text-white">{avgTrades.toFixed(1)}</p></div>
          </div>
          <div className="mt-3"><PnlBars matches={history} /></div>
        </section>

        <section className="fr-panel p-3">
          <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Past matches</h2>
          <ul className="space-y-1">
            {history.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  aria-current={m.id === match.id}
                  onClick={() => setSelectedId(m.id)}
                  className={`flex w-full items-center gap-2 border px-2 py-1.5 text-left font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                    m.id === match.id ? "border-orange-500/60 bg-orange-500/8" : "border-white/8 hover:border-white/25"
                  }`}
                >
                  <span className="text-zinc-300">{new Date(m.at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}</span>
                  <span className="text-zinc-500">{SYMBOLS.find((x) => x.id === m.symbol)?.ticker}</span>
                  <span className={`ml-auto tabular-nums ${tone(m.pnl)}`}>{fmtMoney(m.pnl, true)}</span>
                </button>
              </li>
            ))}
          </ul>
        </section>
      </aside>
    </div>
  );
}