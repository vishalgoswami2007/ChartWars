import { CATEGORY } from "../engine/reviewEngine";
import { Panel } from "./ui";

export default function ReviewPanel({ summary }) {
  const { review, warmup } = summary;
  const n = (index) => index - warmup + 1;
  const { depth, mistakes, groups, recurring, consistency, timeline, botDecisions } = review;

  return (
    <div className="space-y-3">
      <Panel title="Mistake analysis">
        {mistakes.length === 0 ? (
          <p className="text-sm text-emerald-300">No rule breaks or common mistakes found in your trades.</p>
        ) : depth === "basic" ? (
          <ul className="space-y-2">
            {mistakes.map((m) => (
              <li key={m.id} className="border-l-2 border-amber-500/60 pl-3 text-xs leading-5 text-zinc-300">
                <span className="mr-1.5 font-mono text-zinc-500">Candle {n(m.index)}</span>
                {m.message}
              </li>
            ))}
          </ul>
        ) : (
          <div className="space-y-3">
            {groups.map(([category, count]) => (
              <div key={category}>
                <p className="mb-1 flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-zinc-300">
                  {CATEGORY[category]}
                  <span className="border border-amber-500/50 px-1.5 text-[10px] text-amber-300">{count}</span>
                </p>
                <ul className="space-y-1.5">
                  {mistakes.filter((m) => m.category === category).map((m) => (
                    <li key={m.id} className="border-l-2 border-amber-500/40 pl-3 text-xs leading-5 text-zinc-400">
                      <span className="mr-1.5 font-mono text-zinc-600">Candle {n(m.index)}</span>
                      {m.message}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}

        {depth === "deep" && (
          <div className="mt-3 grid gap-2 border-t border-white/10 pt-3 sm:grid-cols-2">
            <div className="border border-white/10 p-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Recurring weakness</p>
              <p className="mt-1 text-sm text-white">
                {recurring ? CATEGORY[recurring] : "No weakness repeated"}
              </p>
            </div>
            <div className="border border-white/10 p-2.5">
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Consistency</p>
              <p className="mt-1 text-sm text-white">
                {consistency.label}
                {consistency.sd > 0 && <span className="ml-2 font-mono text-[11px] text-zinc-500">spread {consistency.sd.toFixed(2)}R</span>}
              </p>
            </div>
          </div>
        )}
      </Panel>

      <Panel title={`${summary.botName}: decisions explained`}>
        {botDecisions.length === 0 ? (
          <p className="text-xs text-zinc-500">The coach did not take or pass on any setup in this match.</p>
        ) : (
          <ul className="space-y-1.5">
            {botDecisions.map((d, i) => (
              <li key={`${d.index}-${i}`} className="flex gap-3 text-xs leading-5 text-zinc-300">
                <span className="w-16 shrink-0 font-mono text-zinc-500">Candle {n(d.index)}</span>
                <span>{d.text}</span>
              </li>
            ))}
          </ul>
        )}
      </Panel>

      {depth !== "basic" && (
        <Panel title="Decision timeline: you and the coach">
          {timeline.length === 0 ? (
            <p className="text-xs text-zinc-500">No decisions to compare.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-120 text-left text-xs">
                <thead className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                  <tr>
                    <th scope="col" className="pb-1 font-medium">Candle</th>
                    <th scope="col" className="pb-1 font-medium">Who</th>
                    <th scope="col" className="pb-1 font-medium">Decision</th>
                    <th scope="col" className="pb-1 font-medium">Market at the time</th>
                  </tr>
                </thead>
                <tbody>
                  {timeline.map((item, i) => (
                    <tr key={`${item.index}-${item.who}-${i}`} className="border-t border-white/5">
                      <td className="py-1.5 pr-3 font-mono text-zinc-500">{n(item.index)}</td>
                      <td className={`py-1.5 pr-3 font-mono ${item.who === "you" ? "text-orange-300" : "text-sky-300"}`}>{item.who === "you" ? "You" : "Coach"}</td>
                      <td className="py-1.5 pr-3 text-zinc-300">{item.text}</td>
                      <td className="py-1.5 text-zinc-500">{item.regime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}