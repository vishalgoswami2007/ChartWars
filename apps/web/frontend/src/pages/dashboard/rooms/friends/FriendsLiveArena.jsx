import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { AlertCircle, LogOut, Maximize2, Minus, Plus, RefreshCw } from "lucide-react";

import FriendsChart from "./FriendsChart";
import PermissionsPanel from "./FriendsPermissions";
import VoicePanel, { useDemoSpeaking, useLocalMedia } from "./FriendsVoicePanel";
import {
  CFG,
  DEMO_MODE,
  ROUTES,
  SYMBOLS,
  buildSummary,
  canTrade,
  checkExits,
  clamp,
  clearRoom,
  clock,
  computeOrder,
  drawdownOf,
  equityOf,
  fmtMoney,
  fmtPct,
  fmtPrice,
  fmtSize,
  friendStep,
  getBlockers,
  loadRoom,
  marketExit,
  newAccount,
  openPosition,
  pnlOf,
  pushHistory,
  rotateCode,
  tone,
  usePriceFeed,
} from "./friendsData";
import "./friends-room.css";

const STOP_PRESETS = [
  { label: "Tight", pct: 0.1 },
  { label: "Normal", pct: 0.25 },
  { label: "Wide", pct: 0.5 },
];
const STALL_MS = 5000;

function Panel({ title, right, children, className = "" }) {
  return (
    <section className={`fr-panel p-3 ${className}`}>
      {title && (
        <h2 className="mb-2 flex items-center justify-between gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
          <span>{title}</span>
          {right}
        </h2>
      )}
      {children}
    </section>
  );
}

