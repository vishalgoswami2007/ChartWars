import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowRight,
  Clock3,
  EyeOff,
  GraduationCap,
  Trophy,
  Users,
  DoorOpen,
} from "lucide-react";

const MODES = [
  {
    id: "friends",
    title: "Friends Room",
    description: "Practice alongside friends and compare your decisions.",
    detail: "Social practice",
    icon: Users,
    status: "Available",
  },
  {
    id: "blind",
    title: "Blind Room",
    description: "Predict the next move before the hidden candle is revealed.",
    detail: "Prediction challenge",
    icon: EyeOff,
    status: "Preview",
  },
  {
    id: "coaches",
    title: "VS Coaches",
    description: "Build your market-reading skills with guided challenges.",
    detail: "Guided practice",
    icon: GraduationCap,
    status: "Available",
  },
  {
    id: "tournament",
    title: "Tournament",
    description: "Compete in structured rounds and climb the leaderboard.",
    detail: "Competitive arena",
    icon: Trophy,
    status: "Coming Soon",
  },
];

export default function RoomsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [selectedMode, setSelectedMode] = useState(
    searchParams.get("mode") || "friends"
  );

  const coinId = searchParams.get("coin");
  const startingBalance = searchParams.get("balance") || "10000";
  const duration = searchParams.get("duration") || "5";

  const startMode = (mode) => {
    if (mode === "tournament") return;

    if (mode === "friends" || mode === "blind" || mode === "coaches") {
      setSelectedMode(mode);

      if (coinId) {
        navigate(
          `/dashboard/markets/${encodeURIComponent(coinId)}?mode=${mode}&balance=${encodeURIComponent(startingBalance)}&duration=${encodeURIComponent(duration)}`
        );
        return;
      }
    }
  };

  return (
    <main className="mx-auto w-full max-w-375 space-y-7 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
      <section className="relative overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 sm:p-9">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#e87524]/8 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#e87524]">
            ChartWars · Practice arena
          </p>
          <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-4xl">
            Every round makes you sharper.
          </h1>
          <p className="mt-3 max-w-xl text-xs leading-6 text-zinc-400 sm:text-sm">
            Choose your practice style, work with virtual funds, and learn to
            read market movements without risking real money.
          </p>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-[10px] text-zinc-500">
            <span className="rounded-full border border-white/10 px-3 py-1.5">
              Virtual funds
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">
              Skill-first practice
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5">
              No real trades
            </span>
          </div>
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold text-white">
              Choose your room
            </h2>
            <p className="mt-1 text-xs text-zinc-500">
              Select a mode to continue.
            </p>
          </div>
          <DoorOpen size={20} className="text-[#e87524]" />
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {MODES.map((mode) => {
            const Icon = mode.icon;
            const selected = selectedMode === mode.id;
            const comingSoon = mode.id === "tournament";

            return (
              <article
                key={mode.id}
                className={`rounded-xl border bg-[#0d0d0d] p-5 transition ${
                  selected
                    ? "border-[#e87524]/45"
                    : "border-white/8 hover:border-white/20"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-[#e87524]/20 bg-[#e87524]/8">
                    <Icon size={20} className="text-[#f59a55]" />
                  </div>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] ${
                      comingSoon
                        ? "border-white/10 text-zinc-500"
                        : "border-emerald-400/20 text-emerald-400"
                    }`}
                  >
                    {mode.status}
                  </span>
                </div>

                <p className="mt-5 text-[10px] uppercase tracking-wider text-zinc-600">
                  {mode.detail}
                </p>
                <h3 className="mt-1 text-base font-semibold text-white">
                  {mode.title}
                </h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-400">
                  {mode.description}
                </p>

                {comingSoon ? (
                  <div className="mt-5 flex items-center gap-2 rounded-lg border border-white/8 bg-white/2 px-3 py-3 text-xs text-zinc-500">
                    <Clock3 size={14} />
                    This mode is on the roadmap.
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => startMode(mode.id)}
                    className={`mt-5 flex w-full items-center justify-between rounded-lg border px-4 py-3 text-xs font-medium transition ${
                      selected
                        ? "border-[#e87524]/40 bg-[#e87524]/10 text-[#f59a55]"
                        : "border-white/10 text-zinc-300 hover:border-[#e87524]/40 hover:text-white"
                    }`}
                  >
                    {coinId ? "Continue with selected coin" : "Open chart to begin"}
                    <ArrowRight size={15} />
                  </button>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {!coinId && (
        <section className="flex flex-col justify-between gap-4 rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-medium text-white">
              Choose a market before starting
            </p>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Select a coin first, then configure your virtual practice session.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate("/dashboard/markets")}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-[#e87524] px-4 py-3 text-xs font-semibold text-black transition hover:bg-[#f59a55]"
          >
            Explore markets
            <ArrowRight size={14} />
          </button>
        </section>
      )}
    </main>
  );
}