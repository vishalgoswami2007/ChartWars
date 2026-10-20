
import {
  ArrowRight,
  Bot,
  Check,
  GraduationCap,
  Play,
  Plus,
  Users,
  Volume2,
  Zap,
} from "lucide-react";

const modes = [
  {
    number: "01",
    title: "Replay Trading",
    description:
      "Relive historical market conditions, test your strategy, and build confidence without risking real money.",
    icon: Play,
    action: "Explore replay",
    preview: "replay",
    tag: "SOLO PRACTICE",
  },
  {
    number: "02",
    title: "Friend Rooms",
    description:
      "Challenge your friends, join a room, and compare trading decisions in a shared market session.",
    icon: Users,
    action: "Explore rooms",
    preview: "rooms",
    tag: "COMPETE TOGETHER",
  },
  {
    number: "03",
    title: "Vs Coach",
    description:
      "Sharpen your entries, understand risk, and improve your decision-making with guided practice.",
    icon: GraduationCap,
    action: "Meet your coach",
    preview: "coach",
    tag: "GUIDED LEARNING",
  },
];

function ReplayPreview() {
  const candles = [
    { h: 35, l: 56, up: true },
    { h: 48, l: 65, up: false },
    { h: 28, l: 52, up: true },
    { h: 40, l: 59, up: true },
    { h: 30, l: 48, up: false },
    { h: 20, l: 43, up: true },
    { h: 33, l: 52, up: false },
    { h: 17, l: 38, up: true },
    { h: 24, l: 45, up: true },
    { h: 12, l: 31, up: false },
    { h: 8, l: 28, up: true },
    { h: 18, l: 37, up: true },
  ];

  return (
    <div className="grid h-full min-h-47.5 grid-cols-[1fr_104px] gap-2">
      <div className="relative overflow-hidden rounded-lg border border-white/9 bg-[#080909] p-3">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              "linear-gradient(rgba(255,255,255,.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.045) 1px, transparent 1px)",
            backgroundSize: "26px 26px",
          }}
        />
        <div className="relative flex items-center justify-between">
          <span className="text-[11px] font-medium text-white/80">
            BTC / USDT
          </span>
          <span className="text-[10px] text-white/35">5m</span>
        </div>

        <div className="relative mt-4 flex h-28 items-center justify-around">
          {candles.map((candle, index) => (
            <div
              key={index}
              className="relative flex h-full w-2 items-center justify-center"
            >
              <span
                className={`absolute w-px ${
                  candle.up ? "bg-emerald-400" : "bg-rose-500"
                }`}
                style={{
                  height: `${candle.l - candle.h + 15}px`,
                  top: `${candle.h}px`,
                }}
              />
              <span
                className={`absolute w-1.75 rounded-[1px] ${
                  candle.up ? "bg-emerald-400" : "bg-rose-500"
                }`}
                style={{
                  height: `${Math.max(8, candle.l - candle.h - 2)}px`,
                  top: `${candle.h + 6}px`,
                }}
              />
            </div>
          ))}
        </div>
        <div className="relative mt-1 flex justify-between text-[9px] text-white/30">
          <span>09:30</span>
          <span>10:00</span>
          <span>10:30</span>
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-white/9 bg-white/2.5 p-3">
        <span className="text-[10px] text-white/45">REPLAY CONTROLS</span>
        <span className="mt-3 text-xs text-white/80">Jan 14, 2025</span>
        <div className="mt-4 h-1 rounded-full bg-white/10">
          <div className="h-1 w-2/3 rounded-full bg-orange-500" />
        </div>
        <div className="mt-4 flex items-center justify-center">
          <span className="flex size-9 items-center justify-center rounded-full border border-orange-500/40 bg-orange-500/10 text-orange-400">
            <Play size={14} fill="currentColor" />
          </span>
        </div>
        <span className="mt-3 text-center text-[10px] text-white/45">
          Speed: 1x
        </span>
      </div>
    </div>
  );
}

