import { useEffect, useState } from "react";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { Check, Copy, LogOut } from "lucide-react";

import { useAuth } from "../../../auth/AuthProvider";
import { approveJoin } from "../../../../features/rooms/roomsApi";
import { useRoomSocket } from "../../../../features/rooms/useRoomSocket";
import { ROUTES, useCopy } from "./friendsData";
import "./friends-room.css";

function Message({ text, onBack }) {
  return (
    <main className="fr-root fixed inset-0 z-50 grid place-items-center text-zinc-100">
      <div className="text-center">
        <p className="text-sm text-zinc-400">{text}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 border border-white/20 px-4 py-2 font-mono text-[11px] uppercase tracking-wider text-zinc-200 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          Back to lobby
        </button>
      </div>
    </main>
  );
}

export default function FriendsWaitingRoom() {
  const { code } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { room, requests, phase, error, closed, clearRequest, setReady, start, leave } = useRoomSocket(code);
  const { copied, copy } = useCopy();
  const [busyId, setBusyId] = useState(null);
  const [actionError, setActionError] = useState("");

  // Host ne Start dabaya -> sab live arena me
  useEffect(() => {
    if (phase === "countdown" || phase === "live") navigate(`${ROUTES.live}/${code}`, { replace: true });
  }, [phase, code, navigate]);

  const backToLobby = () => navigate(ROUTES.lobby);
  if (closed) return <Navigate to={ROUTES.lobby} replace />;
  if (!room) return <Message text={error || "Connecting to room..."} onBack={backToLobby} />;

  const meId = String(user?.id ?? user?._id ?? "");
  const hostId = String(room.host);
  const players = room.players.map((p) => ({
    id: String(p.user._id),
    name: p.user.username,
    elo: p.user.elo,
    ready: p.ready,
    isHost: String(p.user._id) === hostId,
  }));
  const isHost = meId === hostId;
  const me = players.find((p) => p.id === meId);
  const readyCount = players.filter((p) => p.ready || p.isHost).length;
  const canStart = players.length >= 2 && readyCount === players.length;
  const minutes = Math.round(room.durationSec / 60);
  const startHint =
    players.length < 2 ? "Need at least 2 players" : !canStart ? "Waiting for everyone to be ready" : "Everyone is ready";

  const decide = async (userId, accept) => {
    setBusyId(userId);
    setActionError("");
    try {
      await approveJoin({ code, userId, accept });
      clearRequest(userId);
    } catch (e) {
      setActionError(e.message);
    } finally {
      setBusyId(null);
    }
  };

  const onLeave = () => {
    leave();
    navigate(ROUTES.lobby);
  };

  const smallBtn =
    "border px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 disabled:opacity-40";

  return (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={onLeave}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <LogOut size={14} />
          Leave room
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Friends <span className="text-orange-500">/</span> Waiting room
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">Virtual funds only</span>
      </header>

      {(error || actionError) && (
        <p role="alert" className="shrink-0 border-b border-red-500/30 bg-red-500/10 px-4 py-2 text-xs text-red-300">
          {actionError || error}
        </p>
      )}

      <div className="grid min-h-0 flex-1 gap-4 p-4 lg:grid-cols-[minmax(0,1fr)_340px] lg:overflow-hidden">
        <div className="flex min-h-0 flex-col gap-4">
          <section className="fr-panel flex flex-wrap items-center gap-x-6 gap-y-2 p-3">
            <div>
              <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">Room code</p>
              <div className="flex items-center gap-2">
                <span className="fr-code font-mono text-2xl font-bold tracking-[0.3em] text-orange-300">{room.code}</span>
                <button
                  type="button"
                  onClick={() => copy(room.code)}
                  aria-label="Copy room code"
                  className="border border-white/15 p-1.5 text-zinc-300 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                >
                  {copied ? <Check size={13} /> : <Copy size={13} />}
                </button>
              </div>
            </div>
            {[
              ["Market", "BTC/USD"],
              ["Players", `${players.length} of ${room.maxPlayers}`],
              ["Length", `${minutes} min`],
              ["Capital", "$10,000 virtual"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">{k}</p>
                <p className="font-mono text-sm font-semibold text-white">{v}</p>
              </div>
            ))}
          </section>

          <section className="fr-panel fr-scroll min-h-0 flex-1 overflow-y-auto p-3">
            <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Players</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {players.map((p) => (
                <li key={p.id} className="flex items-center gap-3 border border-white/10 bg-black/30 p-3">
                  <span className="grid size-9 shrink-0 place-items-center border border-white/15 font-mono text-sm text-orange-300">
                   {(p.name || "?").slice(0, 1).toUpperCase()}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {p.name}
                      {p.id === meId && <span className="ml-1 text-zinc-500">(you)</span>}
                    </p>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-zinc-500">
                      {p.isHost ? "Host" : "Player"} · ELO {p.elo}
                    </p>
                  </div>
                  <span
                    className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                      p.ready || p.isHost ? "border-emerald-500/50 text-emerald-300" : "border-white/10 text-zinc-500"
                    }`}
                  >
                    {p.ready || p.isHost ? "Ready" : "Not ready"}
                  </span>
                </li>
              ))}
              {Array.from({ length: room.maxPlayers - players.length }, (_, i) => (
                <li
                  key={`empty-${i}`}
                  className="grid place-items-center border border-dashed border-white/10 p-3 text-xs text-zinc-600"
                >
                  Waiting for a player...
                </li>
              ))}
            </ul>
            <p className="mt-3 border-l-2 border-orange-500/60 pl-3 text-xs leading-5 text-zinc-400">
              Voice and video lounge is coming soon.
            </p>
          </section>
        </div>

        <aside className="fr-scroll flex min-h-0 flex-col gap-4 lg:overflow-y-auto">
          {isHost && (
            <section className="fr-panel p-3">
              <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Join requests</h2>
              {requests.length === 0 ? (
                <p className="text-xs text-zinc-500">No requests yet. Share the room code with a friend.</p>
              ) : (
                <ul className="space-y-2">
                  {requests.map((r) => (
                    <li key={r._id} className="flex items-center gap-2 border border-white/10 bg-black/30 p-2">
                      <span className="min-w-0 flex-1 truncate text-xs text-white">
                        {r.username} <span className="text-zinc-500">· ELO {r.elo}</span>
                      </span>
                      <button
                        type="button"
                        disabled={busyId === r._id}
                        onClick={() => decide(r._id, true)}
                        className={`${smallBtn} border-emerald-500/60 bg-emerald-500/15 text-emerald-300`}
                      >
                        Accept
                      </button>
                      <button
                        type="button"
                        disabled={busyId === r._id}
                        onClick={() => decide(r._id, false)}
                        className={`${smallBtn} border-white/15 text-zinc-300`}
                      >
                        Reject
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}

          <section className="fr-panel p-3">
            <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Ready check</h2>
            <p className="font-mono text-sm text-white">
              {readyCount} of {players.length} ready
            </p>
            <p className="mb-3 text-[11px] text-zinc-500">{startHint}</p>

            {isHost ? (
              <button
                type="button"
                disabled={!canStart}
                onClick={start}
                className="w-full border border-orange-400 bg-orange-500 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                [ Start match ]
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => setReady(!me?.ready)}
                  className={`w-full border py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                    me?.ready
                      ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300"
                      : "border-orange-400 bg-orange-500 text-black hover:bg-orange-400"
                  }`}
                >
                  {me?.ready ? "Ready (tap to undo)" : "I am ready"}
                </button>
                <p className="mt-2 text-[11px] text-zinc-500">The host starts the match when everyone is ready.</p>
              </>
            )}
          </section>
        </aside>
      </div>

      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-2 text-center font-mono text-[10px] text-zinc-600">
        Virtual funds only. Educational. Not investment advice.
      </footer>
    </main>
  );
}