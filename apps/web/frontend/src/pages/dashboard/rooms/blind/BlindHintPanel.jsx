import { useState } from "react";
import { Lightbulb } from "lucide-react";

import { TOTAL_HINTS } from "./utils/blind-scoring";

export function HintPips({ remaining }) {
  return (
    <span className="inline-flex items-center gap-1.5" role="img" aria-label={`${remaining} of ${TOTAL_HINTS} hints left`}>
      {Array.from({ length: TOTAL_HINTS }, (_, i) => (
        <span key={i} className={`br-pip size-2.5 rounded-full ${i < remaining ? "is-full" : "is-empty"}`} />
      ))}
    </span>
  );
}

export default function BlindHintPanel({ remaining, hints, revealed, onUse }) {
  const [confirming, setConfirming] = useState(false);
  const allShown = revealed >= hints.length;
  const noTokens = remaining <= 0;

  return (
    <section className="br-panel p-3" aria-labelledby="hint-title">
      <h2 id="hint-title" className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
        <span className="flex items-center gap-1.5">
          <Lightbulb size={12} className="text-orange-400" />
          Hints
        </span>
        <span className="flex items-center gap-2 text-zinc-300">
          <HintPips remaining={remaining} />
          {remaining} / {TOTAL_HINTS}
        </span>
      </h2>

      <p className="mb-3 border-l-2 border-orange-500/60 pl-3 text-xs italic leading-5 text-zinc-400">
        &ldquo;Think carefully before using a hint. Save them for the challenges where you need them most.&rdquo;
      </p>

      {revealed > 0 && (
        <ol className="mb-3 space-y-2" aria-live="polite">
          {hints.slice(0, revealed).map((hint, i) => (
            <li key={hint.text} className="br-rise border border-orange-500/30 bg-orange-500/6 p-2.5 text-xs leading-5 text-zinc-200">
              <span className="mr-1.5 font-mono text-[10px] text-orange-400">HINT {i + 1}</span>
              {hint.text}
            </li>
          ))}
        </ol>
      )}

      {allShown ? (
        <p className="font-mono text-[11px] text-zinc-500">All hints for this level are shown.</p>
      ) : noTokens ? (
        <p className="font-mono text-[11px] text-zinc-500">No hints left. You can still complete the level.</p>
      ) : confirming ? (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-zinc-300">Use 1 hint? You will have {remaining - 1} left.</span>
          <button
            type="button"
            autoFocus
            onClick={() => {
              onUse();
              setConfirming(false);
            }}
            className="border border-orange-400 bg-orange-500 px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-wider text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            Yes, use it
          </button>
          <button
            type="button"
            onClick={() => setConfirming(false)}
            className="border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider text-zinc-300 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
          >
            Cancel
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setConfirming(true)}
          className="w-full border border-white/15 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Use hint
        </button>
      )}
      <p className="mt-2 text-[10px] text-zinc-600">A hint gives a clue, never the answer. Each hint lowers the final score a little but never blocks progress.</p>
    </section>
  );
}