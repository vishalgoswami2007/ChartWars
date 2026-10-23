
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CircleHelp,
  Clock3,
  Globe2,
  LogOut,
  Radio,
  RotateCcw,
  Shield,
  Swords,
  Trophy,
  Users,
  X,
  Zap,
} from "lucide-react";
import "./OnlineMode.css";

const ASSETS = ["BTC", "SOL", "DOGE"];
const DURATIONS = [1, 3, 5];
const FORMATS = [
  { id: "duel", label: "1v1 Duel", detail: "One rival. One winner.", players: 2 },
  { id: "rumble", label: "4-Player Rumble", detail: "Three rivals. Total chaos.", players: 4 },
];

const COUNTRIES = [
  { code: "in", name: "India" },
  { code: "us", name: "United States" },
  { code: "gb", name: "United Kingdom" },
  { code: "jp", name: "Japan" },
  { code: "de", name: "Germany" },
  { code: "sg", name: "Singapore" },
  { code: "ae", name: "United Arab Emirates" },
  { code: "ca", name: "Canada" },
];

const EMOTES = [
  { emoji: "🚀", label: "Moonshot" },
  { emoji: "📉", label: "Rekt" },
  { emoji: "🐋", label: "Whale" },
  { emoji: "🤫", label: "HODL" },
  { emoji: "💎", label: "Hands" },
  { emoji: "🤡", label: "Noob" },
];

const DEMO_PLAYERS = [
  { name: "You", code: "in", rating: 1248, pnl: 2.4 },
  { name: "ChartFox", code: "gb", rating: 1312, pnl: 1.2 },
  { name: "Kaito_X", code: "jp", rating: 1196, pnl: -0.8 },
  { name: "BullRunner", code: "us", rating: 1274, pnl: -1.5 },
];

function FlagImage({ code, name }) {
  return (
    <img
      className="om-flag"
      src={`https://flagcdn.io/${code}.svg`}
      alt={`${name} flag`}
      loading="lazy"
    />
  );
}

function PanelHeading({ eyebrow, title, right }) {
  return (
    <div className="om-panel-heading">
      <div>
        <p className="om-eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
      </div>
      {right}
    </div>
  );
}

function SetupStage({ settings, setSettings, onSearch, onBack }) {
  const update = (key, value) =>
    setSettings((previous) => ({ ...previous, [key]: value }));

  return (
    <div className="om-stage om-setup">
      <button className="om-back" onClick={onBack} type="button">
        <ArrowLeft size={15} /> All rooms
      </button>

      <div className="om-intro">
        <span className="om-kicker"><Swords size={14} /> GLOBAL DUEL PROTOCOL</span>
        <h1>Enter the <span>arena.</span></h1>
        <p>Set your rules. Find your rival. Trade the clock.</p>
      </div>

      <div className="om-setup-grid">
        <section className="om-panel">
          <PanelHeading eyebrow="01 / IDENTITY" title="Your region" />
          <div className="om-country-grid">
            {COUNTRIES.map((country) => (
              <button
                type="button"
                key={country.code}
                className={`om-country ${settings.country === country.code ? "selected" : ""}`}
                onClick={() => update("country", country.code)}
              >
                <FlagImage code={country.code} name={country.name} />
                <span>{country.name}</span>
                {settings.country === country.code && <Check size={14} />}
              </button>
            ))}
          </div>
        </section>

        <section className="om-panel">
          <PanelHeading eyebrow="02 / MARKET" title="Choose your asset" />
          <div className="om-asset-grid">
            {ASSETS.map((asset) => (
              <button
                type="button"
                key={asset}
                className={`om-asset ${settings.asset === asset ? "selected" : ""}`}
                onClick={() => update("asset", asset)}
              >
                <span className="om-asset-symbol">
                  {asset === "BTC" ? "₿" : asset === "SOL" ? "◎" : "Ð"}
                </span>
                <span>{asset}</span>
                <small>DEMO MARKET</small>
                {settings.asset === asset && <Check size={14} />}
              </button>
            ))}
          </div>

          <div className="om-setting-block">
            <PanelHeading eyebrow="03 / TIME CONTROL" title="Round duration" />
            <div className="om-segmented">
              {DURATIONS.map((duration) => (
                <button
                  type="button"
                  key={duration}
                  className={settings.duration === duration ? "selected" : ""}
                  onClick={() => update("duration", duration)}
                >
                  <Clock3 size={14} /> {duration} min
                </button>
              ))}
            </div>
          </div>

          <div className="om-setting-block">
            <PanelHeading eyebrow="04 / FORMAT" title="Battle type" />
            <div className="om-format-grid">
              {FORMATS.map((format) => (
                <button
                  type="button"
                  key={format.id}
                  className={`om-format ${settings.format === format.id ? "selected" : ""}`}
                  onClick={() => update("format", format.id)}
                >
                  <span className="om-format-icon">
                    {format.players === 2 ? <Swords size={19} /> : <Users size={19} />}
                  </span>
                  <strong>{format.label}</strong>
                  <small>{format.detail}</small>
                  {settings.format === format.id && <Check size={14} />}
                </button>
              ))}
            </div>
          </div>
        </section>
      </div>

      <div className="om-setup-footer">
        <div className="om-security-note">
          <Shield size={16} />
          <span><strong>Practice only</strong><small>No real orders or money at risk.</small></span>
        </div>
        <button type="button" className="om-primary" onClick={onSearch}>
          Find opponent <Zap size={16} />
        </button>
      </div>
    </div>
  );
}

