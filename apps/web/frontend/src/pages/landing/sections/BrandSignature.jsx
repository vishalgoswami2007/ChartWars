import Container from "../../../components/ui/Container";

export default function BrandSignature() {
  return (
    <section className="cw-brand-glow overflow-hidden border-t border-[#202a33]">
      <Container>
        <div className="py-12 text-center sm:py-16 lg:py-20">
          <p className="cw-eyebrow mb-5">PRACTICE WITH PURPOSE</p>

          <h2
            aria-label="ChartWars"
            className="cw-brand-gradient whitespace-nowrap text-[clamp(2.8rem,12vw,10rem)] font-black leading-none tracking-[-0.085em]"
          >
            CHARTWARS
          </h2>

          <p className="mt-6 text-xs font-semibold tracking-[0.14em] text-[#c2cdd6] sm:text-sm sm:tracking-[0.22em]">
            READ THE CHART. RESPECT THE RISK.
          </p>

          <p className="mt-3 text-xs text-[#718194] sm:text-sm">
            Learn deliberately. Trade virtually. Improve continuously.
          </p>
        </div>
      </Container>
    </section>
  );
}