function RoomsPreview() {
  const rooms = [
    { name: "Alpha Traders", host: "Hosted by Vishal", count: "03" },
    { name: "Strategy Battle", host: "Hosted by Rohan", count: "02" },
    { name: "Weekend Warriors", host: "Hosted by Akash", count: "04" },
  ];

  return (
    <div className="flex h-full min-h-47.5 flex-col rounded-lg border border-white/9 bg-[#080909] p-3">
      <div className="flex items-center justify-between border-b border-white/[0.07] pb-3">
        <span className="flex items-center gap-2 text-xs text-white/80">
          <Users size={15} className="text-orange-400" />
          Practice rooms
        </span>
        <span className="flex items-center gap-1 rounded-md bg-orange-500 px-2 py-1 text-[10px] font-semibold text-black">
          <Plus size={11} />
          Create
        </span>
      </div>

      <div className="mt-2 flex flex-1 flex-col gap-2">
        {rooms.map((room) => (
          <div
            key={room.name}
            className="flex items-center justify-between rounded-lg border border-white/6 bg-white/2.5 px-3 py-2.5"
          >
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex size-8 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/6 text-[10px] text-white/70">
                {room.count}
              </div>
              <div className="min-w-0">
                <p className="truncate text-[11px] font-medium text-white/85">
                  {room.name}
                </p>
                <p className="mt-1 text-[9px] text-white/40">{room.host}</p>
              </div>
            </div>
            <span className="flex shrink-0 items-center gap-1 text-[9px] text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Live
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function CoachPreview() {
  const topics = ["Entry & Exit", "Risk Management", "Trade Psychology"];

  return (
    <div className="grid h-full min-h-47.5 grid-cols-[1fr_118px] gap-2">
      <div className="flex flex-col rounded-lg border border-white/9 bg-[#080909] p-3">
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/10 text-orange-400">
            <Bot size={22} />
          </div>
          <div>
            <p className="text-xs font-medium text-white/90">Trading Coach</p>
            <p className="mt-1 flex items-center gap-1 text-[10px] text-emerald-400">
              <span className="size-1.5 rounded-full bg-emerald-400" />
              Ready to help
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-white/6 bg-white/[0.035] p-3">
          <p className="text-[10px] leading-relaxed text-white/70">
            Good setup. Always define your risk before entering a trade.
          </p>
        </div>

        <div className="mt-auto flex items-center gap-2 pt-3 text-[10px] text-white/40">
          <Volume2 size={13} />
          Guided feedback
        </div>
      </div>

      <div className="flex flex-col rounded-lg border border-white/9 bg-white/2.5 p-2.5">
        <span className="mb-2 text-[9px] text-white/40">LEARN</span>
        {topics.map((topic) => (
          <div
            key={topic}
            className="flex items-center gap-2 border-b border-white/6 py-3 last:border-b-0"
          >
            <span className="flex size-5 shrink-0 items-center justify-center rounded-md bg-orange-500/10 text-orange-400">
              <Check size={11} />
            </span>
            <span className="text-[9px] leading-relaxed text-white/65">
              {topic}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function ModePreview({ type }) {
  if (type === "replay") return <ReplayPreview />;
  if (type === "rooms") return <RoomsPreview />;
  return <CoachPreview />;
}

function PracticeCard({ mode }) {
  const Icon = mode.icon;

  return (
    <article className="group relative flex min-w-0 flex-col overflow-hidden rounded-2xl border border-white/11 bg-[#080909] p-4 transition duration-300 hover:-translate-y-1 hover:border-orange-500/60 hover:bg-[#0b0b0b] sm:p-5 lg:p-6">
      <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-linear-to-r from-transparent via-orange-500/60 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

      <div className="mb-4 flex items-center justify-between">
        <span className="text-[10px] font-semibold tracking-[0.18em] text-white/40">
          {mode.tag}
        </span>
        <span className="text-xs font-medium tabular-nums text-white/25">
          {mode.number}
        </span>
      </div>

      <div className="mb-6 rounded-xl border border-white/[0.07] bg-black/60 p-2.5 sm:p-3">
        <ModePreview type={mode.preview} />
      </div>

      <div className="flex items-center gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-orange-500/30 bg-orange-500/8 text-orange-400 transition-colors group-hover:bg-orange-500/15">
          <Icon size={21} strokeWidth={1.8} />
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-white sm:text-xl">
          {mode.title}
        </h3>
      </div>

      <p className="mt-4 flex-1 text-sm leading-7 text-white/55">
        {mode.description}
      </p>

      <a
        href="#get-started"
        className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-medium text-orange-400 transition-colors hover:text-orange-300"
      >
        {mode.action}
        <ArrowRight
          size={16}
          className="transition-transform duration-200 group-hover:translate-x-1"
        />
      </a>
    </article>
  );
}

export default function PracticeModes() {
  return (
    <section
      id="features"
      aria-labelledby="practice-modes-heading"
      className="relative overflow-hidden bg-[#050505] px-5 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28"
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-white/[0.07]" />

      <div className="relative mx-auto max-w-310">
        <header className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <span className="inline-flex items-center gap-2 rounded-full border border-orange-500/30 bg-orange-500/6 px-4 py-2 text-[10px] font-semibold tracking-[0.2em] text-orange-400 sm:text-xs">
            <Zap size={13} />
            PRACTICE MODES
          </span>

          <h2
            id="practice-modes-heading"
            className="mt-6 text-3xl font-semibold leading-tight tracking-[-0.04em] text-white sm:text-4xl lg:text-5xl"
          >
            One market.
            <br className="sm:hidden" />{" "}
            <span className="text-orange-500">Different ways</span> to compete.
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-white/55 sm:text-base">
            Practice on your own, compete with friends, or learn through guided
            sessions. Build better decisions, one trade at a time.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
          {modes.map((mode) => (
            <PracticeCard key={mode.number} mode={mode} />
          ))}
        </div>

      </div>
    </section>
  );
}
