
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Crown,
  Link2,
  Mic,
  MicOff,
  Plus,
  Radio,
  ShieldCheck,
  Users,
  Video,
  VideoOff,
  Zap,
} from "lucide-react";


const createRoomId = () =>
  `fr_${Math.random().toString(36).slice(2, 6)}_${Date.now()
    .toString(36)
    .slice(-4)}`;

const initialPlayers = [
  { id: "you", name: "You", initials: "YOU", role: "HOST", status: "ready" },
  { id: "p2", name: "Open seat", initials: "+", role: "PLAYER", status: "empty" },
  { id: "p3", name: "Open seat", initials: "+", role: "PLAYER", status: "empty" },
  { id: "p4", name: "Open seat", initials: "+", role: "PLAYER", status: "empty" },
];

export default function FriendsRoom() {
  const navigate = useNavigate();

  const [roomId, setRoomId] = useState(createRoomId);
  const [players, setPlayers] = useState(initialPlayers);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [copied, setCopied] = useState(false);
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");

  const inviteUrl = `${window.location.origin}/dashboard/rooms/friends/room?roomId=${roomId}`;

  const occupiedPlayers = players.filter(
    (player) => player.status !== "empty"
  ).length;

  const handleCopyInvite = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setError("Could not copy the invite link. Copy it from the input field.");
    }
  };

  const handleCreateRoom = () => {
    const nextRoomId = createRoomId();
    setRoomId(nextRoomId);
    setPlayers(initialPlayers);
    setError("");
  };

  const handleJoinRoom = (event) => {
    event.preventDefault();

    const cleanCode = joinCode.trim().replace(/\s+/g, "");

    if (!cleanCode) {
      setError("Enter a room ID to join a friend's room.");
      return;
    }

    navigate(
      `/dashboard/rooms/friends/room?roomId=${encodeURIComponent(cleanCode)}`
    );
  };

  const handleStartRoom = () => {
    navigate(
      `/dashboard/rooms/friends/room?roomId=${encodeURIComponent(roomId)}&role=admin&voice=${voiceEnabled}&video=${videoEnabled}`
    );
  };

  return (
    <main className="fr-page">
      <div className="fr-shell">
        <header className="fr-topbar">
          <div className="fr-brand">
            <button
              type="button"
              className="fr-back"
              onClick={() => navigate("/dashboard/rooms")}
              aria-label="Back to rooms"
            >
              <ArrowLeft size={17} />
            </button>

            <div className="fr-brand-mark">
              <Users size={19} />
            </div>

            <div>
              <div className="fr-brand-name">
                CHART<span>WARS</span>
              </div>
              <div className="fr-brand-subtitle">SOCIAL TRADING</div>
            </div>
          </div>

          <div className="fr-top-status">
            <span className="fr-status-dot" />
            ROOM SYSTEM READY
          </div>

          <div className="fr-top-version">FR / 01</div>
        </header>

        <section className="fr-hero">
          <div className="fr-eyebrow">
            <span className="fr-eyebrow-line" />
            MULTIPLAYER PRACTICE
            <span className="fr-eyebrow-line" />
          </div>

          <h1>
            Trade together.
            <br />
            <span>Think as one.</span>
          </h1>

          <p className="fr-hero-copy">
            Build a private trading room, bring your crew together, and
            practise your strategy in one shared arena.
          </p>

          <div className="fr-hero-meta">
            <span>
              <Users size={14} /> UP TO 4 PLAYERS
            </span>
            <span>
              <Radio size={14} /> PRIVATE ROOM
            </span>
            <span>
              <ShieldCheck size={14} /> ADMIN CONTROL
            </span>
          </div>
        </section>

        <section className="fr-main-grid">
          <article className="fr-panel fr-create-panel">
            <div className="fr-panel-heading">
              <div className="fr-section-icon">
                <Users size={19} />
              </div>
              <div>
                <div className="fr-kicker">01 / ROOM CONFIGURATION</div>
                <h2>Create your room</h2>
              </div>
              <span className="fr-admin-badge">
                <Crown size={12} /> ADMIN
              </span>
            </div>

            <div className="fr-room-identity">
              <div>
                <span className="fr-field-label">ROOM IDENTIFIER</span>
                <strong>{roomId.toUpperCase()}</strong>
              </div>
              <button
                type="button"
                className="fr-icon-button"
                onClick={handleCreateRoom}
                title="Generate a new room ID"
                aria-label="Generate a new room ID"
              >
                <Plus size={17} />
              </button>
            </div>

            <label className="fr-field-label" htmlFor="fr-invite-link">
              INVITATION LINK
            </label>

            <div className="fr-invite-row">
              <div className="fr-input-with-icon">
                <Link2 size={15} />
                <input
                  id="fr-invite-link"
                  value={inviteUrl}
                  readOnly
                  onFocus={(event) => event.target.select()}
                  aria-label="Room invitation link"
                />
              </div>

              <button
                type="button"
                className={`fr-copy-button ${copied ? "is-copied" : ""}`}
                onClick={handleCopyInvite}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>

            <div className="fr-divider" />

            <div className="fr-subheading">
              <span>YOUR CREW</span>
              <span>{occupiedPlayers} / 4 OCCUPIED</span>
            </div>

            <div className="fr-player-grid">
              {players.map((player, index) => (
                <div
                  className={`fr-player-slot ${
                    player.status === "empty" ? "is-empty" : "is-host"
                  }`}
                  key={player.id}
                >
                  <div className="fr-player-avatar">
                    {player.status === "empty" ? (
                      <Plus size={20} />
                    ) : (
                      player.initials
                    )}
                    {player.status !== "empty" && (
                      <span className="fr-avatar-online" />
                    )}
                  </div>

                  <div className="fr-player-name">{player.name}</div>
                  <div className="fr-player-role">
                    {player.status === "empty" ? "AWAITING PLAYER" : player.role}
                  </div>

                  {index === 0 && (
                    <span className="fr-host-crown">
                      <Crown size={11} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="fr-helper">
              Share the invitation link with your friends. Player presence
              will update when multiplayer services are connected.
            </p>

            <div className="fr-divider" />

            <div className="fr-subheading">
              <span>SESSION PERMISSIONS</span>
              <span className="fr-editable-label">ADMIN CONFIGURABLE</span>
            </div>

            <button
              type="button"
              className="fr-permission-row"
              onClick={() => setVoiceEnabled((value) => !value)}
              aria-pressed={voiceEnabled}
            >
              <span className="fr-permission-icon">
                {voiceEnabled ? <Mic size={17} /> : <MicOff size={17} />}
              </span>
              <span className="fr-permission-copy">
                <strong>Global voice</strong>
                <small>Voice communication for the room</small>
              </span>
              <span className={`fr-toggle ${voiceEnabled ? "is-on" : ""}`}>
                <span />
              </span>
              <span className="fr-toggle-value">
                {voiceEnabled ? "ON" : "OFF"}
              </span>
            </button>

            <button
              type="button"
              className="fr-permission-row"
              onClick={() => setVideoEnabled((value) => !value)}
              aria-pressed={videoEnabled}
            >
              <span className="fr-permission-icon">
                {videoEnabled ? <Video size={17} /> : <VideoOff size={17} />}
              </span>
              <span className="fr-permission-copy">
                <strong>Video access</strong>
                <small>Allow cameras during the session</small>
              </span>
              <span className={`fr-toggle ${videoEnabled ? "is-on" : ""}`}>
                <span />
              </span>
              <span className="fr-toggle-value">
                {videoEnabled ? "YES" : "NO"}
              </span>
            </button>

            {error && <p className="fr-error">{error}</p>}

            <button
              type="button"
              className="fr-primary-button"
              onClick={handleStartRoom}
            >
              OPEN WAITING ROOM
              <ArrowUpRight size={17} />
            </button>

            <p className="fr-disclaimer">
              VIRTUAL FUNDS ONLY · EDUCATIONAL PRACTICE
            </p>
          </article>

          <aside className="fr-side-column">
            <article className="fr-panel fr-join-panel">
              <div className="fr-kicker">02 / JOIN YOUR CREW</div>
              <h2>Already invited?</h2>
              <p>
                Enter your friend’s room identifier to continue to their
                waiting room.
              </p>

              <form onSubmit={handleJoinRoom}>
                <label className="fr-field-label" htmlFor="fr-join-code">
                  ROOM ID
                </label>
                <input
                  id="fr-join-code"
                  className="fr-text-input"
                  placeholder="e.g. fr_a1b2_c3d4"
                  value={joinCode}
                  onChange={(event) => setJoinCode(event.target.value)}
                />
                <button type="submit" className="fr-secondary-button">
                  JOIN ROOM <ArrowUpRight size={16} />
                </button>
              </form>
            </article>

            <article className="fr-panel fr-preview-panel">
              <div className="fr-preview-top">
                <div className="fr-kicker">03 / ARENA PREVIEW</div>
                <span className="fr-preview-live">
                  <span className="fr-status-dot" /> READY
                </span>
              </div>

              <div className="fr-preview-chart">
                <div className="fr-chart-grid">
                  {[1, 2, 3, 4, 5].map((line) => (
                    <span key={line} />
                  ))}
                </div>
                <svg
                  viewBox="0 0 320 145"
                  className="fr-chart-svg"
                  role="img"
                  aria-label="Illustrative trading chart preview"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="fr-chart-fill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f97316" stopOpacity=".22" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 112 L20 99 L37 106 L53 73 L69 85 L86 64 L105 77 L122 49 L141 66 L157 38 L174 55 L193 62 L211 33 L231 48 L250 26 L271 42 L289 18 L320 24 L320 145 L0 145 Z"
                    fill="url(#fr-chart-fill)"
                  />
                  <path
                    d="M0 112 L20 99 L37 106 L53 73 L69 85 L86 64 L105 77 L122 49 L141 66 L157 38 L174 55 L193 62 L211 33 L231 48 L250 26 L271 42 L289 18 L320 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>
                <div className="fr-chart-price">SHARED MARKET VIEW</div>
              </div>

              <div className="fr-preview-stats">
                <div>
                  <span>CHART</span>
                  <strong>Candlestick</strong>
                </div>
                <div>
                  <span>TRADING MODE</span>
                  <strong>Practice</strong>
                </div>
                <div>
                  <span>CONTROL</span>
                  <strong>Admin-led</strong>
                </div>
              </div>
            </article>

            <div className="fr-note">
              <Zap size={17} />
              <div>
                <strong>One chart. One crew.</strong>
                <p>
                  Coordinate strategies, discuss setups, and learn together
                  in a private practice environment.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <footer className="fr-footer">
          <span>CHARTWARS / FRIENDS ROOM</span>
          <span>
            <ShieldCheck size={13} /> EDUCATIONAL USE ONLY
          </span>
          <span>BUILD 01.00</span>
        </footer>
      </div>
    </main>
  );
}
