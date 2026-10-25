import { useNavigate } from "react-router-dom";
import { ArrowLeft, Lock } from "lucide-react";

import { HintPips } from "./BlindHintPanel";
import { Stars } from "./BlindResult";
import { BANDS, BLIND_ROUTES, LEVELS } from "./data/blind-levels";
import { isUnlocked, summarize, useBlindProgress } from "./utils/blind-progress";
import "./blind-room.css";

function stateOf(progress, level) {
  if (!level.authored) return "planned";
  if (progress.levels[level.id]?.passed) return "done";
  return isUnlocked(progress, level.id) ? "open" : "locked";
}

const STATE_TEXT = {
  done: "completed",
  open: "unlocked",
  locked: "locked, pass the previous level first",
  planned: "planned, not available yet",
};

function Node({ level, state, stars, onOpen }) {
  const playable = state === "open" || state === "done";
  return (
    <button
      type="button"
      disabled={!playable}
      onClick={() => onOpen(level.id)}
      aria-label={`Level ${level.id}${level.title ? `, ${level.title}` : ""}, ${STATE_TEXT[state]}${stars ? `, ${stars} stars` : ""}`}
      title={level.title ?? STATE_TEXT[state]}
      className={`br-node is-${state} flex h-24 flex-col items-center justify-center gap-1 border p-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed`}
    >
      <span className={`font-mono text-xl font-bold ${state === "open" ? "text-orange-300" : state === "done" ? "text-emerald-300" : "text-zinc-500"}`}>
        {level.id}
      </span>
      {state === "locked" && <Lock size={13} className="text-zinc-500" />}
      {state === "planned" && <span className="font-mono text-[9px] uppercase tracking-widest text-zinc-600">Soon</span>}
      {(state === "done" || state === "open") && <Stars count={stars} size={13} />}
      {playable && <span className="max-w-full truncate px-1 text-[10px] text-zinc-500">{level.title}</span>}
    </button>
  );
}

export default function BlindLevelMap() {
  const navigate = useNavigate();
  const { progress } = useBlindProgress();
  const { authoredCount, completed, totalStars } = summarize(progress);

  return (
    <main className="br-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate(BLIND_ROUTES.home)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          Blind room
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Blind room <span className="text-orange-500">/</span> Level map
        </p>
        <span className="flex items-center gap-3 font-mono text-[10px] text-zinc-400">
          <Stars count={Math.min(3, totalStars)} size={13} />
          {totalStars} stars <HintPips remaining={progress.hintsRemaining} />
        </span>
      </header>

      <div className="br-scroll min-h-0 flex-1 overflow-y-auto p-4">
        <div className="mx-auto max-w-5xl">
          <p className="mb-5 text-sm leading-6 text-zinc-400">
            {completed} of {authoredCount} available levels completed. Only individually designed levels can be played. Levels marked
            <span className="text-zinc-300"> Soon </span>
            are planned, and are not filled with generic questions.
          </p>

          <div className="space-y-6">
            {BANDS.map((band) => (
              <section key={band.from} aria-label={`Levels ${band.from} to ${band.to}`}>
                <h2 className="mb-2 flex flex-wrap items-baseline gap-x-3 font-mono text-[11px] uppercase tracking-[0.2em] text-zinc-300">
                  <span className="text-orange-500">
                    {band.from}-{band.to}
                  </span>
                  {band.title}
                  <span className="normal-case tracking-normal text-zinc-600">{band.note}</span>
                </h2>
                <div className="grid grid-cols-[repeat(auto-fill,minmax(92px,1fr))] gap-2">
                  {LEVELS.slice(band.from - 1, band.to).map((level) => {
                    const state = stateOf(progress, level);
                    return (
                      <Node
                        key={level.id}
                        level={level}
                        state={state}
                        stars={progress.levels[level.id]?.stars ?? 0}
                        onOpen={(id) => navigate(BLIND_ROUTES.level(id))}
                      />
                    );
                  })}
                </div>
              </section>
            ))}
          </div>
        </div>
      </div>

      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-2 text-center font-mono text-[10px] text-zinc-600">
        Progress is saved on this device only. Virtual practice. Educational. Not investment advice.
      </footer>
    </main>
  );
}