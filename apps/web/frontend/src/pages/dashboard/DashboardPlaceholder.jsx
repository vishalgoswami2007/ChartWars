import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function DashboardPlaceholder({
  eyebrow = "CHARTWARS",
  title,
  description,
}) {
  return (
    <main className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-7 sm:py-10 lg:px-9">
      <div className="rounded-2xl border border-white/8 bg-[#0d0d0d] p-6 sm:p-10">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#e87524]">
          {eyebrow}
        </p>

        <h1 className="mt-3 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>

        <p className="mt-3 max-w-xl text-sm leading-6 text-zinc-400">
          {description}
        </p>

        <Link
          to="/dashboard"
          className="mt-7 inline-flex items-center gap-2 rounded-lg border border-white/12 px-4 py-3 text-xs font-medium text-zinc-200 transition hover:border-[#e87524]/40 hover:text-white"
        >
          Back to dashboard
          <ArrowRight size={14} />
        </Link>
      </div>
    </main>
  );
}