import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import FriendsLobby from "./FriendsLobby";
import { CODE_RE, ROUTES, loadHistory, normalizeCode } from "./friendsData";
import { createRoom, requestJoin } from "../../../../features/rooms/roomsApi";
import { socket } from "../../../../lib/socket";
import "./friends-room.css";

const MINUTES_OK = [1, 5, 10, 15]; // backend sirf yahi durations allow karta hai

export default function FriendsRoom() {
  const navigate = useNavigate();
  const [joinError, setJoinError] = useState("");
  const [createError, setCreateError] = useState("");
  const [pendingCode, setPendingCode] = useState(null);
  const [matchCount] = useState(() => loadHistory().length);

  // Host ka jawab (approve / reject) socket se aata hai
  useEffect(() => {
    if (!pendingCode) return undefined;
    const onResult = ({ code, accepted }) => {
      if (code !== pendingCode) return;
      if (accepted) {
        navigate(`${ROUTES.waiting}/${code}`);
      } else {
        setPendingCode(null);
        setJoinError("Host ne request reject kar di.");
      }
    };
    socket.on("room:join-result", onResult);
    return () => socket.off("room:join-result", onResult);
  }, [pendingCode, navigate]);

  const handleCreate = async ({ players = 2, minutes = 5 } = {}) => {
  setJoinError("");
  setCreateError("");
  try {
    const room = await createRoom({ durationSec: minutes * 60, maxPlayers: players });
    console.log("room created", room);
    navigate(`${ROUTES.waiting}/${room.code}`);
  } catch (e) {
    console.error("create room failed", e);
    setCreateError(e.message);
  }
};
  const handleJoin = async (raw) => {
    const code = normalizeCode(raw);
    if (!CODE_RE.test(code)) {
      setJoinError("Enter the 6-character code your friend shared.");
      return;
    }
    setJoinError("");
    try {
      const res = await requestJoin(code);
      if (res.status === "joined") navigate(`${ROUTES.waiting}/${code}`);
      else setPendingCode(code);
    } catch (e) {
      setJoinError(e.message);
    }
  };

  return (
    <main className="fr-root fixed inset-0 z-50 flex flex-col overflow-hidden text-zinc-100">
      <header className="flex shrink-0 items-center justify-between border-b border-white/10 px-4 py-2.5">
        <button
          type="button"
          onClick={() => navigate(ROUTES.rooms)}
          className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400"
        >
          <ArrowLeft size={14} />
          Exit
        </button>
        <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-zinc-500">
          Friends <span className="text-orange-500">/</span> Lobby
        </p>
        <span className="hidden font-mono text-[10px] uppercase tracking-widest text-zinc-600 sm:block">Virtual funds only</span>
      </header>

      {pendingCode && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-orange-500/30 bg-orange-500/8 px-4 py-2 text-xs text-orange-200">
          <span>
            Request bhej di room <b className="font-mono tracking-widest">{pendingCode}</b> ke liye. Host ke approve karne ka wait...
          </span>
          <button
            type="button"
            onClick={() => setPendingCode(null)}
            className="border border-orange-400 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-orange-200 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            Cancel
          </button>
        </div>
      )}

      <FriendsLobby
        nextCode="------"
        onNewCode={() => {}}
        onCreate={handleCreate}
        onJoin={handleJoin}
        joinError={joinError}
        matchCount={matchCount}
        onOpenAnalytics={() => navigate(ROUTES.analytics)}
      />

      <footer className="shrink-0 border-t border-orange-500/30 bg-[#070707]/95 px-4 py-2 text-center font-mono text-[10px] text-zinc-600">
        Virtual funds only. Educational. Not investment advice.
      </footer>
    </main>
  );
}