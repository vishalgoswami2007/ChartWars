import { equityOf } from "../engine/tradeSimulator";
import { fmtMoney, fmtPct, tone } from "../format";

function Card({ name, side, price, capital, mirror, badge }) {
  const equity = equityOf(side, price);
  const pnl = equity - capital;
  const pos = side.position;
  return (
    <div className={`cc-panel flex min-w-0 items-center gap-3 p-3 ${mirror ? "flex-row-reverse text-right" : ""}`}>
      <span className="flex size-11 shrink-0 items-center justify-center border border-orange-500/50 bg-orange-500/10 font-mono text-lg font-bold text-orange-300">
        {badge}
      </span>
      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-semibold text-white">{name}</p>
        <p className="truncate font-mono text-[11px] text-zinc-500">
          {pos ? (
            <span className={pos.side === "buy" ? "text-emerald-300" : "text-red-300"}>{pos.side === "buy" ? "LONG" : "SHORT"}</span>
          ) : (
            "FLAT"
          )}{" "}
          · {side.tradeCount} trades {side.busted && <span className="text-red-400">· LIMIT HIT</span>}
        </p>
      </div>
      <div className={mirror ? "text-left" : "text-right"}>
        <p className="font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">P&amp;L</p>
        <p className={`font-mono text-2xl font-bold leading-7 tabular-nums ${tone(pnl)}`}>{fmtMoney(pnl, true)}</p>
        <p className={`font-mono text-[11px] ${tone(pnl)}`}>{fmtPct((pnl / capital) * 100)}</p>
      </div>
    </div>
  );
}

export default function MatchScoreboard({ you, coach, price, capital, botName, children }) {
  return (
    <div className="grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-3 max-lg:grid-cols-1">
      <Card name="You" side={you} price={price} capital={capital} badge="Y" />
      <div className="min-w-64 text-center">{children}</div>
      <Card name={botName} side={coach} price={price} capital={capital} mirror badge="C" />
    </div>
  );
}