import { useId, useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

// Change the slogan here. Two lines: the first in white, the second in orange.
const SLOGAN = ["Decide before", "you know."];


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
const SHORT = "[@media(max-height:720px)]";

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

/* ---------- Showcase (left) ---------- */

const NOW = { x: 520, y: 330 };
const HISTORY = "M0 470 C60 448 92 482 140 440 S222 398 262 420 S342 338 392 360 S472 298 520 330";
const FUTURES = [
  "M520 330 C600 296 690 240 1000 140",
  "M520 330 C610 322 720 300 1000 280",
  "M520 330 C590 300 660 332 1000 372",
  "M520 330 C606 352 712 420 1000 468",
  "M520 330 C596 318 700 262 1000 214",
];

function Showcase() {
  const reduce = typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  return (
    <aside className="relative hidden h-dvh overflow-hidden border-r border-white/10 bg-[#050505] lg:block" aria-hidden="true">
      {/* dot grid */}
      <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.09)_1px,transparent_1px)] bg-size-28px_28px] mask-[radial-gradient(ellipse_at_center,black_30%,transparent_80%)]" />

      {/* horizon glow */}
      <div className="absolute left-1/2 top-[68%] h-[120%] w-[150%] -translate-x-1/2 rounded-[50%] border-t border-orange-500/50 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.18),transparent_60%)] shadow-[0_-24px_110px_rgba(249,115,22,0.30)]" />

      {/* chart */}
      <svg viewBox="0 0 1000 600" preserveAspectRatio="xMidYMid slice" className="absolute inset-0 h-full w-full" fill="none">
        <defs>
          <linearGradient id="fade-right" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0.5" stopColor="#fff" stopOpacity="1" />
            <stop offset="1" stopColor="#fff" stopOpacity="0" />
          </linearGradient>
          <mask id="mask-future">
            <rect x="500" y="0" width="500" height="600" fill="url(#fade-right)" />
          </mask>
          <linearGradient id="line-grad" x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor="#f97316" stopOpacity="0" />
            <stop offset="0.4" stopColor="#f97316" stopOpacity="0.9" />
            <stop offset="1" stopColor="#fdba74" />
          </linearGradient>
        </defs>

        <line x1={NOW.x} x2={NOW.x} y1="0" y2="600" stroke="rgba(255,255,255,0.10)" strokeDasharray="3 6" />

        <g mask="url(#mask-future)" stroke="#f97316" strokeWidth="1.5" strokeDasharray="5 7" strokeLinecap="round">
          {FUTURES.map((d, i) => (
            <path key={d} d={d} opacity={0.55 - i * 0.06}>
              {!reduce && <animate attributeName="stroke-dashoffset" from="0" to="-24" dur={`${3 + i * 0.4}s`} repeatCount="indefinite" />}
            </path>
          ))}
        </g>

        <path d={HISTORY} stroke="url(#line-grad)" strokeWidth="2.5" strokeLinecap="round" pathLength="1" strokeDasharray="1" strokeDashoffset={reduce ? 0 : 1}>
          {!reduce && <animate attributeName="stroke-dashoffset" from="1" to="0" dur="2.6s" fill="freeze" calcMode="spline" keyTimes="0;1" keySplines="0.22 0.61 0.36 1" />}
        </path>

        <circle cx={NOW.x} cy={NOW.y} r="16" fill="#f97316" opacity="0.12">
          {!reduce && <animate attributeName="r" values="6;20;6" dur="2.4s" repeatCount="indefinite" />}
          {!reduce && <animate attributeName="opacity" values="0.35;0;0.35" dur="2.4s" repeatCount="indefinite" />}
        </circle>
        <circle cx={NOW.x} cy={NOW.y} r="5" fill="#fb923c" />
        <circle cx={NOW.x} cy={NOW.y} r="2" fill="#fff" />
      </svg>

      {/* slogan */}
      <div className="absolute inset-x-0 bottom-0 p-12 xl:p-16">
        <h2 className="text-5xl font-semibold leading-[1.02] tracking-tight xl:text-7xl">
          {SLOGAN[0]}
          <br />
          <span className="bg-linear-to-r from-orange-400 to-orange-600 bg-clip-text text-transparent">{SLOGAN[1]}</span>
        </h2>
        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.3em] text-zinc-600">Virtual funds only</p>
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

const inputBase =
  "h-11 w-full rounded-xl border bg-white/[0.03] px-4 text-sm text-white placeholder:text-zinc-600 transition focus:outline-none focus:ring-2 focus:ring-orange-500/30";

