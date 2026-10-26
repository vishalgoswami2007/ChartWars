import { useState } from "react";
import { useNavigate } from "react-router-dom";

import DifficultyCard from "../../../../features/coach/components/DifficultyCard";
import { CoachShell, btnPrimary } from "../../../../features/coach/components/ui";
import { DIFFICULTIES, DIFFICULTY_LIST } from "../../../../features/coach/data/difficultyConfig";
import { fmtMoney } from "../../../../features/coach/format";
import { COACH_ROUTES } from "../../../../features/coach/routes";
import { loadHistory } from "../../../../features/coach/storage";

const STEPS = [
  ["Pick a difficulty", "Each level changes the bot, the rules and how much help you get."],
  ["Same market for both", "You and the coach trade identical price movement, so the match is fair."],
  ["Trade the scenario", "Choose entries, stop-loss and take-profit. The coach decides by its own rules."],
  ["Compare the results", "Net P&L decides the winner. A performance score breaks ties and shows your habits."],
];

const WINNER = { user: "You won", coach: "Coach won", draw: "Draw" };

export default function CoachLanding() {
  const navigate = useNavigate();
  const [selected, setSelected] = useState("beginner");
  const [history] = useState(() => loadHistory().slice(0, 3));

  return (
    <CoachShell title="Pro vs Coach" backLabel="Exit" onBack={() => navigate(COACH_ROUTES.rooms)}>
      <div className="cc-scroll min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-500">Trading simulation</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">
            Pro vs <span className="text-orange-500">Coach</span>
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
            Trade the same market scenario as a rule-based coach bot. The harder the level, the smarter the bot and the less help you get.
          </p>

          <div className="mt-6 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            {DIFFICULTY_LIST.map((config) => (
              <DifficultyCard key={config.id} config={config} selected={selected === config.id} onSelect={setSelected} />
            ))}
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button type="button" onClick={() => navigate(COACH_ROUTES.setup(selected))} className={`${btnPrimary} px-6 py-3.5 text-xs tracking-[0.2em]`}>
              [ Set up {DIFFICULTIES[selected].label} match ]
            </button>
            <p className="text-xs text-zinc-500">Pro stays locked until its unlock rules are defined and tested.</p>
          </div>

          <div className="mt-8 grid gap-3 md:grid-cols-4">
            {STEPS.map(([title, text], i) => (
              <div key={title} className="cc-panel p-3">
                <span className="font-mono text-xs text-orange-500">0{i + 1}</span>
                <p className="mt-1 text-sm font-medium text-white">{title}</p>
                <p className="mt-1 text-xs leading-5 text-zinc-500">{text}</p>
              </div>
            ))}
          </div>

          {history.length > 0 && (
            <section className="mt-8" aria-labelledby="recent">
              <h2 id="recent" className="mb-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">Recent matches on this device</h2>
              <ul className="space-y-1.5">
                {history.map((h) => (
                  <li key={h.id} className="cc-panel flex flex-wrap items-center gap-x-4 gap-y-1 px-3 py-2 font-mono text-[11px]">
                    <span className="uppercase text-orange-300">{h.difficulty}</span>
                    <span className="text-zinc-400">{h.title}</span>
                    <span className="text-zinc-200">{WINNER[h.winner]}</span>
                    <span className="ml-auto text-zinc-500">You {fmtMoney(h.userPnl, true)} · Coach {fmtMoney(h.botPnl, true)}</span>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      </div>
    </CoachShell>
  );
}