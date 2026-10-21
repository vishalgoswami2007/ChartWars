import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Activity,
  Boxes,
  Building2,
  Check,
  ChevronRight,
  Cloud,
  Code2,
  Database,
  Gauge,
  GitBranch,
  LockKeyhole,
  Network,
  Server,
  ShieldCheck,
  Workflow,
} from "lucide-react";
import logo from "../../assets/logo.png";
import Footer from "../landing/footer/Footer";

const solutions = [
  {
    number: "01",
    id: "white-label",
    eyebrow: "CORE TECHNOLOGY LICENSING",
    title: "White-Label Simulation Engine",
    description:
      "A configurable simulation layer for brokerages and fintech products that want to deliver branded chart-based experiences without building the entire engine from scratch.",
    audience: "Neo-brokers · Fintech apps",
    delivery: "SDK · UI wrappers · REST APIs",
    features: [
      "Configurable asset onboarding for supported market feeds",
      "WebSocket-based event delivery architecture",
      "Deployment options designed around regional requirements",
    ],
    icon: Boxes,
    diagram: [
      { label: "Client product", sub: "Your brand", icon: Code2 },
      { label: "API gateway", sub: "Auth · routing", icon: Network },
      { label: "Simulation core", sub: "Events · state", icon: Server },
    ],
    code: "simulation.createSession({\n  tenant: 'your-platform',\n  assets: ['BTC-USD'],\n  mode: 'sandbox'\n})",
    side: "left",
  },
  {
    number: "02",
    id: "analytics",
    eyebrow: "INSTITUTIONAL DATA & INTELLIGENCE",
    title: "Institutional Analytics & Risk API",
    description:
      "Structured analytics interfaces for teams assessing decision quality, execution patterns, and performance across simulated trading workflows.",
    audience: "Proprietary desks · Trading education",
    delivery: "Webhooks · JSON streams · Reporting APIs",
    features: [
      "Performance metrics and configurable reporting outputs",
      "Behavioral pattern analysis for review workflows",
      "Potential blind-spot indicators for research and coaching",
    ],
    icon: Activity,
    diagram: [
      { label: "Event stream", sub: "Normalized data", icon: Database },
      { label: "Analytics layer", sub: "Rules · scoring", icon: Gauge },
      { label: "Client systems", sub: "Reports · alerts", icon: Workflow },
    ],
    code: "{\n  \"event\": \"analysis.completed\",\n  \"schema\": \"v1\",\n  \"delivery\": \"webhook\"\n}",
    side: "right",
  },
  {
    number: "03",
    id: "arenas",
    eyebrow: "PRIVATE ENGAGEMENT ENVIRONMENTS",
    title: "Custom Corporate Arenas",
    description:
      "Dedicated, branded environments for internal training, private competitions, and structured skill-building for employees or invited client groups.",
    audience: "Financial institutions · Enterprise teams",
    delivery: "Isolated deployment options · Admin controls",
    features: [
      "Private event configuration and participant management",
      "Custom branding, rules, and engagement flows",
      "Deployment and support scope defined during discovery",
    ],
    icon: Building2,
    diagram: [
      { label: "Enterprise admin", sub: "Policies · users", icon: Building2 },
      { label: "Private arena", sub: "Rules · sessions", icon: LockKeyhole },
      { label: "Review console", sub: "Outcomes · exports", icon: Activity },
    ],
    code: "arena.configure({\n  access: 'invite-only',\n  branding: 'tenant',\n  reporting: true\n})",
    side: "left",
  },
];

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3" aria-label="ChartWars home">
      <img src={logo} alt="ChartWars logo" className="h-8 w-8 object-contain" />
      <span className="text-sm font-black tracking-[0.2em] text-white sm:text-base">CHARTWARS</span>
    </Link>
  );
}

