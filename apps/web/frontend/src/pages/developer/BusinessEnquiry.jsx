import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Building2, Database, Handshake, Layers3, LockKeyhole, Megaphone, ShieldCheck } from "lucide-react";
import logo from "../../assets/logo.png";
import Footer from "../landing/footer/Footer";

const pillars = [
  { icon: Layers3, title: "White-Label Solutions", description: "Deploy chart processing and matching workflows under your own brand, tailored to your product and operating model." },
  { icon: Database, title: "Data Streams & Licensing", description: "Discuss access to chart data, backtesting datasets, and synthetic engine telemetry for approved commercial use." },
  { icon: Handshake, title: "Strategic Partnerships", description: "Explore institutional initiatives, co-branded products, and long-term technical or commercial ventures." },
  { icon: Megaphone, title: "Brand Sponsorships", description: "Evaluate relevant sponsorships and premium placements across suitable ChartWars platform surfaces." },
];
const roles = ["Founder / Co-founder", "Managing Director", "Investment Partner", "Head of Product", "Engineering / Technology Lead", "Business Development", "Other"];
const intents = ["Enterprise Licensing", "Custom Infrastructure", "Strategic Investment", "Media & Sponsorship", "Data Licensing", "Strategic Partnership"];
const scales = ["Tier-1 Institutional", "Growth Scale", "Early-stage / Pilot", "Custom Partnership", "To be determined"];
const inputClass = "mt-2 w-full rounded-md border border-white/[0.09] bg-[#080b10] px-4 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 focus:border-slate-400/70 focus:ring-2 focus:ring-white/[0.04]";

function Brand() {
  return <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="ChartWars home">
    <img src={logo} alt="ChartWars logo" className="h-8 w-8 object-contain" />
    <span className="text-sm font-black tracking-[0.2em] text-white sm:text-base">CHARTWARS</span>
  </Link>;
}
function Field({ label, children }) {
  return <label className="block min-w-0 text-[10px] font-semibold uppercase tracking-[0.13em] text-slate-300">{label}{children}</label>;
}

