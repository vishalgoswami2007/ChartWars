import { useState } from "react";
import { Navigate, useNavigate, useSearchParams } from "react-router-dom";

import { CoachShell, btnPrimary, chip } from "../../../../features/coach/components/ui";
import { CAPITAL_OPTIONS, COSTS, DIFFICULTIES, WARMUP, isOpen } from "../../../../features/coach/data/difficultyConfig";
import { playLength, scenariosFor } from "../../../../features/coach/data/scenarios";
import { fmtMoney } from "../../../../features/coach/format";
import { COACH_ROUTES } from "../../../../features/coach/routes";

function Form({ rules }) {
  const navigate = useNavigate();
  const scenarios = scenariosFor(rules.id);
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [capital, setCapital] = useState(10000);
  const [riskFrac, setRiskFrac] = useState(rules.defaultRisk);
  const [autoplay, setAutoplay] = useState(rules.replay === "auto");

  const start = () => navigate(COACH_ROUTES.battle, { state: { difficulty: rules.id, scenarioId, capital, riskFrac, autoplay } });

  const facts = [
    ["Starting balance", fmtMoney(capital)],
    ["Candles", "1H sample candles"],
    ["Fee and slippage", `${(COSTS.fee * 100).toFixed(2)}% + ${(COSTS.slippage * 100).toFixed(2)}% per side`],
    ["Max drawdown", `${(rules.maxDrawdown * 100).toFixed(0)}% (the match stops for you)`],
    ["Max leverage", `${rules.maxLeverage}x`],
    ["Max trades", String(rules.maxTrades)],
    ["Min reward:risk", `${rules.minRR}:1${rules.requireTp ? " (take-profit required)" : ""}`],
    ["Cooling off after a loss", rules.cooldownCandles ? `${rules.cooldownCandles} candles` : "Not enforced"],
  ];

  return (
    <CoachShell title={`Pro vs Coach / ${rules.label}`} backLabel="Back" onBack={() => navigate(COACH_ROUTES.landing)}>
      <div className="cc-scroll grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-4">
          <section aria-labelledby="scenario">
            <h2 id="scenario" className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              <span className="text-orange-500">01</span> / Choose a scenario
            </h2>
            <div role="radiogroup" aria-label="Scenario" className="grid gap-2 md:grid-cols-3">
              {scenarios.map((s) => {
                const active = s.id === scenarioId;
                return (
                  <button
                    key={s.id}
                    type="button"
                    role="radio"
                    aria-checked={active}
                    onClick={() => setScenarioId(s.id)}
                    className={`cc-tile flex flex-col p-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${active ? "is-selected" : ""}`}
                  >
                    <span className="text-sm font-semibold text-white">{s.title}</span>
                    <span className="mt-1 text-xs leading-5 text-zinc-400">{s.blurb}</span>
                    <span className="mt-2 flex flex-wrap gap-1">
                      {s.tests.map((t) => (
                        <span key={t} className="border border-white/10 px-1.5 py-0.5 font-mono text-[10px] text-zinc-400">{t}</span>
                      ))}
                    </span>
                    <span className="mt-2 font-mono text-[10px] text-zinc-500">{playLength(s, WARMUP)} candles to play</span>
                  </button>
                );
              })}
            </div>
          </section>

          <section className="cc-panel p-4" aria-labelledby="settings">
            <h2 id="settings" className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              <span className="text-orange-500">02</span> / Your settings
            </h2>
            <div className="grid gap-4 sm:grid-cols-3">
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Virtual balance</p>
                <div role="radiogroup" aria-label="Virtual balance" className="flex flex-wrap gap-1.5">
                  {CAPITAL_OPTIONS.map((c) => (
                    <button key={c} type="button" role="radio" aria-checked={capital === c} onClick={() => setCapital(c)} className={chip(capital === c)}>
                      {fmtMoney(c)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Starting risk per trade</p>
                {rules.ticket.risk === "preset" ? (
                  <p className="font-mono text-sm text-zinc-200">{(rules.defaultRisk * 100).toFixed(0)}% (preset)</p>
                ) : (
                  <div role="radiogroup" aria-label="Risk per trade" className="flex flex-wrap gap-1.5">
                    {rules.riskOptions.map((r) => (
                      <button key={r} type="button" role="radio" aria-checked={riskFrac === r} onClick={() => setRiskFrac(r)} className={chip(riskFrac === r)}>
                        {(r * 100).toFixed(2).replace(/\.?0+$/, "")}%
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <div>
                <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Replay</p>
                <div role="radiogroup" aria-label="Replay mode" className="flex gap-1.5">
                  <button type="button" role="radio" aria-checked={!autoplay} onClick={() => setAutoplay(false)} className={chip(!autoplay)}>Step by step</button>
                  <button type="button" role="radio" aria-checked={autoplay} onClick={() => setAutoplay(true)} className={chip(autoplay)}>Auto-play</button>
                </div>
              </div>
            </div>
          </section>

          <button type="button" onClick={start} className={`${btnPrimary} w-full px-6 py-4 text-xs tracking-[0.2em]`}>
            [ Start match vs {rules.bot.name} ]
          </button>
        </div>

        <aside className="space-y-4">
          <section className="cc-panel p-4">
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">Rules for {rules.label}</h2>
            <dl className="space-y-1.5">
              {facts.map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 font-mono text-[11px]">
                  <dt className="text-zinc-500">{k}</dt>
                  <dd className="text-right text-zinc-200">{v}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="cc-panel p-4">
            <h2 className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">Your opponent</h2>
            <p className="text-sm font-semibold text-white">{rules.bot.name}</p>
            <p className="mt-1 text-xs leading-5 text-zinc-400">{rules.bot.about}</p>
            <p className="mt-2 text-[11px] leading-5 text-zinc-500">It trades the same candles as you, but never sees candles that you have not seen yet.</p>
          </section>
        </aside>
      </div>
    </CoachShell>
  );
}

export default function CoachSetup() {
  const [params] = useSearchParams();
  const level = params.get("level");
  if (!level || !isOpen(level)) return <Navigate to={COACH_ROUTES.landing} replace />;
  return <Form key={level} rules={DIFFICULTIES[level]} />;
}