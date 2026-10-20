import { Activity, ArrowDownRight, ArrowUpRight, Target } from "lucide-react";
import Container from "../../../components/ui/Container";
import SectionHeading from "../components/SectionHeading";

const metrics = [
  { label: "Win rate", value: "—", note: "Calculated from completed trades" },
  { label: "Risk-to-reward", value: "—", note: "Compared across positions" },
  { label: "Maximum drawdown", value: "—", note: "Track downside exposure" },
];

const bars = [32, 48, 40, 61, 50, 72, 58, 79, 68, 91, 75, 100];

export default function PerformanceSection() {
  return (
    <section id="performance" className="cw-section scroll-mt-20">
      <Container>
        <SectionHeading
          eyebrow="03 / Performance"
          title="Measure your decisions, not just your returns."
          description="A useful practice session should show more than whether a trade won or lost."
        />

        <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
          <div className="cw-card p-5 sm:p-7">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm font-semibold text-white">
                  Performance overview
                </p>
                <p className="mt-1 text-xs text-[#8193a5]">
                  Illustrative visual · Not actual user results
                </p>
              </div>

              <Activity size={20} className="text-[#00e887]" />
            </div>

            <div className="mt-8 flex h-40 items-end gap-2 border-b border-l border-[#26313b] px-3 pb-0 sm:gap-3">
              {bars.map((height, index) => (
                <div
                  key={index}
                  className="flex-1 bg-[#00e887]/70 transition hover:bg-[#00e887]"
                  style={{ height: `${height}%` }}
                />
              ))}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-[#8193a5]">
              <span>Session start</span>
              <span>Session end</span>
            </div>

            <div className="mt-6 flex flex-wrap gap-4 border-t border-[#202a33] pt-5">
              <span className="flex items-center gap-2 text-xs text-[#b6c2cd]">
                <ArrowUpRight size={15} className="text-[#00e887]" />
                Consistent execution
              </span>
              <span className="flex items-center gap-2 text-xs text-[#b6c2cd]">
                <ArrowDownRight size={15} className="text-[#ff5364]" />
                Downside awareness
              </span>
            </div>
          </div>

          <div className="grid gap-3">
            {metrics.map((metric) => (
              <div key={metric.label} className="cw-card p-5">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-sm text-[#b8c4cf]">{metric.label}</p>
                  <Target size={16} className="text-[#00e887]" />
                </div>

                <p className="mt-3 text-3xl font-semibold tracking-tight text-white">
                  {metric.value}
                </p>

                <p className="mt-2 text-xs leading-5 text-[#8193a5]">
                  {metric.note}
                </p>
              </div>
            ))}

            <p className="text-xs leading-5 text-[#718194]">
              Metrics will populate when simulation and reporting functionality
              is implemented.
            </p>
          </div>
        </div>
      </Container>
    </section>
  );
}