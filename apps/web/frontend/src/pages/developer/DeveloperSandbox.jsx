
import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../landing/footer/Footer";
import {
  Activity,
  ArrowUpRight,
  Bell,
  Check,
  ChevronDown,
  CircleHelp,
  Clock3,
  Code2,
  Copy,
  Eye,
  EyeOff,
  FileJson,
  FileSpreadsheet,
  KeyRound,
  LockKeyhole,
  Plus,
  ShieldCheck,
  Terminal,
  Trash2,
  Webhook,
  X,
} from "lucide-react";
import logo from "../../assets/logo.png";

const ENDPOINTS = [
  {
    method: "GET",
    path: "/v1/market/charts",
    title: "Market chart data",
    description:
      "Retrieve historical OHLCV candles, timeframe metadata, and market series.",
    auth: "Required",
    params: [
      ["symbol", "string", "BTC-USD"],
      ["interval", "string", "1h"],
      ["limit", "integer", "100"],
    ],
  },
  {
    method: "GET",
    path: "/v1/user/performance",
    title: "Performance analytics",
    description:
      "Fetch account performance metrics, equity history, and trade statistics.",
    auth: "Required",
    params: [
      ["period", "string", "30d"],
      ["include_trades", "boolean", "true"],
    ],
  },
  {
    method: "POST",
    path: "/v1/arena/trade",
    title: "Submit an arena order",
    description:
      "Submit an order request to the trading arena. Execution requires a supported backend and explicit permissions.",
    auth: "Trade permission",
    params: [
      ["symbol", "string", "BTC-USD"],
      ["side", "string", "buy"],
      ["quantity", "number", "0.01"],
      ["order_type", "string", "market"],
    ],
  },
];

const SNIPPETS = {
  cURL: `curl -X GET "https://api.chartwars.com/v1/market/charts?symbol=BTC-USD&interval=1h&limit=100" \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Accept: application/json"`,
  JavaScript: `const response = await fetch(
  "https://api.chartwars.com/v1/market/charts?symbol=BTC-USD&interval=1h&limit=100",
  {
    headers: {
      Authorization: \`Bearer \${API_KEY}\`,
      Accept: "application/json",
    },
  }
);

const data = await response.json();
console.log(data);`,
  Python: `import requests

response = requests.get(
    "https://api.chartwars.com/v1/market/charts",
    headers={
        "Authorization": f"Bearer {API_KEY}",
        "Accept": "application/json",
    },
    params={
        "symbol": "BTC-USD",
        "interval": "1h",
        "limit": 100,
    },
    timeout=15,
)

response.raise_for_status()
data = response.json()
print(data)`,
};

const MOCK_RESPONSE = `{
  "success": true,
  "data": {
    "symbol": "BTC-USD",
    "interval": "1h",
    "candles": [
      {
        "timestamp": "2026-10-20T09:00:00Z",
        "open": 67420.50,
        "high": 67612.80,
        "low": 67384.20,
        "close": 67588.10,
        "volume": 128.42
      },
      {
        "timestamp": "2026-10-20T10:00:00Z",
        "open": 67588.10,
        "high": 67840.00,
        "low": 67510.35,
        "close": 67724.65,
        "volume": 94.17
      }
    ],
    "next_cursor": null
  },
  "meta": {
    "source": "sandbox_fixture",
    "request_id": "req_demo_8f31a2"
  }
}`;

const INITIAL_KEY = "cw_demo_••••••••••••7F2A";

function Brand() {
  return (
    <Link to="/" className="flex shrink-0 items-center gap-3">
      <img src={logo} alt="ChartWars logo" className="h-9 w-9 object-contain" />
      <span className="text-base font-black tracking-[0.17em] text-white">
        CHARTWARS
      </span>
    </Link>
  );
}

function SectionHeading({ eyebrow, title, description, icon: Icon }) {
  return (
    <div className="mb-6">
      <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.17em] text-emerald-400">
        {Icon && <Icon size={14} />}
        {eyebrow}
      </div>
      <h2 className="text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {title}
      </h2>
      {description && (
        <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
          {description}
        </p>
      )}
    </div>
  );
}

