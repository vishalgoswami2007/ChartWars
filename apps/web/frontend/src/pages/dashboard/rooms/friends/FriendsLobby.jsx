import { useState } from "react";

import { MINUTE_OPTIONS, PLAYER_OPTIONS, SYMBOLS } from "./friendsData";

const chip = (active) =>
  `border px-3 py-2 font-mono text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 ${
    active ? "border-orange-500 bg-orange-500/15 text-orange-300" : "border-white/10 text-zinc-400 hover:text-white"
  }`;

function Panel({ index, title, children }) {
  return (
    <section className="fr-panel p-4">
      <h2 className="mb-3 flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.22em] text-zinc-400">
        <span className="text-orange-500">{index}</span>
        <span className="text-zinc-600">/</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function FriendsLobby({ onCreate, onJoin, joinError, matchCount, onOpenAnalytics }) {
  const [symbol, setSymbol] = useState("bitcoin");
  const [players, setPlayers] = useState(2);
  const [minutes, setMinutes] = useState(5);
  const [joinText, setJoinText] = useState("");
  const [creating, setCreating] = useState(false);

  const label = "mb-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-500";

  const create = async () => {
    setCreating(true);
    try {
      await onCreate({ symbol, players, minutes });
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="grid min-h-0 flex-1 gap-4 overflow-y-auto p-4 fr-scroll lg:grid-cols-2">
      <Panel index="01" title="Create a room">
        <p className="border-l-2 border-orange-500/60 pl-3 text-xs leading-5 text-zinc-400">
          Your 6-character room code is created when you press Create. Share it, then approve the friends who ask to join.
        </p>

        <p className={`${label} mt-4`}>Market</p>
        <div role="radiogroup" aria-label="Market" className="flex flex-wrap gap-1.5">
          {SYMBOLS.filter((s) => s.id === "bitcoin").map((s) => (
            <button key={s.id} type="button" role="radio" aria-checked={symbol === s.id} onClick={() => setSymbol(s.id)} className={chip(symbol === s.id)}>
              {s.ticker}
            </button>
          ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <p className={label}>Players</p>
            <div role="radiogroup" aria-label="Players" className="flex gap-1.5">
              {PLAYER_OPTIONS.map((n) => (
                <button key={n} type="button" role="radio" aria-checked={players === n} onClick={() => setPlayers(n)} className={chip(players === n)}>
                  {n} players
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className={label}>Match length</p>
            <div role="radiogroup" aria-label="Match length" className="flex flex-wrap gap-1.5">
              {MINUTE_OPTIONS.map((m) => (
                <button key={m} type="button" role="radio" aria-checked={minutes === m} onClick={() => setMinutes(m)} className={chip(minutes === m)}>
                  {m} min
                </button>
              ))}
            </div>
          </div>
        </div>

        <button
          type="button"
          disabled={creating}
          onClick={create}
          className="mt-5 w-full border border-orange-400 bg-orange-500 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-50"
        >
          {creating ? "[ Creating... ]" : "[ Create room ]"}
        </button>
      </Panel>

      <div className="flex flex-col gap-4">
        <Panel index="02" title="Join with a code">
          <form
            onSubmit={(event) => {
              event.preventDefault();
              onJoin(joinText);
            }}
          >
            <label htmlFor="join-code" className={label}>
              Friend's room code
            </label>
            <input
              id="join-code"
              value={joinText}
              onChange={(event) => setJoinText(event.target.value.toUpperCase())}
              maxLength={6}
              autoComplete="off"
              spellCheck={false}
              placeholder="A1B2C3"
              aria-invalid={Boolean(joinError)}
              aria-describedby="join-error"
              className={`w-full border bg-black/40 px-4 py-3 text-center font-mono text-3xl font-bold tracking-[0.4em] text-white outline-none placeholder:text-zinc-700 focus:ring-2 focus:ring-orange-500/30 ${
                joinError ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70"
              }`}
            />
            <p id="join-error" className="mt-1.5 min-h-4 text-xs text-red-400">
              {joinError}
            </p>
            <button
              type="submit"
              className="mt-2 w-full border border-white/20 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-zinc-100 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
            >
              Join room
            </button>
          </form>
          <p className="mt-3 border-l-2 border-orange-500/60 pl-3 text-[11px] leading-5 text-zinc-400">
            The host has to approve your request before you enter the room.
          </p>
        </Panel>

        <Panel index="03" title="Past matches">
          <p className="text-sm text-zinc-400">
            {matchCount > 0 ? `${matchCount} saved on this device.` : "No matches yet. Your analytics will appear here after your first match."}
          </p>
          <button
            type="button"
            disabled={matchCount === 0}
            onClick={onOpenAnalytics}
            className="mt-3 border border-white/15 px-4 py-2 font-mono text-[11px] uppercase tracking-[0.18em] text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:cursor-not-allowed disabled:opacity-40"
          >
            View analytics
          </button>
        </Panel>
      </div>
    </div>
  );
}