export function Field({ label, error, right, ...input }) {
  const id = useId();
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-zinc-200">{label}</label>
        {right}
      </div>
      <input
        id={id}
        aria-invalid={Boolean(error)}
        aria-describedby={error ? `${id}-error` : undefined}
        className={`${inputBase} ${error ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70"}`}
        {...input}
      />
      <p id={`${id}-error`} className="min-h-3.5 text-xs leading-3.5 text-red-400">{error}</p>
    </div>
  );
}

export function PasswordField({ label, error, right, ...input }) {
  const id = useId();
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between">
        <label htmlFor={id} className="text-[13px] font-medium text-zinc-200">{label}</label>
        {right}
      </div>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          aria-invalid={Boolean(error)}
          aria-describedby={error ? `${id}-error` : undefined}
          className={`${inputBase} pr-16 ${error ? "border-red-500/70" : "border-white/10 focus:border-orange-500/70"}`}
          {...input}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          aria-pressed={show}
          aria-label={show ? "Hide password" : "Show password"}
          className={`absolute right-2 top-1/2 -translate-y-1/2 rounded-lg px-3 py-1 text-xs font-medium text-zinc-400 transition hover:text-white ${FOCUS}`}
        >
          {show ? "Hide" : "Show"}
        </button>
      </div>
      <p id={`${id}-error`} className="min-h-3.5 text-xs leading-3.5 text-red-400">{error}</p>
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
    <div aria-live="polite" className="mb-1">
      <div className="flex gap-1.5" aria-hidden="true">
        {[1, 2, 3, 4].map((n) => (
          <span key={n} className={`h-1 flex-1 rounded-full ${score >= n ? colors[score] : "bg-white/10"}`} />
        ))}
      </div>
      <p className={`mt-1 text-xs text-zinc-500 ${value ? "" : `${SHORT}:hidden`}`}>
        {value ? `Password strength: ${labels[score]}` : "8+ characters, upper and lower case, a number and a symbol."}
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
      className={`flex h-11 w-full items-center justify-center gap-3 rounded-full border border-[#8e918f] bg-[#131314] text-sm font-medium text-[#e3e3e3] transition hover:bg-[#1c1c1e] ${FOCUS}`}
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
    <div className="my-4 flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] text-zinc-600" role="separator">
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
    <div role={tone === "error" ? "alert" : "status"} className={`mb-3 rounded-xl border px-4 py-2.5 text-[13px] ${styles[tone]}`}>
      {children}
    </div>
  );
}

export function SubmitButton({ loading, children }) {
  return (
    <button
      type="submit"
      disabled={loading}
      className={`h-11 w-full rounded-full bg-orange-500 text-sm font-semibold text-black transition hover:bg-orange-400 disabled:cursor-not-allowed disabled:opacity-60 ${FOCUS}`}
    >
      {loading ? "Please wait..." : children}
    </button>
  );
}

export function DemoNote() {
  if (API_URL) return null;
  return <p className="mt-3 text-center text-[11px] text-amber-400">Demo mode: the backend is not connected yet.</p>;
}

/* ---------- Layout ---------- */

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="h-dvh overflow-hidden bg-[#050505] text-zinc-100 antialiased selection:bg-orange-500/30 lg:grid lg:grid-cols-[1.35fr_1fr]">
      <Showcase />
      <div className="relative flex h-dvh flex-col overflow-y-auto px-6 py-5 sm:px-10">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-60 bg-[radial-gradient(ellipse_at_top,rgba(249,115,22,0.10),transparent_70%)]" />
        <header className="relative flex shrink-0 items-center justify-between">
          <Link to={ROUTES.home} className={`flex items-center gap-3 rounded-md ${FOCUS}`} aria-label="ChartWars home">
            <img src={logo} alt="" width={32} height={32} className="h-8 w-8" />
            <span className="text-sm font-semibold tracking-[0.22em]">
              CHART<span className="text-orange-500">WARS</span>
            </span>
          </Link>
          <Link to={ROUTES.home} className={`rounded-full border border-white/15 px-4 py-1.5 text-sm text-zinc-300 transition hover:border-orange-500/60 hover:text-white ${FOCUS}`}>
            Back to home
          </Link>
        </header>

        <main className="relative mx-auto flex w-full max-w-100 flex-1 flex-col justify-center py-4">
          <h1 className={`text-3xl font-semibold tracking-tight ${SHORT}:text-2xl`}>{title}</h1>
          <p className={`mb-5 mt-1.5 text-sm leading-relaxed text-zinc-400 ${SHORT}:hidden`}>{subtitle}</p>
          <div className={`mt-4 ${SHORT}:mt-2`} />
          {children}
          {footer && <div className="mt-4 text-center text-sm text-zinc-400">{footer}</div>}
        </main>

        <p className={`relative shrink-0 text-center text-[11px] leading-relaxed text-zinc-600 ${SHORT}:hidden`}>
          Virtual funds only. Educational purposes. Not investment advice.
        </p>
      </div>
    </div>
  );
}