function MethodBadge({ method }) {
  const isGet = method === "GET";

  return (
    <span
      className={`inline-flex min-w-13 items-center justify-center rounded-md border px-2 py-1 font-mono text-[10px] font-bold tracking-wide ${
        isGet
          ? "border-emerald-500/30 bg-emerald-500/8 text-emerald-400"
          : "border-violet-500/30 bg-violet-500/9 text-violet-300"
      }`}
    >
      {method}
    </span>
  );
}

function SmallLabel({ children }) {
  return (
    <span className="text-[10px] font-semibold uppercase tracking-[0.14em] text-slate-500">
      {children}
    </span>
  );
}

function CopyButton({ value, label = "Copy" }) {
  const [copied, setCopied] = useState(false);

  async function copyText() {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <button
      type="button"
      onClick={copyText}
      title={copied ? "Copied" : label}
      className="inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-2.5 py-1.5 text-xs text-slate-400 transition hover:border-emerald-500/30 hover:text-emerald-300"
    >
      {copied ? <Check size={13} /> : <Copy size={13} />}
      <span>{copied ? "Copied" : label}</span>
    </button>
  );
}

export default function DeveloperSandbox() {
  const [apiKey, setApiKey] = useState(INITIAL_KEY);
  const [showKey, setShowKey] = useState(false);
  const [permission, setPermission] = useState("read");
  const [language, setLanguage] = useState("cURL");
  const [selectedEndpoint, setSelectedEndpoint] = useState(0);
  const [showRevoke, setShowRevoke] = useState(false);
  const [notice, setNotice] = useState("");
  const [webhooks, setWebhooks] = useState({
    discord: false,
    slack: false,
  });
  const [exportFormat, setExportFormat] = useState("CSV");

 ENDPOINTS[selectedEndpoint];

  function generateDemoKey() {
    const suffix = Math.random().toString(36).slice(2, 8).toUpperCase();
    setApiKey(`cw_demo_••••••••${suffix}`);
    setShowKey(false);
    setNotice("Demo key created locally. Connect a backend for real credentials.");
  }

  function revokeDemoKey() {
    setApiKey("");
    setShowKey(false);
    setShowRevoke(false);
    setNotice("Demo key revoked in this session.");
  }

  function toggleWebhook(name) {
    setWebhooks((current) => ({
      ...current,
      [name]: !current[name],
    }));
  }

  return (
    <div className="min-h-screen bg-[#080a0e] text-slate-200 selection:bg-emerald-400/20 selection:text-emerald-100">
      {/* Header: brand only */}
      <header className="sticky top-0 z-40 border-b border-white/8 bg-[#080a0e]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-18 max-w-360 items-center justify-start px-5 sm:px-8 xl:px-12">
          <Brand />
        </div>
      </header>

      <main className="mx-auto max-w-360 px-5 pb-20 pt-9 sm:px-8 sm:pt-12 xl:px-12">
        {/* Intro */}
        <section className="mb-10 border-b border-white/8 pb-9">
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 px-3 py-1.5 text-xs text-emerald-300">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
              Developer platform
            </span>
            <span className="rounded-full border border-white/10 px-3 py-1.5 text-xs text-slate-500">
              API v1
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-end">
            <div>
              <h1 className="max-w-3xl text-3xl font-semibold tracking-[-0.04em] text-white sm:text-5xl">
                Build with <span className="text-slate-400">ChartWars.</span>
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Programmatic access to market data, performance analytics, and
                trading arena workflows—all from one developer workspace.
              </p>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-white/8 bg-white/2.5 px-4 py-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-sky-400/10 text-sky-300">
                <Activity size={18} />
              </div>
              <div>
                <p className="text-sm font-medium text-white">Sandbox mode</p>
                <p className="mt-1 text-xs text-slate-500">
                  Example data · No live execution
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Access tokens */}
        <section className="mb-12">
          <SectionHeading
            eyebrow="01 / Access management"
            title="API credentials"
            description="Manage your demo access configuration and choose the permissions your integration should request."
            icon={KeyRound}
          />

          <div className="overflow-hidden rounded-2xl border border-white/9 bg-[#0d1016]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-300">
                  <LockKeyhole size={18} />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">Primary API key</p>
                  <p className="mt-1 text-xs text-slate-500">
                    Local demo credential
                  </p>
                </div>
              </div>

              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/20 bg-emerald-500/6 px-3 py-1.5 text-xs text-emerald-300">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                {apiKey ? "Demo active" : "Revoked"}
              </span>
            </div>

            <div className="grid gap-6 p-5 sm:p-6 lg:grid-cols-[1.3fr_0.7fr]">
              <div>
                <SmallLabel>Credential value</SmallLabel>
                <div className="mt-2 flex min-h-13.5 items-center gap-2 rounded-xl border border-white/9 bg-[#080a0e] p-2 pl-4">
                  <code className="min-w-0 flex-1 truncate font-mono text-sm text-slate-300">
                    {!apiKey
                      ? "No active demo key"
                      : showKey
                        ? apiKey.replace("••••••••", "DEMO_ONLY_")
                        : apiKey}
                  </code>

                  <button
                    type="button"
                    onClick={() => setShowKey((value) => !value)}
                    disabled={!apiKey}
                    aria-label={showKey ? "Hide API key" : "Show API key"}
                    className="rounded-lg p-2 text-slate-500 transition hover:bg-white/6 hover:text-white disabled:opacity-30"
                  >
                    {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>

                  <CopyButton value={apiKey || ""} label="Copy" />
                </div>

                <p className="mt-3 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <ShieldCheck size={14} className="mt-0.5 shrink-0 text-emerald-400" />
                  Never expose a production secret in client-side code or commit it
                  to source control.
                </p>
              </div>

              <div>
                <SmallLabel>Permission level</SmallLabel>
                <div className="mt-2 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setPermission("read")}
                    className={`rounded-xl border p-3 text-left transition ${
                      permission === "read"
                        ? "border-emerald-500/40 bg-emerald-500/[0.07]"
                        : "border-white/8 bg-white/2 hover:border-white/20"
                    }`}
                  >
                    <ShieldCheck
                      size={17}
                      className={
                        permission === "read"
                          ? "text-emerald-400"
                          : "text-slate-500"
                      }
                    />
                    <p className="mt-3 text-sm font-medium text-white">Read-only</p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      Market data and analytics
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPermission("trade")}
                    className={`rounded-xl border p-3 text-left transition ${
                      permission === "trade"
                        ? "border-violet-500/40 bg-violet-500/[0.07]"
                        : "border-white/8 bg-white/2 hover:border-white/20"
                    }`}
                  >
                    <Activity
                      size={17}
                      className={
                        permission === "trade"
                          ? "text-violet-300"
                          : "text-slate-500"
                      }
                    />
                    <p className="mt-3 text-sm font-medium text-white">
                      Trade execution
                    </p>
                    <p className="mt-1 text-[11px] leading-4 text-slate-500">
                      Requires a trusted backend
                    </p>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[0.07] bg-white/1.5 px-5 py-4 sm:px-6">
              <p className="max-w-2xl text-xs leading-5 text-slate-500">
                {permission === "read"
                  ? "Read-only is selected for this local preview. Permission enforcement must be implemented server-side."
                  : "Trade execution is selected for this preview only. This does not authorize or execute real orders."}
              </p>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setShowRevoke(true)}
                  disabled={!apiKey}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs font-medium text-slate-400 transition hover:border-red-400/30 hover:text-red-300 disabled:opacity-30"
                >
                  <Trash2 size={14} />
                  Revoke
                </button>

                <button
                  type="button"
                  onClick={generateDemoKey}
                  className="inline-flex items-center gap-2 rounded-lg bg-emerald-400 px-3.5 py-2 text-xs font-semibold text-[#07110d] transition hover:bg-emerald-300"
                >
                  <Plus size={14} />
                  Generate new key
                </button>
              </div>
            </div>
          </div>

          {notice && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/5 px-4 py-3 text-xs leading-5 text-emerald-300">
              <Check size={14} className="mt-0.5 shrink-0" />
              <span>{notice}</span>
              <button
                type="button"
                onClick={() => setNotice("")}
                className="ml-auto text-emerald-300/70 hover:text-white"
                aria-label="Dismiss notice"
              >
                <X size={14} />
              </button>
            </div>
          )}

          <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
            <LockKeyhole size={14} className="mt-0.5 shrink-0" />
            All requests must be authenticated via a Bearer token over HTTPS.
          </p>
        </section>

        {/* API docs and code sandbox */}
        <section className="mb-16">
          <SectionHeading
            eyebrow="02 / API reference"
            title="Everything you need to integrate"
            description="Explore the available routes, review request parameters, and start with a ready-to-adapt example."
            icon={Code2}
          />

          <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.2fr)_minmax(360px,0.8fr)]">
            {/* Left: documentation */}
            <div className="min-w-0 space-y-5">
              <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <LockKeyhole size={16} className="text-slate-400" />
                  <h3 className="text-sm font-semibold text-white">
                    Authentication
                  </h3>
                </div>

                <p className="mt-3 text-sm leading-6 text-slate-400">
                  Send your API token in the Authorization header for every
                  authenticated request. Store real secrets in a secure
                  server-side environment variable.
                </p>

                <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#080a0e] p-4">
                  <SmallLabel>HTTP header</SmallLabel>
                  <code className="mt-2 block break-all font-mono text-xs leading-6">
                    <span className="text-sky-300">Authorization</span>
                    <span className="text-slate-500">: </span>
                    <span className="text-emerald-300">Bearer YOUR_API_KEY</span>
                  </code>
                </div>

                <div className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                  <ShieldCheck
                    size={14}
                    className="mt-0.5 shrink-0 text-emerald-400"
                  />
                  Never send API credentials through URL query parameters.
                </div>
              </div>

              <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">
                      REST endpoints
                    </h3>
                    <p className="mt-1 text-xs text-slate-500">
                      Select a route to inspect its details.
                    </p>
                  </div>
                  <span className="rounded-md border border-white/8 px-2 py-1 font-mono text-[10px] text-slate-500">
                    3 ROUTES
                  </span>
                </div>

                <div className="space-y-2">
                  {ENDPOINTS.map((item, index) => (
                    <button
                      type="button"
                      key={item.path}
                      onClick={() => setSelectedEndpoint(index)}
                      className={`w-full rounded-xl border p-3 text-left transition sm:p-4 ${
                        selectedEndpoint === index
                          ? "border-emerald-500/30 bg-emerald-500/4.5"
                          : "border-white/[0.07] bg-white/1.5 hover:border-white/15"
                      }`}
                    >
                      <div className="flex flex-wrap items-center gap-2">
                        <MethodBadge method={item.method} />
                        <code className="min-w-0 break-all font-mono text-xs text-slate-200 sm:text-sm">
                          {item.path}
                        </code>
                        <ChevronDown
                          size={14}
                          className={`ml-auto shrink-0 text-slate-500 transition ${
                            selectedEndpoint === index ? "rotate-180" : ""
                          }`}
                        />
                      </div>
                      <p className="mt-2 text-xs leading-5 text-slate-500">
                        {item.title} — {item.description}
                      </p>

                      {selectedEndpoint === index && (
                        <div className="mt-4 border-t border-white/8 pt-4">
                          <div className="mb-3 flex items-center justify-between gap-3">
                            <SmallLabel>Request parameters</SmallLabel>
                            <span className="text-[10px] text-slate-500">
                              Auth: {item.auth}
                            </span>
                          </div>

                          <div className="space-y-2">
                            {item.params.map(([name, type, example]) => (
                              <div
                                key={name}
                                className="grid grid-cols-[1fr_auto] gap-2 rounded-lg bg-black/20 px-3 py-2 sm:grid-cols-[1fr_90px_1fr]"
                              >
                                <code className="text-xs text-sky-300">{name}</code>
                                <span className="hidden text-xs text-slate-500 sm:block">
                                  {type}
                                </span>
                                <code className="break-all text-right text-xs text-emerald-300 sm:text-left">
                                  {example}
                                </code>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>

              <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-400/15 bg-sky-400/6 text-sky-300">
                    <Activity size={18} />
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-semibold text-white">
                      WebSocket stream
                    </h3>
                    <p className="mt-1 text-xs leading-5 text-slate-500">
                      Designed for real-time tick and market metric updates.
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/[0.07] bg-[#080a0e] p-3">
                  <code className="break-all font-mono text-xs leading-5 text-sky-300">
                    wss://api.chartwars.com/v1/market/stream
                  </code>
                  <CopyButton
                    value="wss://api.chartwars.com/v1/market/stream"
                  />
                </div>
                <p className="mt-3 text-xs leading-5 text-slate-500">
                  Illustrative endpoint. Confirm the actual WebSocket URL,
                  authentication handshake, and subscription protocol with your
                  backend implementation.
                </p>
              </div>
            </div>

            {/* Right: sticky code vault */}
            <aside className="min-w-0 lg:sticky lg:top-24">
              <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0B0F19] shadow-2xl shadow-black/20">
                <div className="flex items-center justify-between gap-3 border-b border-white/8 px-4 py-4 sm:px-5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/8 bg-white/3 text-emerald-300">
                      <Terminal size={17} />
                    </div>
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        Code sandbox
                      </h3>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Request examples
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md border border-sky-400/20 bg-sky-400/6 px-2 py-1 text-[10px] text-sky-300">
                    API v1
                  </span>
                </div>

                <div className="flex gap-1 border-b border-white/8 px-3 pt-3">
                  {Object.keys(SNIPPETS).map((name) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setLanguage(name)}
                      className={`rounded-t-lg border-b-2 px-3 py-2.5 text-xs transition ${
                        language === name
                          ? "border-emerald-400 text-emerald-300"
                          : "border-transparent text-slate-500 hover:text-slate-200"
                      }`}
                    >
                      {name}
                    </button>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400" />
                    <span className="text-xs text-slate-400">
                      {language} · Example request
                    </span>
                  </div>
                  <CopyButton value={SNIPPETS[language]} />
                </div>

                <div className="overflow-x-auto px-4 pb-5 sm:px-5">
                  <pre className="min-h-67.5 whitespace-pre-wrap wrap-break-words font-mono text-[11px] leading-[1.9] text-slate-300 sm:text-xs">
                    <code>{SNIPPETS[language]}</code>
                  </pre>
                </div>

                <div className="border-t border-white/8 px-4 py-4 sm:px-5">
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-white">
                        Example response
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        Mock fixture · Not live market data
                      </p>
                    </div>
                    <CopyButton value={MOCK_RESPONSE} label="Copy JSON" />
                  </div>

                  <pre className="max-h-67.5 overflow-auto rounded-xl border border-white/[0.07] bg-black/30 p-3 font-mono text-[10px] leading-[1.8] text-slate-400 sm:text-[11px]">
                    <code>{MOCK_RESPONSE}</code>
                  </pre>

                  <div className="mt-3 flex items-start gap-2 text-[10px] leading-5 text-slate-500">
                    <CircleHelp size={13} className="mt-0.5 shrink-0" />
                    Values are illustrative. Replace them with the response
                    schema returned by your implemented API.
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        {/* Integrations */}
        <section>
          <SectionHeading
            eyebrow="03 / Connected workflows"
            title="Integrations & exports"
            description="Prepare notification channels and choose a data format for your external workflows."
            icon={Webhook}
          />

          <div className="grid gap-5 lg:grid-cols-2">
            {/* Webhooks */}
            <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/8 bg-white/3 text-slate-300">
                  <Bell size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Notification channels
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Webhook connection preferences
                  </p>
                </div>
              </div>

              <div className="mt-5 space-y-3">
                {[
                  {
                    id: "discord",
                    name: "Discord",
                    description: "Trade events and report notifications",
                    letter: "D",
                  },
                  {
                    id: "slack",
                    name: "Slack",
                    description: "Workspace alerts and report delivery",
                    letter: "S",
                  },
                ].map((item) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 rounded-xl border border-white/[0.07] bg-white/1.5 p-4"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-white/8 bg-white/3 font-semibold text-slate-300">
                      {item.letter}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-slate-500">
                        {item.description}
                      </p>
                    </div>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={webhooks[item.id]}
                      aria-label={`${item.name} demo toggle`}
                      onClick={() => toggleWebhook(item.id)}
                      className={`relative h-6 w-11 shrink-0 rounded-full border transition ${
                        webhooks[item.id]
                          ? "border-emerald-400/50 bg-emerald-400/30"
                          : "border-white/10 bg-white/4"
                      }`}
                    >
                      <span
                        className={`absolute top-0.5 h-4 w-4 rounded-full transition ${
                          webhooks[item.id]
                            ? "left-5.5 bg-emerald-300"
                            : "left-0.5 bg-slate-500"
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>

              <p className="mt-4 flex items-start gap-2 text-xs leading-5 text-slate-500">
                <Webhook size={14} className="mt-0.5 shrink-0" />
                These toggles only update local UI state. Real notifications
                require endpoint URLs, server-side delivery, and signature
                verification.
              </p>
            </div>

            {/* Export */}
            <div className="rounded-2xl border border-white/9 bg-[#0d1016] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/5 bg-white/3 text-slate-300">
                  <FileSpreadsheet size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-white">
                    Export utilities
                  </h3>
                  <p className="mt-1 text-xs text-slate-500">
                    Formats for external journals and analysis
                  </p>
                </div>
              </div>

              <div className="mt-5 grid grid-cols-3 gap-2">
                {[
                  { name: "CSV", icon: FileSpreadsheet, desc: "Spreadsheets" },
                  { name: "JSON", icon: FileJson, desc: "API payloads" },
                  { name: "Python", icon: Code2, desc: "Dataframes" },
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      type="button"
                      onClick={() => setExportFormat(item.name)}
                      className={`rounded-xl border p-3 text-left transition ${
                        exportFormat === item.name
                          ? "border-emerald-500/30 bg-emerald-500/5"
                          : "border-white/[0.07] bg-white/1.5 hover:border-white/15"
                      }`}
                    >
                      <Icon
                        size={17}
                        className={
                          exportFormat === item.name
                            ? "text-emerald-300"
                            : "text-slate-500"
                        }
                      />
                      <p className="mt-3 text-sm font-medium text-white">
                        {item.name}
                      </p>
                      <p className="mt-1 text-[10px] text-slate-500">
                        {item.desc}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-4 rounded-xl border border-white/[0.07] bg-[#080a0e] p-4">
                <SmallLabel>Selected format</SmallLabel>
                <p className="mt-2 text-sm font-medium text-white">
                  {exportFormat} export
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  {exportFormat === "CSV" &&
                    "Tabular output suitable for spreadsheet applications and trading journals."}
                  {exportFormat === "JSON" &&
                    "Structured output suitable for integrations and downstream services."}
                  {exportFormat === "Python" &&
                    "A Python-oriented workflow for loading records into a pandas DataFrame."}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  setNotice(
                    `${exportFormat} export selected. Connect a backend data source to implement real exports.`
                  )
                }
                className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/3 px-4 py-3 text-xs font-medium text-slate-200 transition hover:border-emerald-500/30 hover:text-emerald-300"
              >
                Configure export
                <ArrowUpRight size={14} />
              </button>
            </div>
          </div>
        </section>

        {/* Security footer */}
        <footer className="mt-14 flex flex-col gap-4 border-t border-white/8 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck size={15} className="text-emerald-400" />
            Security-first integration design
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
            <span className="inline-flex items-center gap-1.5">
              <LockKeyhole size={13} />
              HTTPS required
            </span>
            <span className="inline-flex items-center gap-1.5">
              <Clock3 size={13} />
              Versioned API
            </span>
            <span>ChartWars Developer Sandbox</span>
          </div>
        </footer>
      </main>

      {/* Revoke confirmation */}
      {showRevoke && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setShowRevoke(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-title"
            className="w-full max-w-md rounded-2xl border border-white/12 bg-[#0d1016] p-6 shadow-2xl"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/[0.07] text-red-300">
              <Trash2 size={19} />
            </div>
            <h3 id="revoke-title" className="mt-5 text-lg font-semibold text-white">
              Revoke demo key?
            </h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              This removes the displayed demo credential from the current page
              state. No real API key or server credential will be revoked.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowRevoke(false)}
                className="rounded-lg border border-white/10 px-4 py-2.5 text-sm text-slate-300 transition hover:bg-white/4"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={revokeDemoKey}
                className="rounded-lg bg-red-400 px-4 py-2.5 text-sm font-semibold text-[#1a0808] transition hover:bg-red-300"
              >
                Revoke key
              </button>
            </div>
          </div>
        </div>
      )}
      <Footer/>
    </div>
  );
}
