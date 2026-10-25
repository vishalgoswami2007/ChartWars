import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

import FriendsLobby from "./FriendsLobby";
import {
  CODE_RE,
  ROUTES,
  createRoom,
  getNextCode,
  joinRoom,
  loadHistory,
  loadRoom,
  normalizeCode,
  rotateCode,
  saveRoom,
} from "./friendsData";
import "./friends-room.css";

export default function FriendsRoom() {
  const navigate = useNavigate();
  const [nextCode, setNextCode] = useState(getNextCode);
  const [joinError, setJoinError] = useState("");
  const [existing] = useState(loadRoom);
  const [matchCount] = useState(() => loadHistory().length);

  const handleCreate = (options) => {
    saveRoom(createRoom({ code: nextCode, ...options }));
    navigate(ROUTES.waiting);
  };

  const handleJoin = (raw) => {
    const code = normalizeCode(raw);
    if (!CODE_RE.test(code)) {
      setJoinError("Enter the 6-character code your friend shared.");
      return;
    }
    if (code === nextCode) {
      setJoinError("That is your own code. Send it to a friend instead.");
      return;
    }
    setJoinError("");
    saveRoom(joinRoom(code));
    navigate(ROUTES.waiting);
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

      {existing && (
        <div className="flex shrink-0 items-center justify-between gap-3 border-b border-orange-500/30 bg-orange-500/8 px-4 py-2 text-xs text-orange-200">
          <span>
            You are already in room <b className="font-mono tracking-widest">{existing.code}</b>.
          </span>
          <button
            type="button"
            onClick={() => navigate(existing.phase === "live" ? ROUTES.live : ROUTES.waiting)}
            className="border border-orange-400 px-3 py-1 font-mono text-[11px] uppercase tracking-wider text-orange-200 transition hover:bg-orange-500/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-300"
          >
            Return to room
          </button>
        </div>
      )}

      <FriendsLobby
        nextCode={nextCode}
        onNewCode={() => setNextCode(rotateCode())}
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