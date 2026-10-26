import { useMemo, useRef, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { recordMatch } from "../../../../features/account/accountStore";
import BlindAnswerForm from "./BlindAnswerForm";
import BlindChart from "./BlindChart";
import BlindHintPanel from "./BlindHintPanel";
import BlindResult, { Stars } from "./BlindResult";
import { BLIND_ROUTES, getLevel, toSeries } from "./data/blind-levels";
import { spendHint } from "./utils/blind-hints";
import { isUnlocked, levelState, recordAttempt, useBlindProgress } from "./utils/blind-progress";
import { calculateResult } from "./utils/blind-scoring";
import { evaluateBlindAnswer } from "./utils/evaluate-blind-answer";
import "./blind-room.css";

function Briefing({ level, onStart }) {
  return (
    <div className="br-scroll flex min-h-0 flex-1 items-center justify-center overflow-y-auto p-4">
      <section className="br-panel br-rise w-full max-w-2xl p-6">
        <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-orange-500">Level {level.id} briefing</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight">{level.title}</h1>
        <p className="mt-1 font-mono text-[11px] uppercase tracking-wider text-zinc-500">Focus: {level.focus}</p>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          <div>
            <h2 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">Objective</h2>
            <p className="text-sm leading-6 text-zinc-300">{level.objective}</p>
            <h2 className="mb-1.5 mt-4 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">The concept</h2>
            <p className="text-sm leading-6 text-zinc-300">{level.briefing.concept}</p>
          </div>
          <div>
            <h2 className="mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500">How to play</h2>
            <ol className="space-y-2">
              {level.briefing.instructions.map((step, i) => (
                <li key={step} className="flex gap-3 text-sm leading-6 text-zinc-300">
                  <span className="font-mono text-orange-500">{i + 1}</span>
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </div>

        <p className="mt-5 border-l-2 border-orange-500/60 pl-3 text-xs leading-5 text-zinc-400">
          The chart uses sample candles, not a live market. What happens next is fixed in advance. Virtual practice only. Not investment advice.
        </p>

        <button
          type="button"
          autoFocus
          onClick={onStart}
          className="mt-5 w-full border border-orange-400 bg-orange-500 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black"
        >
          [ Start level ]
        </button>
      </section>
    </div>
  );
}

function Play({ level, progress, update }) {
  const navigate = useNavigate();
  const [stage, setStage] = useState("briefing"); // briefing | play | result
  const [decision, setDecision] = useState(null);
  const [text, setText] = useState("");
  const [result, setResult] = useState(null);
  const submitted = useRef(false);

  const state = levelState(progress, level.id);
  const revealedHints = level.hints.slice(0, state.hintsUsed);
  const next = getLevel(level.id + 1);
  const hasNext = Boolean(next?.authored);

  const history = useMemo(() => toSeries(level.candles), [level]);
  const outcome = useMemo(() => toSeries(level.reveal, level.candles.length), [level]);
  const data = useMemo(() => (stage === "result" ? [...history, ...outcome] : history), [stage, history, outcome]);

  const lines = useMemo(
    () => [...level.lines, ...revealedHints.flatMap((h) => h.highlight?.lines ?? [])],
    [level, revealedHints]
  );

  const markers = useMemo(() => {
    const list = revealedHints.flatMap((hint) =>
      (hint.highlight?.markers ?? [])
        .filter((m) => history[m.index])
        .map((m) => ({
          time: history[m.index].time,
          position: m.pos === "above" ? "aboveBar" : "belowBar",
          shape: m.pos === "above" ? "arrowDown" : "arrowUp",
          color: "#fdba74",
          text: m.text,
        }))
    );
    if (stage === "result" && outcome[0]) {
      list.push({ time: outcome[0].time, position: "aboveBar", shape: "circle", color: "#f97316", text: "Result" });
    }
    return list;
  }, [revealedHints, history, outcome, stage]);

  const submit = () => {
    if (!decision || stage !== "play" || submitted.current) return;
    submitted.current = true;

    const evaluation = evaluateBlindAnswer({ level, decision, text });
    const scoring = calculateResult({
      decision: evaluation.decision,
      reasoningScore: evaluation.reasoning.score,
      hintsUsed: state.hintsUsed,
    });
    update((p) => recordAttempt(p, level.id, scoring));
    recordMatch({
      mode: "blind",
      title: `Level ${level.id}: ${level.title}`,
      result: scoring.passed ? "pass" : "fail",
      pnl: null,
      detail: `Score ${scoring.finalScore} · ${scoring.stars} star${scoring.stars === 1 ? "" : "s"}`,
    });
    setResult({ evaluation, scoring, firstClear: !state.passed && scoring.passed });
    setStage("result");
  };

  const retry = () => {
    submitted.current = false;
    setResult(null);
    setDecision(null);
    setText("");
    setStage("play");
  };

  return (
    <main className="br-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-3 py-2">
        <button
          type="button"
          onClick={() => navigate(BLIND_ROUTES.map)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          Level map
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Blind room <span className="text-orange-500">/</span> Level {level.id} <span className="text-zinc-700">{level.title}</span>
        </p>
        <span className="flex items-center gap-2 font-mono text-[10px] text-zinc-500">
          Best <Stars count={state.stars} size={13} />
        </span>
      </header>

      {stage === "briefing" ? (
        <Briefing level={level} onStart={() => setStage("play")} />
      ) : (
        <div className="grid min-h-0 flex-1 gap-3 p-3 lg:grid-cols-[minmax(0,1fr)_380px] lg:overflow-hidden">
          <section className="br-panel flex min-h-0 flex-col p-3 max-lg:h-96 max-lg:shrink-0">
            <div className="mb-2 flex shrink-0 flex-wrap items-center gap-2">
              <span className="border border-orange-500/50 bg-orange-500/10 px-2 py-1 font-mono text-[11px] text-orange-300">Level {level.id}</span>
              <span className="font-mono text-[11px] text-zinc-400">{level.timeframe}</span>
              <span className="ml-auto font-mono text-[10px] text-zinc-600">
                {stage === "result" ? "Showing what happened next" : "The next candles are hidden"}
              </span>
            </div>
            <BlindChart data={data} lines={lines} markers={markers} />
          </section>

          <aside className="br-scroll flex min-h-0 flex-col gap-3 lg:overflow-y-auto">
            {stage === "play" ? (
              <>
                <section className="br-panel p-3" aria-labelledby="question-title">
                  <h2 id="question-title" className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">
                    The question
                  </h2>
                  <p className="text-sm leading-6 text-zinc-100">{level.question}</p>
                </section>
                <section className="br-panel p-3">
                  <BlindAnswerForm decision={decision} onDecision={setDecision} text={text} onText={setText} onSubmit={submit} />
                </section>
                <BlindHintPanel
                  remaining={progress.hintsRemaining}
                  hints={level.hints}
                  revealed={state.hintsUsed}
                  onUse={() => update((p) => spendHint(p, level))}
                />
              </>
            ) : (
              result && (
                <BlindResult
                  result={result}
                  level={level}
                  hasNext={hasNext}
                  onRetry={retry}
                  onNext={() => navigate(BLIND_ROUTES.level(level.id + 1))}
                  onMap={() => navigate(BLIND_ROUTES.map)}
                />
              )
            )}
          </aside>
        </div>
      )}

      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-3 py-2 text-center font-mono text-[10px] text-zinc-600">
        Sample candles for practice. Virtual only. Educational. Not investment advice. Charts powered by TradingView Lightweight Charts.
      </footer>
    </main>
  );
}

export default function BlindLevel() {
  const { levelId } = useParams();
  const { progress, update } = useBlindProgress();
  const id = Number(levelId);
  const level = Number.isInteger(id) ? getLevel(id) : null;

  if (!level || !level.authored || !isUnlocked(progress, id)) return <Navigate to={BLIND_ROUTES.map} replace />;
  return <Play key={id} level={level} progress={progress} update={update} />;
}