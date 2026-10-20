
import { useEffect, useState } from "react";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronRight,
  CirclePlay,
  Crown,
  RotateCcw,
  ShieldCheck,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";

const steps = [
  {
    number: "01",
    title: "Login / Sign up",
    description:
      "Create your account or log in to enter the world of ChartWars.",
    label: "YOUR JOURNEY STARTS",
  },
  {
    number: "02",
    title: "Join a room",
    description:
      "Find an online friend, send an invite, and enter the same battle room.",
    label: "CHOOSE YOUR OPPONENT",
  },
  {
    number: "03",
    title: "Trade & compete",
    description:
      "Read the chart, make your move, and compete against your friend.",
    label: "MAKE YOUR MOVE",
  },
  {
    number: "04",
    title: "Win & repeat",
    description:
      "Celebrate the win, collect your reward, and jump into the next battle.",
    label: "CLAIM YOUR VICTORY",
  },
];

function MiniChart({ active }) {
  const candles = [
    [22, 34, true],
    [32, 25, false],
    [28, 43, true],
    [44, 36, false],
    [39, 55, true],
    [54, 42, true],
    [47, 31, false],
    [34, 47, true],
    [49, 28, false],
    [42, 39, true],
    [58, 33, true],
    [51, 45, false],
    [38, 26, true],
    [31, 41, false],
    [46, 30, true],
    [56, 40, true],
    [43, 24, false],
    [35, 32, true],
    [49, 38, false],
    [59, 29, true],
  ];

  return (
    <div className="relative h-32 overflow-hidden rounded-xl border border-white/[0.07] bg-[#080a0c] p-3">
      <div
        className="absolute inset-0 opacity-30"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.07) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.07) 1px,transparent 1px)",
          backgroundSize: "24px 24px",
        }}
      />
      <div className="relative z-10 flex items-start justify-between">
        <div>
          <p className="text-[10px] text-neutral-500">BTC / USDT</p>
          <p className="mt-1 text-sm font-semibold text-white">
            $67,482.90
          </p>
        </div>
        <span className="rounded-md bg-emerald-400/10 px-2 py-1 text-[10px] text-emerald-400">
          +2.48%
        </span>
      </div>

      <div className="absolute inset-x-3 bottom-3 top-12 flex items-end justify-between gap-1">
        {candles.map(([height, wick, green], i) => (
          <div
            key={i}
            className="relative flex h-full flex-1 items-center justify-center"
          >
            <div
              className={`absolute w-px ${
                green ? "bg-emerald-400/70" : "bg-red-400/70"
              }`}
              style={{
                height: `${Math.min(wick + 15, 90)}%`,
                bottom: `${Math.max(0, height - 35)}%`,
              }}
            />
            <div
              className={`relative z-10 w-full max-w-1.25 rounded-[1px] ${
                green ? "bg-emerald-400" : "bg-red-400"
              }`}
              style={{ height: `${height}%` }}
            />
          </div>
        ))}
      </div>

      {active && (
        <div className="absolute bottom-3 right-3 z-20 rounded-md border border-orange-400/30 bg-black/90 px-2 py-1 text-[9px] text-orange-300">
          LIVE BATTLE
        </div>
      )}
    </div>
  );
}