function Ticket({ ticker, running, allowed, acct, price, buy, sell, riskIdx, setRiskIdx, stopText, setStopText, tp, setTp, onTrade }) {
  const stopPct = parseFloat(stopText);
  const blockers = getBlockers({ running, acct, price, stopPct, allowed });
  const blocked = blockers.length > 0;
  const step = (delta) => {
    const base = Number.isFinite(stopPct) ? stopPct : STOP_PRESETS[1].pct;
    setStopText(String(clamp(Math.round((base + delta) * 100) / 100, CFG.stopMin, CFG.stopMax)));
  };
  const chip = (active) =>
    `border px-2.5 py-1.5 font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
      active ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-400 hover:text-white"
    }`;
  const label = "mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500";

  return (
    <Panel title="Order ticket" className="shrink-0">
      <p className={label}>Risk per trade</p>
      <div className="flex gap-1.5">
        {CFG.risks.map((r, i) => (
          <button key={r} type="button" aria-pressed={riskIdx === i} onClick={() => setRiskIdx(i)} className={chip(riskIdx === i)}>
            {(r * 100).toFixed(2).replace(/\.?0+$/, "")}%
          </button>
        ))}
      </div>

      <p className={`${label} mt-2.5`}>Stop-loss distance (required)</p>
      <div className="flex items-center gap-1.5">
        <button type="button" aria-label="Tighter stop-loss" onClick={() => step(-CFG.stopStep)} className={chip(false)}>
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
        <button type="button" aria-label="Wider stop-loss" onClick={() => step(CFG.stopStep)} className={chip(false)}>
          <Plus size={12} />
        </button>
      </div>
      <div className="mt-1.5 flex gap-1.5">
        {STOP_PRESETS.map((p) => (
          <button key={p.label} type="button" onClick={() => setStopText(String(p.pct))} className={`${chip(stopPct === p.pct)} flex-1`}>
            {p.label}
          </button>
        ))}
      </div>

      <p className={`${label} mt-2.5`}>Take-profit (optional)</p>
      <div className="flex gap-1.5">
        {CFG.tps.map((m) => (
          <button key={m ?? "none"} type="button" aria-pressed={tp === m} onClick={() => setTp(m)} className={`${chip(tp === m)} flex-1`}>
            {m ? `${m}R` : "None"}
          </button>
        ))}
      </div>

      <dl className="mt-2.5 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
        <div className="flex justify-between"><dt className="text-zinc-500">Size</dt><dd className="text-zinc-200">{buy ? `${fmtSize(buy.size)} ${ticker}` : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Risk</dt><dd className="text-zinc-200">{buy ? fmtMoney(buy.riskAmount) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Buy stop</dt><dd className="text-red-300">{buy ? fmtPrice(buy.stop) : "—"}</dd></div>
        <div className="flex justify-between"><dt className="text-zinc-500">Sell stop</dt><dd className="text-red-300">{sell ? fmtPrice(sell.stop) : "—"}</dd></div>
      </dl>

      <div className="mt-3 grid grid-cols-2 gap-2">
        <button type="button" disabled={blocked} onClick={() => onTrade("buy")} className="fr-buy h-11 bg-emerald-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-emerald-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300 disabled:cursor-not-allowed disabled:opacity-35">
          BUY <span className="ml-1 text-[10px] font-normal opacity-70">[B]</span>
        </button>
        <button type="button" disabled={blocked} onClick={() => onTrade("sell")} className="fr-sell h-11 bg-red-500 font-mono text-sm font-bold tracking-widest text-black transition hover:bg-red-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-35">
          SELL <span className="ml-1 text-[10px] font-normal opacity-70">[S]</span>
        </button>
      </div>
      <p className={`mt-1.5 min-h-4 font-mono text-[10px] ${blocked ? "text-amber-300" : "text-zinc-600"}`}>
        {blocked ? blockers[0] : "Market order. Fills with small simulated slippage."}
      </p>
    </Panel>
  );
}

function LiveArena({ initial }) {
  const navigate = useNavigate();
  const room = initial;
  const sym = SYMBOLS.find((s) => s.id === room.symbol) ?? SYMBOLS[0];
  const total = room.minutes * 60000;

  const [people, setPeople] = useState(room.participants);
  const [phase, setPhase] = useState("countdown"); // countdown | running | ended
  const [count, setCount] = useState(3);
  const [remaining, setRemaining] = useState(total);
  const [acct, setAcct] = useState(newAccount);
  const [riskIdx, setRiskIdx] = useState(1);
  const [stopText, setStopText] = useState("0.25");
  const [tp, setTp] = useState(2);
  const [tab, setTab] = useState("perms");
  const [announce, setAnnounce] = useState("");
  const [stalled, setStalled] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showEma, setShowEma] = useState(true);
  const [fitKey, setFitKey] = useState(0);
  const [endInfo, setEndInfo] = useState(null);

  const media = useLocalMedia();
  const speakingId = useDemoSpeaking(people);

  const phaseRef = useRef("countdown");
  const acctRef = useRef(acct);
  const peopleRef = useRef(people);
  const deadlineRef = useRef(0);
  const evalRef = useRef(0);
  const samplesRef = useRef([]);
  const lastSampleRef = useRef(0);
  const maxDdRef = useRef(0);
  const endedRef = useRef(false);
  const latest = useRef({});

  const feed = usePriceFeed(room.symbol, (p, c) => latest.current.tick?.(p, c));
  const price = feed.price;

  useEffect(() => {
    peopleRef.current = people;
  }, [people]);

  const commitAcct = (next) => {
    acctRef.current = next;
    setAcct(next);
  };

  const finish = (reason, atPrice) => {
    if (endedRef.current) return;
    endedRef.current = true;
    phaseRef.current = "ended";
    const p = Number.isFinite(atPrice) ? atPrice : feed.priceRef.current;
    const closed = Number.isFinite(p) ? marketExit(acctRef.current, p, "match end", Date.now()) : acctRef.current;
    commitAcct(closed);
    samplesRef.current.push(closed.balance);

    const entry = buildSummary({ room, acct: closed, samples: samplesRef.current, maxDd: maxDdRef.current, reason, people: peopleRef.current });
    pushHistory(entry);
    rotateCode(); // a fresh room code for the next match
    clearRoom();
    setEndInfo(entry);
    setPhase("ended");
    setConfirmOpen(false);
    setAnnounce("Match ended");
  };

  const handleTick = (tickPrice, candles) => {
    if (phaseRef.current !== "running") return;
    const now = Date.now();
    let next = checkExits(acctRef.current, tickPrice, now);

    if (DEMO_MODE) {
      const trader = peopleRef.current.find((p) => p.id !== "you" && canTrade(p));
      if (trader) next = friendStep(next, candles, tickPrice, now, evalRef, trader.name);
    }

    if (next !== acctRef.current) {
      commitAcct(next);
      const last = next.trades[next.trades.length - 1];
      if (!next.position && last) setAnnounce(`Position closed by ${last.reason}: ${fmtMoney(last.pnl, true)}`);
    }

    const dd = drawdownOf(equityOf(next, tickPrice));
    if (dd > maxDdRef.current) maxDdRef.current = dd;
    if (dd >= CFG.maxDrawdown) finish("drawdown", tickPrice);
  };

  const stopPct = parseFloat(stopText);
  const me = people.find((p) => p.id === "you");
  const allowed = Boolean(me && canTrade(me));
  const base = { balance: acct.balance, price, stopFrac: stopPct / 100, riskFrac: CFG.risks[riskIdx], tpMult: tp };
  const previewBuy = computeOrder({ ...base, side: "buy" });
  const previewSell = computeOrder({ ...base, side: "sell" });

  const placeOrder = (side) => {
    const meNow = peopleRef.current.find((p) => p.id === "you");
    const livePrice = feed.priceRef.current;
    const current = acctRef.current;
    const allow = Boolean(meNow && canTrade(meNow));
    if (getBlockers({ running: phaseRef.current === "running", acct: current, price: livePrice, stopPct, allowed: allow }).length > 0) return;
    const order = computeOrder({ balance: current.balance, price: livePrice, side, stopFrac: stopPct / 100, riskFrac: CFG.risks[riskIdx], tpMult: tp });
    if (!order) return;
    commitAcct(openPosition(current, order, Date.now(), "You"));
    setAnnounce(`${side === "buy" ? "Buy" : "Sell"} position opened`);
  };

  const closeNow = () => {
    const meNow = peopleRef.current.find((p) => p.id === "you");
    if (phaseRef.current !== "running" || !acctRef.current.position || !meNow || !canTrade(meNow)) return;
    const next = marketExit(acctRef.current, feed.priceRef.current, "manual", Date.now());
    commitAcct(next);
    const last = next.trades[next.trades.length - 1];
    setAnnounce(`Position closed: ${fmtMoney(last.pnl, true)}`);
  };

  const updatePerm = (id, key, value) => {
    setPeople((prev) => prev.map((p) => (p.id === id ? { ...p, perms: { ...p.perms, [key]: value } } : p)));
    const who = people.find((p) => p.id === id)?.name ?? "Player";
    setAnnounce(`${who}: ${key} permission ${value ? "granted" : "removed"}`);
  };
  const kick = (id) => {
    setPeople((prev) => prev.filter((p) => p.id !== id));
    setAnnounce("A player was removed from the room");
  };

  useEffect(() => {
    latest.current = { tick: handleTick, finish, placeOrder, closeNow, escape: () => setConfirmOpen(false) };
  });

  // 3-2-1 countdown, started once the price is ready.
  useEffect(() => {
    if (phase !== "countdown" || !feed.ready) return undefined;
    let n = 3;
    const id = setInterval(() => {
      n -= 1;
      if (n > 0) {
        setCount(n);
        return;
      }
      clearInterval(id);
      deadlineRef.current = Date.now() + total;
      lastSampleRef.current = Date.now();
      samplesRef.current = [CFG.capital];
      phaseRef.current = "running";
      setRemaining(total);
      setPhase("running");
      setAnnounce("Match started");
    }, 1000);
    return () => clearInterval(id);
  }, [phase, feed.ready, total]);

  // Timestamp-based timer, so a hidden tab cannot slow the match down.
  useEffect(() => {
    if (phase !== "running") return undefined;
    const id = setInterval(() => {
      const now = Date.now();
      const ms = Math.max(0, deadlineRef.current - now);
      setRemaining(ms);
      setStalled(now - feed.lastTickRef.current > STALL_MS);
      if (now - lastSampleRef.current >= 5000) {
        lastSampleRef.current = now;
        samplesRef.current.push(equityOf(acctRef.current, feed.priceRef.current));
      }
      if (ms <= 0) latest.current.finish?.("time");
    }, 250);
    return () => clearInterval(id);
  }, [phase, feed.lastTickRef, feed.priceRef]);

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (key === "escape") latest.current.escape?.();
      else if (key === "b") latest.current.placeOrder?.("buy");
      else if (key === "s") latest.current.placeOrder?.("sell");
      else if (key === "x") latest.current.closeNow?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const equity = equityOf(acct, price);
  const pnl = equity - CFG.capital;
  const dd = drawdownOf(equity);
  const used = clamp(dd / CFG.maxDrawdown, 0, 1);
  const running = phase === "running";
  const urgent = running && remaining <= 10000;
  const pos = acct.position;
  const unrealised = pos ? pnlOf(pos, price) : 0;
  const recent = acct.trades.slice(-6).reverse();

  return (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto">
      <p className="sr-only" aria-live="polite">{announce}</p>

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <button type="button" disabled={phase === "ended"} onClick={() => setConfirmOpen(true)} className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40">
          <LogOut size={14} />
          Leave match
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Friends <span className="text-orange-500">/</span> Live arena <span className="ml-2 text-zinc-700">{room.code}</span>
        </p>
        <div className="flex items-center gap-2">
          {DEMO_MODE && <span className="border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">Demo: simulated friends and prices</span>}
          <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider ${stalled ? "border-red-500/50 text-red-300" : "border-white/10 text-zinc-400"}`}>
            {stalled ? "Feed stalled" : feed.status === "loading" ? "Connecting" : feed.source === "coingecko" ? "Sim feed · CoinGecko base" : "Demo price"}
          </span>
        </div>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <div className="shrink-0">
            <VoicePanel people={people} players={room.players} media={media} speakingId={speakingId} compact />
          </div>

          <Panel className="flex min-h-0 flex-1 flex-col max-lg:h-96 max-lg:flex-none">
            <div className="mb-2 flex shrink-0 flex-wrap items-center gap-3">
              <span className="border border-orange-500/50 bg-orange-500/10 px-2 py-1 font-mono text-[11px] text-orange-300">{sym.ticker}/USD</span>
              <span className="font-mono text-lg font-bold tabular-nums text-white">{fmtPrice(price)}</span>
              <span className={`font-mono text-2xl font-bold tabular-nums ${urgent ? "fr-urgent" : "text-orange-300"}`} role="timer" aria-label={`${clock(remaining)} left`}>
                {clock(remaining)}
              </span>
              <div className="ml-auto flex items-center gap-1.5">
                <button type="button" aria-pressed={showEma} onClick={() => setShowEma((v) => !v)} className={`border px-2 py-1 font-mono text-[10px] ${showEma ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-500"}`}>EMA 20</button>
                <button type="button" aria-label="Fit chart" onClick={() => setFitKey((k) => k + 1)} className="border border-white/10 p-1.5 text-zinc-400 transition hover:text-white"><Maximize2 size={12} /></button>
              </div>
            </div>
            <FriendsChart candles={feed.candles} position={pos} showEma={showEma} fitKey={fitKey} />
            {stalled && running && <p role="alert" className="mt-2 font-mono text-[11px] text-red-300">Price feed stalled. Orders may fill at an old price.</p>}
          </Panel>
        </div>

        <aside className="fr-scroll flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
          <Panel title="Room account" className="shrink-0">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono">
              <div><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Equity</p><p className="text-sm font-semibold tabular-nums text-white">{fmtMoney(equity)}</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Total P&amp;L</p><p className={`text-sm font-semibold tabular-nums ${tone(pnl)}`}>{fmtMoney(pnl, true)} <span className="text-[10px]">{fmtPct((pnl / CFG.capital) * 100)}</span></p></div>
            </div>
            <div className="mt-3">
              <div className="flex justify-between font-mono text-[10px] text-zinc-500">
                <span>Drawdown</span>
                <span className={used >= 0.8 ? "text-red-400" : ""}>{(dd * 100).toFixed(2)}% / {(CFG.maxDrawdown * 100).toFixed(2)}%</span>
              </div>
              <div className="mt-1 h-1.5 bg-white/8">
                <div className={`fr-dd h-full ${used < 0.5 ? "bg-emerald-400" : used < 0.8 ? "bg-orange-400" : "bg-red-500"}`} style={{ width: `${used * 100}%` }} />
              </div>
            </div>
          </Panel>

          <Ticket
            ticker={sym.ticker}
            running={running}
            allowed={allowed}
            acct={acct}
            price={price}
            buy={previewBuy}
            sell={previewSell}
            riskIdx={riskIdx}
            setRiskIdx={setRiskIdx}
            stopText={stopText}
            setStopText={setStopText}
            tp={tp}
            setTp={setTp}
            onTrade={placeOrder}
          />

          {DEMO_MODE && me && me.role !== "host" && !allowed && (
            <button
              type="button"
              onClick={() => updatePerm("you", "trade", true)}
              className="border border-amber-500/40 bg-amber-500/10 px-3 py-2 font-mono text-[10px] uppercase tracking-wider text-amber-300 transition hover:bg-amber-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
            >
              Demo: host grants me trade permission
            </button>
          )}

          <Panel
            title="Open position"
            className="shrink-0"
            right={pos && <span className={`px-1.5 py-0.5 text-[10px] ${pos.side === "buy" ? "bg-emerald-500/20 text-emerald-300" : "bg-red-500/20 text-red-300"}`}>{pos.side.toUpperCase()} by {pos.by}</span>}
          >
            {pos ? (
              <>
                <div className="flex items-end justify-between">
                  <p className={`font-mono text-xl font-bold tabular-nums ${tone(unrealised)}`}>{fmtMoney(unrealised, true)}</p>
                  <button type="button" disabled={!running || !allowed} onClick={closeNow} className="border border-white/15 px-3 py-1.5 font-mono text-[11px] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40">
                    Close [X]
                  </button>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><dt className="text-zinc-500">Entry</dt><dd className="text-zinc-200">{fmtPrice(pos.entry)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">Size</dt><dd className="text-zinc-200">{fmtSize(pos.size)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">SL</dt><dd className="text-red-300">{fmtPrice(pos.stop)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">TP</dt><dd className="text-emerald-300">{pos.tp ? fmtPrice(pos.tp) : "—"}</dd></div>
                </dl>
              </>
            ) : (
              <p className="font-mono text-[11px] text-zinc-500">No open position. One position at a time.</p>
            )}
          </Panel>

          <Panel className="shrink-0">
            <div className="mb-2 flex gap-3" role="tablist">
              {[["perms", "Permissions"], ["log", "Trade log"]].map(([id, text]) => (
                <button key={id} type="button" role="tab" aria-selected={tab === id} onClick={() => setTab(id)} className={`border-b-2 px-1 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${tab === id ? "border-orange-500 text-orange-300" : "border-transparent text-zinc-500 hover:text-zinc-300"}`}>
                  {text}
                </button>
              ))}
            </div>
            {tab === "perms" ? (
              <PermissionsPanel people={people} meId="you" onChange={updatePerm} onKick={kick} />
            ) : recent.length === 0 ? (
              <p className="font-mono text-[11px] text-zinc-500">No closed trades yet.</p>
            ) : (
              <ul className="space-y-1">
                {recent.map((t) => (
                  <li key={t.id} className="flex items-center gap-2 font-mono text-[11px]">
                    <span className={t.side === "buy" ? "text-emerald-300" : "text-red-300"}>{t.side.toUpperCase()}</span>
                    <span className="text-zinc-500">{t.by} · {t.reason}</span>
                    <span className={`ml-auto tabular-nums ${tone(t.pnl)}`}>{fmtMoney(t.pnl, true)}</span>
                  </li>
                ))}
              </ul>
            )}
          </Panel>
        </aside>
      </div>

      <footer className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-t border-orange-500/30 bg-[#070707]/95 px-3 py-2 font-mono text-[10px] text-zinc-600">
        <span>Virtual funds only. Educational. Not investment advice. Prices may differ from real markets.</span>
        <span>Charts powered by TradingView Lightweight Charts</span>
      </footer>

      {phase === "countdown" && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          {feed.status === "loading" && (
            <div role="status" className="text-center">
              <RefreshCw size={26} className="mx-auto animate-spin text-orange-500" />
              <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">Loading market data</p>
            </div>
          )}
          {feed.status === "error" && (
            <div role="alert" className="fr-panel max-w-sm p-6 text-center">
              <AlertCircle size={22} className="mx-auto text-red-400" />
              <p className="mt-3 text-sm text-zinc-200">Could not load the market price.</p>
              <div className="mt-4 flex justify-center gap-2">
                <button type="button" onClick={feed.retry} className="border border-orange-400 bg-orange-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">Retry</button>
                <button type="button" onClick={feed.useDemoPrice} className="border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-200">Use demo price</button>
              </div>
            </div>
          )}
          {feed.ready && (
            <div role="status" className="text-center">
              <p className="font-mono text-xs uppercase tracking-[0.35em] text-orange-400">Match starts in</p>
              <p key={count} className="fr-count font-mono text-9xl font-bold text-white">{count}</p>
            </div>
          )}
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 p-4" role="alertdialog" aria-modal="true" aria-label="Leave match">
          <div className="fr-panel fr-pop w-full max-w-sm p-5">
            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">Leave this match?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">The match ends for everyone. The open position is closed at the current price and the match is saved to your analytics.</p>
            <div className="mt-4 flex gap-2">
              <button type="button" autoFocus onClick={() => setConfirmOpen(false)} className="border border-orange-400 bg-orange-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">Keep playing</button>
              <button type="button" onClick={() => finish("left")} className="border border-red-500/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-red-300">Leave</button>
            </div>
          </div>
        </div>
      )}

      {phase === "ended" && endInfo && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Match ended">
          <div className="fr-panel fr-pop w-full max-w-md p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">
              {{ time: "Time is up", drawdown: "Max drawdown reached", left: "Match left" }[endInfo.reason]}
            </p>
            <h2 className={`mt-1 font-mono text-4xl font-bold ${tone(endInfo.pnl)}`}>{fmtMoney(endInfo.pnl, true)}</h2>
            <p className="font-mono text-xs text-zinc-400">{fmtPct(endInfo.pnlPct)} · {endInfo.trades.length} trades · max drawdown {(endInfo.maxDd * 100).toFixed(2)}%</p>
            <p className="mt-3 text-sm text-zinc-400">Your match is saved. Open the analytics for the full review. A new room code has been created for your next match.</p>
            <div className="mt-5 flex flex-wrap gap-2">
              <button type="button" autoFocus onClick={() => navigate(ROUTES.analytics, { state: { matchId: endInfo.id } })} className="border border-orange-400 bg-orange-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400">View analytics</button>
              <button type="button" onClick={() => navigate(ROUTES.lobby)} className="border border-white/15 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-orange-500/60">Back to lobby</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function FriendsLiveArena() {
  const [room] = useState(loadRoom);
  if (!room) return <Navigate to={ROUTES.lobby} replace />;
  if (room.phase !== "live") return <Navigate to={ROUTES.waiting} replace />;
  return <LiveArena initial={room} />;
}