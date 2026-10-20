import { ShieldCheck } from "lucide-react";

export default function EducationalDisclaimer() {
  return (
    <div className="border-t border-[#202a33] px-4 py-6 text-center">
      <div className="mx-auto flex max-w-3xl items-center justify-center gap-2 text-xs font-semibold text-[#c1ccd6]">
        <ShieldCheck size={15} className="shrink-0 text-[#00e887]" />
        <span>Educational purposes only. Not investment advice.</span>
      </div>

      <p className="mx-auto mt-3 max-w-3xl text-xs leading-6 text-[#718194]">
        ChartWars is a trading simulation and educational practice platform.
        It does not execute real-money trades or provide financial advice.
        Simulated results do not guarantee future performance.
      </p>

      <p className="mt-4 text-[11px] text-[#657586]">
        © {new Date().getFullYear()} ChartWars. All rights reserved.
      </p>
    </div>
  );
}