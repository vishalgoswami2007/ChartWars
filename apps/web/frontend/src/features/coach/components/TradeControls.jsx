import { useEffect, useRef, useState } from "react";
import { Minus, Plus } from "lucide-react";

import { buildOrder, getBlockers, stopPriceFromFrac } from "../engine/tradeSimulator";
import { clamp, fmtMoney, fmtPrice, fmtSize } from "../format";
import { Meter, Panel, chip } from "./ui";

const label = "mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500";

export default function TradeControls({ rules, costs, price, atr, acct, index, running, defaultRisk, onOrder }) {
  const t = rules.ticket;
  const [risk, setRisk] = useState(defaultRisk);
  const [stopText, setStopText] = useState(rules.defaultStopPct ?? "0.60");
  const [preset, setPreset] = useState(rules.defaultStopPreset ?? 1);
  const [tp, setTp] = useState(rules.defaultTp);

  const frac = t.stop === "preset" ? (rules.stopPresets[preset].atr * atr) / price : Number(stopText) / 100;
  const fracOk = Number.isFinite(frac) && frac >= 0.0005 && frac <= 0.1;

  const blockers = [
    ...getBlockers(acct, { running, rules }),
    ...(fracOk ? [] : ["Set a stop-loss between 0.05% and 10%"]),
  ];
  const blocked = blockers.length > 0;

  const base = { price, balance: acct.balance, tpMult: tp, riskFrac: risk, rules, costs };
  const preview = (side) => (fracOk ? buildOrder({ ...base, side, stopPrice: stopPriceFromFrac(side, price, frac) }) : null);
  const buy = preview("buy");
  const sell = preview("sell");

  const warnings = [];
  if (rules.requireTp && !tp) warnings.push("This level expects a take-profit. Skipping it counts as a rule break.");
  if (tp && tp < rules.minRR) warnings.push(`Reward below ${rules.minRR}R counts as a rule break on this level.`);
  if (rules.cooldownCandles > 0 && index - acct.lastLossIndex <= rules.cooldownCandles) {
    warnings.push("You are within the cooling-off period after a loss. Trading now counts as a revenge-trade rule break.");
  }

  const submit = (side) => {
    if (blocked) return;
    onOrder({ side, stopFrac: frac, tpMult: tp, riskFrac: risk });
  };

  const latest = useRef(submit);
  useEffect(() => {
    latest.current = submit;
  });
  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (key === "b") latest.current("buy");
      else if (key === "s") latest.current("sell");
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const step = (delta) => {
    const current = Number.isFinite(Number(stopText)) ? Number(stopText) : 0.6;
    setStopText(String(clamp(Math.round((current + delta) * 100) / 100, 0.05, 10)));
  };

  const shown = buy ?? sell;
  const riskText = (risk * 100).toFixed(2).replace(/\.?0+$/, "");

  return (
    <Panel title="Order ticket" className="shrink-0">
      <p className={label}>Risk per trade</p>
      {t.risk === "preset" ? (
        <p className="font-mono text-xs text-zinc-200">{riskText}% of your balance (preset)</p>
      ) : (
        <div className="flex gap-1.5">
          {rules.riskOptions.map((r) => (
            <button key={r} type="button" aria-pressed={risk === r} onClick={() => setRisk(r)} className={chip(risk === r)}>
              {(r * 100).toFixed(2).replace(/\.?0+$/, "")}%
            </button>
          ))}
        </div>
      )}

      <p className={`${label} mt-2.5`}>Stop-loss (required)</p>
      {t.stop === "preset" ? (
        <div className="flex gap-1.5">
          {rules.stopPresets.map((p, i) => (
            <button key={p.label} type="button" aria-pressed={preset === i} onClick={() => setPreset(i)} className={`${chip(preset === i)} flex-1`}>
              {p.label}
            </button>
          ))}
        </div>
      ) : (
        <div className="flex items-center gap-1.5">
          <button type="button" aria-label="Tighter stop-loss" onClick={() => step(-0.1)} className={chip(false)}>
            <Minus size={12} />
          </button>
          <div className="flex h-8 flex-1 items-center border border-white/10 bg-black/40 px-2">
            <input
              value={stopText}
              onChange={(event) => setStopText(event.target.value)}
              inputMode="decimal"
              aria-label="Stop-loss distance in percent"
              className="w-full bg-transparent font-mono text-sm text-white outline-none"
            />
            <span className="font-mono text-xs text-zinc-500">%</span>
          </div>
          <button type="button" aria-label="Wider stop-loss" onClick={() => step(0.1)} className={chip(false)}>
            <Plus size={12} />
          </button>
        </div>
      )}

      <p className={`${label} mt-2.5`}>Take-profit</p>
      {t.tp === "preset" ? (
        <p className="font-mono text-xs text-zinc-200">{tp}R (preset)</p>
      ) : (
        <div className="flex gap-1.5">
          {rules.tpOptions.map((m) => (
            <button key={m ?? "none"} type="button" aria-pressed={tp === m} onClick={() => setTp(m)} className={`${chip(tp === m)} flex-1`}>
              {m ? `${m}R` : "None"}
            </button>
          ))}
        </div>
      )}

      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <div className="flex justify-between"><dt className="text-zinc-500">Size</dt><dd className="text-zinc-200">{shown ? fmtSize(shown.size) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Risk</dt><dd className="text-zinc-200">{shown ? fmtMoney(shown.riskAmount) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Buy stop</dt><dd className="text-red-300">{buy ? fmtPrice(buy.stop) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Sell stop</dt><dd className="text-red-300">{sell ? fmtPrice(sell.stop) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Fee (entry)</dt><dd className="text-zinc-200">{shown ? fmtMoney(shown.fee) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Capped</dt><dd className={shown?.capped ? "text-orange-300" : "text-zinc-200"}>{shown?.capped ? "Yes, max leverage" : "No"}</dd></div>
      </dl>

      {t.budget && shown && (
        <div className="mt-2.5 space-y-2 border border-white/10 bg-black/30 p-2">
          <Meter
            label="Risk budget used"
            value={shown.riskAmount}
            max={acct.balance * rules.riskBudgetFrac}
            text={`${((shown.riskAmount / acct.balance) * 100).toFixed(2)}% of ${(rules.riskBudgetFrac * 100).toFixed(2)}%`}
            color="bg-orange-400"
          />
          <Meter
            label="Exposure"
            value={shown.notional}
            max={acct.balance * rules.maxLeverage}
            text={`${(shown.notional / acct.balance).toFixed(2)}x of ${rules.maxLeverage}x`}
            color="bg-sky-400"
          />
        </div>
      )}

      {warnings.length > 0 && (
        <ul className="mt-2 space-y-1">
          {warnings.map((w) => (
            <li key={w} className="border-l-2 border-amber-500/60 pl-2 text-[11px] leading-4 text-amber-200">{w}</li>
          ))}
        </ul>
      )}

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={blocked} onClick={() => submit("buy")} className="cc-buy h-11 bg-emerald-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-35">
          BUY <span className="ml-1 text-[10px] font-normal opacity-70">[B]</span>
        </button>
        <button type="button" disabled={blocked} onClick={() => submit("sell")} className="cc-sell h-11 bg-red-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-35">
          SELL <span className="ml-1 text-[10px] font-normal opacity-70">[S]</span>
        </button>
      </div>
      <p className={`mt-1.5 min-h-4 font-mono text-[10px] ${blocked ? "text-amber-300" : "text-zinc-600"}`}>
        {blocked ? blockers[0] : "Fills at the latest close plus small slippage and a fee."}
      </p>
    </Panel>
  );
}