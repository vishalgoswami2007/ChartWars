import { useId, useState } from "react";
import { Link } from "react-router-dom";

import logo from "../../assets/logo.png";

const ROUTES = {
  dashboard: "/dashboard",
  login: "/login",
  Signup:"/signup",
  forgotPassword: "/forgetPassword",
  home:"/",
  privacyPolicy:"/privacyPolicy",
  termsOfUse: "/termsOfUse"
};

const FOCUS =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-400 focus-visible:ring-offset-2 focus-visible:ring-offset-black";
const API_URL = import.meta.env.VITE_API_URL || "";

/**
 * POST helper shared by the auth pages.
 * With no VITE_API_URL it runs in demo mode: it waits a moment and pretends it worked.
 */
// eslint-disable-next-line react-refresh/only-export-components
export async function postJson(path, body) {
  if (!API_URL) {
    await new Promise((resolve) => setTimeout(resolve, 700));
    return { demo: true };
  }
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    throw error;
  }
  return data;
}

/* ---------- Showcase panel (left, 60%) ---------- */

// [open, close, high, low] as y-coordinates, so a smaller number is a higher price.
const CANDLES = [
  [380, 360, 350, 395], [360, 372, 350, 385], [372, 345, 335, 380], [345, 330, 320, 355],
  [330, 342, 322, 350], [342, 315, 305, 350], [315, 300, 290, 322], [300, 312, 292, 320],
  [312, 285, 275, 318], [285, 270, 260, 292], [270, 282, 262, 290], [282, 250, 240, 288],
  [250, 235, 225, 258], [235, 245, 228, 252], [245, 210, 200, 250], [210, 190, 180, 216],
];
const X0 = 40;
const STEP = 46;
const LINE = CANDLES.map(([, close], i) => `${i === 0 ? "M" : "L"}${X0 + i * STEP + 6} ${close}`).join(" ");

