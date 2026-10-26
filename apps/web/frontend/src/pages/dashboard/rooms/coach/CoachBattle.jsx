import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Maximize2, Pause, Play, SkipForward } from "lucide-react";
import { recordMatch } from "../../../../features/account/accountStore";
import BattleChart from "../../../../features/coach/components/BattleChart";
import BotPanel from "../../../../features/coach/components/BotPanel";
import CoachPanel from "../../../../features/coach/components/CoachPanel";
import MatchScoreboard from "../../../../features/coach/components/MatchScoreboard";
import TradeControls from "../../../../features/coach/components/TradeControls";
import { Meter, Panel, btnGhost, btnPrimary, chip } from "../../../../features/coach/components/ui";
import { SPEEDS } from "../../../../features/coach/data/difficultyConfig";
import { analyze } from "../../../../features/coach/engine/indicators";
import { advance, buildContext, createMatch, endNow, userClose, userHint, userOrder } from "../../../../features/coach/engine/matchEngine";
import { summarizeMatch } from "../../../../features/coach/engine/matchScoring";
import { equityOf, rOf, unrealized } from "../../../../features/coach/engine/tradeSimulator";
import { fmtMoney, fmtPrice, fmtR, tone } from "../../../../features/coach/format";
import { COACH_ROUTES } from "../../../../features/coach/routes";
import { pushHistory, saveResult } from "../../../../features/coach/storage";
import "../../../../features/coach/coach.css";

