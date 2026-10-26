import { useMemo } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

import ReviewPanel from "../../../../features/coach/components/ReviewPanel";
import { Meter, Panel, btnGhost, btnPrimary } from "../../../../features/coach/components/ui";
import { DIFFICULTIES } from "../../../../features/coach/data/difficultyConfig";
import { clamp, fmtMoney, fmtPct, fmtR, tone } from "../../../../features/coach/format";
import { COACH_ROUTES } from "../../../../features/coach/routes";
import { loadResult } from "../../../../features/coach/storage";
import "../../../../features/coach/coach.css";

const END_TEXT = { time: "Scenario completed", "ended-early": "Match ended early" };

function EquityCompare({ user, coach, capital, coachName }) {
  const all = [...user, ...coach, capital];
  const min = Math.min(...all);
  const max = Math.max(...all);
  const range = max - min || 1;
  const path = (values) =>
    values
      .map((v, i) => `${i === 0 ? "M" : "L"}${(i / Math.max(1, values.length - 1)) * 100} ${46 - ((v - min) / range) * 42}`)
      .join(" ");
  const baseline = 46 - ((capital - min) / range) * 42;
  return (
    <div>
      <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="h-44 w-full" role="img" aria-label="Equity of you and the coach over the match">
        <line x1="0" x2="100" y1={baseline} y2={baseline} stroke="rgba(255,255,255,0.18)" strokeDasharray="1.5 1.5" strokeWidth="0.4" vectorEffect="non-scaling-stroke" />
        <path d={path(coach)} fill="none" stroke="#7dd3fc" strokeWidth="1.4" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
        <path d={path(user)} fill="none" stroke="#f97316" strokeWidth="1.8" vectorEffect="non-scaling-stroke" strokeLinejoin="round" />
      </svg>
      <p className="mt-1 flex gap-4 font-mono text-[10px] text-zinc-500">
        <span><span className="text-orange-400">━</span> You</span>
        <span><span className="text-sky-300">━</span> {coachName}</span>
        <span>Dashed line: starting balance</span>
      </p>
    </div>
  );
}

function ScoreCard({ title, score, winner, rules }) {
  const profitFactor = score.profitFactor == null || score.profitFactor === Infinity ? "No losses" : score.profitFactor.toFixed(2);
  return (
    <section className={`cc-panel p-3 ${winner ? "border-orange-500/60" : ""}`}>
      <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">{title}</p>
      <p className={`mt-1 font-mono text-3xl font-bold tabular-nums ${tone(score.pnl)}`}>{fmtMoney(score.pnl, true)}</p>
      <p className={`font-mono text-xs ${tone(score.pnl)}`}>{fmtPct(score.pnlPct)} net of fees and slippage</p>

      <dl className="mt-3 grid grid-cols-2 gap-x-3 gap-y-1.5 font-mono text-[11px]">
        <div className="flex justify-between"><dt className="text-zinc-500">Trades</dt><dd className="text-zinc-200">{score.trades}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Win rate</dt><dd className="text-zinc-200">{Math.round(score.winRate * 100)}%</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Avg result</dt><dd className="text-zinc-200">{fmtR(score.avgR)}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Profit factor</dt><dd className="text-zinc-200">{profitFactor}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Fees paid</dt><dd className="text-zinc-200">{fmtMoney(score.fees)}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Max drawdown</dt><dd className={score.busted ? "text-red-300" : "text-zinc-200"}>{(score.maxDrawdown * 100).toFixed(2)}%{score.busted ? " (limit)" : ""}</dd></div>
      </dl>

      <div className="mt-3 space-y-2 border-t border-white/10 pt-3">
        <Meter label="Risk management" value={score.parts.risk} max={35} text={`${score.parts.risk.toFixed(1)} / 35`} color="bg-emerald-400" />
        <Meter label="Rule discipline" value={score.parts.discipline} max={35} text={`${score.parts.discipline.toFixed(1)} / 35`} color="bg-orange-400" />
        <Meter label="Setup quality" value={score.parts.setup} max={30} text={`${score.parts.setup.toFixed(1)} / 30`} color="bg-sky-400" />
        <p className="flex justify-between pt-1 font-mono text-sm font-bold">
          <span className="text-zinc-300">Performance score</span>
          <span className="text-orange-300">{score.performance} / 100</span>
        </p>
        <p className="text-[10px] text-zinc-600">
          {score.violations} trade{score.violations === 1 ? "" : "s"} broke a rule (min {rules.minRR}:1{rules.requireTp ? ", take-profit required" : ""}).
        </p>
      </div>
    </section>
  );
}

