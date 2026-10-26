import { Lightbulb } from "lucide-react";

import { Panel, btnGhost } from "./ui";

const TONE = {
  info: "border-white/15 bg-white/3",
  good: "border-emerald-500/40 bg-emerald-500/6",
  warn: "border-amber-500/40 bg-amber-500/6",
};

export default function CoachPanel({ rules, feed, hintsUsed, onHint, running }) {
  const limit = rules.hints.limit;
  const finite = Number.isFinite(limit);
  const left = finite ? Math.max(0, limit - hintsUsed) : null;
  const auto = rules.hints.mode === "auto";

  return (
    <Panel
      title="Coach"
      className="flex min-h-0 flex-col"
      right={
        <span className="flex items-center gap-1 text-orange-300">
          <Lightbulb size={12} />
          {finite ? `${left} of ${limit} hints left` : "Frequent hints"}
        </span>
      }
    >
      <p className="mb-2 text-[11px] leading-5 text-zinc-500">
        {auto
          ? "The coach comments as the chart develops."
          : "Hints are optional. Ask when you want a second look."}
      </p>

      <div className="cc-scroll min-h-24 flex-1 space-y-1.5 overflow-y-auto" aria-live="polite">
        {feed.length === 0 ? (
          <p className="font-mono text-[11px] text-zinc-600">{auto ? "Waiting for the first candles." : "No hints used yet."}</p>
        ) : (
          feed.map((tip) => (
            <div key={tip.key} className={`cc-tip border px-2.5 py-2 text-xs leading-5 text-zinc-200 ${TONE[tip.tone] ?? TONE.info}`}>
              <span className="mr-1.5 font-mono text-[10px] text-orange-400">{tip.manual ? "HINT" : "NOTE"}</span>
              {tip.text}
            </div>
          ))
        )}
      </div>

      <button
        type="button"
        onClick={onHint}
        disabled={!running || (finite && left === 0)}
        className={`${btnGhost} mt-2 w-full py-2 text-[11px] tracking-[0.18em]`}
      >
        {finite && left === 0 ? "No hints left" : "Ask the coach"}
      </button>
      <p className="mt-1.5 text-[10px] text-zinc-600">Observations about the chart so far. Not predictions or advice.</p>
    </Panel>
  );
}