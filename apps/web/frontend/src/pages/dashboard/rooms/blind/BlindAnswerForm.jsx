import { countWords } from "./utils/evaluate-blind-answer";
import { SCORING } from "./utils/blind-scoring";

const OPTIONS = [
  { id: "buy", label: "BUY", on: "border-emerald-500 bg-emerald-500/15 text-emerald-300" },
  { id: "sell", label: "SELL", on: "border-red-500 bg-red-500/15 text-red-300" },
  { id: "wait", label: "WAIT", on: "border-orange-500 bg-orange-500/15 text-orange-300" },
];

export default function BlindAnswerForm({ decision, onDecision, text, onText, onSubmit }) {
  const words = countWords(text);
  const short = words > 0 && words < SCORING.minWords;

  return (
    <form
      className="flex flex-col gap-3"
      onSubmit={(event) => {
        event.preventDefault();
        onSubmit();
      }}
    >
      <div>
        <p className="mb-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">1 · Your decision</p>
        <div role="radiogroup" aria-label="Decision" className="grid grid-cols-3 gap-2">
          {OPTIONS.map((option) => {
            const active = decision === option.id;
            return (
              <button
                key={option.id}
                type="button"
                role="radio"
                aria-checked={active}
                onClick={() => onDecision(option.id)}
                className={`h-11 border font-mono text-sm font-bold tracking-widest transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
                  active ? option.on : "border-white/10 text-zinc-400 hover:border-white/30 hover:text-white"
                }`}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <label htmlFor="blind-reasoning" className="mb-1.5 block font-mono text-[9px] uppercase tracking-[0.2em] text-zinc-500">
          2 · Why did you choose it?
        </label>
        <textarea
          id="blind-reasoning"
          value={text}
          onChange={(event) => onText(event.target.value.slice(0, SCORING.maxChars))}
          rows={5}
          placeholder="Use trading terms and explain the link between what you see and your decision."
          aria-describedby="blind-reasoning-help"
          className="w-full resize-none border border-white/10 bg-black/40 px-3 py-2.5 text-sm leading-6 text-white outline-none placeholder:text-zinc-600 focus:border-orange-500/70 focus:ring-2 focus:ring-orange-500/30"
        />
        <p id="blind-reasoning-help" className={`mt-1 flex justify-between font-mono text-[10px] ${short ? "text-amber-300" : "text-zinc-600"}`}>
          <span>{short ? `At least ${SCORING.minWords} words are needed for full credit.` : "Say what you see, and what it suggests."}</span>
          <span>
            {words} words · {text.length}/{SCORING.maxChars}
          </span>
        </p>
      </div>

      <button
        type="submit"
        disabled={!decision || words === 0}
        className="h-11 border border-orange-400 bg-orange-500 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
      >
        [ Submit answer ]
      </button>
      {!decision && <p className="-mt-1 font-mono text-[10px] text-zinc-600">Choose BUY, SELL or WAIT first.</p>}
    </form>
  );
}