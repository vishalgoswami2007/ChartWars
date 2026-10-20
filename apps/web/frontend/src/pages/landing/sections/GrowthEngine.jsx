
import { useState } from "react";

const ArrowIcon = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12h14" />
    <path d="m12 5 7 7-7 7" />
  </svg>
);

const CheckIcon = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="m5 12 4 4L19 6" />
  </svg>
);

const benefits = {
  b2c: [
    "Learn market concepts at your own pace",
    "Practice with interactive trading experiences",
    "Track progress and build better habits",
  ],
  b2b: [
    "Discuss market-data API integrations",
    "Explore simulations and learning infrastructure",
    "Collaborate on enterprise solutions",
  ],
};

function GrowthCard({ type, onSelect }) {
  const isB2C = type === "b2c";

  return (
    <div
      className={`group relative flex h-full flex-col overflow-hidden rounded-3xl border p-6 sm:p-8 lg:p-9 ${
        isB2C
          ? "border-orange-500/30 bg-[#11100e]"
          : "border-white/10 bg-[#0c0d0f]"
      }`}
    >
      <div
        className={`pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full blur-[90px] ${
          isB2C ? "bg-orange-500/10" : "bg-white/4"
        }`}
      />

      <div className="relative flex items-center justify-between">
        <span
          className={`rounded-full border px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.2em] ${
            isB2C
              ? "border-orange-400/30 bg-orange-400/10 text-orange-300"
              : "border-white/15 bg-white/4 text-gray-300"
          }`}
        >
          {isB2C ? "01 / Community" : "02 / Business"}
        </span>

        <span
          className={`flex h-11 w-11 items-center justify-center rounded-xl border ${
            isB2C
              ? "border-orange-400/20 bg-orange-400/10 text-orange-400"
              : "border-white/10 bg-white/4 text-gray-200"
          }`}
        >
          {isB2C ? (
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6">
              <circle cx="9" cy="8" r="3.5" />
              <path d="M3 20v-1.5A5.5 5.5 0 0 1 8.5 13h1A5.5 5.5 0 0 1 15 18.5V20" />
              <path d="M16 5.5a3.5 3.5 0 0 1 0 6.8M18 14a5 5 0 0 1 3 4.5V20" />
            </svg>
          ) : (
            <svg width="23" height="23" viewBox="0 0 24 24" fill="none"
              stroke="currentColor" strokeWidth="1.6">
              <rect x="3" y="7" width="18" height="13" rx="2" />
              <path d="M8 7V4h8v3M3 12h18M10 12v2h4v-2" />
            </svg>
          )}
        </span>
      </div>

      <div className="relative mt-9">
        <p className="text-xs font-semibold uppercase tracking-[0.22em] text-gray-500">
          {isB2C ? "For individual traders & learners" : "For teams & businesses"}
        </p>

        <h3 className="mt-4 text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">
          {isB2C ? (
            <>Learn. Practice.<br /><span className="text-orange-400">Improve.</span></>
          ) : (
            <>Build with<br /><span className="text-gray-300">ChartWars.</span></>
          )}
        </h3>

        <p className="mt-4 max-w-md text-sm leading-7 text-gray-400 sm:text-base">
          {isB2C
            ? "Get early access to a new way of learning markets, practising strategies and tracking your progress."
            : "Explore potential API integrations, market-learning infrastructure and tailored partnerships with our team."}
        </p>
      </div>

      <div className="relative my-8 h-px bg-white/8" />

      <ul className="relative space-y-4">
        {benefits[type].map((benefit) => (
          <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-gray-300">
            <span className={`mt-0.5 ${isB2C ? "text-orange-400" : "text-gray-400"}`}>
              <CheckIcon />
            </span>
            {benefit}
          </li>
        ))}
      </ul>

      <div className="relative mt-auto pt-9">
        <button
          type="button"
          onClick={onSelect}
          className={`flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 text-sm font-bold transition duration-200 ${
            isB2C
              ? "bg-orange-500 text-black hover:bg-orange-400"
              : "border border-white/15 bg-white/4 text-white hover:border-white/30 hover:bg-white/8"
          }`}
        >
          {isB2C ? "GET EARLY ACCESS" : "EXPLORE PARTNERSHIPS"}
          <ArrowIcon />
        </button>

        <p className="mt-3 text-center text-xs text-gray-600">
          {isB2C ? "Be part of the early community" : "Let's explore what's possible"}
        </p>
      </div>
    </div>
  );
}