function TradeList({ title, trades }) {
  return (
    <Panel title={title}>
      {trades.length === 0 ? (
        <p className="font-mono text-[11px] text-zinc-500">No trades.</p>
      ) : (
        <ul className="space-y-1">
          {trades.map((t) => (
            <li key={t.id} className="flex flex-wrap items-center gap-x-3 font-mono text-[11px]">
              <span className={t.side === "buy" ? "text-emerald-300" : "text-red-300"}>{t.side === "buy" ? "LONG" : "SHORT"}</span>
              <span className="text-zinc-500">{t.reason}</span>
              <span className="text-zinc-600">{t.hold} candles</span>
              <span className={`ml-auto tabular-nums ${tone(t.pnl)}`}>{fmtMoney(t.pnl, true)} ({fmtR(t.r)})</span>
            </li>
          ))}
        </ul>
      )}
    </Panel>
  );
}

function Results({ summary, setup }) {
  const navigate = useNavigate();
  const rules = DIFFICULTIES[summary.difficulty];
  const { verdict } = summary;

  const headline = verdict.winner === "user" ? "YOU WIN" : verdict.winner === "coach" ? `${summary.botName.toUpperCase()} WINS` : "DRAW";
  const color = verdict.winner === "user" ? "text-emerald-400" : verdict.winner === "coach" ? "text-red-400" : "text-zinc-200";

  const again = () =>
    navigate(COACH_ROUTES.battle, {
      state: setup ?? { difficulty: summary.difficulty, scenarioId: summary.scenarioId, capital: summary.capital, riskFrac: rules.defaultRisk, autoplay: rules.replay === "auto" },
    });

  const profit = useMemo(() => clamp(summary.user.performance, 0, 100), [summary]);

  return (
    <main className="cc-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button type="button" onClick={() => navigate(COACH_ROUTES.landing)} className="text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          Back to modes
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Pro vs Coach <span className="text-orange-500">/</span> Results
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">{summary.difficultyLabel}</span>
      </header>

      <div className="cc-scroll min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-6xl space-y-4">
          <section className="cc-panel cc-pop p-5 text-center" aria-live="polite">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {summary.scenarioTitle} · {END_TEXT[summary.endReason]} · {summary.candlesPlayed} of {summary.totalPlay} candles
            </p>
            <h1 className={`mt-2 font-mono text-4xl font-bold tracking-widest sm:text-5xl ${color}`}>{headline}</h1>
            <p className="mt-2 text-sm text-zinc-400">{verdict.reason}</p>
            <p className="mx-auto mt-2 max-w-2xl text-[11px] leading-5 text-zinc-600">
              Winner rule: net P&amp;L after fees and slippage decides. If the gap is under 0.1% of the balance, the performance score (risk, discipline, setup quality) breaks the tie. Your score: {profit} / 100.
            </p>
          </section>

          <div className="grid gap-3 lg:grid-cols-2">
            <ScoreCard title="You" score={summary.user} winner={verdict.winner === "user"} rules={summary.rules} />
            <ScoreCard title={summary.botName} score={summary.bot} winner={verdict.winner === "coach"} rules={summary.rules} />
          </div>

          <Panel title="Equity over the match">
            <EquityCompare user={summary.curves.user} coach={summary.curves.bot} capital={summary.capital} coachName={summary.botName} />
          </Panel>

          <ReviewPanel summary={summary} />

          <div className="grid gap-3 lg:grid-cols-2">
            <TradeList title="Your trades" trades={summary.userTrades} />
            <TradeList title={`${summary.botName} trades`} trades={summary.botTrades} />
          </div>

          <div className="flex flex-wrap gap-2 pb-2">
            <button type="button" onClick={again} className={`${btnPrimary} px-5 py-3 text-[11px] tracking-[0.18em]`}>Play this scenario again</button>
            <button type="button" onClick={() => navigate(COACH_ROUTES.setup(summary.difficulty))} className={`${btnGhost} px-5 py-3 text-[11px] tracking-[0.18em]`}>New setup</button>
            <button type="button" onClick={() => navigate(COACH_ROUTES.landing)} className={`${btnGhost} px-5 py-3 text-[11px] tracking-[0.18em]`}>Choose another level</button>
          </div>
          <p className="pb-4 text-[11px] leading-5 text-zinc-600">
            {summary.botName}: {summary.botAbout} Sample market candles, virtual funds only. The coach is a rule-based bot, not a person or an AI. Educational. Not investment advice.
          </p>
        </div>
      </div>
    </main>
  );
}

export default function CoachResults() {
  const location = useLocation();
  const summary = location.state?.summary ?? loadResult();
  if (!summary) return <Navigate to={COACH_ROUTES.landing} replace />;
  return <Results summary={summary} setup={location.state?.setup} />;
}