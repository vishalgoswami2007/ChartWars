import { useEffect, useRef, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { LogOut, Maximize2, Mic, MicOff, RefreshCw, Video, VideoOff } from "lucide-react";

import { loadAccount, recordMatch } from "../account/accountStore";
import { apiFetch, useAuth } from "../../pages/auth/AuthProvider";
import FriendsChart from "../../pages/dashboard/rooms/friends/FriendsChart";
import {
  CFG,
  ROUTES,
  clock,
  fmtMoney,
  fmtPct,
  fmtPrice,
  fmtSize,
  tone,
} from "../../pages/dashboard/rooms/friends/friendsData";
import "../../pages/dashboard/rooms/friends/friends-room.css";
import { useRoomSocket } from "./useRoomSocket";

const MODES = {
  friends: {
    label: "Friends",
    sub: "Live arena",
    exit: ROUTES.lobby,
    again: "Back to lobby",
    leaveNote: "The match keeps running without you. Your cash and holding are valued at the final price when time is up.",
  },
  online: {
    label: "Online mode",
    sub: "Live match",
    exit: "/dashboard/rooms/online",
    again: "Play again",
    leaveNote: "The match keeps running without you. Your cash and holding are valued at the final price, so you will probably lose.",
  },
};

const PRESETS = [25, 50, 75, 100];
const BLACK = { background: "#000" };

// Online mode me opponent ka P&L match khatam hone tak hidden rehta hai.
const REVEAL_OPPONENT_PNL = false;

function Panel({ title, children, className = "", style }) {
  return (
    <section className={`fr-panel p-3 ${className}`} style={style}>
      {title && <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">{title}</h2>}
      {children}
    </section>
  );
}

function Message({ text, onBack }) {
  return (
    <main className="fr-root fixed inset-0 z-50 grid place-items-center text-zinc-100" style={BLACK}>
      <div className="text-center">
        <p className="text-sm text-zinc-400">{text}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Go back
        </button>
      </div>
    </main>
  );
}

function Stat({ label, value, valueClass = "text-zinc-200" }) {
  return (
    <div>
      <p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">{label}</p>
      <p className={`text-sm font-semibold tabular-nums ${valueClass}`}>{value}</p>
    </div>
  );
}

function InfoRow({ label, value, valueClass = "text-zinc-200" }) {
  return (
    <div className="flex items-center justify-between border-b border-white/5 py-1.5 font-mono text-[11px] last:border-b-0">
      <span className="text-zinc-500">{label}</span>
      <span className={`tabular-nums ${valueClass}`}>{value}</span>
    </div>
  );
}

function PnlRow({ name, you, value, hidden }) {
  return (
    <div
      className={`flex items-center gap-2 border px-2.5 py-2 font-mono ${
        you ? "border-orange-500/50 bg-orange-500/10" : "border-white/10"
      }`}
    >
      <span className="min-w-0 flex-1 truncate text-[11px] text-white">
        {name}
        {you && <span className="text-zinc-500"> (you)</span>}
      </span>
      {hidden ? (
        <span className="text-[10px] uppercase tracking-wider text-zinc-500">Hidden</span>
      ) : (
        <span className={`text-sm font-semibold tabular-nums ${tone(value)}`}>
          {fmtMoney(value, true)}
          <span className="ml-1 text-[10px]">{fmtPct((value / CFG.capital) * 100)}</span>
        </span>
      )}
    </div>
  );
}

// Friends mode ka video/mic box. Abhi sirf UI toggles hain (WebRTC baad me jodna hai).
function PlayerBox({ name, sub, you, micOn, camOn, onMic, onCam }) {
  const btn = (on) =>
    `grid h-7 w-7 place-items-center border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
      on ? "border-white/15 text-zinc-200 hover:border-orange-500/60" : "border-red-500/60 bg-red-500/10 text-red-300"
    }`;
  return (
    <div className={`fr-panel min-w-0 p-2 ${you ? "border-orange-500/40" : ""}`}>
      <div className="relative grid aspect-video place-items-center overflow-hidden bg-black/60">
        {camOn ? (
          <div className="grid h-12 w-12 place-items-center rounded-full border border-orange-500/50 bg-orange-500/10 font-mono text-lg font-bold uppercase text-orange-300">
            {(name || "?").charAt(0)}
          </div>
        ) : (
          <span className="font-mono text-[10px] uppercase tracking-wider text-zinc-600">Camera off</span>
        )}
        {!micOn && (
          <span className="absolute left-1 top-1 inline-flex items-center gap-1 bg-red-500/20 px-1.5 py-0.5 font-mono text-[9px] uppercase text-red-300">
            <MicOff size={10} /> Muted
          </span>
        )}
      </div>
      <div className="mt-2 flex items-center gap-2">
        <div className="min-w-0 flex-1">
          <p className="truncate font-mono text-[11px] font-semibold text-white">
            {name}
            {you && <span className="text-zinc-500"> (you)</span>}
          </p>
          <p className="truncate font-mono text-[9px] text-zinc-500">{sub}</p>
        </div>
        <button type="button" onClick={onMic} aria-pressed={micOn} aria-label={micOn ? "Mute mic" : "Unmute mic"} className={btn(micOn)}>
          {micOn ? <Mic size={13} /> : <MicOff size={13} />}
        </button>
        <button type="button" onClick={onCam} aria-pressed={camOn} aria-label={camOn ? "Turn video off" : "Turn video on"} className={btn(camOn)}>
          {camOn ? <Video size={13} /> : <VideoOff size={13} />}
        </button>
      </div>
    </div>
  );
}

export default function MatchArena({ mode, code, opponent }) {
  const cfg = MODES[mode] ?? MODES.friends;
  const navigate = useNavigate();
  const { user, setUser } = useAuth();
  const { room, match, candles, deadline, phase, result, error, closed, buy, sell, clearError } = useRoomSocket(code);

  const [pct, setPct] = useState(25);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [showEma, setShowEma] = useState(true);
  const [fitKey, setFitKey] = useState(0);
  const [now, setNow] = useState(() => Date.now());
  const [myMic, setMyMic] = useState(true);
  const [myCam, setMyCam] = useState(true);
  const [friendMic, setFriendMic] = useState(true);
  const [friendCam, setFriendCam] = useState(true);
  const recordedRef = useRef(false);

  const meId = String(user?.id ?? user?._id ?? "");

  // Timer: server se mila bacha hua time
  useEffect(() => {
    if (phase !== "live") return undefined;
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [phase]);

  // Match khatam: server se naya ELO aur stats (header aur profile ke liye)
  useEffect(() => {
    if (phase === "ended") loadAccount();
  }, [phase]);

  // Match khatam hone par apne account me ek baar record
  useEffect(() => {
    if (phase !== "ended" || !result || recordedRef.current) return;
    recordedRef.current = true;
    const idx = result.results.findIndex((r) => r.id === meId);
    if (idx < 0) return;
    const pnl = result.results[idx].value - CFG.capital;
    recordMatch({
      id: `${mode}_${code}`,
      mode,
      title: `BTC · ${result.results.length} players`,
      result: result.winner === meId ? "win" : pnl < 0 ? "loss" : "draw",
      pnl,
      detail: `Finished #${idx + 1} of ${result.results.length}`,
    });
  }, [phase, result, meId, code, mode]);

  // Online: naya ELO account me dikhane ke liye user dobara fetch
  useEffect(() => {
    if (mode !== "online" || phase !== "ended") return;
    apiFetch("/api/v1/auth/me")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (data?.user) setUser(data.user);
      })
      .catch(() => {});
  }, [mode, phase, setUser]);

  const leave = () => navigate(cfg.exit);
  if (closed) return <Navigate to={cfg.exit} replace />;
  if (room && phase === "lobby") {
    if (mode === "friends" && room.status === "waiting") return <Navigate to={`${ROUTES.waiting}/${code}`} replace />;
    if (room.status === "finished") return <Message text="This match has already finished." onBack={leave} />;
  }

  const isOnline = mode === "online";
  const price = match?.price;
  const live = phase === "live";
  const players = [...(match?.players ?? [])].sort((a, b) => b.value - a.value);
  const mine = players.find((p) => p.id === meId);
  const others = players.filter((p) => p.id !== meId);
  const firstOther = others[0];
  const equity = mine?.value ?? CFG.capital;
  const pnl = equity - CFG.capital;
  const holdings = mine && Number.isFinite(price) ? mine.qty * price : 0;
  const remaining = deadline ? Math.max(0, deadline - now) : (room?.durationSec ?? 0) * 1000;
  const urgent = live && remaining <= 10000;

  const buyAmount = mine ? Math.floor(mine.cash * pct) / 100 : 0;
  const sellAmount = pct === 100 ? holdings * 2 : Math.floor(holdings * pct) / 100; // server 100% pe khud clamp karta hai
  const sellShown = (holdings * pct) / 100; // sirf dikhane ke liye
  const canBuy = live && Boolean(mine) && buyAmount >= 1;
  const canSell = live && Boolean(mine) && holdings >= 1 && sellAmount >= 1;

  const winnerName = result?.results.find((r) => r.id === result.winner)?.username;
  const myRow = result?.results.find((r) => r.id === meId);
  const eloDelta = myRow?.eloChange ?? 0;
  const eloText = isOnline ? ` · ELO ${eloDelta > 0 ? "+" : ""}${eloDelta}` : "";

  const myName = user?.username ?? mine?.username ?? "You";
  const oppName = opponent?.username ?? firstOther?.username ?? "Opponent";

  // Market info: match ki candles se nikala hua (session)
  const lastC = candles[candles.length - 1];
  const sessionOpen = candles[0]?.open;
  const sessionHigh = candles.length ? Math.max(...candles.map((c) => c.high)) : undefined;
  const sessionLow = candles.length ? Math.min(...candles.map((c) => c.low)) : undefined;
  const hasPrice = Number.isFinite(price) && Number.isFinite(sessionOpen);
  const change = hasPrice ? price - sessionOpen : 0;
  const changePct = hasPrice && sessionOpen ? (change / sessionOpen) * 100 : 0;
  const sign = change > 0 ? "+" : change < 0 ? "-" : "";
  const range = Number.isFinite(sessionHigh) && Number.isFinite(sessionLow) ? sessionHigh - sessionLow : undefined;

  const cyclePct = () => setPct((p) => PRESETS[(PRESETS.indexOf(p) + 1) % PRESETS.length]);

  return (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto" style={BLACK}>
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <button
          type="button"
          disabled={phase === "ended"}
          onClick={() => setConfirmOpen(true)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40"
        >
          <LogOut size={14} />
          Leave match
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          {cfg.label} <span className="text-orange-500">/</span> {cfg.sub} <span className="ml-2 text-zinc-700">{code}</span>
        </p>
        <span className="border border-white/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          Server price · same for everyone
        </span>
      </header>

      {error && (
        <p role="alert" className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300" onClick={clearError}>
          {error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_360px] lg:overflow-hidden">
        {/* CHART + overlays */}
        <Panel className="relative flex min-h-0 min-w-0 flex-col max-lg:h-[30rem]" style={BLACK}>
          <div className="relative flex min-h-0 flex-1 flex-col">
            <FriendsChart candles={candles} position={null} showEma={showEma} fitKey={fitKey} />

            {/* Top-left: TradingView style SELL | size | BUY + legend */}
            <div className="pointer-events-none absolute left-2 top-2 z-10 flex flex-col gap-1.5">
              <div className="flex items-stretch">
                <button
                  type="button"
                  disabled={!canSell}
                  onClick={() => sell(sellAmount)}
                  aria-label="Sell"
                  className="fr-sell pointer-events-auto flex min-w-24 flex-col items-center rounded-l-sm bg-[#f23645] px-3 py-1 font-mono text-white transition hover:bg-[#ff4a59] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-sm font-bold tabular-nums leading-tight">{fmtPrice(price)}</span>
                  <span className="text-[10px] font-semibold leading-tight tracking-widest">SELL</span>
                </button>
                <button
                  type="button"
                  onClick={cyclePct}
                  aria-label={`Trade size ${pct} percent, click to change`}
                  title="Trade size (click to change)"
                  className="pointer-events-auto grid min-w-12 place-items-center border-y border-white/10 bg-[#0b0b0b] px-2 font-mono text-[11px] font-semibold text-zinc-200 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  {pct}%
                </button>
                <button
                  type="button"
                  disabled={!canBuy}
                  onClick={() => buy(buyAmount)}
                  aria-label="Buy"
                  className="fr-buy pointer-events-auto flex min-w-24 flex-col items-center rounded-r-sm bg-[#2962ff] px-3 py-1 font-mono text-white transition hover:bg-[#4a7cff] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span className="text-sm font-bold tabular-nums leading-tight">{fmtPrice(price)}</span>
                  <span className="text-[10px] font-semibold leading-tight tracking-widest">BUY</span>
                </button>
              </div>

              <p className="font-mono text-[11px] text-zinc-400">
                <span className="font-semibold text-white">BTC/USD</span>
                <span className="mx-1.5 text-zinc-600">·</span>
                ChartWars
                {lastC && (
                  <span className="ml-2 tabular-nums">
                    O <span className={tone(lastC.close - lastC.open)}>{fmtPrice(lastC.open)}</span> H{" "}
                    <span className={tone(lastC.close - lastC.open)}>{fmtPrice(lastC.high)}</span> L{" "}
                    <span className={tone(lastC.close - lastC.open)}>{fmtPrice(lastC.low)}</span> C{" "}
                    <span className={tone(lastC.close - lastC.open)}>{fmtPrice(lastC.close)}</span>
                  </span>
                )}
              </p>
            </div>

            {/* Top-right: EMA + fit */}
            <div className="pointer-events-auto absolute right-16 top-2 z-10 flex items-center gap-1.5">
              <button
                type="button"
                aria-pressed={showEma}
                onClick={() => setShowEma((v) => !v)}
                className={`border px-2 py-1 font-mono text-[10px] ${showEma ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 bg-black/70 text-zinc-500"}`}
              >
                EMA 20
              </button>
              <button type="button" aria-label="Fit chart" onClick={() => setFitKey((k) => k + 1)} className="border border-white/10 bg-black/70 p-1.5 text-zinc-400 transition hover:text-white">
                <Maximize2 size={12} />
              </button>
            </div>

            {/* Bottom-center: timer */}
            <div className="pointer-events-none absolute bottom-10 left-1/2 z-10 -translate-x-1/2 border border-white/10 bg-black/75 px-4 py-1 text-center backdrop-blur-sm">
              <span
                className={`font-mono text-2xl font-bold tabular-nums ${urgent ? "fr-urgent" : "text-orange-300"}`}
                role="timer"
                aria-label={`${clock(remaining)} left`}
              >
                {clock(remaining)}
              </span>
            </div>
          </div>
          <p className="mt-2 shrink-0 text-center font-mono text-[10px] text-zinc-600">
            {live ? `Market order at the server price · ${pct}% size` : "Trading opens when the match starts."}
          </p>
        </Panel>

        {/* RIGHT SIDE */}
        <aside className="fr-scroll flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
          {/* Market card: naam, live price, change, market status */}
          <Panel className="shrink-0" style={BLACK}>
            <div className="flex items-center gap-2.5">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-orange-500 font-mono text-sm font-bold text-black">₿</span>
              <div className="min-w-0">
                <p className="font-mono text-sm font-bold text-white">BTC/USD</p>
                <p className="truncate font-mono text-[10px] text-zinc-500">Bitcoin / US Dollar · ChartWars server feed</p>
              </div>
            </div>
            <p className="mt-3 font-mono text-3xl font-bold tabular-nums text-white">
              {fmtPrice(price)} <span className="text-xs font-normal text-zinc-500">USD</span>
            </p>
            <p className={`font-mono text-sm tabular-nums ${tone(change)}`}>
              {sign}
              {fmtPrice(Math.abs(change))} <span className="ml-1">{sign}{Math.abs(changePct).toFixed(2)}%</span>
              <span className="ml-2 text-[10px] text-zinc-600">session</span>
            </p>
            <p className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px]">
              <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-400" : "bg-zinc-600"}`} />
              <span className={live ? "text-emerald-400" : "text-zinc-500"}>{live ? "Market open" : "Market closed"}</span>
            </p>
          </Panel>

          {/* Friends mode: 2 player boxes (mic + video) */}
          {!isOnline && (
            <div className="grid shrink-0 grid-cols-2 gap-3">
              <PlayerBox
                name={myName}
                sub="You"
                you
                micOn={myMic}
                camOn={myCam}
                onMic={() => setMyMic((v) => !v)}
                onCam={() => setMyCam((v) => !v)}
              />
              <PlayerBox
                name={firstOther?.username ?? "Waiting..."}
                sub="Friend"
                micOn={friendMic}
                camOn={friendCam}
                onMic={() => setFriendMic((v) => !v)}
                onCam={() => setFriendCam((v) => !v)}
              />
            </div>
          )}

          {/* Card: P&L */}
          <Panel title="Profit / Loss" className="shrink-0" style={BLACK}>
            <div className="space-y-1.5">
              <PnlRow name={myName} you value={pnl} />
              {isOnline ? (
                <PnlRow
                  name={oppName}
                  value={firstOther ? firstOther.value - CFG.capital : 0}
                  hidden={!REVEAL_OPPONENT_PNL || !firstOther}
                />
              ) : others.length === 0 ? (
                <p className="font-mono text-[11px] text-zinc-500">Waiting for the first update...</p>
              ) : (
                others.map((p) => <PnlRow key={p.id} name={p.username} value={p.value - CFG.capital} />)
              )}
            </div>
            {isOnline && (
              <p className="mt-2 font-mono text-[10px] text-zinc-600">
                ELO {opponent?.elo ?? "—"} · opponent P&amp;L hidden until the match ends
              </p>
            )}
          </Panel>

          {/* Card: Account + quantity */}
          <Panel title="Account & quantity" className="shrink-0" style={BLACK}>
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono">
              <Stat label="Equity" value={fmtMoney(equity)} valueClass="text-white" />
              <Stat label="Cash (virtual)" value={fmtMoney(mine?.cash ?? CFG.capital)} />
              <Stat label="Holding" value={`${fmtSize(mine?.qty ?? 0)} BTC`} />
              <Stat label="Holding value" value={fmtMoney(holdings)} />
            </div>

            <div className="mt-3 border-t border-white/10 pt-3">
              <p className="mb-1 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">Quantity</p>
              <div className="flex gap-1.5">
                {PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    aria-pressed={pct === p}
                    onClick={() => setPct(p)}
                    className={`flex-1 border px-2 py-1.5 font-mono text-[11px] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                      pct === p ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-400 hover:text-white"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[11px]">
                <p className="text-zinc-500">
                  Buy <span className="text-blue-400">{fmtMoney(buyAmount)}</span>
                </p>
                <p className="text-right text-zinc-500">
                  Sell <span className="text-red-400">{fmtMoney(sellShown)}</span>
                </p>
              </div>
            </div>
          </Panel>

          {/* Card: Market information (scroll karke dikhega) */}
          <Panel title="Market information" className="shrink-0" style={BLACK}>
            <InfoRow label="Symbol" value="BTC/USD" valueClass="text-white" />
            <InfoRow label="Type" value="Crypto · Spot (simulated)" />
            <InfoRow label="Session open" value={fmtPrice(sessionOpen)} />
            <InfoRow label="Session high" value={fmtPrice(sessionHigh)} valueClass="text-emerald-400" />
            <InfoRow label="Session low" value={fmtPrice(sessionLow)} valueClass="text-red-400" />
            <InfoRow label="Range" value={range === undefined ? "—" : fmtPrice(range)} />
            <InfoRow label="Candles" value={String(candles.length)} />
            <InfoRow label="Time left" value={clock(remaining)} valueClass={urgent ? "text-red-400" : "text-orange-300"} />
            <InfoRow label="Start capital" value={fmtMoney(CFG.capital)} />
            <p className="mt-2 font-mono text-[10px] leading-4 text-zinc-600">
              Prices come from the match server and are the same for every player. Session stats cover this match only.
            </p>
          </Panel>
        </aside>
      </div>

      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-3 py-2 text-center font-mono text-[10px] text-zinc-600">
        Virtual funds only. Educational. Not investment advice. Prices may differ from real markets.
      </footer>

      {(phase === "lobby" || phase === "countdown") && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/80 backdrop-blur-sm">
          <div role="status" className="text-center">
            <RefreshCw size={26} className="mx-auto animate-spin text-orange-500" />
            <p className="mt-4 font-mono text-xs uppercase tracking-[0.25em] text-zinc-300">
              {phase === "countdown" ? "Get ready, match is starting" : "Connecting to the match"}
            </p>
          </div>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 p-4" role="alertdialog" aria-modal="true" aria-label="Leave match">
          <div className="fr-panel fr-pop w-full max-w-sm p-5">
            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">Leave this match?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">{cfg.leaveNote}</p>
            <div className="mt-4 flex gap-2">
              <button type="button" autoFocus onClick={() => setConfirmOpen(false)} className="border border-orange-400 bg-orange-500 px-4 py-2 font-mono text-[11px] font-bold uppercase tracking-wider text-black">
                Keep playing
              </button>
              <button type="button" onClick={leave} className="border border-red-500/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-red-300">
                Leave
              </button>
            </div>
          </div>
        </div>
      )}

      {phase === "ended" && result && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label="Match ended">
          <div className="fr-panel fr-pop w-full max-w-md p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-zinc-500">Time is up</p>
            <h2 className={`mt-1 font-mono text-3xl font-bold ${result.winner === meId ? "text-emerald-400" : "text-white"}`}>
              {result.winner === meId ? "You won!" : `${winnerName} wins`}
            </h2>
            {myRow && (
              <p className={`font-mono text-xs ${tone(myRow.value - CFG.capital)}`}>
                Your result: {fmtMoney(myRow.value - CFG.capital, true)} ({fmtPct(((myRow.value - CFG.capital) / CFG.capital) * 100)})
                {eloText}
              </p>
            )}
            <ul className="mt-3 space-y-1.5">
              {result.results.map((r, i) => (
                <li key={r.id} className={`flex items-center gap-2 border px-2 py-1.5 font-mono text-[11px] ${r.id === meId ? "border-orange-500/50 bg-orange-500/10" : "border-white/10"}`}>
                  <span className="w-4 text-zinc-500">{i + 1}</span>
                  <span className="min-w-0 flex-1 truncate text-white">{r.username}</span>
                  <span className="tabular-nums text-zinc-300">{fmtMoney(r.value)}</span>
                </li>
              ))}
            </ul>
            <button
              type="button"
              autoFocus
              onClick={leave}
              className="mt-5 border border-orange-400 bg-orange-500 px-5 py-2.5 font-mono text-[11px] font-bold uppercase tracking-[0.18em] text-black transition hover:bg-orange-400"
            >
              {cfg.again}
            </button>
          </div>
        </div>
      )}
    </main>
  );
}