function PhoneScreen({ step, onRestart }) {
  return (
    <div className="relative mx-auto w-full max-w-67.5">
      <div className="absolute -inset-5 rounded-[55px] bg-orange-500/9 blur-3xl" />

      <div className="relative rounded-[38px] border border-white/20 bg-[#111214] p-1.75 shadow-[0_0_0_1px_rgba(255,125,0,0.12),0_25px_90px_rgba(255,102,0,0.12)]">
        <div className="relative min-h-122.5 overflow-hidden rounded-[31px] border border-white/6 bg-[#08090b] px-4 pb-5 pt-5">
          <div className="absolute left-1/2 top-2 h-4.25 w-19 -translate-x-1/2 rounded-full bg-black ring-1 ring-white/10" />

          <div className="mt-5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-orange-400/30 bg-orange-400/10">
                <Swords size={16} className="text-orange-400" />
              </div>
              <span className="text-[11px] font-black tracking-[0.18em] text-white">
                CHART<span className="text-orange-400">WARS</span>
              </span>
            </div>
            <span className="text-[9px] text-neutral-500">
              STEP {step + 1}/4
            </span>
          </div>

          <div className="mt-7">
            {step === 0 && (
              <div className="animate-[fadeIn_.35s_ease-out]">
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-orange-400">
                  Welcome to the arena
                </p>
                <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
                  Your next
                  <br />
                  battle starts here.
                </h3>
                <p className="mt-2 text-xs leading-5 text-neutral-500">
                  Learn the charts. Challenge your friends. Earn your rank.
                </p>

                <div className="mt-7 space-y-3">
                  <div className="rounded-xl border border-white/10 bg-white/3 px-3 py-3 text-xs text-neutral-500">
                    Email address
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/3 px-3 py-3 text-xs text-neutral-500">
                    Password
                  </div>
                  <div className="flex items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-semibold text-black">
                    Enter ChartWars <ArrowRight size={14} />
                  </div>
                </div>

                <p className="mt-4 text-center text-[10px] text-neutral-600">
                  A new battle. A new opportunity.
                </p>
              </div>
            )}

            {step === 1 && (
              <div className="animate-[fadeIn_.35s_ease-out]">
                <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400">
                  Find your opponent
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  Battle rooms<span className="text-orange-400">.</span>
                </h3>
                <p className="mt-1 text-xs text-neutral-500">
                  Friends online · 3 available
                </p>

                <div className="mt-5 space-y-3">
                  {[
                    ["AS", "Alex Smith", "Online"],
                    ["JD", "Jordan Davis", "Online"],
                    ["MK", "Max Kim", "In a match"],
                  ].map(([initials, name, status], i) => (
                    <div
                      key={name}
                      className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/2.5 p-3"
                    >
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-neutral-800 text-[10px] font-semibold text-white">
                        {initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs font-medium text-white">
                          {name}
                        </p>
                        <p
                          className={`mt-1 text-[9px] ${
                            i < 2 ? "text-emerald-400" : "text-neutral-500"
                          }`}
                        >
                          {status}
                        </p>
                      </div>
                      {i < 2 ? (
                        <span className="rounded-lg bg-orange-500 px-2 py-1.5 text-[9px] font-semibold text-black">
                          Invite
                        </span>
                      ) : (
                        <Users size={14} className="text-neutral-600" />
                      )}
                    </div>
                  ))}
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-xl border border-orange-400/20 bg-orange-400/6 p-3">
                  <Check size={14} className="text-orange-400" />
                  <span className="text-[10px] text-neutral-300">
                    Friend invited · Room ready
                  </span>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="animate-[fadeIn_.35s_ease-out]">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.2em] text-orange-400">
                      Match in progress
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">
                      Head to head
                    </h3>
                  </div>
                  <span className="rounded-lg border border-red-400/20 bg-red-400/10 px-2 py-1 text-[9px] text-red-300">
                    LIVE
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-2">
                  <div className="rounded-xl border border-orange-400/20 bg-orange-400/6 p-3">
                    <p className="text-[9px] text-neutral-500">YOU</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      +$240
                    </p>
                    <p className="text-[9px] text-emerald-400">
                      +4.8%
                    </p>
                  </div>
                  <div className="rounded-xl border border-white/10 bg-white/2.5 p-3">
                    <p className="text-[9px] text-neutral-500">ALEX</p>
                    <p className="mt-1 text-lg font-semibold text-white">
                      +$180
                    </p>
                    <p className="text-[9px] text-emerald-400">
                      +3.6%
                    </p>
                  </div>
                </div>

                <div className="mt-4">
                  <MiniChart active />
                </div>

                <p className="mt-4 text-[10px] text-neutral-500">
                  Choose your next move
                </p>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-emerald-500 py-3 text-xs font-semibold text-black">
                    <ArrowUpRight size={15} /> UP
                  </div>
                  <div className="flex items-center justify-center gap-1.5 rounded-xl bg-red-500 py-3 text-xs font-semibold text-white">
                    <ArrowDownRight size={15} /> DOWN
                  </div>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="flex min-h-92.5 animate-[fadeIn_.35s_ease-out] flex-col items-center justify-center text-center">
                <div className="relative flex h-24 w-24 items-center justify-center rounded-full border border-orange-400/30 bg-orange-400/8 shadow-[0_0_50px_rgba(255,115,0,0.12)]">
                  <div className="absolute inset-2 rounded-full border border-orange-400/15" />
                  <Trophy size={38} className="text-orange-400" />
                  <span className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-400 text-black">
                    <Check size={15} />
                  </span>
                </div>

                <p className="mt-7 text-[10px] font-medium uppercase tracking-[0.25em] text-orange-400">
                  Battle complete
                </p>
                <h3 className="mt-2 text-3xl font-semibold tracking-tight text-white">
                  You won<span className="text-orange-400">!</span>
                </h3>
                <p className="mt-2 max-w-50 text-xs leading-5 text-neutral-500">
                  Great match. You outplayed your opponent.
                </p>

                <div className="mt-6 flex w-full items-center justify-between rounded-xl border border-orange-400/20 bg-orange-400/6 px-4 py-3">
                  <div className="text-left">
                    <p className="text-[9px] text-neutral-500">
                      REWARD EARNED
                    </p>
                    <p className="mt-1 text-sm font-semibold text-white">
                      +250 XP
                    </p>
                  </div>
                  <Crown size={22} className="text-orange-400" />
                </div>

                <button
                  onClick={onRestart}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-semibold text-black transition hover:bg-orange-400"
                >
                  Battle again <RotateCcw size={14} />
                </button>

                <p className="mt-3 text-[9px] text-neutral-600">
                  CHARTWARS · PLAY YOUR NEXT MOVE
                </p>
              </div>
            )}
          </div>

          <div className="absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/20" />
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(0);
  const [autoPlay, setAutoPlay] = useState(true);

  useEffect(() => {
    if (!autoPlay) return undefined;

    const timer = setInterval(() => {
      setActiveStep((current) => (current + 1) % steps.length);
    }, 4200);

    return () => clearInterval(timer);
  }, [autoPlay]);

  const selectStep = (index) => {
    setActiveStep(index);
    setAutoPlay(false);
  };

  const restart = () => {
    setActiveStep(0);
    setAutoPlay(true);
  };

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10 lg:py-32"
    >
      <div className="pointer-events-none absolute left-1/2 top-20 -z-10 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/[0.07] blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <div className="grid items-center gap-14 lg:grid-cols-[0.88fr_1.12fr] lg:gap-16">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/30 bg-orange-400/6 px-3 py-1.5 text-[10px] font-semibold tracking-[0.22em] text-orange-400">
              <Zap size={12} />
              HOW IT WORKS
            </div>

            <h2 className="mt-6 max-w-xl text-4xl font-semibold leading-[1.1] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
              From first click
              <br />
              to <span className="text-orange-500">victory.</span>
            </h2>

            <p className="mt-5 max-w-md text-sm leading-7 text-neutral-400 sm:text-base">
              Create your account, challenge your friends, battle the charts,
              and claim your win. Your next trading showdown starts here.
            </p>

            <div className="mt-10 space-y-2">
              {steps.map((step, index) => {
                const selected = activeStep === index;

                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => selectStep(index)}
                    aria-pressed={selected}
                    className={`group w-full rounded-2xl border p-4 text-left transition duration-300 sm:p-5 ${
                      selected
                        ? "border-orange-400/35 bg-orange-400/5.5"
                        : "border-transparent bg-transparent hover:border-white/10 hover:bg-white/2.5"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition ${
                          selected
                            ? "border-orange-400 bg-orange-500 text-black shadow-[0_0_24px_rgba(255,115,0,0.2)]"
                            : "border-white/15 text-neutral-400 group-hover:border-orange-400/40"
                        }`}
                      >
                        {selected ? (
                          <span>{step.number}</span>
                        ) : (
                          step.number
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <div className="flex items-center justify-between gap-3">
                          <h3 className="text-sm font-semibold sm:text-base">
                            {step.title}
                          </h3>
                          <ChevronRight
                            size={17}
                            className={`shrink-0 transition ${
                              selected
                                ? "rotate-90 text-orange-400"
                                : "text-neutral-600"
                            }`}
                          />
                        </div>

                        <p
                          className={`mt-2 text-xs leading-6 sm:text-sm ${
                            selected ? "text-neutral-300" : "text-neutral-500"
                          }`}
                        >
                          {step.description}
                        </p>

                        {selected && (
                          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold tracking-[0.13em] text-orange-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                            {step.label}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Mobile preview expands inside the selected step */}
                    <div
                      className={`grid transition-all duration-300 lg:hidden ${
                        selected
                          ? "mt-4 grid-rows-[1fr] opacity-100"
                          : "grid-rows-[0fr] opacity-0"
                      }`}
                    >
                      <div className="overflow-hidden">
                        <div className="rounded-xl border border-white/10 bg-[#090a0c] p-3">
                          {index === 0 && (
                            <div className="flex items-center gap-3">
                              <ShieldCheck
                                size={28}
                                className="text-orange-400"
                              />
                              <div>
                                <p className="text-xs font-semibold">
                                  Welcome to ChartWars
                                </p>
                                <p className="mt-1 text-[10px] text-neutral-500">
                                  Sign in · Join the arena
                                </p>
                              </div>
                            </div>
                          )}
                          {index === 1 && (
                            <div className="flex items-center gap-3">
                              <Users size={28} className="text-orange-400" />
                              <div>
                                <p className="text-xs font-semibold">
                                  Friend is online
                                </p>
                                <p className="mt-1 text-[10px] text-neutral-500">
                                  Invite sent · Room ready
                                </p>
                              </div>
                            </div>
                          )}
                          {index === 2 && <MiniChart active />}
                          {index === 3 && (
                            <div className="flex items-center gap-3">
                              <Trophy size={28} className="text-orange-400" />
                              <div>
                                <p className="text-xs font-semibold">
                                  Victory unlocked
                                </p>
                                <p className="mt-1 text-[10px] text-neutral-500">
                                  +250 XP · Battle again
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => setAutoPlay((value) => !value)}
              className="mt-5 inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2.5 text-xs text-neutral-400 transition hover:border-orange-400/30 hover:text-white"
            >
              {autoPlay ? (
                <>
                  <CirclePlay size={15} className="text-orange-400" />
                  Auto demo playing
                </>
              ) : (
                <>
                  <CirclePlay size={15} className="text-orange-400" />
                  Play automatic demo
                </>
              )}
            </button>
          </div>

          <div className="relative hidden min-w-0 items-center justify-center lg:flex">
            <div className="pointer-events-none absolute inset-10 rounded-full bg-orange-500/6 blur-[80px]" />

            <div className="relative w-full max-w-135">
              <div className="absolute -left-4 top-1/4 h-px w-16 bg-linear-to-r from-transparent to-orange-400/60" />
              <div className="absolute -right-4 bottom-1/4 h-px w-16 bg-linear-to-l from-transparent to-orange-400/60" />

              <div className="mb-5 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-semibold tracking-[0.2em] text-neutral-500">
                    INTERACTIVE PREVIEW
                  </p>
                  <p className="mt-1 text-xs text-neutral-300">
                    {steps[activeStep].title}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-orange-400" />
                  <span className="text-[9px] tracking-wider text-neutral-400">
                    DEMO MODE
                  </span>
                </div>
              </div>

              <div className="mx-auto max-w-82.5">
                <PhoneScreen step={activeStep} onRestart={restart} />
              </div>

              <div className="mt-6 flex items-center justify-center gap-2">
                {steps.map((step, index) => (
                  <button
                    key={step.number}
                    type="button"
                    aria-label={`Show step ${step.number}: ${step.title}`}
                    aria-pressed={activeStep === index}
                    onClick={() => selectStep(index)}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      activeStep === index
                        ? "w-9 bg-orange-500"
                        : "w-3 bg-white/20 hover:bg-white/40"
                    }`}
                  />
                ))}
              </div>

              <p className="mt-3 text-center text-[10px] text-neutral-600">
                A product walkthrough · Sample interface, not a live match
              </p>
            </div>
          </div>
        </div>

        <div className="mt-20 border-t border-white/9 pt-7 sm:mt-24">
          <div className="grid grid-cols-2 gap-y-6 sm:grid-cols-4">
            {[
              { icon: ShieldCheck, title: "Create account", sub: "Get started" },
              { icon: Users, title: "Invite a friend", sub: "Find your rival" },
              { icon: Swords, title: "Battle the charts", sub: "Make your move" },
              { icon: Trophy, title: "Claim victory", sub: "Play again" },
            ].map(({ icon: Icon, title, sub }, index) => (
              <div key={title} className="flex items-center gap-3 sm:justify-center">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/2.5">
                  <Icon
                    size={17}
                    className={index === 3 ? "text-orange-400" : "text-neutral-300"}
                  />
                </div>
                <div>
                  <p className="text-xs font-medium text-neutral-200">{title}</p>
                  <p className="mt-1 text-[10px] text-neutral-500">{sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
