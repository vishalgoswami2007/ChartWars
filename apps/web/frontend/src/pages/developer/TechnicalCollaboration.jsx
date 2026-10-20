
import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  CheckCircle2,
  ChevronDown,
  CircleDot,
  Code2,
  File,
  FileText,
  GitBranch,
  Layers3,
  LockKeyhole,
  Network,
  Send,
  ShieldCheck,
  Upload,
  X,
  Zap,
} from "lucide-react";
import logo from "../../assets/logo.png";

const proposals = [
  {
    id: "RFC-014",
    title: "Latency Reduction Optimization",
    description:
      "Explore low-latency WebSocket ingestion strategies, event batching, and backpressure controls for high-throughput market streams.",
    domain: "Infrastructure",
    status: "RFC Open",
    tags: ["WebSockets", "Streaming", "Latency"],
    updated: "Engineering proposal",
  },
  {
    id: "RFC-012",
    title: "Quantitative Benchmarking",
    description:
      "Establish reproducible statistical benchmarks for scoring technical-analysis decisions across varying market regimes.",
    domain: "Quant Research",
    status: "In Review",
    tags: ["Statistics", "Backtesting", "Metrics"],
    updated: "Peer review requested",
  },
  {
    id: "RFC-009",
    title: "Asymmetric Data Architecture",
    description:
      "Investigate distributed caching strategies for rapidly changing chart states while maintaining consistency and efficient reads.",
    domain: "Core Protocols",
    status: "RFC Open",
    tags: ["Caching", "Distribution", "Data"],
    updated: "Engineering proposal",
  },
  {
    id: "RFC-006",
    title: "Unified Analytics API Bridge",
    description:
      "Define a stable integration boundary for downstream analytics consumers and external research tooling.",
    domain: "API Bridges",
    status: "Closed",
    tags: ["REST", "Schema", "Integrations"],
    updated: "Reference proposal",
  },
];

const domains = [
  "Quant Research",
  "Infrastructure",
  "Core Protocols",
  "API Bridges",
];

const tiers = [
  {
    id: "open",
    index: "01",
    icon: Code2,
    eyebrow: "COMMUNITY / RESEARCH",
    title: "Open Infrastructure",
    description:
      "Contribute to reusable simulation engines, order-matching modules, and decentralized analytics models.",
    features: [
      "Open-source engineering",
      "Academic research collaboration",
      "RFCs and architecture reviews",
    ],
  },
  {
    id: "institutional",
    index: "02",
    icon: Network,
    eyebrow: "ENTERPRISE / INSTITUTIONAL",
    title: "Institutional Nodes",
    description:
      "Explore custom integrations, risk analytics pipelines, and dedicated infrastructure for institutional workflows.",
    features: [
      "Custom analytics architecture",
      "White-label integration planning",
      "Infrastructure requirements review",
    ],
  },
];

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <img
        src={logo}
        alt="ChartWars logo"
        className="h-9 w-9 object-contain"
      />
      <span className="text-base font-black tracking-[0.17em] text-white">
        CHARTWARS
      </span>
    </Link>
  );
}

function SectionLabel({ number, children }) {
  return (
    <div className="mb-4 flex items-center gap-3">
      <span className="font-mono text-[11px] text-indigo-300">{number}</span>
      <span className="h-px w-7 bg-indigo-400/40" />
      <span className="text-[10px] font-semibold uppercase tracking-[0.19em] text-slate-500">
        {children}
      </span>
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    "RFC Open":
      "border-emerald-400/20 bg-emerald-400/[0.06] text-emerald-300",
    "In Review": "border-indigo-400/25 bg-indigo-400/[0.07] text-indigo-300",
    Closed: "border-slate-500/20 bg-slate-500/[0.06] text-slate-400",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-md border px-2 py-1 text-[10px] font-medium ${styles[status]}`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === "RFC Open"
            ? "bg-emerald-400"
            : status === "In Review"
              ? "bg-indigo-400"
              : "bg-slate-500"
        }`}
      />
      {status}
    </span>
  );
}

