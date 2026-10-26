import { initials } from "./accountStore";

const G = "#34d399";
const R = "#f87171";
const O = "#f97316";
const W = "#e4e4e7";

const stroke = { fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

const ART = {
  twin: (
    <>
      <g transform="rotate(-30 32 32)">
        <rect x="30" y="9" width="4" height="46" rx="2" fill={R} />
        <rect x="25" y="11" width="14" height="16" rx="2" fill={R} />
      </g>
      <g transform="rotate(30 32 32)">
        <rect x="30" y="9" width="4" height="46" rx="2" fill={G} />
        <rect x="25" y="9" width="14" height="20" rx="2" fill={G} />
      </g>
    </>
  ),
  bull: (
    <>
      <rect x="12" y="38" width="8" height="14" fill={G} />
      <rect x="24" y="30" width="8" height="22" fill={G} />
      <rect x="36" y="22" width="8" height="30" fill={G} />
      <rect x="48" y="12" width="8" height="40" fill={G} />
      <path d="M12 30L26 20L36 26L52 8" stroke={O} strokeWidth="2.5" {...stroke} />
    </>
  ),
  bear: (
    <>
      <rect x="12" y="12" width="8" height="40" fill={R} />
      <rect x="24" y="22" width="8" height="30" fill={R} />
      <rect x="36" y="30" width="8" height="22" fill={R} />
      <rect x="48" y="38" width="8" height="14" fill={R} />
      <path d="M12 22L26 34L36 28L52 52" stroke={O} strokeWidth="2.5" {...stroke} />
    </>
  ),
  green: (
    <>
      <line x1="32" y1="10" x2="32" y2="54" stroke={G} strokeWidth="3" />
      <rect x="23" y="20" width="18" height="26" rx="2" fill={G} />
    </>
  ),
  red: (
    <>
      <line x1="32" y1="10" x2="32" y2="54" stroke={R} strokeWidth="3" />
      <rect x="23" y="18" width="18" height="26" rx="2" fill={R} />
    </>
  ),
  hammer: (
    <>
      <line x1="32" y1="14" x2="32" y2="54" stroke={G} strokeWidth="3" />
      <rect x="24" y="14" width="16" height="12" rx="2" fill={G} />
    </>
  ),
  crosshair: (
    <>
      <circle cx="32" cy="32" r="16" stroke={O} strokeWidth="2.5" fill="none" />
      <path d="M32 8v14M32 42v14M8 32h14M42 32h14" stroke={O} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="32" cy="32" r="3" fill={W} />
    </>
  ),
  shield: (
    <>
      <path d="M32 9l19 7v14c0 12-8 21-19 25C21 51 13 42 13 30V16z" stroke={O} strokeWidth="2.5" {...stroke} />
      <path d="M23 32l6 6 12-13" stroke={G} strokeWidth="3" {...stroke} />
    </>
  ),
  peak: (
    <>
      <path d="M8 50l14-16 9 8 13-22 12 14V54H8z" fill={G} opacity="0.15" />
      <path d="M8 50l14-16 9 8 13-22 12 14" stroke={G} strokeWidth="3" {...stroke} />
    </>
  ),
  bolt: <path d="M36 8L16 36h14l-4 20 22-30H34z" fill={O} />,
  crown: (
    <>
      <path d="M12 46V22l12 12 8-16 8 16 12-12v24z" fill={O} />
      <rect x="12" y="48" width="40" height="5" rx="2" fill={W} opacity="0.8" />
    </>
  ),
  radar: (
    <>
      <circle cx="32" cy="32" r="20" stroke={O} strokeWidth="2" opacity="0.5" fill="none" />
      <circle cx="32" cy="32" r="11" stroke={O} strokeWidth="2" opacity="0.5" fill="none" />
      <path d="M32 32L50 22" stroke={O} strokeWidth="3" strokeLinecap="round" />
      <circle cx="44" cy="40" r="3" fill={G} />
    </>
  ),
};

const NAMES = {
  twin: "Twin blades",
  bull: "Bull run",
  bear: "Bear market",
  green: "Green candle",
  red: "Red candle",
  hammer: "Hammer",
  crosshair: "Crosshair",
  shield: "Risk shield",
  peak: "Peak",
  bolt: "Momentum",
  crown: "Top trader",
  radar: "Radar",
};

// eslint-disable-next-line react-refresh/only-export-components
export const AVATARS = Object.keys(ART).map((id) => ({ id, label: NAMES[id] }));

/** avatar: { kind: "preset", id } or { kind: "upload", src }. */
export function Avatar({ avatar, name = "", size = 40, className = "" }) {
  const style = { width: size, height: size };

  if (avatar?.kind === "upload") {
    return <img src={avatar.src} alt="" style={style} className={`shrink-0 rounded-xl border border-white/10 object-cover ${className}`} />;
  }
  const art = ART[avatar?.id];
  if (art) {
    return (
      <svg viewBox="0 0 64 64" style={style} className={`shrink-0 rounded-xl ${className}`} role="img" aria-label={`${NAMES[avatar.id]} avatar`}>
        <rect width="64" height="64" fill="#111214" />
        <rect x="0.5" y="0.5" width="63" height="63" fill="none" stroke="rgba(255,255,255,0.12)" />
        {art}
      </svg>
    );
  }
  return (
    <div style={style} className={`flex shrink-0 items-center justify-center rounded-xl border border-white/10 bg-[#191919] text-xs font-semibold text-zinc-300 ${className}`}>
      {initials(name)}
    </div>
  );
}