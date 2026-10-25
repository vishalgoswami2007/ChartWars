import { useCallback, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { Check, Copy, LogOut, RefreshCw } from "lucide-react";

import VoicePanel, { useDemoSpeaking, useLocalMedia } from "./FriendsVoicePanel";
import PermissionsPanel from "./FriendsPermissions";
import {
  DEMO_FRIENDS,
  DEMO_MODE,
  ROUTES,
  SYMBOLS,
  clearRoom,
  loadRoom,
  makeCode,
  makeMember,
  saveRoom,
  useCopy,
} from "./friendsData";
import "./friends-room.css";

function Waiting({ initial }) {
  const navigate = useNavigate();
  const [room, setRoom] = useState(initial);
  const media = useLocalMedia();
  const speakingId = useDemoSpeaking(room.participants);
  const { copied, copy } = useCopy();

  useEffect(() => {
    saveRoom(room);
  }, [room]);

  // Demo: friends join one by one while the host waits.
  useEffect(() => {
    if (!DEMO_MODE || room.participants.length >= room.players) return undefined;
    const friend = DEMO_FRIENDS.find((f) => !room.participants.some((p) => p.id === f.id));
    if (!friend) return undefined;
    const id = setTimeout(() => {
      setRoom((r) => ({ ...r, participants: [...r.participants, makeMember(friend)] }));
    }, 2000);
    return () => clearTimeout(id);
  }, [room.participants, room.players]);

  // Demo: friends mark themselves ready after joining.
  useEffect(() => {
    if (!DEMO_MODE) return undefined;
    const pending = room.participants.find((p) => p.id !== "you" && p.role !== "host" && !p.ready);
    if (!pending) return undefined;
    const id = setTimeout(() => {
      setRoom((r) => ({ ...r, participants: r.participants.map((p) => (p.id === pending.id ? { ...p, ready: true } : p)) }));
    }, 1600);
    return () => clearTimeout(id);
  }, [room.participants]);

  const me = room.participants.find((p) => p.id === "you");
  const isHost = me?.role === "host";
  const full = room.participants.length >= room.players;
  const allReady = full && room.participants.every((p) => p.ready);
  const symbol = SYMBOLS.find((s) => s.id === room.symbol) ?? SYMBOLS[0];

  const startMatch = useCallback(() => {
    saveRoom({ ...room, phase: "live", startsAt: Date.now() });
    navigate(ROUTES.live);
  }, [room, navigate]);

  // Demo: when you are a member, the simulated host starts the match once everyone is ready.
  useEffect(() => {
    if (!DEMO_MODE || isHost || !allReady) return undefined;
    const id = setTimeout(startMatch, 3500);
    return () => clearTimeout(id);
  }, [isHost, allReady, startMatch]);

  const updatePerm = (id, key, value) =>
    setRoom((r) => ({ ...r, participants: r.participants.map((p) => (p.id === id ? { ...p, perms: { ...p.perms, [key]: value } } : p)) }));
  const kick = (id) => setRoom((r) => ({ ...r, participants: r.participants.filter((p) => p.id !== id) }));
  const toggleReady = () =>
    setRoom((r) => ({ ...r, participants: r.participants.map((p) => (p.id === "you" ? { ...p, ready: !p.ready } : p)) }));
  const newCode = () => setRoom((r) => ({ ...r, code: makeCode() }));
  const leave = () => {
    clearRoom();
    navigate(ROUTES.lobby);
  };

  const readyCount = room.participants.filter((p) => p.ready).length;
  const startHint = !full
    ? `Waiting for ${room.players - room.participants.length} more`
    : !allReady
      ? "Waiting for everyone to be ready"
      : "Everyone is ready";

  return (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100 max-lg:overflow-y-auto">
      <header className="flex shrink-0 flex-wrap items-center justify-between gap-2 border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={leave}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <LogOut size={14} />
          Leave room
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Friends <span className="text-orange-500">/</span> Waiting room
        </p>
        <div className="flex items-center gap-2">
          {DEMO_MODE && (
            <span className="border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-amber-300">
              Demo: simulated friends
            </span>
          )}
        </div>
      </header>

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
                {isHost && (
                  <button
                    type="button"
                    onClick={newCode}
                    aria-label="Generate a new room code"
                    title="New code"
                    className="border border-white/15 p-1.5 text-zinc-300 transition hover:border-orange-500/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
                  >
                    <RefreshCw size={13} />
                  </button>
                )}
              </div>
            </div>
            {[
              ["Market", `${symbol.ticker}/USD`],
              ["Players", `${room.participants.length} of ${room.players}`],
              ["Length", `${room.minutes} min`],
              ["Capital", "$10,000 virtual"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="font-mono text-[9px] uppercase tracking-[0.22em] text-zinc-500">{k}</p>
                <p className="font-mono text-sm font-semibold text-white">{v}</p>
              </div>
            ))}
          </section>

          <section className="fr-panel min-h-0 flex-1 overflow-y-auto p-3 fr-scroll">
            <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">The lounge</h2>
            <VoicePanel people={room.participants} players={room.players} media={media} speakingId={speakingId} />
            <p className="mt-3 border-l-2 border-orange-500/60 pl-3 text-xs leading-5 text-zinc-400">
              Turn on your mic to talk before the match. Camera is optional, and you can switch either on or off at any time.
            </p>
          </section>
        </div>

        <aside className="fr-scroll flex min-h-0 flex-col gap-4 lg:overflow-y-auto">
          <section className="fr-panel p-3">
            <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Permissions</h2>
            <PermissionsPanel people={room.participants} meId="you" onChange={updatePerm} onKick={kick} />
          </section>

          <section className="fr-panel p-3">
            <h2 className="mb-2 font-mono text-[10px] uppercase tracking-[0.22em] text-zinc-400">Ready check</h2>
            <p className="font-mono text-sm text-white">
              {readyCount} of {room.players} ready
            </p>
            <p className="mb-3 text-[11px] text-zinc-500">{startHint}</p>

            {isHost ? (
              <button
                type="button"
                disabled={!allReady}
                onClick={startMatch}
                className="w-full border border-orange-400 bg-orange-500 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-black transition hover:bg-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 focus-visible:ring-offset-2 focus-visible:ring-offset-black disabled:cursor-not-allowed disabled:opacity-40"
              >
                [ Start match ]
              </button>
            ) : (
              <>
                <button
                  type="button"
                  onClick={toggleReady}
                  className={`w-full border py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300 ${
                    me?.ready ? "border-emerald-500/60 bg-emerald-500/15 text-emerald-300" : "border-orange-400 bg-orange-500 text-black hover:bg-orange-400"
                  }`}
                >
                  {me?.ready ? "Ready (tap to undo)" : "I am ready"}
                </button>
                <p className="mt-2 text-[11px] text-zinc-500">
                  {allReady ? "The host is starting the match..." : "The host starts the match when everyone is ready."}
                </p>
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

export default function FriendsWaitingRoom() {
  const [room] = useState(loadRoom);
  if (!room) return <Navigate to={ROUTES.lobby} replace />;
  return <Waiting initial={room} />;
}