function Battle({ ctx, setup }) {
  const navigate = useNavigate();
  const rules = ctx.rules;

  const [match, setMatch] = useState(() => createMatch(ctx));
  const [playing, setPlaying] = useState(Boolean(setup.autoplay));
  const [speedId, setSpeedId] = useState(1);
  const [confirmEnd, setConfirmEnd] = useState(false);
  const [showE20, setShowE20] = useState(true);
  const [showE50, setShowE50] = useState(false);
  const [follow, setFollow] = useState(true);
  const endedRef = useRef(false);
  const latest = useRef({});

  const step = useCallback(() => setMatch((m) => advance(m, ctx)), [ctx]);
  const live = match.phase === "live";

  // Auto-play timer.
  useEffect(() => {
    if (!playing || !live) return undefined;
    const ms = SPEEDS.find((s) => s.id === speedId)?.ms ?? 900;
    const id = setInterval(step, ms);
    return () => clearInterval(id);
  }, [playing, live, speedId, step]);

  // When the match ends, save the summary and open the results page.
  useEffect(() => {
    if (match.phase !== "ended" || endedRef.current) return;
    endedRef.current = true;
    const summary = summarizeMatch(match, ctx);
    saveResult(summary);
    pushHistory(summary);
    recordMatch({
        id: summary.id,
        mode: "coach",
        title: `${summary.difficultyLabel}: ${summary.scenarioTitle}`,
        result: summary.verdict.winner === "user" ? "win" : summary.verdict.winner === "coach" ? "loss" : "draw",
        pnl: summary.user.pnl,
        detail: `vs ${summary.botName}`,
      });
    navigate(COACH_ROUTES.results, { replace: true, state: { summary, setup } });
  }, [match, ctx, navigate, setup]);

  const visible = useMemo(() => ctx.candles.slice(0, match.idx + 1), [ctx, match.idx]);
  const a = useMemo(() => analyze(visible), [visible]);
  const price = a.close;
  const progress = Math.round(((match.idx - ctx.warmup + 1) / (ctx.total - ctx.warmup)) * 100);
  const candleNo = match.idx - ctx.warmup + 1;

  const pos = match.user.position;
  const lines = useMemo(() => {
    if (!pos) return [];
    const list = [
      { price: pos.entry, color: "#f97316", title: "ENTRY", dashed: false },
      { price: pos.stop, color: "#f87171", title: "SL", dashed: true },
    ];
    if (pos.tp) list.push({ price: pos.tp, color: "#34d399", title: "TP", dashed: true });
    return list;
  }, [pos]);

  const showBotMarkers = rules.bot.reasons === "live";
  const markers = useMemo(() => {
    const make = (events, who) =>
      events
        .filter((e) => ctx.candles[e.index])
        .map((e) => {
          const open = e.type === "open";
          const buy = e.side === "buy";
          return {
            time: ctx.candles[e.index].time,
            position: open ? (buy ? "belowBar" : "aboveBar") : "inBar",
            shape: open ? (buy ? "arrowUp" : "arrowDown") : "circle",
            color: who === "you" ? (open ? (buy ? "#34d399" : "#f87171") : "#f97316") : "#7dd3fc",
            text: who === "you" ? (open ? "You" : "x") : open ? "Coach" : "x",
          };
        });
    return [...make(match.user.events, "you"), ...(showBotMarkers ? make(match.bot.events, "coach") : [])];
  }, [ctx, match.user.events, match.bot.events, showBotMarkers]);

  const order = (params) => setMatch((m) => userOrder(m, ctx, params));
  const closeNow = () => setMatch((m) => userClose(m, ctx));
  const hint = () => setMatch((m) => userHint(m, ctx));
  const finishMatch = () => {
    setPlaying(false);
    setMatch((m) => endNow(m, ctx));
  };

  useEffect(() => {
    latest.current = {
      toggle: () => setPlaying((p) => !p),
      next: () => {
        if (!playing) step();
      },
      close: closeNow,
      escape: () => setConfirmEnd(false),
    };
  });

  useEffect(() => {
    const onKey = (event) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target;
      const tag = target?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || tag === "BUTTON" || target?.isContentEditable) return;
      const key = event.key.toLowerCase();
      if (key === " ") {
        event.preventDefault();
        latest.current.toggle?.();
      } else if (key === "n" || key === "arrowright") latest.current.next?.();
      else if (key === "x") latest.current.close?.();
      else if (key === "escape") latest.current.escape?.();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const userEquity = equityOf(match.user, price);
  const drawdown = Math.max(0, (ctx.capital - userEquity) / ctx.capital);
  const lastUser = match.userLog[match.userLog.length - 1]?.text ?? "";
  const unreal = pos ? unrealized(pos, price) : 0;

  return (
    <main className="cc-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto">
      <p className="sr-only" aria-live="polite">{lastUser}</p>

      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <button
          type="button"
          onClick={() => setConfirmEnd(true)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          End match
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Pro vs Coach <span className="text-orange-500">/</span> {rules.label} <span className="ml-2 text-zinc-700">{ctx.scenario.title}</span>
        </p>
        <span className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-zinc-400">
          <span className="cc-live size-1.5 rounded-full bg-emerald-400" aria-hidden="true" />
          Sample market
        </span>
      </header>

      <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_340px] lg:overflow-hidden">
        <div className="flex min-h-0 min-w-0 flex-col gap-3">
          <MatchScoreboard you={match.user} coach={match.bot} price={price} capital={ctx.capital} botName={rules.bot.name}>
            <div className="flex items-center justify-center gap-1.5">
              <button type="button" onClick={() => setPlaying((p) => !p)} disabled={!live} aria-label={playing ? "Pause" : "Play"} className={`${btnPrimary} flex h-9 w-9 items-center justify-center`}>
                {playing ? <Pause size={14} /> : <Play size={14} />}
              </button>
              <button type="button" onClick={step} disabled={!live || playing} aria-label="Next candle" title="Next candle [N]" className={`${btnGhost} flex h-9 w-9 items-center justify-center`}>
                <SkipForward size={14} />
              </button>
              {SPEEDS.map((s) => (
                <button key={s.id} type="button" aria-pressed={speedId === s.id} onClick={() => setSpeedId(s.id)} className={chip(speedId === s.id)}>
                  {s.label}
                </button>
              ))}
            </div>
            <p className="mt-1.5 font-mono text-[11px] text-zinc-400">
              Candle {candleNo} of {ctx.total - ctx.warmup} · {fmtPrice(price)}
            </p>
            <div className="mx-auto mt-1 h-1 w-48 bg-white/10" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100} aria-label="Match progress">
              <div className="h-full bg-orange-500" style={{ width: `${progress}%` }} />
            </div>
          </MatchScoreboard>

          <Panel className="flex min-h-0 flex-1 flex-col max-lg:h-96 max-lg:flex-none">
            <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
              <span className="border border-orange-500/50 bg-orange-500/10 px-2 py-1 font-mono text-[11px] text-orange-300">SAMPLE / 1H</span>
              <span className="font-mono text-[10px] text-zinc-600">Future candles are hidden for you and the coach.</span>
              <div className="ml-auto flex items-center gap-1.5">
                <button type="button" aria-pressed={showE20} onClick={() => setShowE20((v) => !v)} className={chip(showE20)}>EMA 20</button>
                <button type="button" aria-pressed={showE50} onClick={() => setShowE50((v) => !v)} className={chip(showE50)}>EMA 50</button>
                <button type="button" aria-pressed={follow} aria-label="Follow the latest candle" onClick={() => setFollow((v) => !v)} className={chip(follow)}>
                  <Maximize2 size={12} />
                </button>
              </div>
            </div>
            <BattleChart candles={visible} lines={lines} markers={markers} showE20={showE20} showE50={showE50} follow={follow} />
          </Panel>

          <div className="shrink-0 text-[10px] text-zinc-600">
            Shortcuts: B buy · S sell · X close · Space play or pause · N next candle. Charts powered by TradingView Lightweight Charts.
          </div>
        </div>

        <aside className="cc-scroll flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
          <Panel title="Your account" className="shrink-0">
            <div className="grid grid-cols-2 gap-x-3 gap-y-2 font-mono">
              <div><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Balance</p><p className="text-sm font-semibold tabular-nums text-white">{fmtMoney(match.user.balance)}</p></div>
              <div><p className="text-[9px] uppercase tracking-[0.18em] text-zinc-500">Equity</p><p className="text-sm font-semibold tabular-nums text-white">{fmtMoney(userEquity)}</p></div>
            </div>
            <div className="mt-3">
              <Meter
                label="Drawdown"
                value={drawdown}
                max={rules.maxDrawdown}
                text={`${(drawdown * 100).toFixed(2)}% / ${(rules.maxDrawdown * 100).toFixed(0)}%`}
                color={drawdown / rules.maxDrawdown < 0.5 ? "bg-emerald-400" : drawdown / rules.maxDrawdown < 0.8 ? "bg-orange-400" : "bg-red-500"}
              />
            </div>
          </Panel>

          <TradeControls
            rules={rules}
            costs={ctx.costs}
            price={price}
            atr={a.atr}
            acct={match.user}
            index={match.idx}
            running={live}
            defaultRisk={setup.riskFrac}
            onOrder={order}
          />

          <Panel title="Open position" className="shrink-0">
            {pos ? (
              <>
                <div className="flex items-end justify-between">
                  <p className={`font-mono text-xl font-bold tabular-nums ${tone(unreal)}`}>{fmtMoney(unreal, true)}</p>
                  <button type="button" disabled={!live} onClick={closeNow} className={`${btnGhost} px-3 py-1.5 text-[11px]`}>Close [X]</button>
                </div>
                <dl className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1 font-mono text-[11px]">
                  <div className="flex justify-between"><dt className="text-zinc-500">Entry</dt><dd className="text-zinc-200">{fmtPrice(pos.entry)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">Now</dt><dd className="text-zinc-200">{fmtPrice(price)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">SL</dt><dd className="text-red-300">{fmtPrice(pos.stop)}</dd></div>
                  <div className="flex justify-between"><dt className="text-zinc-500">TP</dt><dd className="text-emerald-300">{pos.tp ? fmtPrice(pos.tp) : "—"}</dd></div>
                  <div className="col-span-2 flex justify-between"><dt className="text-zinc-500">Result so far</dt><dd className={tone(unreal)}>{fmtR(rOf(pos, price))}</dd></div>
                </dl>
              </>
            ) : (
              <p className="font-mono text-[11px] text-zinc-500">No open position. One position at a time.</p>
            )}
          </Panel>

          <BotPanel rules={rules} coach={match.bot} botLog={match.botLog} price={price} warmup={ctx.warmup} />
          <CoachPanel rules={rules} feed={match.feed} hintsUsed={match.hintsUsed} onHint={hint} running={live} />
        </aside>
      </div>

      {confirmEnd && (
        <div className="fixed inset-0 z-70 flex items-center justify-center bg-black/80 p-4" role="alertdialog" aria-modal="true" aria-label="End match">
          <div className="cc-panel cc-pop w-full max-w-sm p-5">
            <h2 className="font-mono text-sm font-bold uppercase tracking-[0.2em] text-white">End the match now?</h2>
            <p className="mt-2 text-sm leading-6 text-zinc-400">
              Open positions for you and the coach are closed at the current price, and you go to the results.
            </p>
            <div className="mt-4 flex gap-2">
              <button type="button" autoFocus onClick={() => setConfirmEnd(false)} className={`${btnPrimary} px-4 py-2 text-[11px] tracking-wider`}>Keep playing</button>
              <button type="button" onClick={finishMatch} className="border border-red-500/60 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-red-300">End match</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default function CoachBattle() {
  const location = useLocation();
  const setup = location.state;
  const ctx = useMemo(
    () => (setup ? buildContext({ difficulty: setup.difficulty, scenarioId: setup.scenarioId, capital: setup.capital }) : null),
    [setup]
  );
  if (!ctx) return <Navigate to={COACH_ROUTES.landing} replace />;
  return <Battle ctx={ctx} setup={setup} />;
}