import { rOf, unrealized } from "../engine/tradeSimulator";
import { fmtMoney, fmtPrice, fmtR, tone } from "../format";
import { Panel } from "./ui";

export default function BotPanel({ rules, coach, botLog, price, warmup }) {
  const reasons = rules.bot.reasons;
  const pos = coach.position;
  const recent = [...botLog].reverse().slice(0, 4);

  return (
    <Panel title={rules.bot.name} className="shrink-0">
      <p className="mb-2 text-[11px] leading-5 text-zinc-500">{rules.bot.about}</p>

      {pos ? (
        <div className="border border-white/10 bg-black/30 p-2 font-mono text-[11px]">
          <p className="flex justify-between">
            <span className={pos.side === "buy" ? "text-emerald-300" : "text-red-300"}>{pos.side === "buy" ? "LONG" : "SHORT"}</span>
            <span className={tone(unrealized(pos, price))}>{fmtMoney(unrealized(pos, price), true)}</span>
          </p>
          {reasons === "live" ? (
            <p className="mt-1 text-zinc-400">
              Entry {fmtPrice(pos.entry)} · SL {fmtPrice(pos.stop)} · {fmtR(rOf(pos, price))}
            </p>
          ) : (
            <p className="mt-1 text-zinc-600">Entry details are hidden until the review.</p>
          )}
        </div>
      ) : (
        <p className="font-mono text-[11px] text-zinc-500">Flat. Waiting for a setup.</p>
      )}

      {reasons === "live" ? (
        <ul className="mt-2 space-y-1.5" aria-live="polite">
          {recent.length === 0 ? (
            <li className="font-mono text-[11px] text-zinc-600">No decisions yet.</li>
          ) : (
            recent.map((entry, i) => (
              <li key={`${entry.index}-${i}`} className="border-l-2 border-orange-500/50 pl-2 text-[11px] leading-4 text-zinc-300">
                <span className="mr-1 font-mono text-zinc-500">#{entry.index - warmup + 1}</span>
                {entry.text}
              </li>
            ))
          )}
        </ul>
      ) : (
        <p className="mt-2 border-l-2 border-white/15 pl-2 text-[11px] leading-4 text-zinc-500">
          {reasons === "after"
            ? "The coach's reasons are shown after the round."
            : "The coach's reasons are hidden until the detailed review."}
        </p>
      )}
    </Panel>
  );
}