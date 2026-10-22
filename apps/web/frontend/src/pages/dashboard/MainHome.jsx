import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  ChartNoAxesCombined,
  Clock3,
  Swords,
  Users,
  GraduationCap,
  Trophy,
  Target,
  Play,
} from "lucide-react";

const practiceModes = [
  {
    title: "Friend Battle",
    description: "Challenge friends in a shared trading room.",
    icon: Users,
    label: "SOCIAL",
    accent: "orange",
  },
  {
    title: "Blind Trading",
    description: "Test your instincts without visible indicators.",
    icon: Target,
    label: "REACTION",
    accent: "silver",
  },
  {
    title: "Coach Mode",
    description: "Practice with guided feedback and explanations.",
    icon: GraduationCap,
    label: "LEARNING",
    accent: "silver",
  },
  {
    title: "Tournament",
    description: "Compete, climb the leaderboard, and improve.",
    icon: Trophy,
    label: "COMPETITIVE",
    accent: "orange",
  },
];

function SectionHeading({ eyebrow, title, action }) {
  return (
    <div className="mb-5 flex items-end justify-between gap-4">
      <div>
        <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e87524]">
          {eyebrow}
        </p>
        <h2 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {title}
        </h2>
      </div>
      {action ? (
        <button
          type="button"
          className="flex shrink-0 items-center gap-1.5 text-xs text-zinc-400 transition hover:text-white"
        >
          {action}
          <ArrowRight size={14} />
        </button>
      ) : null}
    </div>
  );
}

export default function MainHome() {
  return (
    <main className="mx-auto w-full max-w-[1600px] space-y-9 px-4 py-7 sm:px-7 sm:py-9 lg:px-9">
      <section className="relative overflow-hidden rounded-2xl border border-white/9 bg-[#101010] p-6 sm:p-8 lg:p-10">
        <div className="pointer-events-none absolute -right-16 -top-20 h-64 w-64 rounded-full bg-[#e87524]/8 blur-3xl" />

        <div className="relative max-w-2xl">
          <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#f59a55]">
            YOUR TRADING ARENA
          </p>

          <h1 className="max-w-xl text-2xl font-semibold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
            Sharpen your strategy.
            <span className="block text-zinc-400">
              Compete on your terms.
            </span>
          </h1>

          <p className="mt-4 max-w-lg text-sm leading-6 text-zinc-400">
            Practice market decisions, challenge your friends, and build
            confidence in a simulated trading environment.
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg bg-[#e87524] px-4 py-3 text-xs font-semibold text-black transition hover:bg-[#f58b3b]"
            >
              <Play size={15} fill="currentColor" />
              Start practicing
            </button>

            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-3 text-xs font-medium text-zinc-300 transition hover:bg-white/5 hover:text-white"
            >
              Explore modes
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        <div className="relative mt-8 grid grid-cols-2 gap-3 border-t border-white/8 pt-5 sm:mt-10 sm:max-w-lg">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              Environment
            </p>
            <p className="mt-1.5 text-xs font-medium text-zinc-200">
              Simulated markets
            </p>
          </div>
          <div>
            <p className="text-[10px] uppercase tracking-wider text-zinc-500">
              Built for
            </p>
            <p className="mt-1.5 text-xs font-medium text-zinc-200">
              Practice & learning
            </p>
          </div>
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Choose your challenge"
          title="Practice modes"
          action="View all modes"
        />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {practiceModes.map((mode, index) => {
            const Icon = mode.icon;
            const isOrange = mode.accent === "orange";

            return (
              <button
                key={mode.title}
                type="button"
                className="group text-left rounded-xl border border-white/8 bg-[#0d0d0d] p-5 transition duration-200 hover:-translate-y-1 hover:border-[#e87524]/40 hover:bg-[#111111]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div
                    className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
                      isOrange
                        ? "border-[#e87524]/20 bg-[#e87524]/9 text-[#f59a55]"
                        : "border-white/9 bg-white/[0.035] text-zinc-300"
                    }`}
                  >
                    <Icon size={20} strokeWidth={1.7} />
                  </div>
                  <span className="text-[9px] font-medium tracking-[0.13em] text-zinc-600">
                    0{index + 1}
                  </span>
                </div>

                <p className="mt-5 text-[9px] font-semibold tracking-[0.15em] text-zinc-500">
                  {mode.label}
                </p>
                <h3 className="mt-2 text-sm font-semibold text-zinc-100">
                  {mode.title}
                </h3>
                <p className="mt-2 min-h-10 text-xs leading-5 text-zinc-500">
                  {mode.description}
                </p>

                <div className="mt-5 flex items-center justify-between border-t border-white/[0.07] pt-4">
                  <span className="text-[11px] text-zinc-400">
                    Enter mode
                  </span>
                  <ArrowRight
                    size={15}
                    className="text-zinc-600 transition group-hover:translate-x-1 group-hover:text-[#f59a55]"
                  />
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <section>
        <SectionHeading
          eyebrow="Your recent activity"
          title="Pick up where you left off"
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.35fr_1fr]">
          <article className="rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-zinc-300">
                  <Swords size={19} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Last practice session
                  </h3>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    Your session summary will appear here.
                  </p>
                </div>
              </div>
              <span className="rounded-md border border-white/8 px-2 py-1 text-[9px] text-zinc-500">
                NO DATA
              </span>
            </div>

            <div className="mt-6 grid grid-cols-3 gap-3 border-y border-white/[0.07] py-4">
              <div>
                <p className="text-[10px] text-zinc-500">Sessions</p>
                <p className="mt-2 text-lg font-semibold text-white">—</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Win rate</p>
                <p className="mt-2 text-lg font-semibold text-white">—</p>
              </div>
              <div>
                <p className="text-[10px] text-zinc-500">Best streak</p>
                <p className="mt-2 text-lg font-semibold text-white">—</p>
              </div>
            </div>

            <button
              type="button"
              className="mt-5 inline-flex items-center gap-2 text-xs font-medium text-[#f59a55] transition hover:text-white"
            >
              Start a new session
              <ArrowRight size={14} />
            </button>
          </article>

          <article className="rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:p-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/8 bg-white/[0.035] text-zinc-300">
                <ChartNoAxesCombined size={19} />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Performance snapshot
                </h3>
                <p className="mt-1 text-[11px] text-zinc-500">
                  Personal stats, once available
                </p>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">Practice progress</span>
                <span className="text-xs text-zinc-500">—</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                <div className="h-full w-0 rounded-full bg-[#e87524]" />
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="rounded-lg border border-white/[0.07] p-3">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <ArrowUpRight size={14} />
                    <span className="text-[10px]">Best result</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-200">—</p>
                </div>
                <div className="rounded-lg border border-white/[0.07] p-3">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Clock3 size={14} />
                    <span className="text-[10px]">Practice time</span>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-zinc-200">—</p>
                </div>
              </div>
            </div>
          </article>
        </div>
      </section>

      <section className="rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:p-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[#f59a55]">
              Built to improve
            </p>
            <h2 className="mt-2 text-base font-semibold text-white">
              Every round is a chance to learn.
            </h2>
            <p className="mt-2 max-w-xl text-xs leading-5 text-zinc-500">
              Review decisions, learn from outcomes, and develop your strategy
              in a simulated environment — not with real-money trades.
            </p>
          </div>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-[#e87524]/20 bg-[#e87524]/[0.07] text-[#f59a55]">
            <ArrowDownRight size={23} />
          </div>
        </div>
      </section>
    </main>
  );
}
