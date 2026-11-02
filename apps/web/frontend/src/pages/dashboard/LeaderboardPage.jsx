import { useMemo, useState } from "react";
import { Award, Crown, Medal, RefreshCw, Search, TrendingUp, Wallet } from "lucide-react";

import { useLeaderboard } from "../../features/social/useLeaderboard";
import { avatarSrc, displayName, initialsOf } from "../../features/social/people";

const PODIUM_STYLES = {
  1: {
    label: "CHAMPION",
    border: "border-amber-400/50",
    background: "bg-amber-400/10",
    color: "text-amber-300",
    glow: "shadow-amber-950/30",
  },
  2: {
    label: "RUNNER UP",
    border: "border-zinc-300/30",
    background: "bg-zinc-300/5",
    color: "text-zinc-200",
    glow: "shadow-black/20",
  },
  3: {
    label: "THIRD PLACE",
    border: "border-orange-700/40",
    background: "bg-orange-700/10",
    color: "text-orange-300",
    glow: "shadow-black/20",
  },
};

function formatMoney(value) {
  return `$${Math.round(Number(value) || 0).toLocaleString("en-US")}`;
}

function Avatar({ player, size = "normal" }) {
  const sizeClass = size === "large" ? "h-16 w-16 text-lg" : "h-10 w-10 text-sm";
  const src = avatarSrc(player);

  if (src) {
    return (
      <img
        src={src}
        alt={`${displayName(player)} profile`}
        loading="lazy"
        className={`${sizeClass} shrink-0 rounded-full border border-white/15 bg-zinc-800 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} flex shrink-0 items-center justify-center rounded-full border border-[#e87524]/25 bg-[#e87524]/10 font-semibold text-[#f5a36b]`}
    >
      {initialsOf(player)}
    </div>
  );
}

function OpenSpot({ rank }) {
  const style = PODIUM_STYLES[rank];
  return (
    <div
      className={`flex min-w-0 flex-1 flex-col items-center justify-center rounded-2xl border border-dashed border-white/10 px-2 py-8 text-center ${
        rank === 1 ? "sm:-translate-y-3" : "sm:mt-5"
      }`}
    >
      <p className={`text-[9px] font-bold tracking-[0.16em] ${style.color}`}>{style.label}</p>
      <p className="mt-3 text-xs text-zinc-600">Open spot</p>
    </div>
  );
}

function PodiumPlayer({ player, rank, isMe }) {
  if (!player) return <OpenSpot rank={rank} />;

  const style = PODIUM_STYLES[rank];
  const isChampion = rank === 1;

  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col items-center rounded-2xl border px-2 pb-4 pt-5 text-center shadow-xl ${style.border} ${style.background} ${style.glow} ${
        isChampion ? "sm:-translate-y-3 sm:pb-6 sm:pt-7" : "sm:mt-5"
      } ${isMe ? "ring-1 ring-[#e87524]/60" : ""}`}
    >
      <div className={`mb-3 flex items-center gap-1 text-[9px] font-bold tracking-[0.16em] ${style.color}`}>
        {isChampion ? <Crown size={13} /> : <Award size={13} />}
        <span>{style.label}</span>
      </div>

      <div className="relative mb-3">
        {isChampion && (
          <div className="absolute -top-5 left-1/2 -translate-x-1/2 text-amber-300">
            <Crown size={22} fill="currentColor" />
          </div>
        )}
        <div className={`rounded-full p-1 ${rank === 1 ? "bg-amber-300/20" : "bg-white/5"}`}>
          <Avatar player={player} size="large" />
        </div>
        <span
          className={`absolute -bottom-1 left-1/2 flex h-6 min-w-6 -translate-x-1/2 items-center justify-center rounded-full border border-[#0b0b0c] px-1 text-xs font-bold ${style.background} ${style.color}`}
        >
          {rank}
        </span>
      </div>

      <p className="w-full truncate text-sm font-semibold text-white">
        {displayName(player)}
        {isMe && <span className="ml-1 text-[#f5a36b]">(you)</span>}
      </p>
      <p className="mt-1 text-[10px] text-zinc-500">CW RATING</p>
      <p className={`mt-0.5 text-xl font-bold tabular-nums ${style.color}`}>{player.elo.toLocaleString("en-US")}</p>

      <div className="mt-3 w-full border-t border-white/10 pt-3">
        <p className="text-[10px] text-zinc-500">Virtual balance</p>
        <p className="mt-1 text-xs font-semibold text-zinc-200">{formatMoney(player.balance)}</p>
      </div>
    </div>
  );
}

function PlayerRow({ player, isMe }) {
  return (
    <tr
      className={`border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.035] ${
        isMe ? "bg-[#e87524]/6" : ""
      }`}
    >
      <td className="px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="w-6 text-sm font-semibold tabular-nums text-zinc-500">{player.rank}</span>
          <Avatar player={player} />
          <div>
            <p className="text-sm font-medium text-zinc-100">
              {displayName(player)}
              {isMe && (
                <span className="ml-2 rounded bg-[#e87524]/15 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#f5a36b]">
                  You
                </span>
              )}
            </p>
            <p className="mt-1 text-[10px] text-zinc-500">
              {player.matches === 0 ? "New competitor" : `${player.wins} wins · ${player.losses} losses`}
            </p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-sm font-bold tabular-nums text-[#f59a55]">{player.elo.toLocaleString("en-US")}</span>
        <span className="ml-1 text-[10px] text-zinc-600">CW</span>
      </td>
      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-300">{formatMoney(player.balance)}</td>
      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-400">{player.matches}</td>
      <td className="px-5 py-4 text-right">
        <span
          className={`inline-flex items-center justify-end gap-1 text-sm font-medium ${
            player.winRate >= 50 ? "text-emerald-400" : "text-zinc-400"
          }`}
        >
          {player.winRate}%
          <TrendingUp size={13} />
        </span>
      </td>
    </tr>
  );
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");
  const { players, me, total, loading, error, refresh } = useLeaderboard();

  const query = search.trim().toLowerCase();
  const meId = me?.id;

  const rows = useMemo(() => {
    if (!query) return players.slice(3);
    return players.filter((p) => `${displayName(p)} ${p.username}`.toLowerCase().includes(query));
  }, [players, query]);

  // Tu top 100 se bahar ho to apna rank alag se dikhao
  const showMeRow = Boolean(me) && !query && !players.some((p) => p.id === meId);

  const podium = [
    { rank: 2, player: players[1] },
    { rank: 1, player: players[0] },
    { rank: 3, player: players[2] },
  ];

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 sm:py-8 xl:px-9">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        {error && (
          <div
            role="alert"
            className="flex items-center justify-between gap-3 rounded-xl border border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-300"
          >
            <p>{error}</p>
            <button
              type="button"
              onClick={refresh}
              className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-red-400/30 px-3 py-1.5 text-red-200 transition hover:bg-red-500/10"
            >
              <RefreshCw size={13} />
              Retry
            </button>
          </div>
        )}

        <section className="rounded-2xl border border-white/10 bg-[#0b0b0c] p-4 sm:p-6">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Hall of Champions</h2>
              <p className="mt-1 text-xs text-zinc-500">The top three by CW Rating</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-full border border-amber-400/20 bg-amber-400/5 px-3 py-1.5 text-[10px] font-medium text-amber-200">
              <Medal size={13} />
              Top 3
            </div>
          </div>

          <div className="grid grid-cols-3 items-stretch gap-2 sm:gap-5">
            {podium.map(({ rank, player }) => (
              <PodiumPlayer key={rank} player={player} rank={rank} isMe={player?.id === meId} />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
          <div className="flex flex-col gap-4 border-b border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-lg font-semibold">Global Rankings</h2>
              <p className="mt-1 text-xs text-zinc-500">Players ranked by current CW Rating</p>
            </div>

            <label className="flex w-full items-center gap-2 rounded-xl border border-white/10 bg-[#111113] px-3 py-2.5 sm:max-w-xs">
              <Search size={16} className="shrink-0 text-zinc-500" />
              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search players..."
                aria-label="Search leaderboard players"
                className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
              />
            </label>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-180 border-collapse text-left">
              <thead>
                <tr className="border-b border-white/8 bg-white/2 text-[10px] font-semibold uppercase tracking-[0.13em] text-zinc-500">
                  <th className="px-5 py-4">Rank / Player</th>
                  <th className="px-4 py-4 text-right">CW Rating</th>
                  <th className="px-4 py-4 text-right">Virtual balance</th>
                  <th className="px-4 py-4 text-right">Matches</th>
                  <th className="px-5 py-4 text-right">Win rate</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((player) => (
                  <PlayerRow key={player.id} player={player} isMe={player.id === meId} />
                ))}

                {showMeRow && (
                  <>
                    <tr>
                      <td
                        colSpan={5}
                        className="px-5 py-2 text-center text-[10px] uppercase tracking-[0.3em] text-zinc-600"
                      >
                        Your position
                      </td>
                    </tr>
                    <PlayerRow player={me} isMe />
                  </>
                )}
              </tbody>
            </table>

            {loading && players.length === 0 && (
              <p className="px-5 py-12 text-center text-sm text-zinc-500">Loading rankings...</p>
            )}

            {!loading && rows.length === 0 && (
              <div className="px-5 py-12 text-center">
                <Search className="mx-auto mb-3 text-zinc-600" size={24} />
                <p className="text-sm font-medium text-zinc-300">
                  {query ? "No players found" : "No more players yet"}
                </p>
                <p className="mt-1 text-xs text-zinc-500">
                  {query ? "Try another name." : "Invite friends to join the competition."}
                </p>
              </div>
            )}
          </div>
        </section>

        <div className="flex flex-col gap-3 rounded-xl border border-white/8 bg-[#0b0b0c] p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Wallet className="mt-0.5 shrink-0 text-[#f59a55]" size={18} />
            <div>
              <p className="text-sm font-medium text-zinc-200">Virtual balance, real practice.</p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">
                Balances are simulated and do not represent real money. CW Rating reflects competitive match results.
              </p>
            </div>
          </div>
          <p className="text-[10px] uppercase tracking-[0.12em] text-emerald-500/80">
            Live · {total} {total === 1 ? "player" : "players"}
          </p>
        </div>
      </div>
    </main>
  );
}