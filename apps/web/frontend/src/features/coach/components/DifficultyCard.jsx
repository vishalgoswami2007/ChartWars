import { Check, Lock } from "lucide-react";

export default function DifficultyCard({ config, selected, onSelect }) {
  const locked = config.status === "locked";
  return (
    <button
      type="button"
      disabled={locked}
      aria-pressed={selected}
      aria-disabled={locked}
      onClick={() => onSelect(config.id)}
      className={`cc-tile flex h-full flex-col p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
        selected ? "is-selected" : ""
      } ${locked ? "is-locked" : ""}`}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-lg font-bold uppercase tracking-widest text-white">{config.label}</span>
        <span
          className={`flex items-center gap-1 border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${
            locked ? "border-white/15 text-zinc-500" : "border-emerald-500/40 text-emerald-300"
          }`}
        >
          {locked && <Lock size={10} />}
          {locked ? "Locked" : "Open"}
        </span>
      </div>
      <p className="mt-1 text-sm font-medium text-orange-300">{config.tag}</p>

      <ul className="mt-3 flex-1 space-y-2">
        {config.summary.map((line) => (
          <li key={line} className="flex gap-2 text-xs leading-5 text-zinc-400">
            <Check size={13} className={`mt-0.5 shrink-0 ${locked ? "text-zinc-600" : "text-orange-500"}`} />
            {line}
          </li>
        ))}
      </ul>

      {!locked && (
        <dl className="mt-4 grid grid-cols-3 gap-2 border-t border-white/10 pt-3 font-mono text-[10px] text-zinc-500">
          <div>
            <dt>Max drawdown</dt>
            <dd className="text-xs text-zinc-200">{(config.maxDrawdown * 100).toFixed(0)}%</dd>
          </div>
          <div>
            <dt>Min R:R</dt>
            <dd className="text-xs text-zinc-200">{config.minRR}:1</dd>
          </div>
          <div>
            <dt>Hints</dt>
            <dd className="text-xs text-zinc-200">{config.hints.label}</dd>
          </div>
        </dl>
      )}
    </button>
  );
}