import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Map as MapIcon, Play } from "lucide-react";

import { HintPips } from "./BlindHintPanel";
import { Stars } from "./BlindResult";
import { BLIND_ROUTES, LEVELS, TOTAL_LEVELS } from "./data/blind-levels";
import { summarize, useBlindProgress } from "./utils/blind-progress";
import { TOTAL_HINTS } from "./utils/blind-scoring";
import { runSelfTests } from "./utils/evaluate-blind-answer";
import "./blind-room.css";

const JOURNEY = [
  ["Blind Room home", "Start, progress and hints"],
  ["Level map", "Unlocked, completed and locked levels"],
  ["Level briefing", "The concept and the objective"],
  ["Analyze the chart", "Candles, trend and key levels"],
  ["Choose a decision", "BUY, SELL or WAIT"],
  ["Explain your reasoning", "Use trading terms"],
  ["Evaluation", "Decision score, reasoning score, feedback"],
  ["Result and progress", "Pass, retry, stars, next level"],
];

export default function BlindRoom() {
  const navigate = useNavigate();
  const { progress, reset } = useBlindProgress();
  const [confirmReset, setConfirmReset] = useState(false);
  const { authoredCount, completed, totalStars, next } = summarize(progress);
  const started = Object.keys(progress.levels).length > 0;
  const allDone = authoredCount > 0 && completed === authoredCount;

  // Development only: checks every level's authored test answers and reports surprises in the console.
  useEffect(() => {
    if (!import.meta.env.DEV) return;
    const failures = runSelfTests(LEVELS.filter((l) => l.authored));
    if (failures.length > 0) console.warn("Blind Room self-test failures:", failures);
  }, []);

  return (
    <main className="br-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate(BLIND_ROUTES.rooms)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          Exit
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Rooms <span className="text-orange-500">/</span> Blind room
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">Virtual practice only</span>
      </header>

      <div className="br-scroll grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 lg:grid-cols-[minmax(0,1fr)_380px]">
        <section className="flex flex-col justify-center py-6 lg:px-6">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-orange-500">50-level challenge</p>
          <h1 className="mt-4 text-5xl font-semibold leading-[1.05] tracking-tight sm:text-6xl">
            Blind <span className="text-orange-500">Room</span>
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-zinc-400">
            Read the chart without hindsight. Choose a decision, explain your reasoning in your own words, and learn from the feedback. Every level tests one idea.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => navigate(next ? BLIND_ROUTES.level(next.id) : BLIND_ROUTES.map)}
              className="inline-flex items-center gap-2 border border-orange-400 bg-orange-500 px-6 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
            >
              <Play size={14} />
              {allDone ? "Review levels" : next ? (started ? `Continue level ${next.id}` : "Start blind room") : "Open level map"}
            </button>
            <button
              type="button"
              onClick={() => navigate(BLIND_ROUTES.map)}
              className="inline-flex items-center gap-2 border border-white/20 px-6 py-3.5 font-mono text-xs uppercase tracking-[0.2em] text-zinc-100 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              <MapIcon size={14} />
              Level map
            </button>
          </div>

          <dl className="mt-8 grid max-w-xl grid-cols-3 gap-3">
            <div className="br-panel p-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Cleared</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-white">
                {completed}
                <span className="text-sm text-zinc-500"> / {authoredCount}</span>
              </dd>
              <dd className="font-mono text-[10px] text-zinc-600">of {TOTAL_LEVELS} planned</dd>
            </div>
            <div className="br-panel p-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Stars</dt>
              <dd className="mt-1 flex items-center gap-2 font-mono text-xl font-bold text-white">
                {totalStars}
                <Stars count={totalStars > 0 ? 1 : 0} max={1} size={18} />
              </dd>
            </div>
            <div className="br-panel p-3">
              <dt className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Hints</dt>
              <dd className="mt-1 font-mono text-xl font-bold text-white">
                {progress.hintsRemaining}
                <span className="text-sm text-zinc-500"> / {TOTAL_HINTS}</span>
              </dd>
              <dd className="mt-1">
                <HintPips remaining={progress.hintsRemaining} />
              </dd>
            </div>
          </dl>

          <p className="mt-6 max-w-xl text-xs leading-5 text-zinc-600">
            {authoredCount} of {TOTAL_LEVELS} levels are designed so far. Practice charts use sample candles, not live markets. Progress is saved on this device only. Virtual funds only. Educational. Not investment advice.
          </p>
        </section>

        <aside className="flex flex-col gap-4">
          <section className="br-panel p-4" aria-labelledby="journey">
            <h2 id="journey" className="mb-3 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
              How a level works
            </h2>
            <ol className="space-y-2.5">
              {JOURNEY.map(([title, sub], i) => (
                <li key={title} className="flex gap-3">
                  <span className="mt-0.5 flex size-5 shrink-0 items-center justify-center border border-orange-500/50 font-mono text-[10px] text-orange-300">{i + 1}</span>
                  <span>
                    <span className="block text-sm font-medium text-white">{title}</span>
                    <span className="block text-xs text-zinc-500">{sub}</span>
                  </span>
                </li>
              ))}
            </ol>
          </section>

          {started && (
            <section className="br-panel p-3">
              {confirmReset ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-zinc-300">Delete all progress and hints on this device?</span>
                  <button
                    type="button"
                    autoFocus
                    onClick={() => {
                      reset();
                      setConfirmReset(false);
                    }}
                    className="border border-red-500/60 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-red-300 transition hover:bg-red-500/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400"
                  >
                    Delete
                  </button>
                  <button type="button" onClick={() => setConfirmReset(false)} className="border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                    Cancel
                  </button>
                </div>
              ) : (
                <button type="button" onClick={() => setConfirmReset(true)} className="font-mono text-[11px] uppercase tracking-wider text-zinc-500 transition hover:text-red-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
                  Reset my progress
                </button>
              )}
            </section>
          )}
        </aside>
      </div>
    </main>
  );
}