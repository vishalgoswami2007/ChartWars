
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  Activity,
  BarChart3,
  ChevronRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";

const initialForm = {
  name: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const inputClass =
  "h-11 w-full rounded-lg border border-[#252D38] bg-[#0C1119] px-3 text-[13px] text-white outline-none placeholder:text-[#626D7C] transition focus:border-emerald-500/70 focus:ring-2 focus:ring-emerald-500/10";

function MarketPanel() {
  const points =
    "0,118 22,108 42,114 61,87 80,96 99,72 119,81 140,58 158,68 178,47 197,59 218,33 238,44 258,25 278,38 298,16 320,27 342,12";

  return (
    <section className="relative hidden h-dvh min-h-0 flex-col overflow-hidden border-r border-white/[0.07] bg-[#080B11] p-7 xl:p-9 lg:flex">
      <div className="pointer-events-none absolute -left-44 top-1/4 h-105 w-105 rounded-full bg-emerald-500/4.5 blur-[110px]" />

      <Link to="/" className="relative z-10 flex w-fit items-center gap-2.5">
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-emerald-500/25 bg-emerald-500/8">
          <Activity size={19} className="text-emerald-400" strokeWidth={1.7} />
        </div>
        <div className="text-[19px] font-semibold tracking-[-0.7px]">
          ChartWars
          <span className="ml-2 rounded border border-[#26313D] px-1.5 py-0.5 align-middle text-[9px] font-medium tracking-[1px] text-[#8995A5]">
            SIM
          </span>
        </div>
      </Link>

      <div className="relative z-10 my-auto max-w-165 py-6">
        <div className="mb-5 flex items-center gap-2 text-[10px] font-medium uppercase tracking-[2.2px] text-emerald-400">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Market simulation platform
        </div>

        <h1 className="max-w-155 text-[clamp(30px,3.2vw,51px)] font-semibold leading-[1.12] tracking-[-2px] text-white">
          Institutional-grade simulation.
          <span className="mt-2 block text-[#8D98A8]">
            Trade global markets.
          </span>
        </h1>

        <p className="mt-4 max-w-117.5 text-[13px] leading-6 text-[#929DAD]">
          Test your strategies, analyze price action, and sharpen your
          decision-making in a risk-free trading environment.
        </p>

        <div className="mt-8 overflow-hidden rounded-xl border border-[#222B37] bg-[#0B1017]">
          <div className="flex items-center justify-between border-b border-[#222B37] px-4 py-3">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[1.5px] text-[#8792A1]">
                Market overview
              </p>
              <p className="mt-1 text-xs text-white">Illustrative price chart</p>
            </div>
            <span className="flex items-center gap-1.5 rounded-md border border-emerald-500/20 bg-emerald-500/6 px-2 py-1 text-[9px] text-emerald-400">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              SIMULATED
            </span>
          </div>

          <div className="grid grid-cols-3 divide-x divide-[#222B37] border-b border-[#222B37]">
            {[
              ["MARKET", "Global"],
              ["MODE", "Practice"],
              ["RISK", "Virtual funds"],
            ].map(([label, value]) => (
              <div key={label} className="px-3 py-3">
                <p className="text-[9px] tracking-[1px] text-[#687587]">{label}</p>
                <p className="mt-1 text-xs font-medium text-[#D5DCE5]">{value}</p>
              </div>
            ))}
          </div>

          <div className="px-4 pb-3 pt-4">
            <div className="relative h-37.5 overflow-hidden">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, #202A35 1px, transparent 1px), linear-gradient(to bottom, #202A35 1px, transparent 1px)",
                  backgroundSize: "42px 30px",
                  opacity: 0.42,
                }}
              />
              <svg
                viewBox="0 0 342 135"
                preserveAspectRatio="none"
                className="relative h-full w-full"
                aria-label="Illustrative rising market trend"
              >
                <defs>
                  <linearGradient id="marketFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#10B981" stopOpacity=".20" />
                    <stop offset="100%" stopColor="#10B981" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <polygon
                  points={`0,135 ${points} 342,135`}
                  fill="url(#marketFill)"
                />
                <polyline
                  points={points}
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="2"
                  vectorEffect="non-scaling-stroke"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                />
              </svg>
            </div>
            <div className="mt-2 flex justify-between text-[9px] text-[#687587]">
              <span>Illustrative data</span>
              <span>For practice only</span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-5 text-[11px] text-[#8D98A8]">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-emerald-400" />
            Risk-free practice
          </span>
          <span className="flex items-center gap-1.5">
            <BarChart3 size={14} className="text-emerald-400" />
            Strategy analysis
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-between text-[10px] text-[#697484]">
        <span>© {new Date().getFullYear()} ChartWars</span>
        <span>Markets are simulated · No real-money orders</span>
      </div>
    </section>
  );
}

export default function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState(
    location.pathname === "/login" ? "login" : "signup"
  );
  const [form, setForm] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const isSignup = mode === "signup";

  const switchMode = (nextMode) => {
    setMode(nextMode);
    setError("");
    setShowPassword(false);
    setShowConfirm(false);
    setForm(initialForm);
    navigate(nextMode === "signup" ? "/signup" : "/login", {
      replace: true,
    });
  };

  const update = (event) => {
    setForm((previous) => ({
      ...previous,
      [event.target.name]: event.target.value,
    }));
    setError("");
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");

    if (isSignup && form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (form.password.length < 8) {
      setError("Use a password with at least 8 characters.");
      return;
    }

    setLoading(true);

    // UI validation only. Connect your backend API here.
    setTimeout(() => {
      setLoading(false);
      setError(
        isSignup
          ? "Form validated. Connect the signup API to create your account."
          : "Form validated. Connect the login API to authenticate your account."
      );
    }, 250);
  };

  const googleSignIn = () => {
    setError("Google authentication has not been connected yet.");
  };

  return (
    <main className="grid h-dvh min-h-0 w-full grid-cols-1 overflow-hidden bg-[#080B11] text-white lg:grid-cols-[60fr_40fr]">
      <MarketPanel />

      <section className="flex h-dvh min-h-0 items-center justify-center overflow-hidden px-5 py-4 sm:px-8 lg:px-6 xl:px-10">
        <div className="w-full max-w-97.5">
          <div className="mb-5 flex items-center justify-between lg:hidden">
            <Link to="/" className="flex items-center gap-2 text-lg font-semibold">
              <Activity size={21} className="text-emerald-400" />
              ChartWars
            </Link>
            <span className="text-[10px] uppercase tracking-[1.5px] text-[#8D98A8]">
              Trading simulator
            </span>
          </div>

          <div key={mode} className="auth-fade-in">
            <div className="mb-5">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-[2px] text-emerald-400">
                {isSignup ? "Create account" : "Secure access"}
              </p>
              <h2 className="text-[30px] font-semibold leading-tight tracking-[-1.2px] sm:text-[34px]">
                {isSignup ? "Create your trading account" : "Access your terminal"}
              </h2>
              <p className="mt-2 text-[12px] leading-5 text-[#9CA3AF]">
                {isSignup
                  ? "Set up your account to start practicing."
                  : "Sign in to continue your trading practice."}
              </p>
            </div>

            <button
              type="button"
              onClick={googleSignIn}
              className="flex h-10 w-full items-center justify-center gap-2.5 rounded-lg border border-[#252D38] bg-[#0C1119] text-[12px] font-medium text-[#E3E8EF] transition hover:border-[#3B4756] hover:bg-[#111923]"
            >
              <span className="text-sm font-bold text-white">G</span>
              Continue with Google
            </button>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-[#252D38]" />
              <span className="text-[9px] uppercase tracking-[1.5px] text-[#6F7B8B]">
                Or continue with email
              </span>
              <div className="h-px flex-1 bg-[#252D38]" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              {isSignup && (
                <label className="block">
                  <span className="mb-1.5 block text-[11px] font-medium text-[#C7CFD9]">
                    Full name
                  </span>
                  <div className="relative">
                    <UserRound
                      size={15}
                      strokeWidth={1.5}
                      className="absolute left-3 top-3.25 text-[#7E8999]"
                    />
                    <input
                      className={`${inputClass} pl-9`}
                      name="name"
                      value={form.name}
                      onChange={update}
                      placeholder="Your full name"
                      autoComplete="name"
                      required
                    />
                  </div>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-[11px] font-medium text-[#C7CFD9]">
                  Email address
                </span>
                <div className="relative">
                  <Mail
                    size={15}
                    strokeWidth={1.5}
                    className="absolute left-3 top-3.25 text-[#7E8999]"
                  />
                  <input
                    className={`${inputClass} pl-9`}
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={update}
                    placeholder="name@company.com"
                    autoComplete="email"
                    required
                  />
                </div>
              </label>

              <div className={isSignup ? "grid grid-cols-2 gap-3" : "block"}>
                <label className="block min-w-0">
                  <span className="mb-1.5 block text-[11px] font-medium text-[#C7CFD9]">
                    Password
                  </span>
                  <div className="relative">
                    <LockKeyhole
                      size={15}
                      strokeWidth={1.5}
                      className="absolute left-3 top-3.25 text-[#7E8999]"
                    />
                    <input
                      className={`${inputClass} pl-9 pr-9`}
                      name="password"
                      type={showPassword ? "text" : "password"}
                      value={form.password}
                      onChange={update}
                      placeholder="8+ characters"
                      autoComplete={isSignup ? "new-password" : "current-password"}
                      minLength={8}
                      required
                    />
                    <button
                      type="button"
                      aria-label="Toggle password visibility"
                      onClick={() => setShowPassword((value) => !value)}
                      className="absolute right-3 top-3.25 text-[#7E8999] hover:text-white"
                    >
                      {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                    </button>
                  </div>
                </label>

                {isSignup && (
                  <label className="block min-w-0">
                    <span className="mb-1.5 block text-[11px] font-medium text-[#C7CFD9]">
                      Confirm password
                    </span>
                    <div className="relative">
                      <LockKeyhole
                        size={15}
                        strokeWidth={1.5}
                        className="absolute left-3 top-3.25 text-[#7E8999]"
                      />
                      <input
                        className={`${inputClass} pl-9 pr-9`}
                        name="confirmPassword"
                        type={showConfirm ? "text" : "password"}
                        value={form.confirmPassword}
                        onChange={update}
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        minLength={8}
                        required
                      />
                      <button
                        type="button"
                        aria-label="Toggle confirm password visibility"
                        onClick={() => setShowConfirm((value) => !value)}
                        className="absolute right-3 top-3.25 text-[#7E8999] hover:text-white"
                      >
                        {showConfirm ? <EyeOff size={15} /> : <Eye size={15} />}
                      </button>
                    </div>
                  </label>
                )}
              </div>

              {isSignup ? (
                <p className="pt-0.5 text-[10px] leading-4 text-[#7F8A99]">
                  By creating an account, you agree to our{" "}
                  <Link to="/termsOfUse" className="text-[#B8C2CF] underline underline-offset-2">
                    Terms
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacyPolicy" className="text-[#B8C2CF] underline underline-offset-2">
                    Privacy Policy
                  </Link>
                  .
                </p>
              ) : (
                <div className="flex justify-end">
                  <Link
                    to="/forgot-password"
                    className="text-[11px] text-emerald-400 hover:text-emerald-300"
                  >
                    Forgot password?
                  </Link>
                </div>
              )}

              {error && (
                <p
                  role="status"
                  className="rounded-md border border-emerald-500/15 bg-emerald-500/5 px-3 py-2 text-[10px] leading-4 text-emerald-300"
                >
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="group flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-emerald-500 text-[12px] font-semibold text-[#04130E] transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading
                  ? "Please wait..."
                  : isSignup
                    ? "Create account"
                    : "Sign in"}
                {!loading && (
                  <ChevronRight
                    size={16}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                )}
              </button>
            </form>

            <div className="my-4 flex items-center gap-2 text-center text-[11px]">
              <span className="text-[#8994A3]">
                {isSignup ? "Already have an account?" : "New to ChartWars?"}
              </span>
              <button
                type="button"
                onClick={() => switchMode(isSignup ? "login" : "signup")}
                className="font-medium text-emerald-400 hover:text-emerald-300"
              >
                {isSignup ? "Sign in" : "Create account"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 text-[9px] text-[#687484]">
            <ShieldCheck size={12} />
            Practice with virtual funds · No real-money orders
          </div>
        </div>
      </section>

      <style>{`
        @keyframes authFade {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .auth-fade-in {
          animation: authFade 220ms ease-out both;
        }
        @media (prefers-reduced-motion: reduce) {
          .auth-fade-in { animation: none; }
        }
      `}</style>
    </main>
  );
}
