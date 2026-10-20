import {
  ArrowUpRight,
  EyeOff,
  Gamepad2,
  LockKeyhole,
  Users,
} from "lucide-react";
import Container from "../../../components/ui/Container";
import SectionHeading from "../components/SectionHeading";

const modes = [
  {
    number: "01",
    title: "Solo Replay",
    description:
      "Replay historical price action candle by candle and practise entries, exits, and risk control.",
    icon: Gamepad2,
    label: "Explore replay",
    href: "/markets",
    status: "Practice mode",
  },
  {
    number: "02",
    title: "Friend Room",
    description:
      "Bring your friends into a shared session and compare decisions in a collaborative environment.",
    icon: Users,
    label: "Explore rooms",
    href: "/rooms",
    status: "Multiplayer",
  },
  {
    number: "03",
    title: "Vs Coach",
    description:
      "Challenge a rule-based strategy opponent and examine how your decisions compare.",
    icon: Gamepad2,
    label: "Meet the coach",
    href: "/coach",
    status: "Strategy practice",
  },
  {
    number: "04",
    title: "Blind Round",
    description:
      "Make decisions before the hidden market outcome is revealed. Focus on process, not hindsight.",
    icon: EyeOff,
    label: "Coming soon",
    href: "/blind-round",
    status: "Coming soon",
    disabled: true,
  },
];

export default function PracticeModes() {
  return (
    <section id="modes" className="cw-section scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="01 / Practice modes"
          title="Four ways to practise."
          description="Choose a format that matches your goals — from solo learning to competitive sessions with friends."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {modes.map((mode) => {
            const Icon = mode.icon;

            return (
              <article
                key={mode.number}
                className="cw-card group flex cw-practice-card flex-col p-5 sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center border border-[#26343e] text-[#00e887]">
                    <Icon size={19} />
                  </span>

                  <span className="text-[10px] uppercase tracking-wider text-[#8193a5]">
                    {mode.number}
                  </span>
                </div>

                <div className="mt-6">
                  <p className="cw-eyebrow">{mode.status}</p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {mode.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-[#8c9bad]">
                    {mode.description}
                  </p>
                </div>

                <div className="mt-auto pt-6">
                  {mode.disabled ? (
                    <span className="inline-flex items-center gap-2 text-sm text-[#8193a5]">
                      <LockKeyhole size={15} />
                      {mode.label}
                    </span>
                  ) : (
                    <a
                      href={mode.href}
                      className="inline-flex items-center gap-2 text-sm font-semibold text-[#00e887] transition group-hover:gap-3"
                    >
                      {mode.label}
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}