function Showcase() {
  return (
    <aside className="relative hidden overflow-hidden border-r border-white/10 lg:block">
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px)] bg-size-[48px_48px]"
      />
      <div
        aria-hidden="true"
        className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_100%,rgba(249,115,22,0.22),transparent_60%),radial-gradient(ellipse_at_90%_0%,rgba(249,115,22,0.10),transparent_50%)]"
      />

      <div className="relative flex h-full min-h-screen flex-col justify-between p-12 xl:p-16">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-orange-500">Early access</p>
          <h2 className="mt-5 max-w-xl text-4xl font-semibold leading-[1.08] tracking-tight xl:text-5xl">
            Where <span className="text-orange-500">discipline</span> beats luck.
          </h2>
          <p className="mt-5 max-w-md text-base leading-relaxed text-zinc-400">
            Practise with virtual funds, trade a chart with friends, and see how disciplined your decisions really were.
          </p>
        </div>

        <div className="relative my-10 aspect-8/5 w-full max-w-3xl">
          <svg viewBox="0 0 800 500" className="absolute inset-0 h-full w-full" fill="none" aria-hidden="true">
            <defs>
              <linearGradient id="auth-fade" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor="#050505" stopOpacity="0" />
                <stop offset="0.35" stopColor="#050505" stopOpacity="0.92" />
                <stop offset="1" stopColor="#050505" stopOpacity="0.98" />
              </linearGradient>
              <filter id="auth-glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="b" />
                <feMerge>
                  <feMergeNode in="b" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>
            <g stroke="rgba(255,255,255,0.06)">
              <path d="M0 100H800M0 200H800M0 300H800M0 400H800" />
            </g>
            {CANDLES.map(([open, close, high, low], i) => {
              const x = X0 + i * STEP;
              const up = close < open;
              const color = up ? "#f97316" : "#52525b";
              return (
                <g key={x}>
                  <path d={`M${x + 6} ${high}V${low}`} stroke={color} strokeWidth="2" />
                  <rect x={x} y={Math.min(open, close)} width="12" height={Math.max(Math.abs(open - close), 3)} fill={color} />
                </g>
              );
            })}
            <path d={LINE} stroke="#fb923c" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" filter="url(#auth-glow)" pathLength="1" strokeDasharray="1">
              <animate attributeName="stroke-dashoffset" values="1;0;0" keyTimes="0;0.6;1" dur="6s" repeatCount="indefinite" />
            </path>
            <rect x="560" y="0" width="240" height="500" fill="url(#auth-fade)" />
            <text x="690" y="250" textAnchor="middle" fill="#a1a1aa" fontSize="12" letterSpacing="3" fontFamily="ui-monospace, monospace">
              FUTURE CANDLES HIDDEN
            </text>
          </svg>

          <div className="absolute left-2 top-2 w-52 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur">
            <p className="text-[11px] uppercase tracking-[0.2em] text-zinc-500">Discipline score</p>
            <p className="mt-1 font-mono text-2xl font-semibold text-white">
              78<span className="text-sm text-zinc-500"> / 100</span>
            </p>
            <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
              <div className="h-full w-[78%] rounded-full bg-orange-500" />
            </div>
          </div>

          <div className="absolute right-2 top-[26%] w-56 rounded-xl border border-white/10 bg-black/60 p-4 backdrop-blur">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.2em] text-zinc-500">
              <span>Long position</span>
              <span className="text-orange-400">R:R 1 : 2.4</span>
            </div>
            <dl className="mt-3 space-y-1.5 font-mono text-xs">
              <div className="flex justify-between"><dt className="text-zinc-500">Entry</dt><dd className="text-white">64,210</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Stop-loss</dt><dd className="text-red-400">63,980</dd></div>
              <div className="flex justify-between"><dt className="text-zinc-500">Take-profit</dt><dd className="text-emerald-400">64,760</dd></div>
            </dl>
          </div>

          <div className="absolute bottom-2 left-2 flex items-center gap-3 rounded-xl border border-white/10 bg-black/60 px-4 py-3 backdrop-blur">
            <div className="flex -space-x-2">
              {["V", "R", "A"].map((n) => (
                <span key={n} className="flex h-7 w-7 items-center justify-center rounded-full border border-black bg-zinc-800 text-[11px] font-semibold text-zinc-200">
                  {n}
                </span>
              ))}
            </div>
            <div className="text-xs">
              <p className="font-medium text-white">Room 4F2K</p>
              <p className="flex items-center gap-1.5 text-zinc-500">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                3 online
              </p>
            </div>
          </div>
        </div>

        <div>
          <ul className="grid max-w-3xl grid-cols-3 gap-6 border-t border-white/10 pt-6 text-sm">
            {[
              ["Virtual funds only", "No real money, ever."],
              ["Hidden-candle rounds", "Decide without hindsight."],
              ["Private rooms", "Practise with friends."],
            ].map(([t, d]) => (
              <li key={t}>
                <p className="font-medium text-white">{t}</p>
                <p className="mt-1 text-xs leading-relaxed text-zinc-500">{d}</p>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-zinc-600">Sample interface for illustration. Not live data.</p>
        </div>
      </div>
    </aside>
  );
}

/* ---------- Shared pieces ---------- */

export function AuthLink({ to, children, className = "" }) {
  return (
    <Link to={to} className={`rounded text-orange-400 underline-offset-4 transition hover:text-orange-300 hover:underline ${FOCUS} ${className}`}>
      {children}
    </Link>
  );
}

export function Field({ label, error, right, ...input }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">{label}</label>
        {right}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`h-12 w-full rounded-xl border bg-white/3 px-4 text-sm text-white placeholder:text-zinc-600 transition focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
          error ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70"
        }`}
        {...input}
      />
      <p id={`${id}-error`} className="min-h-4 text-xs text-red-400">{error}</p>
    </div>
  );
}