function RadarStage({ settings, elapsed, onCancel }) {
  return (
    <div className="om-stage om-radar-stage">
      <button className="om-back" type="button" onClick={onCancel}>
        <ArrowLeft size={15} /> Cancel and return
      </button>

      <div className="om-radar">
        <div className="om-radar-ring ring-a" />
        <div className="om-radar-ring ring-b" />
        <div className="om-radar-ring ring-c" />
        <div className="om-radar-sweep" />
        <div className="om-radar-cross horizontal" />
        <div className="om-radar-cross vertical" />
        <span className="om-radar-ping ping-a" />
        <span className="om-radar-ping ping-b" />
        <span className="om-radar-ping ping-c" />
        <div className="om-radar-center">
          <Radio size={26} />
          <span>SEARCHING</span>
        </div>
      </div>

      <p className="om-eyebrow">GLOBAL MATCHMAKING / DEMO</p>
      <h1>Scanning for <span>a rival.</span></h1>
      <p className="om-muted">
        {settings.asset} · {settings.duration} min ·{" "}
        {settings.format === "duel" ? "1v1 Duel" : "4-Player Rumble"}
      </p>

      <div className="om-search-stats">
        <div><small>SEARCH TIME</small><strong>00:{String(elapsed).padStart(2, "0")}</strong></div>
        <div><small>YOUR RATING</small><strong>1,248 <span>±</span></strong></div>
        <div><small>RATING RANGE</small><strong>1,248–1,348</strong></div>
      </div>

      <p className="om-demo-note">
        <CircleHelp size={13} /> Simulated radar. Real matchmaking requires the game server.
      </p>

      <button type="button" className="om-secondary" onClick={onCancel}>
        <X size={15} /> Cancel search
      </button>
    </div>
  );
}

function FoundStage({ settings, onContinue, onCancel }) {
  const players = DEMO_PLAYERS.slice(0, settings.format === "duel" ? 2 : 4);

  return (
    <div className="om-stage om-found-stage">
      <p className="om-kicker"><Zap size={14} /> SIGNAL ACQUIRED</p>
      <h1>Rival <span>detected.</span></h1>
      <p className="om-muted">Opponent details below are simulated for this prototype.</p>

      <div className={`om-versus-grid ${players.length === 4 ? "four" : ""}`}>
        {players.map((player, index) => (
          <div className={`om-versus-player ${index === 0 ? "you" : ""}`} key={player.name}>
            <div className="om-player-avatar"><FlagImage code={player.code} name={player.name} /></div>
            <span className="om-player-label">{index === 0 ? "YOUR SIGNAL" : `RIVAL ${index}`}</span>
            <strong>{player.name}</strong>
            <small>{player.rating} CW</small>
          </div>
        ))}
        <div className="om-versus-mark">VS</div>
      </div>

      <div className="om-found-meta">
        <span>{settings.asset} / DEMO</span>
        <span>{settings.duration}:00 ROUND</span>
        <span>{players.length} PLAYERS</span>
      </div>

      <button className="om-primary" type="button" onClick={onContinue}>
        Enter the arena <ArrowRight size={16} />
      </button>
      <button className="om-text-button" type="button" onClick={onCancel}>Return to setup</button>
    </div>
  );
}

