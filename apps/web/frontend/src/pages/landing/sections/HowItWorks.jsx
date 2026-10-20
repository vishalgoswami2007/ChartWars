import { ArrowRight, ChartNoAxesCombined, ShieldCheck, UserRound } from "lucide-react";
import Container from "../../../components/ui/Container";
import SectionHeading from "../components/SectionHeading";

const steps = [
  {
    number: "01",
    title: "Choose your session",
    description:
      "Pick a practice mode, select a market, and prepare your trading setup.",
    icon: UserRound,
  },
  {
    number: "02",
    title: "Practise with virtual funds",
    description:
      "Make simulated trades, manage risk, and work through changing market conditions.",
    icon: ShieldCheck,
  },
  {
    number: "03",
    title: "Review and improve",
    description:
      "Analyse your decisions, inspect your results, and identify habits to improve.",
    icon: ChartNoAxesCombined,
  },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="cw-section scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="02 / The process"
          title="A better process starts with three steps."
          description="Turn market practice into a repeatable learning routine."
        />

        <div className="grid gap-4 lg:grid-cols-3">
          {steps.map((step, index) => {
            const Icon = step.icon;

            return (
              <article key={step.number} className="cw-card p-6 sm:p-8">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-semibold tracking-tight text-[#00e887]">
                    {step.number}
                  </span>
                  <Icon size={24} className="text-[#8193a5]" />
                </div>

                <div className="mt-8 h-px bg-[#26313b]" />

                <h3 className="mt-6 text-xl font-semibold text-white">
                  {step.title}
                </h3>

                <p className="mt-3 text-sm leading-7 text-[#8c9bad]">
                  {step.description}
                </p>

                {index < steps.length - 1 && (
                  <div className="mt-6 hidden items-center gap-2 text-xs text-[#8193a5] lg:flex">
                    Continue <ArrowRight size={14} />
                  </div>
                )}
              </article>
            );
          })}
        </div>
      </Container>
    </section>
  );
}