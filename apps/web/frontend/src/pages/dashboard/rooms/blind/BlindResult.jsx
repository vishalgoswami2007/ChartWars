import { Check, Circle, TriangleAlert } from "lucide-react";

import { SCORING } from "./utils/blind-scoring";

export function Stars({ count, max = 3, size = 16 }) {
  return (
    <span className="inline-flex items-center gap-0.5" role="img" aria-label={`${count} of ${max} stars`}>
      {Array.from({ length: max }, (_, i) => (
        <svg
          key={i}
          viewBox="0 0 24 24"
          width={size}
          height={size}
          fill="currentColor"
          className={`br-star ${i < count ? "is-on" : ""}`}
          style={{ animationDelay: `${i * 0.18}s` }}
          aria-hidden="true"
        >
          <path d="M12 2.5l2.9 6.1 6.6.9-4.8 4.6 1.2 6.6L12 17.5l-5.9 3.2 1.2-6.6L2.5 9.5l6.6-.9z" />
        </svg>
      ))}
    </span>
  );
}

function Bar({ label, value, pass }) {
  return (
    <div>
      <div className="flex justify-between font-mono text-[10px] uppercase tracking-wider text-zinc-500">
        <span>{label}</span>
        <span className="text-zinc-200">{value}</span>
      </div>
      <div className="mt-1 h-1.5 bg-white/8">
        <div className={`br-bar h-full ${pass ? "bg-emerald-400" : "bg-orange-400"}`} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

export default function BlindResult({ result, level, hasNext, onRetry, onNext, onMap }) {
  const { evaluation, scoring } = result;
  const { decision, reasoning } = evaluation;
  const reasoningOk = reasoning.score >= SCORING.reasoningPass;

  return (
    <section className="br-panel br-rise flex flex-col gap-3 p-4" aria-labelledby="result-title">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Answer evaluation</p>
          <h2 id="result-title" className={`font-mono text-3xl font-bold tracking-widest ${scoring.passed ? "text-emerald-400" : "text-orange-300"}`}>
            {scoring.passed ? "PASSED" : "NOT YET"}
          </h2>
        </div>
        <div className="text-right">
          <Stars count={scoring.stars} size={22} />
          <p className="mt-1 font-mono text-[11px] text-zinc-400">Final score {scoring.finalScore}</p>
        </div>
      </div>

      {result.firstClear && hasNext && <p className="border border-emerald-500/40 bg-emerald-500/8 px-3 py-2 text-xs text-emerald-300">Next level unlocked.</p>}

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
        <div className="space-y-3 border border-white/10 p-3">
          <Bar label="Decision" value={decision.score} pass={decision.acceptable} />
          <Bar label={`Reasoning (pass ${SCORING.reasoningPass})`} value={reasoning.score} pass={reasoningOk} />
          {scoring.hintPenalty > 0 && <p className="font-mono text-[10px] text-zinc-500">Hint penalty: -{scoring.hintPenalty} points</p>}
        </div>
        <div className={`border p-3 text-xs leading-5 ${decision.acceptable ? "border-emerald-500/30 text-zinc-300" : "border-red-500/40 text-zinc-300"}`}>
          <p className="mb-1 font-mono text-[10px] uppercase tracking-wider text-zinc-500">
            Your decision: {decision.id.toUpperCase()} · {decision.acceptable ? "acceptable" : "not accepted here"}
          </p>
          {decision.feedback}
        </div>
      </div>

      <div>
        <p className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Your reasoning</p>
        <ul className="space-y-1.5">
          {reasoning.matched.map((m) => (
            <li key={m.id} className="flex items-start gap-2 text-xs text-zinc-300">
              <Check size={13} className="mt-0.5 shrink-0 text-emerald-400" />
              {m.label}
            </li>
          ))}
          {reasoning.missing.map((m) => (
            <li key={m.id} className="flex items-start gap-2 text-xs text-zinc-500">
              <Circle size={13} className="mt-0.5 shrink-0" />
              Missing: {m.label}
              {m.required && <span className="text-orange-300"> (needed)</span>}
            </li>
          ))}
        </ul>
        {reasoning.missingGroups.length > 0 && (
          <p className="mt-1.5 text-xs text-orange-300">Include at least one of the swing-structure points above.</p>
        )}
      </div>

      {(reasoning.notes.length > 0 || reasoning.misconceptions.length > 0) && (
        <ul className="space-y-1.5">
          {reasoning.notes.map((note) => (
            <li key={note} className="flex items-start gap-2 border border-amber-500/30 bg-amber-500/6 px-2.5 py-2 text-xs text-amber-200">
              <TriangleAlert size={13} className="mt-0.5 shrink-0" />
              {note}
            </li>
          ))}
          {reasoning.misconceptions.map((m) => (
            <li key={m.id} className="flex items-start gap-2 border border-red-500/30 bg-red-500/6 px-2.5 py-2 text-xs text-red-200">
              <TriangleAlert size={13} className="mt-0.5 shrink-0" />
              {m.message}
            </li>
          ))}
        </ul>
      )}

      <div className="border-l-2 border-orange-500/60 pl-3">
        <p className="mb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">What the chart shows</p>
        <p className="text-xs leading-5 text-zinc-300">{level.explanation}</p>
        <p className="mt-1.5 text-[11px] text-zinc-500">The next candles on the chart were fixed in advance. Your answer did not change them.</p>
      </div>

      <div className="flex flex-wrap gap-2">
        {scoring.passed && hasNext && (
          <button type="button" autoFocus onClick={onNext} className="border border-orange-400 bg-orange-500 px-4 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300">
            Next level
          </button>
        )}
        <button type="button" autoFocus={!scoring.passed || !hasNext} onClick={onRetry} className="border border-white/20 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-100 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          {scoring.passed ? "Practise again" : "Retry"}
        </button>
        <button type="button" onClick={onMap} className="border border-white/15 px-4 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400">
          Level map
        </button>
      </div>
      <p className="text-[10px] leading-4 text-zinc-600">
        This checker compares your answer with concepts written in advance. It does not understand language like a person, so a valid idea in unusual wording can be missed. Educational only. Not investment advice.
      </p>
    </section>
  );
}