function MiniChart({ elapsed }) {
  const points = Array.from({ length: 52 }, (_, index) => {
    const wave = Math.sin(index * 0.48) * 11 + Math.sin(index * 0.17) * 15;
    const drift = index * 0.32;
    const motion = Math.sin((elapsed + index) * 0.2) * 2;
    return `${index * 6},${65 - wave - drift - motion}`;
  }).join(" ");

  return (
    <div className="om-chart-wrap">
      <div className="om-chart-top">
        <div><small>SIMULATED PRICE / {elapsed}s</small><strong>{elapsed % 2 ? "$142.68" : "$142.74"}</strong></div>
        <span className="om-chart-change">+2.41%</span>
      </div>
      <div className="om-chart">
        <div className="om-chart-grid" />
        <div className="om-chart-price-line" />
        <svg viewBox="0 0 310 100" preserveAspectRatio="none" aria-label="Animated demo price chart">
          <defs>
            <linearGradient id="om-chart-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#fb923c" stopOpacity=".3" />
              <stop offset="100%" stopColor="#fb923c" stopOpacity="0" />
            </linearGradient>
          </defs>
          <polygon points={`0,100 ${points} 306,100`} fill="url(#om-chart-fill)" />
          <polyline points={points} fill="none" stroke="#fb923c" strokeWidth="1.7" vectorEffect="non-scaling-stroke" />
        </svg>
        <span className="om-price-tag">$142.74</span>
      </div>
      <div className="om-chart-times"><span>START</span><span>LIVE DEMO</span><span>END</span></div>
    </div>
  );
}

function LiveStage({ settings, elapsed, onLeave }) {
  const players = DEMO_PLAYERS.slice(0, settings.format === "duel" ? 2 : 4);
  const [emote, setEmote] = useState(null);
  const [showLeave, setShowLeave] = useState(false);
  const [position, setPosition] = useState("long");

  const sendEmote = (item) => {
    setEmote(item);
    window.setTimeout(() => setEmote(null), 1400);
  };

  return (
    <div className="om-stage om-live-stage">
      <header className="om-live-header">
        <button type="button" className="om-back" onClick={() => setShowLeave(true)}>
          <LogOut size={15} /> Leave game
        </button>
        <div className="om-live-badge"><span className="om-live-dot" /> LIVE DEMO</div>
        <div className="om-live-clock">
          <Clock3 size={14} /> {Math.max(0, settings.duration * 60 - elapsed)}s
        </div>
      </header>

      <div className="om-live-meta">
        <span>{settings.asset}/USD</span>
        <span>SIMULATED FEED</span>
        <span>{settings.format === "duel" ? "1V1 DUEL" : "4-PLAYER RUMBLE"}</span>
      </div>

      <div className="om-live-layout">
        <section className="om-live-main">
          <MiniChart elapsed={elapsed} />
          <div className="om-position-panel">
            <div><small>YOUR POSITION</small><strong className={position === "long" ? "positive" : "negative"}>{position.toUpperCase()}</strong></div>
            <div><small>UNREALIZED PNL</small><strong className="positive">+2.40%</strong></div>
            <div className="om-position-actions">
              <button type="button" className={position === "long" ? "selected long" : ""} onClick={() => setPosition("long")}>UP</button>
              <button type="button" className={position === "short" ? "selected short" : ""} onClick={() => setPosition("short")}>DOWN</button>
            </div>
          </div>
          <div className="om-emotes">
            <span>QUICK EMOTES</span>
            <div>
              {EMOTES.map((item) => (
                <button type="button" key={item.label} title={item.label} onClick={() => sendEmote(item)}>
                  {item.emoji}
                </button>
              ))}
            </div>
            {emote && <span className="om-emote-pop">{emote.emoji} {emote.label}</span>}
          </div>
        </section>

        <aside className="om-player-panel">
          <div className="om-player-panel-heading"><Users size={14} /> CONTESTANTS <span>{players.length}</span></div>
          {players.map((player, index) => (
            <div className={`om-live-player ${index === 0 ? "is-you" : ""}`} key={player.name}>
              <FlagImage code={player.code} name={player.name} />
              <div className="om-live-player-info">
                <strong>{player.name}</strong>
                <small>{player.rating} CW</small>
              </div>
              <div className={`om-live-pnl ${player.pnl >= 0 ? "positive" : "negative"}`}>
                {player.pnl > 0 ? "+" : ""}{player.pnl.toFixed(2)}%
              </div>
              <div className="om-health"><span style={{ width: `${Math.max(12, 75 + player.pnl * 5)}%` }} /></div>
            </div>
          ))}
          <div className="om-live-tip"><Shield size={14} /> Practice mode. No real funds.</div>
        </aside>
      </div>

      {showLeave && (
        <div className="om-modal-backdrop" role="presentation">
          <div className="om-modal" role="dialog" aria-modal="true" aria-labelledby="om-leave-title">
            <button type="button" className="om-modal-close" onClick={() => setShowLeave(false)} aria-label="Close"><X size={17} /></button>
            <div className="om-modal-icon"><LogOut size={22} /></div>
            <h2 id="om-leave-title">Leave this match?</h2>
            <p>You'll return to the room setup. Abandon penalties are not active in this frontend demo.</p>
            <button type="button" className="om-primary" onClick={onLeave}>Leave match</button>
            <button type="button" className="om-secondary" onClick={() => setShowLeave(false)}>Stay in arena</button>
          </div>
        </div>
      )}
    </div>
  );
}

