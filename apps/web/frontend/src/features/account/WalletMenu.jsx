import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Wallet } from "lucide-react";

import { HISTORY_DAYS, START_BALANCE, formatCW, formatPnl, pnlTone, timeAgo, useAccount } from "./accountStore";
import { card, useDismiss, useNow } from "./ui";
import "./account.css";

export default function WalletMenu() {
  const navigate = useNavigate();
  const { wallet } = useAccount();
  const now = useNow();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  // Play the flash only for a change that happens while the page is open, not for old entries.
  const last = wallet.ledger[0];
  const [firstId] = useState(last?.id ?? null);
  const flash = last && last.id !== firstId && last.type === "match" ? (last.amount >= 0 ? "ac-flash-up" : "ac-flash-down") : "";

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);
  const matches = wallet.ledger.filter((l) => l.type === "match");
  const today = matches.filter((l) => l.at >= startOfDay.getTime()).reduce((sum, l) => sum + l.amount, 0);
  const period = matches.reduce((sum, l) => sum + l.amount, 0);
  const recent = wallet.ledger.slice(0, 6);

  return (
    <div ref={ref} className="relative hidden sm:block">
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label={`Virtual balance ${formatCW(wallet.balance)} CW. Open wallet`}
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg border border-white/9 bg-white/2.5 px-3 py-2 text-left transition hover:border-[#e87524]/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60"
      >
        <Wallet size={16} className="text-[#f59a55]" />
        <div>
          <p className="text-[9px] uppercase tracking-wider text-zinc-500">Virtual balance</p>
          <p key={last?.id} className={`mt-0.5 text-xs font-semibold tabular-nums text-zinc-200 ${flash}`}>
            {formatCW(wallet.balance)} CW
          </p>
        </div>
      </button>

      {open && (
        <div role="dialog" aria-label="Virtual wallet" className={`${card} absolute right-0 top-full z-50 mt-2 w-80 p-4 shadow-2xl shadow-black`}>
          <p className="text-[10px] uppercase tracking-[0.2em] text-zinc-500">Virtual wallet</p>
          <p className="mt-1 text-2xl font-semibold tabular-nums text-white">{formatCW(wallet.balance)} <span className="text-sm text-zinc-500">CW</span></p>

          <dl className="mt-3 grid grid-cols-2 gap-3 border-y border-white/8 py-3 text-xs">
            <div>
              <dt className="text-zinc-500">Today</dt>
              <dd className={`font-semibold tabular-nums ${pnlTone(today)}`}>{formatPnl(today)}</dd>
            </div>
            <div>
              <dt className="text-zinc-500">Last {HISTORY_DAYS} days</dt>
              <dd className={`font-semibold tabular-nums ${pnlTone(period)}`}>{formatPnl(period)}</dd>
            </div>
          </dl>

          <p className="mt-3 text-[10px] uppercase tracking-[0.2em] text-zinc-500">Ledger</p>
          <ul className="mt-2 space-y-2">
            {recent.map((item) => (
              <li key={item.id} className="flex items-center gap-3 text-xs">
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-zinc-200">{item.label}</span>
                  <span className="text-[10px] text-zinc-600">{timeAgo(item.at, now)}</span>
                </span>
                <span className="text-right tabular-nums">
                  <span className={`block font-medium ${pnlTone(item.amount)}`}>{item.type === "start" ? "—" : formatPnl(item.amount)}</span>
                  <span className="text-[10px] text-zinc-600">{formatCW(item.balance)}</span>
                </span>
              </li>
            ))}
          </ul>

          <p className="mt-3 text-[10px] leading-4 text-zinc-600">
            Virtual funds only, no cash value. 1 CW equals $1 of match profit or loss. The balance updates when a match ends. It starts at {formatCW(START_BALANCE)} CW.
          </p>
          <button
            type="button"
            onClick={() => {
              setOpen(false);
              navigate("/dashboard/history");
            }}
            className="mt-3 w-full rounded-lg border border-white/10 py-2 text-xs text-zinc-300 transition hover:border-[#e87524]/40 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60"
          >
            View match history
          </button>
        </div>
      )}
    </div>
  );
}