function FieldLabel({ htmlFor, children, optional = false }) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-2 block text-xs font-medium text-slate-400"
    >
      {children}
      {optional && (
        <span className="ml-1.5 text-slate-600">(Optional)</span>
      )}
    </label>
  );
}

const fieldClass =
  "w-full rounded-xl border border-slate-700/70 bg-[#0D1527]/70 px-3.5 py-3 text-sm text-slate-200 outline-none transition placeholder:text-slate-600 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10";

export default function TechnicalCollaboration() {
  const [selectedTier, setSelectedTier] = useState("open");
  const [selectedDomain, setSelectedDomain] = useState("Infrastructure");
  const [selectedProposal, setSelectedProposal] = useState("RFC-014");
  const [organization, setOrganization] = useState("");
  const [contact, setContact] = useState("");
  const [proposalTitle, setProposalTitle] = useState("");
  const [brief, setBrief] = useState("");
  const [file, setFile] = useState(null);
  const [consent, setConsent] = useState(false);
  const [submissionState, setSubmissionState] = useState("idle");
  const [feedback, setFeedback] = useState("");
  const fileInputRef = useRef(null);

   proposals.find(
    (proposal) => proposal.id === selectedProposal
  );

  function handleFileChange(event) {
    const nextFile = event.target.files?.[0];

    if (!nextFile) return;

    const allowedExtensions = /\.(pdf|md|markdown|txt|png|jpg|jpeg|svg)$/i;
    const allowedTypes = [
      "application/pdf",
      "text/markdown",
      "text/plain",
      "image/png",
      "image/jpeg",
      "image/svg+xml",
    ];

    if (!allowedExtensions.test(nextFile.name) &&
        !allowedTypes.includes(nextFile.type)) {
      setFeedback("Unsupported file type. Choose PDF, Markdown, TXT, PNG, JPG, or SVG.");
      event.target.value = "";
      return;
    }

    if (nextFile.size > 10 * 1024 * 1024) {
      setFeedback("File exceeds the 10 MB demo limit.");
      event.target.value = "";
      return;
    }

    setFile(nextFile);
    setFeedback("");
    setSubmissionState("idle");
  }

  function handleSubmit(event) {
    event.preventDefault();
    setFeedback("");

    if (!organization.trim() || !contact.trim() || !brief.trim()) {
      setFeedback("Complete the organization, contact, and architecture brief fields.");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.trim())) {
      setFeedback("Enter a valid contact email address.");
      return;
    }

    if (!consent) {
      setFeedback("Confirm that the submitted material is appropriate to share.");
      return;
    }

    // Frontend demo only: no files or form data are transmitted.
    setSubmissionState("demo");
    setFeedback(
      "Your submission is validated locally. Connect a secure backend to send it for review."
    );
  }

  return (
    <div className="min-h-screen bg-[#080a0e] text-slate-200 selection:bg-indigo-400/20 selection:text-indigo-100">
      {/* Header */}
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#080a0e]/90 backdrop-blur-xl">
      <div className="flex h-18 w-full items-center justify-start px-5 sm:px-8">
         <Brand />
       </div>
    </header>

      <main className="mx-auto max-w-360 px-5 pb-20 pt-9 sm:px-8 sm:pt-12 xl:px-12">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-white/8 pb-10 sm:pb-14">
          <div className="pointer-events-none absolute -right-10 -top-24 h-72 w-72 rounded-full bg-indigo-500/[0.07] blur-[100px]" />

          <div className="relative">
            <div className="mb-6 flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-indigo-400/20 bg-indigo-400/5 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.13em] text-indigo-300">
                <GitBranch size={13} />
                Technical collaboration
              </span>
              <span className="rounded-full border border-white/8 px-3 py-1.5 font-mono text-[10px] text-slate-500">
                CW / COLLAB-01
              </span>
            </div>

            <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:items-end">
              <div>
                <h1 className="max-w-4xl text-3xl font-semibold leading-[1.12] tracking-[-0.045em] text-white sm:text-5xl lg:text-[58px]">
                  Engineering the next
                  <br className="hidden sm:block" /> generation of{" "}
                  <span className="text-slate-400">market infrastructure.</span>
                </h1>
                <p className="mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                  A structured collaboration gateway for open-source
                  contributors, quantitative researchers, and institutional
                  engineering teams building rigorous market technology.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 lg:grid-cols-1">
                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    Engagement model
                  </p>
                  <p className="mt-2 text-sm font-medium text-white">
                    Research + Enterprise
                  </p>
                </div>
                <div className="rounded-xl border border-white/8 bg-white/2 p-4">
                  <p className="text-[10px] uppercase tracking-[0.15em] text-slate-500">
                    Submission channel
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-medium text-slate-200">
                    <LockKeyhole size={14} className="text-indigo-300" />
                    Technical intake
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Collaboration tiers */}
        <section className="py-12 sm:py-14">
          <SectionLabel number="01">Collaboration pathways</SectionLabel>

          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
                Choose your engagement model
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Define the context before submitting your technical proposal.
              </p>
            </div>
            <span className="text-xs text-slate-600">01 / 02 pathways</span>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            {tiers.map((tier) => {
              const Icon = tier.icon;
              const isSelected = selectedTier === tier.id;

              return (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => {
                    setSelectedTier(tier.id);
                    setSubmissionState("idle");
                  }}
                  className={`group relative overflow-hidden rounded-2xl border p-5 text-left transition sm:p-7 ${
                    isSelected
                      ? "border-indigo-400/40 bg-indigo-500/5.5"
                      : "border-white/9 bg-[#0d1016] hover:border-white/17"
                  }`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-white/9 bg-white/2.5 text-slate-300">
                      <Icon size={21} />
                    </div>
                    <span
                      className={`rounded-md border px-2 py-1 font-mono text-[10px] ${
                        isSelected
                          ? "border-indigo-400/30 text-indigo-300"
                          : "border-white/8 text-slate-600"
                      }`}
                    >
                      PATH / {tier.index}
                    </span>
                  </div>

                  <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.17em] text-slate-500">
                    {tier.eyebrow}
                  </p>
                  <h3 className="mt-2 text-xl font-semibold text-white">
                    {tier.title}
                  </h3>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-slate-400">
                    {tier.description}
                  </p>

                  <div className="mt-6 space-y-3 border-t border-white/[0.07] pt-5">
                    {tier.features.map((feature) => (
                      <div
                        key={feature}
                        className="flex items-center gap-2.5 text-xs text-slate-400"
                      >
                        <CheckCircle2 size={14} className="text-indigo-300/80" />
                        {feature}
                      </div>
                    ))}
                  </div>

                  <div className="mt-6 flex items-center justify-between">
                    <span
                      className={`text-xs font-semibold ${
                        isSelected ? "text-indigo-300" : "text-slate-500"
                      }`}
                    >
                      {isSelected ? "Selected pathway" : "Select pathway"}
                    </span>
                    <ArrowUpRight
                      size={17}
                      className={`transition ${
                        isSelected
                          ? "text-indigo-300"
                          : "text-slate-600 group-hover:text-slate-300"
                      }`}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        {/* Main two-column pipeline */}
        <section className="py-3 sm:py-5">
          <SectionLabel number="02">The direct pipeline</SectionLabel>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Research & technical intake
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              Review the example proposal registry or submit a new architecture
              brief for evaluation.
            </p>
          </div>

          <div className="grid items-start gap-6 lg:grid-cols-2">
            {/* Left: RFC registry */}
            <div className="min-w-0 overflow-hidden rounded-2xl border border-white/9 bg-[#0d1016]">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 px-5 py-5 sm:px-6">
                <div>
                  <div className="flex items-center gap-2">
                    <Layers3 size={16} className="text-indigo-300" />
                    <h3 className="text-sm font-semibold text-white">
                      Research proposals & RFCs
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-500">
                    Illustrative proposal registry
                  </p>
                </div>
                <span className="rounded-md border border-white/8 px-2.5 py-1.5 font-mono text-[10px] text-slate-400">
                  {proposals.length.toString().padStart(2, "0")} ENTRIES
                </span>
              </div>

              <div className="divide-y divide-white/6">
                {proposals.map((proposal) => {
                  const active = selectedProposal === proposal.id;

                  return (
                    <button
                      type="button"
                      key={proposal.id}
                      onClick={() => {
                        setSelectedProposal(proposal.id);
                        setProposalTitle(proposal.title);
                        setSelectedDomain(proposal.domain);
                        setSubmissionState("idle");
                      }}
                      className={`block w-full p-5 text-left transition sm:px-6 ${
                        active
                          ? "bg-indigo-500/4.5"
                          : "hover:bg-white/[0.018]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] text-slate-600">
                              {proposal.id}
                            </span>
                            <StatusBadge status={proposal.status} />
                          </div>
                          <h4 className="text-sm font-semibold leading-6 text-slate-200">
                            {proposal.title}
                          </h4>
                        </div>
                        <ArrowUpRight
                          size={16}
                          className={`mt-1 shrink-0 ${
                            active ? "text-indigo-300" : "text-slate-600"
                          }`}
                        />
                      </div>

                      <p className="mt-2 text-xs leading-6 text-slate-500">
                        {proposal.description}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        {proposal.tags.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-md border border-white/[0.07] px-2 py-1 text-[10px] text-slate-500"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {active && (
                        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-indigo-400/15 pt-3">
                          <span className="text-[10px] text-slate-500">
                            {proposal.updated}
                          </span>
                          <span className="inline-flex items-center gap-1.5 text-[10px] font-medium text-indigo-300">
                            Prefill intake form <ArrowDownRight size={12} />
                          </span>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="border-t border-white/8 bg-black/10 px-5 py-4 sm:px-6">
                <p className="text-[11px] leading-5 text-slate-500">
                  RFC titles and statuses are illustrative UI examples, not
                  verified active ChartWars issues.
                </p>
              </div>
            </div>

            {/* Right: submission form */}
            <form
              onSubmit={handleSubmit}
              className="min-w-0 rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6"
            >
              <div className="flex items-start justify-between gap-3 border-b border-white/8 pb-5">
                <div>
                  <div className="flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-indigo-400/20 bg-indigo-400/6 text-indigo-300">
                      <FileText size={17} />
                    </div>
                    <h3 className="text-sm font-semibold text-white">
                      Technical ingestion console
                    </h3>
                  </div>
                  <p className="mt-3 text-xs leading-5 text-slate-500">
                    Share the engineering context, proposed approach, and
                    requirements for review.
                  </p>
                </div>
                <span className="shrink-0 rounded-md border border-white/8 px-2 py-1 font-mono text-[9px] text-slate-500">
                  INTAKE / 01
                </span>
              </div>

              <div className="mt-5 space-y-5">
                <div>
                  <FieldLabel htmlFor="collab-organization">
                    Organization / GitHub handle
                  </FieldLabel>
                  <input
                    id="collab-organization"
                    value={organization}
                    onChange={(event) => setOrganization(event.target.value)}
                    placeholder="e.g. research-lab or @username"
                    className={fieldClass}
                    autoComplete="organization"
                    required
                  />
                </div>

                <div>
                  <FieldLabel htmlFor="collab-contact">
                    Contact email
                  </FieldLabel>
                  <input
                    id="collab-contact"
                    type="email"
                    value={contact}
                    onChange={(event) => setContact(event.target.value)}
                    placeholder="engineering@organization.com"
                    className={fieldClass}
                    autoComplete="email"
                    required
                  />
                  <p className="mt-2 text-[10px] leading-5 text-slate-600">
                    Used for follow-up when a real submission service is connected.
                  </p>
                </div>

                <div>
                  <FieldLabel htmlFor="collab-domain">
                    Collaboration domain
                  </FieldLabel>
                  <div className="relative">
                    <select
                      id="collab-domain"
                      value={selectedDomain}
                      onChange={(event) => setSelectedDomain(event.target.value)}
                      className={`${fieldClass} appearance-none pr-10`}
                    >
                      {domains.map((domain) => (
                        <option
                          key={domain}
                          value={domain}
                          className="bg-[#0D1527] text-slate-200"
                        >
                          {domain}
                        </option>
                      ))}
                    </select>
                    <ChevronDown
                      size={15}
                      className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                    />
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="collab-title" optional>
                    Proposal title
                  </FieldLabel>
                  <input
                    id="collab-title"
                    value={proposalTitle}
                    onChange={(event) => setProposalTitle(event.target.value)}
                    placeholder="A concise title for your proposal"
                    className={fieldClass}
                    maxLength={140}
                  />
                </div>

                <div>
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <FieldLabel htmlFor="collab-brief">
                      Proposal architecture / payload
                    </FieldLabel>
                    <span className="text-[10px] text-slate-600">
                      Markdown supported
                    </span>
                  </div>
                  <textarea
                    id="collab-brief"
                    value={brief}
                    onChange={(event) => setBrief(event.target.value)}
                    placeholder={`## Technical overview\n\n**Problem:** What needs to be solved?\n\n**Approach:** Proposed architecture and methodology.\n\n**Evaluation:** Benchmarks, constraints, and expected outcomes.`}
                    className={`${fieldClass} min-h-47.5 resize-y font-mono text-xs leading-6`}
                    maxLength={12000}
                    required
                  />
                  <div className="mt-2 flex items-center justify-between text-[10px] text-slate-600">
                    <span>Do not include secrets or private credentials.</span>
                    <span>{brief.length.toLocaleString()} / 12,000</span>
                  </div>
                </div>

                <div>
                  <FieldLabel htmlFor="collab-file">
                    Secure file payload
                  </FieldLabel>
                  <input
                    ref={fileInputRef}
                    id="collab-file"
                    type="file"
                    accept=".pdf,.md,.markdown,.txt,.png,.jpg,.jpeg,.svg"
                    onChange={handleFileChange}
                    className="sr-only"
                  />

                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex w-full flex-col items-center justify-center rounded-xl border border-dashed border-slate-700 bg-[#0D1527]/40 px-4 py-6 text-center transition hover:border-indigo-400/50 hover:bg-indigo-500/[0.035]"
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/2.5 text-slate-400">
                      <Upload size={18} />
                    </div>
                    <p className="mt-3 text-xs font-medium text-slate-300">
                      Attach architecture files
                    </p>
                    <p className="mt-1 text-[10px] text-slate-600">
                      PDF, Markdown, TXT, PNG, JPG, SVG · Up to 10 MB
                    </p>
                  </button>

                  {file && (
                    <div className="mt-3 flex items-center gap-3 rounded-lg border border-white/8 bg-black/20 p-3">
                      <File size={16} className="shrink-0 text-indigo-300" />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-xs text-slate-300">
                          {file.name}
                        </p>
                        <p className="mt-1 text-[10px] text-slate-600">
                          {(file.size / 1024).toFixed(1)} KB
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setFile(null);
                          if (fileInputRef.current) fileInputRef.current.value = "";
                        }}
                        aria-label="Remove attachment"
                        className="rounded-md p-1.5 text-slate-500 hover:bg-white/5 hover:text-white"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  )}
                  <p className="mt-2 flex items-start gap-2 text-[10px] leading-5 text-slate-600">
                    <LockKeyhole size={12} className="mt-0.5 shrink-0" />
                    File selection is local only. No upload occurs until a
                    secure backend is implemented.
                  </p>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-xl border border-white/[0.07] bg-white/1.5 p-3.5">
                  <input
                    type="checkbox"
                    checked={consent}
                    onChange={(event) => setConsent(event.target.checked)}
                    className="mt-0.5 h-4 w-4 shrink-0 accent-indigo-500"
                  />
                  <span className="text-xs leading-5 text-slate-400">
                    I confirm that I am authorized to share this proposal and
                    any attached materials for technical evaluation.
                  </span>
                </label>

                {feedback && (
                  <div
                    role="status"
                    className={`flex items-start gap-2 rounded-lg border px-3.5 py-3 text-xs leading-5 ${
                      submissionState === "demo"
                        ? "border-emerald-400/20 bg-emerald-400/5 text-emerald-300"
                        : "border-indigo-400/20 bg-indigo-400/5 text-indigo-200"
                    }`}
                  >
                    {submissionState === "demo" ? (
                      <CheckCircle2 size={15} className="mt-0.5 shrink-0" />
                    ) : (
                      <CircleDot size={15} className="mt-0.5 shrink-0" />
                    )}
                    {feedback}
                  </div>
                )}

                <button
                  type="submit"
                  className="group flex w-full items-center justify-center gap-2.5 rounded-xl border border-indigo-400/30 bg-indigo-500/9 px-4 py-4 text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-100 transition hover:border-indigo-300/60 hover:bg-indigo-500/16 focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                >
                  <Send size={15} />
                  Initiate Pipeline Evaluation
                  <ArrowRight
                    size={15}
                    className="transition group-hover:translate-x-1"
                  />
                </button>

                <p className="text-center text-[10px] leading-5 text-slate-600">
                  Demo interaction only. No submission is transmitted or stored.
                </p>
              </div>
            </form>
          </div>
        </section>

        {/* Pipeline timeline */}
        <section className="pt-14 sm:pt-16">
          <SectionLabel number="03">Evaluation lifecycle</SectionLabel>

          <div className="mb-7">
            <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              From architecture to deployment
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-500">
              A proposed workflow for assessing, validating, and integrating
              collaboration submissions.
            </p>
          </div>

          <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-8">
            <div className="grid gap-7 md:grid-cols-3 md:gap-5">
              {[
                {
                  number: "01",
                  title: "Architecture submission",
                  description:
                    "Document the problem, proposed approach, constraints, and evaluation criteria.",
                  icon: FileText,
                  state: "Intake",
                },
                {
                  number: "02",
                  title: "Sandbox peer review",
                  description:
                    "Assess technical feasibility, security considerations, reproducibility, and benchmarks.",
                  icon: GitBranch,
                  state: "Validation",
                },
                {
                  number: "03",
                  title: "Production deployment",
                  description:
                    "Plan integration, testing, approvals, monitoring, and controlled release where applicable.",
                  icon: Zap,
                  state: "Release",
                },
              ].map((step, index) => {
                const Icon = step.icon;

                return (
                  <div key={step.number} className="relative">
                    {index < 2 && (
                      <div className="absolute left-10 top-5 hidden h-px w-[calc(100%-16px)] bg-linear-to-r from-indigo-400/40 to-white/6 md:block" />
                    )}

                    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-indigo-400/25 bg-indigo-500/[0.07] text-indigo-300">
                      <Icon size={17} />
                    </div>

                    <p className="mt-5 font-mono text-[10px] tracking-[0.14em] text-indigo-300">
                      PHASE {step.number} / {step.state.toUpperCase()}
                    </p>
                    <h3 className="mt-2 text-base font-semibold text-white">
                      {step.title}
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-6 text-slate-500">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>

            <div className="mt-8 flex items-start gap-3 border-t border-white/[0.07] pt-5">
              <ShieldCheck
                size={16}
                className="mt-0.5 shrink-0 text-slate-500"
              />
              <p className="text-[11px] leading-5 text-slate-500">
                This lifecycle illustrates a proposed workflow, not a guarantee
                of acceptance, review timing, partnership, or production access.
              </p>
            </div>
          </div>
        </section>
      </main>
      <Footer/>
    </div>
  );
}