function ResultStage({ onAgain, onExit, settings }) {
  return (
    <div className="om-stage om-result-stage">
      <div className="om-result-glow" />
      <div className="om-result-trophy"><Trophy size={34} /></div>
      <p className="om-kicker">MATCH COMPLETE / DEMO RESULT</p>
      <h1>Battle <span>closed.</span></h1>
      <p className="om-muted">{settings.asset} · {settings.duration}-minute simulated round</p>

      <div className="om-result-score">
        <span>YOUR DEMO RATING</span>
        <strong>1,272 <small>+24 CW</small></strong>
        <div className="om-rating-track"><span /></div>
        <p>Sample result only — no rating has been saved.</p>
      </div>

      <div className="om-result-actions">
        <button type="button" className="om-primary" onClick={onAgain}><RotateCcw size={16} /> Instant re-queue</button>
        <button type="button" className="om-secondary" onClick={onExit}><ArrowLeft size={16} /> Base terminal</button>
      </div>
    </div>
  );
}

export default function OnlineMode({ onBack }) {
  const [stage, setStage] = useState("setup");
  const [elapsed, setElapsed] = useState(0);
  const [settings, setSettings] = useState({
    country: "in",
    asset: "BTC",
    duration: 3,
    format: "duel",
  });

  useEffect(() => {
    if (stage !== "searching" && stage !== "playing") return undefined;
    const interval = window.setInterval(() => {
      setElapsed((time) => time + 1);
    }, 1000);
    return () => window.clearInterval(interval);
  }, [stage]);

  useEffect(() => {
    if (stage !== "searching") return undefined;
    const timeout = window.setTimeout(() => setStage("found"), 4500);
    return () => window.clearTimeout(timeout);
  }, [stage]);

  useEffect(() => {
    if (stage !== "playing" || elapsed < settings.duration * 60) return;
    setStage("result");
  }, [stage, elapsed, settings.duration]);

  const startSearch = () => {
    setElapsed(0);
    setStage("searching");
  };

  const startAgain = () => {
    setElapsed(0);
    setStage("searching");
  };

  return (
    <div className="online-mode">
      <div className="om-background-grid" />
      <div className="om-topbar">
        <div className="om-brand"><span className="om-brand-mark"><Swords size={17} /></span> CHARTWARS <span>/ ONLINE</span></div>
        <div className="om-topbar-right"><Globe2 size={14} /> GLOBAL ARENA <span className="om-demo-pill">DEMO</span></div>
      </div>

      {stage === "setup" && (
        <SetupStage
          settings={settings}
          setSettings={setSettings}
          onSearch={startSearch}
          onBack={onBack}
        />
      )}
      {stage === "searching" && (
        <RadarStage settings={settings} elapsed={elapsed} onCancel={() => setStage("setup")} />
      )}
      {stage === "found" && (
        <FoundStage settings={settings} onContinue={() => { setElapsed(0); setStage("playing"); }} onCancel={() => setStage("setup")} />
      )}
      {stage === "playing" && (
        <LiveStage settings={settings} elapsed={elapsed} onLeave={() => { setElapsed(0); setStage("setup"); }} />
      )}
      {stage === "result" && (
        <ResultStage settings={settings} onAgain={startAgain} onExit={onBack} />
      )}

      <footer className="om-footer">
        <span>CHARTWARS / PRACTICE TERMINAL</span>
        <span>Educational simulation · Not investment advice</span>
      </footer>
    </div>
  );
}
