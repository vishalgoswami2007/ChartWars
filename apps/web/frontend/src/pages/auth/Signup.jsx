
import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Activity,
  BarChart3,
  CheckCircle2,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  Phone,
  ShieldCheck,
  Sparkles,
  UserRound,
  Zap,
} from "lucide-react";

function TradingViewTicker() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      symbols: [
        { proName: "BINANCE:BTCUSDT", title: "Bitcoin" },
        { proName: "BINANCE:ETHUSDT", title: "Ethereum" },
        { proName: "NASDAQ:AAPL", title: "Apple" },
        { proName: "NASDAQ:NVDA", title: "NVIDIA" },
        { proName: "NASDAQ:TSLA", title: "Tesla" },
      ],
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    container.appendChild(script);

    return () => {
      container.replaceChildren();
      container.dataset.loaded = "false";
    };
  }, []);

  return (
    <div className="tradingview-widget-container w-full overflow-hidden">
      <div ref={containerRef} className="tradingview-widget-container__widget" />
    </div>
  );
}

function TradingViewChart() {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container || container.dataset.loaded === "true") return;

    container.dataset.loaded = "true";

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";

    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: "BINANCE:BTCUSDT",
      interval: "60",
      timezone: "Asia/Kolkata",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(9, 9, 11, 1)",
      gridColor: "rgba(255, 255, 255, 0.04)",
      hide_top_toolbar: false,
      hide_legend: false,
      allow_symbol_change: true,
      save_image: false,
      calendar: false,
      support_host: "https://www.tradingview.com",
    });

    container.appendChild(script);

    return () => {
      container.replaceChildren();
      container.dataset.loaded = "false";
    };
  }, []);

  return (
    <div className="h-62.5 w-full overflow-hidden rounded-xl sm:h-75">
      <div
        ref={containerRef}
        className="tradingview-widget-container h-full w-full"
      >
        <div className="tradingview-widget-container__widget h-full w-full" />
      </div>
    </div>
  );
}