export function PasswordField({ label, error, right, ...input }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-sm font-medium text-zinc-200">{label}</label>
        {right}
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`h-12 w-full rounded-xl border bg-white/3 pl-4 pr-16 text-sm text-white placeholder:text-zinc-600 transition focus:outline-none focus:ring-2 focus:ring-orange-500/30 ${
            error ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70"
          }`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:text-white ${FOCUS}`}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <p id={`${id}-error`} className="min-h-4 text-xs text-red-400">{error}</p>
    </div>
  );
}

export function PasswordMeter({ value }) {
  let score = 0;
  if (value.length >= 8) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/\d/.test(value)) score += 1;
  if (/[^A-Za-z0-9]/.test(value)) score += 1;
  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"];
  const colors = ["bg-zinc-700", "bg-red-500", "bg-orange-500", "bg-amber-400", "bg-emerald-500"];
  return (
    <div aria-live="polite" className="-mt-2 mb-2">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1 flex-1 rounded-full ${score >= n ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <p className="mt-1.5 text-xs text-zinc-500">
        {value ? `Password strength: ${labels[score]}` : "Use 8+ characters with upper and lower case, a number and a symbol."}
      </p>
    </div>
  );
}

export function GoogleButton({ label, onUnavailable }) {
  const handle = () => {
    if (API_URL) {
      window.location.href = `${API_URL}/api/auth/google`;
    } else {
      onUnavailable?.("Google sign-in is not connected yet. It will work once the backend is set up.");
    }
  };
  return (
    <button
      type="button"
      onClick={handle}
      className={`flex h-12 w-full items-center justify-center gap-3 rounded-full border border-[#8e918f] bg-[#131314] text-sm font-medium text-[#e3e3e3] transition hover:bg-[#1c1c1e] ${FOCUS}`}
    >
      <svg viewBox="0 0 48 48" className="h-5 w-5" aria-hidden="true">
        <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
        <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
        <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
        <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
      </svg>
      {label}
    </button>
  );
}

export function Divider({ children = "or" }) {
  return (
    <div className="my-6 flex items-center gap-4 text-xs uppercase tracking-[0.2em] text-zinc-600" role="separator">
      <span className="h-px flex-1 bg-white/10" />
      {children}
      <span className="h-px flex-1 bg-white/10" />
    </div>
  );
}

export function Alert({ tone = "error", children }) {
  const styles = {
    error: "border-red-500/30 bg-red-500/10 text-red-300",
    success: "border-emerald-500/30 bg-emerald-500/10 text-emerald-300",
    info: "border-orange-500/30 bg-orange-500/10 text-orange-200",
  };
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`mb-5 rounded-xl border px-4 py-3 text-sm ${styles[tone]}`}>
      {children}
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`h-12 w-full rounded-full bg-orange-500 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function DemoNote() {
  if (API_URL) return null;
  return (
    <p className="mt-6 text-center text-xs text-amber-400">
      Demo mode: the backend is not connected yet, so nothing is saved or sent.
    </p>
  );
}

/* ---------- Layout (right, 40%) ---------- */

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="min-h-screen bg-[#050505] text-zinc-100 antialiased selection:bg-orange-500/30 lg:grid lg:grid-cols-[3fr_2fr]">
      <Showcase />
      <div className="relative flex min-h-screen flex-col overflow-hidden px-6 py-8 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.12),transparent_70%)]" />
        <header className="relative flex items-center justify-between">
          <Link to={ROUTES.home} className={`flex items-center gap-3 rounded-md ${FOCUS}`} aria-label="ChartWars home">
            <img src={logo} alt="" width={36} height={36} className="h-9 w-9" />
            <span className="text-sm font-semibold tracking-[0.22em]">
              CHART<span className="text-orange-500">WARS</span>
            </span>
          </Link>
          <Link to={ROUTES.home} className={`rounded-full border border-white/15 px-4 py-2 text-sm text-zinc-300 transition hover:border-orange-500/60 hover:text-white ${FOCUS}`}>
            Back to home
          </Link>
        </header>

        <main className="relative mx-auto flex w-full max-w-105 flex-1 flex-col justify-center py-10">
          <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
          <p className="mb-8 mt-2 text-sm leading-relaxed text-zinc-400">{subtitle}</p>
          {children}
          {footer && <div className="mt-8 text-center text-sm text-zinc-400">{footer}</div>}
        </main>

        <p className="relative text-center text-xs leading-relaxed text-zinc-600">
          Virtual funds only. Educational purposes. Not investment advice.
        </p>
      </div>
    </div>
  );
}