function ArchitecturePanel({ solution }) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-white/11 bg-[#090c11] p-4 sm:p-6">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(148,163,184,0.07),transparent_60%)]" />
      <div className="relative flex items-center justify-between border-b border-white/8 pb-4">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-300">
          <GitBranch size={14} className="text-slate-400" />
          SYSTEM FLOW / {solution.number}
        </div>
        <span className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-500">CONCEPT</span>
      </div>

      <div className="relative mt-6 space-y-2">
        {solution.diagram.map((node, index) => {
          const Icon = node.icon;
          return (
            <div key={node.label}>
              <div className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#0d1118] px-3.5 py-3.5 sm:px-4">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-white/10 bg-white/3 text-slate-300">
                  <Icon size={17} strokeWidth={1.7} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-slate-100 sm:text-sm">{node.label}</p>
                  <p className="mt-1 text-[10px] text-slate-500">{node.sub}</p>
                </div>
                <span className="font-mono text-[9px] text-slate-600">0{index + 1}</span>
              </div>
              {index < solution.diagram.length - 1 && (
                <div className="flex h-7 items-center pl-7">
                  <div className="h-full w-px bg-white/16" />
                  <ArrowDown size={12} className="-ml-1.5 text-slate-500" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="relative mt-5 rounded-lg border border-white/8 bg-black/30 p-4">
        <div className="mb-3 flex items-center gap-2 text-[10px] uppercase tracking-[0.15em] text-slate-500">
          <Code2 size={13} /> Integration sketch
        </div>
        <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] leading-6 text-slate-300">{solution.code}</pre>
      </div>
      <p className="relative mt-3 text-[10px] leading-5 text-slate-600">
        Illustrative architecture only. Final interfaces and deployment characteristics require technical validation.
      </p>
    </div>
  );
}

export default function EnterpriseSolutions() {
  const [activeSolution, setActiveSolution] = useState("white-label");
 solutions.find((item) => item.id === activeSolution) ?? solutions[0];

  return (
    <div className="min-h-screen bg-[#05070a] text-slate-200 selection:bg-white/20 selection:text-white">
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#05070a]/95 backdrop-blur-xl">
        <div className="flex h-18 w-full items-center justify-between px-5 sm:px-8 lg:px-12">
          <Brand />
          <div className="hidden items-center gap-2 rounded-md border border-white/10 px-3.5 py-2 text-[10px] font-medium uppercase tracking-[0.12em] text-slate-400 sm:flex">
            <ShieldCheck size={14} /> Enterprise Solutions
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-375 px-5 sm:px-8 lg:px-12 xl:px-16">
        <section className="grid gap-10 border-b border-white/10 py-12 sm:py-16 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center lg:gap-14 lg:py-20">
          <div>
            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-8 bg-slate-400" />
              <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-slate-400">For business / 01</span>
            </div>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-tighter text-white sm:text-5xl xl:text-[64px]">
              Enterprise technology.
              <span className="mt-1 block text-slate-400">Built for integration.</span>
            </h1>
            <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400 sm:text-base sm:leading-8">
              Modular simulation, analytics, and private engagement infrastructure for teams that need to bring ChartWars capabilities into their own products and workflows.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#solutions" className="inline-flex items-center gap-2 rounded-md border border-white/18 bg-[#171c24] px-5 py-3.5 text-xs font-semibold text-white transition hover:bg-[#202733]">
                Explore solution modules <ArrowRight size={15} />
              </a>
              <span className="text-[10px] text-slate-500">Discovery-led · Scope-defined</span>
            </div>
            <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-5">
              <div><p className="font-mono text-lg text-white">01—03</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Modular solutions</p></div>
              <div><p className="font-mono text-lg text-white">API-first</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Integration approach</p></div>
              <div><p className="font-mono text-lg text-white">B2B</p><p className="mt-1 text-[10px] leading-4 text-slate-500">Business workflows</p></div>
            </div>
          </div>

          <div className="relative rounded-xl border border-white/12 bg-[#080b10] p-4 sm:p-6">
            <div className="flex items-center justify-between border-b border-white/9 pb-4">
              <div><p className="text-[10px] uppercase tracking-[0.18em] text-slate-500">Reference architecture</p><p className="mt-1 text-sm font-semibold text-white">Enterprise integration flow</p></div>
              <span className="rounded border border-white/10 px-2 py-1 font-mono text-[9px] text-slate-500">CW / SYS</span>
            </div>
            <div className="mt-6 grid grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-2">
              {[
                { label: "Client", sub: "Web / app", icon: Code2 },
                { label: "API gateway", sub: "Auth / routes", icon: Network },
                { label: "Core services", sub: "Sim / analytics", icon: Server },
              ].map((node, index) => {
                const Icon = node.icon;
                return <div key={node.label} className="contents">
                  <div className="min-w-0 rounded-lg border border-white/11 bg-[#0d1118] px-2 py-4 text-center sm:px-3">
                    <Icon size={19} className="mx-auto text-slate-300" />
                    <p className="mt-3 text-[10px] font-semibold text-slate-200 sm:text-xs">{node.label}</p>
                    <p className="mt-1 hidden text-[9px] text-slate-500 sm:block">{node.sub}</p>
                  </div>
                  {index < 2 && <ChevronRight size={14} className="text-slate-500" />}
                </div>;
              })}
            </div>
            <div className="mt-5 flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 px-4 py-3">
              <LockKeyhole size={15} className="shrink-0 text-slate-400" />
              <p className="text-[10px] leading-5 text-slate-500">Identity, tenant isolation, and data boundaries are defined during solution design.</p>
            </div>
            <p className="mt-3 text-[9px] leading-5 text-slate-600">Conceptual flow — not a representation of a currently deployed production topology.</p>
          </div>
        </section>

        <section id="solutions" className="py-12 sm:py-16">
          <div className="mb-8 flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Solution architecture / 02</p><h2 className="mt-3 text-3xl font-semibold tracking-[-0.035em] text-white sm:text-4xl">Three modules. Clear outcomes.</h2><p className="mt-3 max-w-2xl text-sm leading-6 text-slate-400">Start with a defined business use case, then scope the interfaces, infrastructure, and operational requirements.</p></div>
            <span className="font-mono text-[10px] text-slate-600">MODULES / 01—03</span>
          </div>

          <div className="mb-8 flex flex-wrap gap-2">
            {solutions.map((solution) => <button key={solution.id} type="button" onClick={() => setActiveSolution(solution.id)} className={`rounded-md border px-3.5 py-2.5 text-xs transition ${activeSolution === solution.id ? "border-white/25 bg-white/8 text-white" : "border-white/9 bg-transparent text-slate-500 hover:text-slate-300"}`}>{solution.number} / {solution.title}</button>)}
          </div>

          {solutions.map((solution) => {
            const Icon = solution.icon;
            const reverse = solution.side === "right";
            return <article key={solution.id} className={`grid gap-7 border-t border-white/10 py-9 sm:py-12 lg:grid-cols-2 lg:items-center lg:gap-12 ${reverse ? "lg:[&>div:first-child]:order-2" : ""}`}>
              <div className="min-w-0">
                <div className="flex items-center gap-3"><span className="font-mono text-xs text-slate-500">{solution.number}</span><span className="h-px w-7 bg-white/18" /><span className="text-[9px] font-semibold uppercase tracking-[0.18em] text-slate-500">{solution.eyebrow}</span></div>
                <div className="mt-5 flex h-11 w-11 items-center justify-center rounded-lg border border-white/12 bg-white/2.5 text-slate-200"><Icon size={20} strokeWidth={1.6} /></div>
                <h3 className="mt-5 max-w-xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">{solution.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-slate-400">{solution.description}</p>
                <div className="mt-6 space-y-3">{solution.features.map((feature) => <div key={feature} className="flex items-start gap-3 text-xs leading-6 text-slate-300"><span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full border border-white/15 text-slate-300"><Check size={10} /></span>{feature}</div>)}</div>
                <div className="mt-7 grid gap-4 border-y border-white/9 py-4 sm:grid-cols-2">
                  <div><p className="text-[9px] uppercase tracking-[0.16em] text-slate-600">Target audience</p><p className="mt-2 text-xs leading-5 text-slate-300">{solution.audience}</p></div>
                  <div><p className="text-[9px] uppercase tracking-[0.16em] text-slate-600">Delivery architecture</p><p className="mt-2 text-xs leading-5 text-slate-300">{solution.delivery}</p></div>
                </div>
                <Link to="/business-enquiry" className="mt-6 inline-flex items-center gap-2 text-xs font-semibold text-slate-200 transition hover:text-white">Discuss this solution <ArrowUpRight size={15} /></Link>
              </div>
              <ArchitecturePanel solution={solution} />
            </article>;
          })}
        </section>

        <section className="mb-14 rounded-xl border border-white/12 bg-[#080b10] p-6 sm:mb-20 sm:p-9 lg:p-12">
          <div className="grid gap-7 lg:grid-cols-[1fr_auto] lg:items-center">
            <div><p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-500">Next step / 03</p><h2 className="mt-3 max-w-3xl text-2xl font-semibold tracking-[-0.035em] text-white sm:text-3xl">Request the architecture and service specifications.</h2><p className="mt-3 max-w-2xl text-sm leading-7 text-slate-400">Share your use case to discuss integration boundaries, deployment options, operational requirements, and service expectations.</p></div>
            <Link to="/business-enquiry" className="inline-flex items-center justify-center gap-3 whitespace-nowrap rounded-md border border-white/18 bg-[#171c24] px-5 py-4 text-xs font-semibold text-white transition hover:bg-[#202733]">Request Architecture SLA & Specs Document <ArrowRight size={15} /></Link>
          </div>
          <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-white/9 pt-5 text-[10px] text-slate-500"><span className="inline-flex items-center gap-2"><ShieldCheck size={13} /> Security requirements reviewed per engagement</span><span className="inline-flex items-center gap-2"><Cloud size={13} /> Deployment scope confirmed during discovery</span><span className="inline-flex items-center gap-2"><Database size={13} /> Data access subject to licensing</span></div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