function PasswordStrength({ password }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password) && /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ];

  const score = checks.filter(Boolean).length;

  const label =
    !password
      ? "Use at least 8 characters"
      : score <= 1
        ? "Weak password"
        : score === 2
          ? "Fair password"
          : score === 3
            ? "Good password"
            : "Strong password";

  const strengthColor =
    score <= 1
      ? "bg-red-500"
      : score === 2
        ? "bg-yellow-500"
        : score === 3
          ? "bg-orange-500"
          : "bg-emerald-500";

  return (
    <div className="mt-3">
      <div className="flex gap-1.5">
        {[1, 2, 3, 4].map((bar) => (
          <div
            key={bar}
            className={`h-1 flex-1 rounded-full ${
              score >= bar ? strengthColor : "bg-zinc-800"
            }`}
          />
        ))}
      </div>

      <p className="mt-2 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

function FormField({
  label,
  icon: Icon,
  error,
  children,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-zinc-300">
        {label}
      </label>

      <div
        className={`flex items-center gap-3 rounded-xl border bg-zinc-900/70 px-3.5 transition focus-within:border-orange-500/70 focus-within:ring-2 focus-within:ring-orange-500/10 ${
          error ? "border-red-500/60" : "border-white/9"
        }`}
      >
        <Icon size={17} className="shrink-0 text-zinc-500" />
        {children}
      </div>

      {error && <p className="mt-1.5 text-xs text-red-400">{error}</p>}
    </div>
  );
}

export default function Signup() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    acceptedTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [notice, setNotice] = useState("");
  const [loading, setLoading] = useState(false);

  function updateField(event) {
    const { name, value, checked, type } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setErrors((previous) => ({
      ...previous,
      [name]: "",
    }));

    setNotice("");
  }

  function validateForm() {
    const nextErrors = {};

    if (form.name.trim().length < 2) {
      nextErrors.name = "Enter your full name.";
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) {
      nextErrors.email = "Enter a valid email address.";
    }

    if (form.phone && !/^[0-9]{10,15}$/.test(form.phone.replace(/[\s+-]/g, ""))) {
      nextErrors.phone = "Enter a valid phone number.";
    }

    if (
      form.password.length < 8 ||
      !/[A-Z]/.test(form.password) ||
      !/[a-z]/.test(form.password) ||
      !/\d/.test(form.password)
    ) {
      nextErrors.password =
        "Use 8+ characters with uppercase, lowercase and a number.";
    }

    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords do not match.";
    }

    if (!form.acceptedTerms) {
      nextErrors.acceptedTerms = "Please accept the terms to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!validateForm()) return;

    // UI only: connect this form to your Express signup API later.
    setNotice(
      "Form validated successfully. Connect your backend API to create your account."
    );
  }

  function handleGoogleSignup() {
    setNotice(
      "Google signup is not connected yet. Configure Google OAuth to enable it."
    );
  }

  return (
    <main className="min-h-screen overflow-x-hidden bg-black font-sans text-white selection:bg-orange-500 selection:text-black">
      <div className="grid min-h-screen lg:grid-cols-[1.08fr_0.92fr]">
        {/* LEFT PANEL */}
        <section className="relative hidden min-h-screen flex-col justify-between overflow-hidden border-r border-white/[0.07] bg-zinc-950 p-8 lg:flex xl:p-12">
          <div className="pointer-events-none absolute -left-32 top-32 h-96 w-96 rounded-full bg-orange-500/8 blur-[120px]" />
          <div className="pointer-events-none absolute -right-20 bottom-20 h-80 w-80 rounded-full bg-orange-600/5 blur-[110px]" />

          {/* Branding */}
          <div className="relative z-10 flex items-center justify-between gap-4">
            <a href="/" className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-500/30 bg-orange-500/10">
                <Activity size={23} className="text-orange-500" />
              </div>

              <div>
                <p className="text-xl font-black tracking-tight">
                  Chart<span className="text-orange-500">Wars</span>
                </p>
                <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.22em] text-zinc-500">
                  Practice. Compete. Improve.
                </p>
              </div>
            </a>

            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-zinc-400">
              <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-orange-500" />
              Trading simulator
            </span>
          </div>

          {/* Main pitch */}
          <div className="relative z-10 my-12 max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-orange-500/20 bg-orange-500/[0.07] px-3 py-2 text-xs font-medium text-orange-400">
              <Sparkles size={14} />
              Your next level starts here
            </div>

            <h1 className="text-5xl font-black leading-[1.12] tracking-tight xl:text-6xl">
              Trade smarter.
              <br />
              <span className="text-orange-500">Practice harder.</span>
              <br />
              Play to improve.
            </h1>

            <p className="mt-5 max-w-lg text-base leading-7 text-zinc-400">
              Build your trading discipline, test your strategies, and
              challenge your friends — without risking real money in practice
              mode.
            </p>

            {/* Feature cards */}
            <div className="mt-8 grid gap-3 sm:grid-cols-3">
              {[
                {
                  icon: Zap,
                  title: "Practice mode",
                  detail: "Virtual trading",
                },
                {
                  icon: BarChart3,
                  title: "Chart analysis",
                  detail: "Study the market",
                },
                {
                  icon: ShieldCheck,
                  title: "Learn safely",
                  detail: "No real-money orders",
                },
              ].map((item) => {
                const Icon = item.icon;

                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-white/8 bg-white/2.5 p-4 transition hover:border-orange-500/25 hover:bg-orange-500/2.5"
                  >
                    <Icon size={20} className="text-orange-500" />
                    <p className="mt-4 text-sm font-semibold text-zinc-200">
                      {item.title}
                    </p>
                    <p className="mt-1 text-xs text-zinc-500">
                      {item.detail}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Live market widget */}
            <div className="mt-8 overflow-hidden rounded-2xl border border-white/8 bg-black/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-orange-500" />
                  <span className="text-xs font-semibold text-zinc-300">
                    Market watch
                  </span>
                </div>
                <span className="text-[10px] text-zinc-600">
                  Powered by TradingView
                </span>
              </div>

              <TradingViewTicker />
            </div>

            {/* Chart */}
            <div className="mt-4 overflow-hidden rounded-2xl border border-white/8 bg-black/60 p-3">
              <div className="mb-3 flex items-center justify-between px-1">
                <div>
                  <p className="text-sm font-semibold text-zinc-200">
                    BTC / USDT
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    Market chart preview
                  </p>
                </div>

                <ArrowUpRight size={18} className="text-orange-500" />
              </div>

              <TradingViewChart />

              <p className="mt-2 text-[10px] leading-5 text-zinc-600">
                External market data is for reference and may differ from
                ChartWars simulation data.
              </p>
            </div>
          </div>

          <div className="relative z-10 flex items-center justify-between gap-4 border-t border-white/[0.07] pt-5 text-xs text-zinc-600">
            <p>© {new Date().getFullYear()} ChartWars</p>
            <p>Built for practice, not financial advice.</p>
          </div>
        </section>

        {/* RIGHT PANEL */}
        <section className="relative flex min-h-screen items-center justify-center bg-black px-5 py-10 sm:px-10 lg:px-8 xl:px-14">
          <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-orange-500/4.5 blur-[100px] lg:hidden" />

          <div className="relative z-10 w-full max-w-md">
            {/* Mobile branding */}
            <a href="/" className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10">
                <Activity size={21} className="text-orange-500" />
              </div>

              <span className="text-xl font-black">
                Chart<span className="text-orange-500">Wars</span>
              </span>
            </a>

            <div className="mb-8">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-orange-500">
                <Sparkles size={14} />
                Create your account
              </span>

              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl">
                Join the battle.
              </h2>

              <p className="mt-3 text-sm leading-6 text-zinc-400">
                Create your account and start improving your trading skills.
              </p>
            </div>

            {/* Google button - UI only */}
            <button
              type="button"
              onClick={handleGoogleSignup}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-white/12 bg-zinc-950 px-4 py-3.5 text-sm font-semibold text-zinc-200 transition hover:border-white/25 hover:bg-zinc-900 focus:outline-none focus:ring-2 focus:ring-orange-500/30"
            >
              <svg
                viewBox="0 0 48 48"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <path
                  fill="#EA4335"
                  d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 3.02 13.22l7.98 6.19C12.9 13.72 18.02 9.5 24 9.5Z"
                  transform="translate(0 4)"
                />
                <path
                  fill="#4285F4"
                  d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.72 7.18l7.62 5.91c4.45-4.11 7.14-10.17 7.14-17.56Z"
                />
                <path
                  fill="#FBBC05"
                  d="M10.99 28.59A14.4 14.4 0 0 1 10.2 24c0-1.59.27-3.13.76-4.59l-7.98-6.19A23.9 23.9 0 0 0 0 24c0 3.86.92 7.51 2.98 10.78l8.01-6.19Z"
                  transform="translate(1 0)"
                />
                <path
                  fill="#34A853"
                  d="M24 48c6.48 0 11.93-2.14 15.9-5.89l-7.62-5.91c-2.12 1.42-4.83 2.27-8.28 2.27-5.98 0-11.06-4.04-12.87-9.48l-8.01 6.19C6.61 42.72 14.62 48 24 48Z"
                />
              </svg>

              Continue with Google
              <ArrowRight size={16} className="ml-auto text-zinc-500" />
            </button>

            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/9" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
                Or sign up with email
              </span>
              <div className="h-px flex-1 bg-white/9" />
            </div>

            {notice && (
              <div
                role="status"
                className="mb-5 flex gap-3 rounded-xl border border-orange-500/20 bg-orange-500/[0.07] p-3.5 text-sm leading-6 text-orange-300"
              >
                <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
                <p>{notice}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="space-y-4">
              <FormField
                label="Full name"
                icon={UserRound}
                error={errors.name}
              >
                <input
                  name="name"
                  type="text"
                  autoComplete="name"
                  value={form.name}
                  onChange={updateField}
                  placeholder="Enter your full name"
                  aria-invalid={Boolean(errors.name)}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </FormField>

              <FormField
                label="Email address"
                icon={Mail}
                error={errors.email}
              >
                <input
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={updateField}
                  placeholder="you@example.com"
                  aria-invalid={Boolean(errors.email)}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </FormField>

              <FormField
                label="Phone number (optional)"
                icon={Phone}
                error={errors.phone}
              >
                <input
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={updateField}
                  placeholder="Enter phone number"
                  aria-invalid={Boolean(errors.phone)}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />
              </FormField>

              <FormField
                label="Password"
                icon={LockKeyhole}
                error={errors.password}
              >
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={updateField}
                  placeholder="Create a strong password"
                  aria-invalid={Boolean(errors.password)}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="shrink-0 text-zinc-500 transition hover:text-white"
                >
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </FormField>

              <PasswordStrength password={form.password} />

              <FormField
                label="Confirm password"
                icon={LockKeyhole}
                error={errors.confirmPassword}
              >
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={updateField}
                  placeholder="Re-enter your password"
                  aria-invalid={Boolean(errors.confirmPassword)}
                  className="min-w-0 flex-1 bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-zinc-600"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((value) => !value)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="shrink-0 text-zinc-500 transition hover:text-white"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={17} />
                  ) : (
                    <Eye size={17} />
                  )}
                </button>
              </FormField>

              <div className="pt-1">
                <label className="flex cursor-pointer items-start gap-3">
                  <input
                    type="checkbox"
                    name="acceptedTerms"
                    checked={form.acceptedTerms}
                    onChange={updateField}
                    className="mt-1 h-4 w-4 shrink-0 accent-orange-500"
                  />

                  <span className="text-xs leading-5 text-zinc-500">
                    I agree to the{" "}
                    <a
                      href="/terms"
                      className="font-medium text-zinc-300 underline decoration-zinc-700 underline-offset-4 transition hover:text-orange-400"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy"
                      className="font-medium text-zinc-300 underline decoration-zinc-700 underline-offset-4 transition hover:text-orange-400"
                    >
                      Privacy Policy
                    </a>
                    .
                  </span>
                </label>

                {errors.acceptedTerms && (
                  <p className="mt-2 text-xs text-red-400">
                    {errors.acceptedTerms}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={loading}
                className="group flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-black shadow-lg shadow-orange-500/8 transition hover:bg-orange-400 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
              >
                Create your account
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-6 flex items-start gap-2.5 rounded-xl border border-white/6 bg-zinc-950/70 p-3.5">
              <ShieldCheck
                size={17}
                className="mt-0.5 shrink-0 text-orange-500"
              />
              <p className="text-xs leading-5 text-zinc-500">
                ChartWars practice mode uses virtual funds. Trading involves
                risk, and simulated results do not guarantee real-world
                performance.
              </p>
            </div>

            <p className="mt-7 text-center text-sm text-zinc-500">
              Already have an account?{" "}
              <a
                href="/login"
                className="font-semibold text-orange-400 transition hover:text-orange-300"
              >
                Sign in
              </a>
            </p>

            <p className="mt-8 text-center text-[10px] leading-5 text-zinc-700">
              By continuing, you agree to use ChartWars responsibly.
              <br />
              © {new Date().getFullYear()} ChartWars.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