export default function GrowthEngine() {
  const [activeForm, setActiveForm] = useState("");
  const [experience, setExperience] = useState("Beginner");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [businessEmail, setBusinessEmail] = useState("");
  const [useCase, setUseCase] = useState("API integration");
  const [message, setMessage] = useState("");

  const openForm = (type) => {
    setActiveForm(type);
    setMessage("");
    setTimeout(() => {
      document.getElementById("growth-form")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 50);
  };

  const handleB2C = (event) => {
    event.preventDefault();
    setMessage(
      "Form validated! Connect your backend to securely save this early-access signup."
    );
  };

  const handleB2B = (event) => {
    event.preventDefault();
    setMessage(
      "Form validated! Connect your backend to send this partnership inquiry to your team."
    );
  };

  return (
    <section
      id="growth-engine"
      className="relative overflow-hidden bg-[#050505] px-4 py-20 sm:px-6 sm:py-28 lg:px-8"
    >
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-0 h-px w-4/5 -translate-x-1/2 bg-linear-to-r from-transparent via-white/10 to-transparent" />
        <div className="absolute left-1/2 top-40 h-72 w-72 -translate-x-1/2 rounded-full bg-orange-500/6 blur-[120px]" />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <div className="mx-auto mb-12 max-w-2xl text-center sm:mb-16">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/6 px-4 py-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-orange-300">
              The ChartWars Growth Engine
            </span>
          </div>

          <h2 className="text-4xl font-semibold leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
            One Platform.
            <br />
            <span className="text-orange-400">Two Ways to Grow.</span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-400 sm:text-base">
            Whether you're exploring the markets or building market-focused
            products, find your place in the ChartWars ecosystem.
          </p>
        </div>

        <div className="grid gap-5 lg:grid-cols-2 lg:gap-6">
          <GrowthCard type="b2c" onSelect={() => openForm("b2c")} />
          <GrowthCard type="b2b" onSelect={() => openForm("b2b")} />
        </div>

        {activeForm && (
          <div
            id="growth-form"
            className="mx-auto mt-8 max-w-2xl rounded-3xl border border-white/10 bg-[#0c0c0c] p-6 sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">
                  {activeForm === "b2c" ? "Early access" : "Business inquiry"}
                </p>
                <h3 className="mt-2 text-2xl font-semibold text-white">
                  {activeForm === "b2c"
                    ? "Join the ChartWars community"
                    : "Let's explore a partnership"}
                </h3>
                <p className="mt-2 text-sm leading-6 text-gray-400">
                  {activeForm === "b2c"
                    ? "Tell us where to reach you and your current experience level."
                    : "Share a few details so your partnership request has context."}
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setActiveForm("");
                  setMessage("");
                }}
                aria-label="Close form"
                className="rounded-lg border border-white/10 px-3 py-2 text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {activeForm === "b2c" ? (
              <form onSubmit={handleB2C} className="space-y-5">
                <div>
                  <label htmlFor="early-email" className="mb-2 block text-sm text-gray-300">
                    Email address
                  </label>
                  <input
                    id="early-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none transition placeholder:text-gray-600 focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label htmlFor="experience" className="mb-2 block text-sm text-gray-300">
                    Trading experience
                  </label>
                  <select
                    id="experience"
                    value={experience}
                    onChange={(e) => setExperience(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3.5 text-white outline-none focus:border-orange-400/60"
                  >
                    <option>Beginner</option>
                    <option>Intermediate</option>
                    <option>Experienced</option>
                  </select>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 px-5 py-4 text-sm font-bold text-black transition hover:bg-orange-400">
                  JOIN EARLY ACCESS <ArrowIcon />
                </button>
              </form>
            ) : (
              <form onSubmit={handleB2B} className="space-y-5">
                <div>
                  <label htmlFor="company" className="mb-2 block text-sm text-gray-300">
                    Company or organization
                  </label>
                  <input
                    id="company"
                    required
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Your company name"
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label htmlFor="business-email" className="mb-2 block text-sm text-gray-300">
                    Work email
                  </label>
                  <input
                    id="business-email"
                    type="email"
                    required
                    value={businessEmail}
                    onChange={(e) => setBusinessEmail(e.target.value)}
                    placeholder="you@company.com"
                    className="w-full rounded-xl border border-white/10 bg-white/3 px-4 py-3.5 text-white outline-none placeholder:text-gray-600 focus:border-orange-400/60"
                  />
                </div>

                <div>
                  <label htmlFor="use-case" className="mb-2 block text-sm text-gray-300">
                    What would you like to explore?
                  </label>
                  <select
                    id="use-case"
                    value={useCase}
                    onChange={(e) => setUseCase(e.target.value)}
                    className="w-full rounded-xl border border-white/10 bg-[#111] px-4 py-3.5 text-white outline-none focus:border-orange-400/60"
                  >
                    <option>API integration</option>
                    <option>Market data solutions</option>
                    <option>Learning & simulation tools</option>
                    <option>Strategic partnership</option>
                    <option>Other collaboration</option>
                  </select>
                </div>

                <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/15 bg-black text-white text-sm font-bold  transition hover:bg-gray-20">
                  SEND PARTNERSHIP INTEREST <ArrowIcon />
                </button>
              </form>
            )}

            {message && (
              <p
                role="status"
                className="mt-5 rounded-xl border border-orange-400/20 bg-orange-400/6 p-4 text-sm leading-6 text-orange-200"
              >
                {message}
              </p>
            )}

          </div>
        )}

        <div className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-xs text-gray-600">
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
            Built for learners
          </span>
          <span className="hidden h-3 w-px bg-white/10 sm:block" />
          <span className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-gray-500" />
            Open to business collaboration
          </span>
        </div>
      </div>
    </section>
  );
}
