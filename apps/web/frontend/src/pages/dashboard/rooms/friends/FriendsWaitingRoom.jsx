
import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowLeft,
  ArrowUpRight,
  Check,
  Copy,
  Crown,
  Link2,
  Mic,
  MicOff,
  ShieldCheck,
  Users,
  Video,
  VideoOff,
  Zap,
} from "lucide-react";
import "./friends-room.css";

export default function FriendsWaitingRoom() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const roomId = searchParams.get("roomId") || "";
  const role = searchParams.get("role") || "player";
  const isHost = role.toLowerCase() === "admin" || role.toLowerCase() === "host";
  const voiceEnabled = searchParams.get("voice") !== "false";
  const videoEnabled = searchParams.get("video") !== "false";

  const [copied, setCopied] = useState(false);
  const [started, setStarted] = useState(false);
  const [copyError, setCopyError] = useState("");

  const inviteUrl = `${window.location.origin}/dashboard/rooms/friends/room?roomId=${encodeURIComponent(roomId)}`;

  const players = [
    { id: 1, name: "You", initials: "YOU", status: "Connected", host: isHost },
    { id: 2, name: "Waiting for player", initials: "+", status: "Open seat" },
    { id: 3, name: "Waiting for player", initials: "+", status: "Open seat" },
    { id: 4, name: "Waiting for player", initials: "+", status: "Open seat" },
  ];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(inviteUrl);
      setCopied(true);
      setCopyError("");
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopyError("Copy failed. Select and copy the invitation link manually.");
    }
  };

  const handleBack = () => {
    navigate("/dashboard/rooms/friends");
  };

  return (
    <main className="fr-page">
      <div className="fr-shell">
        <header className="fr-topbar">
          <div className="fr-brand">
            <button
              type="button"
              className="fr-back"
              onClick={handleBack}
              aria-label="Back to Friends Room setup"
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
              <div className="fr-brand-subtitle">FRIENDS ARENA</div>
            </div>
          </div>

          <div className="fr-top-status">
            <span className="fr-status-dot" />
            {started ? "PRACTICE SESSION" : "WAITING ROOM"}
          </div>

          <div className="fr-top-version">FR / 02</div>
        </header>

        <section className="fr-hero">
          <div className="fr-eyebrow">
            <span className="fr-eyebrow-line" />
            PRIVATE MULTIPLAYER
            <span className="fr-eyebrow-line" />
          </div>

          <h1>
            {started ? "Your arena." : "Your crew."}
            <br />
            <span>{started ? "Your next move." : "Your next move."}</span>
          </h1>

          <p className="fr-hero-copy">
            {started
              ? "Your local practice view is active. Real-time multiplayer requires the backend connection."
              : "Share your room, get your crew together, and prepare for a private practice session."}
          </p>

          <div className="fr-hero-meta">
            <span><Users size={14} /> UP TO 4 PLAYERS</span>
            <span><ShieldCheck size={14} /> PRIVATE ROOM</span>
            <span><Zap size={14} /> PRACTICE MODE</span>
          </div>
        </section>

        <section className="fr-main-grid">
          <article className="fr-panel fr-create-panel">
            <div className="fr-panel-heading">
              <div className="fr-section-icon">
                <Users size={19} />
              </div>
              <div>
                <div className="fr-kicker">01 / SESSION STATUS</div>
                <h2>{started ? "Practice is ready" : "Waiting for your crew"}</h2>
              </div>
              {isHost && (
                <span className="fr-admin-badge">
                  <Crown size={12} /> HOST
                </span>
              )}
            </div>

            <div className="fr-room-identity">
              <div>
                <span className="fr-field-label">ROOM IDENTIFIER</span>
                <strong>{roomId ? roomId.toUpperCase() : "ROOM ID MISSING"}</strong>
              </div>
              <span className="fr-preview-live">
                <span className="fr-status-dot" />
                {started ? "ACTIVE" : "READY"}
              </span>
            </div>

            <label className="fr-field-label" htmlFor="fr-waiting-invite">
              INVITATION LINK
            </label>

            <div className="fr-invite-row">
              <div className="fr-input-with-icon">
                <Link2 size={15} />
                <input
                  id="fr-waiting-invite"
                  value={inviteUrl}
                  readOnly
                  onFocus={(event) => event.target.select()}
                  aria-label="Room invitation link"
                />
              </div>

              <button
                type="button"
                className={`fr-copy-button ${copied ? "is-copied" : ""}`}
                onClick={handleCopy}
                disabled={!roomId}
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
                {copied ? "COPIED" : "COPY LINK"}
              </button>
            </div>

            {copyError && <p className="fr-error">{copyError}</p>}

            <div className="fr-divider" />

            <div className="fr-subheading">
              <span>PLAYER ROSTER</span>
              <span>1 / 4 CONNECTED</span>
            </div>

            <div className="fr-player-grid">
              {players.map((player) => (
                <div
                  className={`fr-player-slot ${
                    player.id === 1 ? "is-host" : "is-empty"
                  }`}
                  key={player.id}
                >
                  <div className="fr-player-avatar">
                    {player.id === 1 ? player.initials : <Users size={18} />}
                    {player.id === 1 && <span className="fr-avatar-online" />}
                  </div>

                  <div className="fr-player-name">{player.name}</div>
                  <div className="fr-player-role">
                    {player.host ? "ROOM HOST" : player.status.toUpperCase()}
                  </div>
                  {player.host && (
                    <span className="fr-host-crown">
                      <Crown size={11} />
                    </span>
                  )}
                </div>
              ))}
            </div>

            <p className="fr-helper">
              Player slots are currently a frontend preview. Other participants
              will appear after a real multiplayer service is connected.
            </p>

            <div className="fr-divider" />

            <div className="fr-subheading">
              <span>ROOM PERMISSIONS</span>
              <span className="fr-editable-label">HOST SETTINGS</span>
            </div>

            <div className="fr-permission-row">
              <span className="fr-permission-icon">
                {voiceEnabled ? <Mic size={17} /> : <MicOff size={17} />}
              </span>
              <span className="fr-permission-copy">
                <strong>Global voice</strong>
                <small>Room voice permission</small>
              </span>
              <span className={`fr-toggle ${voiceEnabled ? "is-on" : ""}`}>
                <span />
              </span>
              <span className="fr-toggle-value">
                {voiceEnabled ? "ON" : "OFF"}
              </span>
            </div>

            <div className="fr-permission-row">
              <span className="fr-permission-icon">
                {videoEnabled ? <Video size={17} /> : <VideoOff size={17} />}
              </span>
              <span className="fr-permission-copy">
                <strong>Video access</strong>
                <small>Room camera permission</small>
              </span>
              <span className={`fr-toggle ${videoEnabled ? "is-on" : ""}`}>
                <span />
              </span>
              <span className="fr-toggle-value">
                {videoEnabled ? "YES" : "NO"}
              </span>
            </div>

            {started && (
              <p className="fr-helper">
                Frontend preview active — this does not connect other players
                or start a synchronized live match.
              </p>
            )}

            {isHost ? (
              <button
                type="button"
                className="fr-primary-button"
                onClick={() => setStarted((value) => !value)}
              >
                {started ? "RETURN TO WAITING ROOM" : "START PRACTICE PREVIEW"}
                <ArrowUpRight size={17} />
              </button>
            ) : (
              <button
                type="button"
                className="fr-primary-button"
                onClick={handleBack}
              >
                BACK TO ROOM SETUP
                <ArrowUpRight size={17} />
              </button>
            )}

            <p className="fr-disclaimer">
              VIRTUAL FUNDS ONLY · EDUCATIONAL PRACTICE
            </p>
          </article>

          <aside className="fr-side-column">
            <article className="fr-panel fr-join-panel">
              <div className="fr-kicker">02 / ROOM DETAILS</div>
              <h2>Bring your crew in.</h2>
              <p>
                Copy the invitation link and share it with friends. They can
                use the room ID to open this waiting room.
              </p>

              <div className="fr-room-identity">
                <div>
                  <span className="fr-field-label">YOUR ROLE</span>
                  <strong>{isHost ? "ROOM HOST" : "PLAYER"}</strong>
                </div>
                <ShieldCheck size={20} />
              </div>

              <button
                type="button"
                className="fr-secondary-button"
                onClick={handleCopy}
                disabled={!roomId}
              >
                {copied ? "LINK COPIED" : "SHARE INVITE LINK"}
                {copied ? <Check size={16} /> : <ArrowUpRight size={16} />}
              </button>
            </article>

            <article className="fr-panel fr-preview-panel">
              <div className="fr-preview-top">
                <div className="fr-kicker">03 / SESSION PREVIEW</div>
                <span className="fr-preview-live">
                  <span className="fr-status-dot" />
                  {started ? "ACTIVE" : "STANDBY"}
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
                  aria-label="Illustrative practice chart"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient
                      id="fr-waiting-chart-fill"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop offset="0%" stopColor="#f97316" stopOpacity=".22" />
                      <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0 112 L20 99 L37 106 L53 73 L69 85 L86 64 L105 77 L122 49 L141 66 L157 38 L174 55 L193 62 L211 33 L231 48 L250 26 L271 42 L289 18 L320 24 L320 145 L0 145 Z"
                    fill="url(#fr-waiting-chart-fill)"
                  />
                  <path
                    d="M0 112 L20 99 L37 106 L53 73 L69 85 L86 64 L105 77 L122 49 L141 66 L157 38 L174 55 L193 62 L211 33 L231 48 L250 26 L271 42 L289 18 L320 24"
                    fill="none"
                    stroke="#f97316"
                    strokeWidth="2"
                    vectorEffect="non-scaling-stroke"
                  />
                </svg>

                <div className="fr-chart-price">
                  {started ? "PRACTICE PREVIEW" : "SHARED MARKET VIEW"}
                </div>
              </div>

              <div className="fr-preview-stats">
                <div>
                  <span>PLAYERS</span>
                  <strong>Up to 4</strong>
                </div>
                <div>
                  <span>VOICE</span>
                  <strong>{voiceEnabled ? "Enabled" : "Disabled"}</strong>
                </div>
                <div>
                  <span>VIDEO</span>
                  <strong>{videoEnabled ? "Enabled" : "Disabled"}</strong>
                </div>
              </div>
            </article>

            <div className="fr-note">
              <Zap size={17} />
              <div>
                <strong>One chart. One crew.</strong>
                <p>
                  Prepare together and practise trading strategies in an
                  educational environment.
                </p>
              </div>
            </div>
          </aside>
        </section>

        <footer className="fr-footer">
          <span>CHARTWARS / FRIENDS WAITING ROOM</span>
          <span><ShieldCheck size={13} /> EDUCATIONAL USE ONLY</span>
          <span>BUILD 01.00</span>
        </footer>
      </div>
    </main>
  );
}
