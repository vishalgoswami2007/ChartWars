
import dashboardImage from "../../../assets/laptop-phone.png";

export default function DashboardPreview() {
  return (
    <section className="relative z-10 mx-auto w-full max-w-360 px-6 pb-24 sm:px-10 lg:px-16">
      <div className="grid items-center gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        {/* Left: Text */}
        <div className="max-w-xl">
          <p className="mb-5 text-xs font-semibold uppercase tracking-[0.25em] text-orange-500 sm:text-sm">
            Your trading workspace
          </p>

          <h2 className="text-3xl font-bold leading-tight text-white sm:text-4xl lg:text-5xl">
            Your next move.
            <br />
            <span className="text-white/60">Your dashboard.</span>
          </h2>

          <p className="mt-5 max-w-md text-base leading-7 text-white/65 sm:text-lg">
            Explore your trading workspace on desktop or phone. Practise with
            virtual money, review your decisions, and improve your strategy.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
              Desktop view
            </span>
            <span className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80">
              Mobile view
            </span>
          </div>
        </div>

        {/* Right: Dashboard image */}
        <div className="relative">
          <div className="absolute -inset-3 rounded-3xl border border-orange-500/40" />

          <div className="relative overflow-hidden rounded-2xl border border-orange-500/70 bg-[#080808] shadow-[0_0_50px_rgba(249,115,22,0.10)]">
            <img
              src={dashboardImage}
              alt="ChartWars trading dashboard shown on desktop and mobile"
              className="block h-auto w-full object-contain"
              loading="lazy"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
