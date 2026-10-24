import { useMemo, useState } from "react";
import {
  Award,
  Crown,
  Medal,
  Search,
  TrendingUp,
  Wallet,
} from "lucide-react";

const DEMO_PLAYERS = [
  { id: 1, name: "Aarav Mehta", rating: 1240, balance: 86200, wins: 84, losses: 18, avatar: 12 },
  { id: 2, name: "Rohan Sharma", rating: 842, balance: 24800, wins: 39, losses: 22, avatar: 11 },
  { id: 3, name: "Kabir Verma", rating: 795, balance: 18500, wins: 31, losses: 20, avatar: 13 },
  { id: 4, name: "Arjun Singh", rating: 720, balance: 15400, wins: 15, losses: 9, avatar: 14 },
  { id: 5, name: "Ishaan Kapoor", rating: 665, balance: 12800, wins: 10, losses: 8, avatar: 15 },
  { id: 6, name: "Dev Malhotra", rating: 612, balance: 9600, wins: 18, losses: 14, avatar: 16 },
  { id: 7, name: "Reyansh Patel", rating: 548, balance: 7200, wins: 12, losses: 13, avatar: 17 },
  { id: 8, name: "Aditya Rao", rating: 490, balance: 5300, wins: 9, losses: 11, avatar: 18 },
  { id: 9, name: "Vihaan Joshi", rating: 385, balance: 2800, wins: 5, losses: 8, avatar: 19 },
  { id: 10, name: "Your Profile", rating: 100, balance: 10000, wins: 0, losses: 0, avatar: 20 },
].sort((a, b) => b.rating - a.rating);

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
  return `$${value.toLocaleString("en-US")}`;
}

function Avatar({ player, size = "normal" }) {
  const sizeClass = size === "large" ? "h-16 w-16" : "h-10 w-10";

  return (
    <img
      src={`https://i.pravatar.cc/120?img=${player.avatar}`}
      alt={`${player.name} profile`}
      loading="lazy"
      className={`${sizeClass} rounded-full border border-white/15 bg-zinc-800 object-cover`}
    />
  );
}

function PodiumPlayer({ player, rank }) {
  const style = PODIUM_STYLES[rank];
  const isChampion = rank === 1;

  return (
    <div
      className={`relative flex min-w-0 flex-1 flex-col items-center rounded-2xl border px-2 pb-4 pt-5 text-center shadow-xl ${style.border} ${style.background} ${style.glow} ${
        isChampion ? "sm:-translate-y-3 sm:pb-6 sm:pt-7" : "sm:mt-5"
      }`}
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
        <span className={`absolute -bottom-1 left-1/2 flex h-6 min-w-6 -translate-x-1/2 items-center justify-center rounded-full border border-[#0b0b0c] px-1 text-xs font-bold ${style.background} ${style.color}`}>
          {rank}
        </span>
      </div>

      <p className="w-full truncate text-sm font-semibold text-white">{player.name}</p>
      <p className="mt-1 text-[10px] text-zinc-500">CW RATING</p>
      <p className={`mt-0.5 text-xl font-bold tabular-nums ${style.color}`}>
        {player.rating.toLocaleString("en-US")}
      </p>

      <div className="mt-3 w-full border-t border-white/10 pt-3">
        <p className="text-[10px] text-zinc-500">Virtual balance</p>
        <p className="mt-1 text-xs font-semibold text-zinc-200">
          {formatMoney(player.balance)}
        </p>
      </div>
    </div>
  );
}

export default function LeaderboardPage() {
  const [search, setSearch] = useState("");

  const rankedPlayers = useMemo(
    () =>
      DEMO_PLAYERS.filter((player) =>
        player.name.toLowerCase().includes(search.trim().toLowerCase()),
      ),
    [search],
  );

  const podiumPlayers = [DEMO_PLAYERS[1], DEMO_PLAYERS[0], DEMO_PLAYERS[2]];

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-6 text-white sm:px-6 sm:py-8 xl:px-9">
      <div className="mx-auto w-full max-w-7xl space-y-7">
        

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
            {podiumPlayers.map((player, index) => (
              <PodiumPlayer key={player.id} player={player} rank={index === 0 ? 2 : index === 1 ? 1 : 3} />
            ))}
          </div>
        </section>

        <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#0b0b0c]">
          <div className="flex flex-col gap-4 border-b border-white/8 p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
            <div>
              <h2 className="text-lg font-semibold">Global Rankings</h2>
              <p className="mt-1 text-xs text-zinc-500">
                Players ranked by current CW Rating
              </p>
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
                {rankedPlayers.filter((player) => player.id !== DEMO_PLAYERS[0].id && player.id !== DEMO_PLAYERS[1].id && player.id !== DEMO_PLAYERS[2].id).map((player) => {
                  const rank = DEMO_PLAYERS.findIndex((item) => item.id === player.id) + 1;
                  const matches = player.wins + player.losses;
                  const winRate = matches ? Math.round((player.wins / matches) * 100) : 0;

                  return (
                    <tr
                      key={player.id}
                      className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/[0.035]"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <span className="w-5 text-sm font-semibold tabular-nums text-zinc-500">
                            {rank}
                          </span>
                          <Avatar player={player} />
                          <div>
                            <p className="text-sm font-medium text-zinc-100">{player.name}</p>
                            <p className="mt-1 text-[10px] text-zinc-500">
                              {matches === 0 ? "New competitor" : `${player.wins} wins · ${player.losses} losses`}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <span className="text-sm font-bold tabular-nums text-[#f59a55]">
                          {player.rating.toLocaleString("en-US")}
                        </span>
                        <span className="ml-1 text-[10px] text-zinc-600">CW</span>
                      </td>
                      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-300">
                        {formatMoney(player.balance)}
                      </td>
                      <td className="px-4 py-4 text-right text-sm tabular-nums text-zinc-400">
                        {matches}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span className="inline-flex items-center justify-end gap-1 text-sm font-medium text-emerald-400">
                          {winRate}%
                          <TrendingUp size={13} />
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {rankedPlayers.filter((player) => ![1, 2, 3].includes(player.id)).length === 0 && (
              <div className="px-5 py-12 text-center">
                <Search className="mx-auto mb-3 text-zinc-600" size={24} />
                <p className="text-sm font-medium text-zinc-300">No players found</p>
                <p className="mt-1 text-xs text-zinc-500">Try another name.</p>
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
          <p className="text-[10px] uppercase tracking-[0.12em] text-zinc-600">
            Frontend demo data
          </p>
        </div>
      </div>
    </main>
  );
}