export default function BusinessEnquiry() {
  const [entity, setEntity] = useState("");
  const [role, setRole] = useState("");
  const [intent, setIntent] = useState("");
  const [scale, setScale] = useState("");
  const [brief, setBrief] = useState("");
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("idle");

  function handleSubmit(event) {
    event.preventDefault();
    setStatus("idle");
    if (!entity.trim() || !role || !intent || !scale || !brief.trim() || !email.trim()) {
      setStatus("error");
      return;
    }
    if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email.trim())) {
      setStatus("email");
      return;
    }
    // Frontend-only acknowledgement. Connect a secure backend before collecting real enquiries.
    setStatus("demo");
  }

  return <div className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-slate-300/20 selection:text-white">
    <header className="sticky top-0 z-40 border-b border-white/8 bg-[#05070a]/95 backdrop-blur-xl">
      <div className="flex h-18 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
        <Brand />
        <span className="hidden items-center gap-2 rounded-md border border-white/10 px-3.5 py-2 text-[11px] font-medium text-slate-400 sm:inline-flex"><Building2 size={14} /> BUSINESS OPERATIONS</span>
      </div>
    </header>

    <main className="mx-auto grid w-full max-w-[1600px] gap-10 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-10 lg:px-12 xl:gap-14 xl:px-16">
      <section className="min-w-0 lg:pt-3">
        <div className="mb-6 flex items-center gap-3"><span className="h-px w-7 bg-slate-400" /><span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">Enterprise · Business Operations</span><span className="h-px max-w-20 flex-1 bg-white/13" /></div>
        <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl xl:text-[58px]">Strategic Partnerships.<br /><span className="text-slate-400">Real Commercial Value.</span></h1>
        <p className="mt-5 max-w-xl text-sm leading-7 text-slate-400 sm:text-base">Enterprise infrastructure, commercial data access, and strategic partnerships — through one dedicated business channel.</p>

        <div className="mt-8 grid gap-3 sm:grid-cols-2">
          {pillars.map(({ icon: Icon, title, description }) => <article key={title} className="rounded-lg border border-white/9 bg-[#080b10] p-5 transition-colors hover:border-white/17">
            <div className="flex h-10 w-10 items-center justify-center rounded-md border border-white/12 bg-white/2.5 text-slate-200"><Icon size={19} strokeWidth={1.7} /></div>
            <h2 className="mt-4 text-sm font-semibold text-white sm:text-base">{title}</h2>
            <p className="mt-2 text-xs leading-6 text-slate-400 sm:text-[13px]">{description}</p>
          </article>)}
        </div>

        <div className="mt-6 border-t border-white/12 pt-5"><div className="flex items-start gap-3">
          <ShieldCheck size={23} className="mt-0.5 shrink-0 text-slate-300" strokeWidth={1.5} />
          <div><p className="text-sm font-medium text-slate-200">Direct business intake</p><p className="mt-1 text-xs leading-6 text-slate-500">Qualified commercial enquiries can be routed to the business operations team once the submission backend is connected.</p></div>
        </div></div>
      </section>

      <section className="min-w-0 rounded-xl border border-white/12 bg-[#080b10] p-5 sm:p-7 lg:p-8 xl:p-9">
        <div className="flex items-start gap-4 border-b border-white/9 pb-6">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md border border-white/12 bg-white/2.5 text-slate-200"><Building2 size={21} strokeWidth={1.6} /></div>
          <div><p className="text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">Commercial intake / 01</p><h2 className="mt-1.5 text-xl font-semibold tracking-tight text-white sm:text-2xl">Commercial Intake Router</h2><p className="mt-2 text-xs leading-6 text-slate-400 sm:text-sm">Share the essentials so the right commercial conversation can begin.</p></div>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Corporate entity name *"><input value={entity} onChange={e => setEntity(e.target.value)} className={inputClass} placeholder="Registered company / institution" autoComplete="organization" required /></Field>
            <Field label="Designation / authority *"><select value={role} onChange={e => setRole(e.target.value)} className={inputClass} required><option value="">Select your role</option>{roles.map(item => <option key={item} value={item} className="bg-[#080b10]">{item}</option>)}</select></Field>
          </div>
          <Field label="Business contact email *"><input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} placeholder="you@company.com" autoComplete="email" required /></Field>
          <Field label="Commercial intent *"><select value={intent} onChange={e => setIntent(e.target.value)} className={inputClass} required><option value="">Select commercial intent</option>{intents.map(item => <option key={item} value={item} className="bg-[#080b10]">{item}</option>)}</select></Field>
          <Field label="Estimated deployment scale / budget range *"><select value={scale} onChange={e => setScale(e.target.value)} className={inputClass} required><option value="">Select scale / partnership tier</option>{scales.map(item => <option key={item} value={item} className="bg-[#080b10]">{item}</option>)}</select></Field>
          <Field label="Brief requirements payload *"><textarea value={brief} onChange={e => setBrief(e.target.value)} className={`${inputClass} min-h-36 resize-y leading-6`} placeholder="Outline your objectives, requirements, expected timeline, and relevant technical or commercial context." maxLength={2000} required /><span className="mt-1 block text-right text-[10px] font-normal normal-case tracking-normal text-slate-600">{brief.length.toLocaleString()} / 2,000</span></Field>

          {status !== "idle" && <div role="status" className={`rounded-md border px-4 py-3 text-xs leading-5 ${status === "demo" ? "border-white/15 bg-white/4 text-slate-200" : "border-red-400/25 bg-red-400/5 text-red-200"}`}>
            {status === "demo" ? "Form validated locally. No enquiry has been sent or stored yet; connect a secure backend to enable real submissions." : status === "email" ? "Please enter a valid business email address." : "Please complete all required fields before continuing."}
          </div>}

          <button type="submit" className="group flex w-full items-center justify-center gap-3 rounded-md border border-white/18 bg-[#151b24] px-5 py-4 text-xs font-semibold tracking-[0.035em] text-white transition hover:border-white/3 hover:bg-[#1b2430] focus:outline-none focus:ring-2 focus:ring-white/12">Initiate Commercial Evaluation<ArrowRight size={16} className="transition-transform group-hover:translate-x-1" /></button>
          <div className="flex items-start justify-center gap-2 pt-1 text-center"><LockKeyhole size={13} className="mt-0.5 shrink-0 text-slate-500" /><p className="max-w-lg text-[10px] leading-5 text-slate-500">Demo form only. Do not submit confidential information until a secure, verified submission channel is available.</p></div>
        </form>
      </section>
    </main>

    <footer className="border-t border-white/9"><div className="mx-auto flex max-w-[1600px] flex-col gap-3 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12 xl:px-16"><Brand /><p className="text-[9px] font-medium uppercase tracking-[0.18em] text-slate-600">Built for serious commercial conversations</p></div></footer>
    <Footer />
  </div>;
}
