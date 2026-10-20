
import { useMemo, useState } from "react";
import {
  Activity,
  ArrowDownRight,
  ArrowUpRight,
  BarChart3,
  CircleHelp,
  Crosshair,
  ShieldCheck,
  Target,
  TrendingUp,
} from "lucide-react";

const EQUITY_DATA = [
  10000, 10120, 10080, 10240, 10190, 10350, 10290, 10410,
  10320, 10500, 10430, 10620, 10540, 10690, 10610, 10820,
  10740, 10900, 10820, 11080, 10950, 11130, 11020, 11250,
  11170, 11340, 11210, 11480, 11390, 11620,
];

const METRICS = [
  {
    label: "Net P&L",
    value: "+$1,620",
    change: "+12.4%",
    positive: true,
    icon: TrendingUp,
    description: "Total simulated profit and loss",
  },
  {
    label: "Win rate",
    value: "68.5%",
    change: "137 / 200",
    positive: true,
    icon: Crosshair,
    description: "Winning trades out of all trades",
  },
  {
    label: "Max drawdown",
    value: "4.2%",
    change: "Risk metric",
    positive: false,
    icon: ShieldCheck,
    description: "Largest peak-to-trough decline",
  },
  {
    label: "Profit factor",
    value: "1.84",
    change: "1.0+ target",
    positive: true,
    icon: Activity,
    description: "Gross profits divided by gross losses",
  },
];

const PERIODS = [
  { label: "7D", count: 7 },
  { label: "30D", count: 30 },
  { label: "90D", count: 30 },
];

function createLinePath(values, width, height, padding = 8) {
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;

  const points = values.map((value, index) => ({
    x: padding + (index / Math.max(values.length - 1, 1)) * (width - padding * 2),
    y:
      height -
      padding -
      ((value - min) / range) * (height - padding * 2),
  }));

  const path = points
    .map((point, index) => {
      if (index === 0) return `M ${point.x} ${point.y}`;

      const previous = points[index - 1];
      const midpoint = (previous.x + point.x) / 2;

      return `C ${midpoint} ${previous.y}, ${midpoint} ${point.y}, ${point.x} ${point.y}`;
    })
    .join(" ");

  return { path, points, min, max };
}

function EquityChart({ values, period }) {
  const [hoverIndex, setHoverIndex] = useState(null);
  const width = 700;
  const height = 250;

  const chart = useMemo(
    () => createLinePath(values, width, height, 12),
    [values]
  );

  const areaPath = `${chart.path} L ${width - 12} ${height - 12} L 12 ${height - 12} Z`;
  const selectedPoint =
    hoverIndex === null ? null : chart.points[hoverIndex];

  return (
    <div className="relative">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs text-neutral-500">Portfolio equity</p>
          <p className="mt-1 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            ${values[values.length - 1].toLocaleString("en-US")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-neutral-500">Selected period</p>
          <p className="mt-1 text-sm font-medium text-emerald-400">
            +{(
              ((values[values.length - 1] - values[0]) / values[0]) *
              100
            ).toFixed(2)}
            %
          </p>
        </div>
      </div>

      <div className="relative">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          role="img"
          aria-label={`Illustrative portfolio equity curve for ${period}`}
          className="h-auto w-full overflow-visible"
        >
          <defs>
            <linearGradient id="cwEquityFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ff7900" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#ff7900" stopOpacity="0" />
            </linearGradient>
            <filter id="cwEquityGlow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {[35, 80, 125, 170, 215].map((y) => (
            <line
              key={y}
              x1="12"
              x2={width - 12}
              y1={y}
              y2={y}
              stroke="#292929"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
          ))}

          <path d={areaPath} fill="url(#cwEquityFill)" />

          <path
            d={chart.path}
            fill="none"
            stroke="#ff7900"
            strokeWidth="2.5"
            strokeLinecap="round"
            filter="url(#cwEquityGlow)"
          />

          {selectedPoint && (
            <>
              <line
                x1={selectedPoint.x}
                x2={selectedPoint.x}
                y1="12"
                y2={height - 12}
                stroke="#ff7900"
                strokeOpacity="0.5"
                strokeDasharray="4 4"
              />
              <circle
                cx={selectedPoint.x}
                cy={selectedPoint.y}
                r="5"
                fill="#ff7900"
                stroke="#fff"
                strokeWidth="2"
              />
            </>
          )}

          {chart.points.map((point, index) => (
            <rect
              key={index}
              x={point.x - width / values.length / 2}
              y="0"
              width={width / values.length}
              height={height}
              fill="transparent"
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(null)}
              onTouchStart={() => setHoverIndex(index)}
            />
          ))}
        </svg>

        {selectedPoint && hoverIndex !== null && (
          <div
            className="pointer-events-none absolute top-2 rounded-lg border border-orange-400/20 bg-[#141414] px-3 py-2 shadow-xl"
            style={{
              left: `${Math.min(
                Math.max((selectedPoint.x / width) * 100, 12),
                75
              )}%`,
            }}
          >
            <p className="text-[10px] text-neutral-500">
              Day {hoverIndex + 1}
            </p>
            <p className="mt-1 text-xs font-semibold text-white">
              ${values[hoverIndex].toLocaleString("en-US")}
            </p>
          </div>
        )}
      </div>

      <div className="mt-2 flex justify-between text-[10px] text-neutral-600">
        <span>START</span>
        <span>PERIOD PROGRESS</span>
        <span>NOW</span>
      </div>
    </div>
  );
}

function DrawdownChart({ values }) {
  const drawdowns = [];
  let peak = values[0];

  for (const value of values) {
    peak = Math.max(peak, value);
    drawdowns.push(((peak - value) / peak) * 100);
  }

  const width = 700;
  const height = 100;
  const maxDrawdown = Math.max(...drawdowns, 1);
  const points = drawdowns.map((value, index) => ({
    x: 8 + (index / Math.max(drawdowns.length - 1, 1)) * (width - 16),
    y: 8 + (value / maxDrawdown) * (height - 16),
  }));

  const path = points
    .map((point, index) =>
      `${index === 0 ? "M" : "L"} ${point.x} ${point.y}`
    )
    .join(" ");

  const worst = Math.max(...drawdowns);

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-white">Drawdown</p>
          <p className="mt-1 text-[11px] text-neutral-500">
            Decline from the previous equity peak
          </p>
        </div>
        <p className="text-sm font-medium text-rose-400">
          -{worst.toFixed(2)}%
        </p>
      </div>

      <svg
        viewBox={`0 0 ${width} ${height}`}
        role="img"
        aria-label="Drawdown curve"
        className="h-auto w-full"
      >
        {[25, 50, 75].map((y) => (
          <line
            key={y}
            x1="8"
            x2={width - 8}
            y1={y}
            y2={y}
            stroke="#292929"
            strokeDasharray="4 6"
          />
        ))}
        <path
          d={`${path} L ${width - 8} 8 L 8 8 Z`}
          fill="#fb7185"
          fillOpacity="0.09"
        />
        <path
          d={path}
          fill="none"
          stroke="#fb7185"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function MetricCard({ metric }) {
  const Icon = metric.icon;

  return (
    <div className="group rounded-2xl border border-white/8 bg-[#0b0b0b] p-4 transition duration-300 hover:border-orange-400/25 hover:bg-[#101010] sm:p-5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-xs text-neutral-500">{metric.label}</p>
        <Icon
          size={16}
          className="text-neutral-600 transition group-hover:text-orange-400"
        />
      </div>

      <p className="mt-4 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
        {metric.value}
      </p>

      <div className="mt-2 flex flex-wrap items-center gap-1.5">
        {metric.positive ? (
          <ArrowUpRight size={13} className="text-emerald-400" />
        ) : (
          <ArrowDownRight size={13} className="text-rose-400" />
        )}
        <span
          className={`text-[11px] ${
            metric.positive ? "text-emerald-400" : "text-rose-400"
          }`}
        >
          {metric.change}
        </span>
      </div>

      <p className="mt-3 text-[10px] leading-4 text-neutral-600">
        {metric.description}
      </p>
    </div>
  );
}

export default function PerformanceAnalytics() {
  const [period, setPeriod] = useState("30D");

  const equity = useMemo(() => {
    const count = PERIODS.find((item) => item.label === period)?.count ?? 30;
    return EQUITY_DATA.slice(-count);
  }, [period]);

  return (
    <section
      id="performance"
      className="relative isolate overflow-hidden bg-[#050505] px-4 py-20 text-white sm:px-6 sm:py-24 lg:px-10 lg:py-28"
    >
      <div className="pointer-events-none absolute -right-32 top-20 -z-10 h-96 w-96 rounded-full bg-orange-500/5.5 blur-[120px]" />

      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col justify-between gap-5 sm:mb-12 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-400/25 bg-orange-400/6 px-3 py-1.5 text-[10px] font-semibold tracking-[0.2em] text-orange-400">
              <BarChart3 size={13} />
              PERFORMANCE ANALYTICS
            </div>

            <h2 className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl lg:text-5xl">
              Every move tells
              <br className="hidden sm:block" /> a{" "}
              <span className="text-orange-500">story.</span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-neutral-400">
              Track performance, understand drawdowns, and measure your
              progress with a dashboard built for competitive trading.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start rounded-xl border border-white/10 bg-white/2.5 p-1 md:self-auto">
            {PERIODS.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => setPeriod(item.label)}
                aria-pressed={period === item.label}
                className={`rounded-lg px-4 py-2 text-xs font-medium transition ${
                  period === item.label
                    ? "bg-orange-500 text-black"
                    : "text-neutral-500 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {METRICS.map((metric) => (
            <MetricCard key={metric.label} metric={metric} />
          ))}
        </div>

        <div className="mt-5 grid gap-5 lg:grid-cols-[1.55fr_0.85fr]">
          <div className="min-w-0 rounded-2xl border border-white/8 bg-[#090909] p-4 sm:p-6">
            <div className="mb-6 flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-white">
                  Equity curve
                </h3>
                <p className="mt-1 text-[11px] text-neutral-500">
                  Simulated account value over time
                </p>
              </div>
              <div className="flex items-center gap-2 text-[10px] text-neutral-500">
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                Equity
              </div>
            </div>

            <EquityChart values={equity} period={period} />

            <div className="mt-5 border-t border-white/[0.07] pt-4">
              <DrawdownChart values={equity} />
            </div>
          </div>

          <div className="flex flex-col gap-4">
            <div className="rounded-2xl border border-white/8 bg-[#090909] p-5 sm:p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-neutral-500">Trading discipline</p>
                  <h3 className="mt-1 text-base font-semibold text-white">
                    Risk overview
                  </h3>
                </div>
                <CircleHelp size={17} className="text-neutral-600" />
              </div>

              <div className="mt-6 space-y-5">
                {[
                  { label: "Win rate", value: 68.5, color: "bg-emerald-400" },
                  { label: "Loss rate", value: 31.5, color: "bg-rose-400" },
                  { label: "Equity stability", value: 82, color: "bg-orange-400" },
                ].map((item) => (
                  <div key={item.label}>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-xs text-neutral-400">
                        {item.label}
                      </span>
                      <span className="text-xs font-medium text-white">
                        {item.value}%
                      </span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                      <div
                        className={`h-full rounded-full ${item.color}`}
                        style={{ width: `${item.value}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex-1 rounded-2xl border border-orange-400/20 bg-linear-to-br from-orange-500/10 to-transparent p-5 sm:p-6">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-orange-400/25 bg-orange-400/8">
                <Target size={19} className="text-orange-400" />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-white">
                Performance over hype.
              </h3>
              <p className="mt-2 text-xs leading-6 text-neutral-400">
                Review your results, understand your risk, and focus on
                consistency instead of chasing a single winning trade.
              </p>

              <div className="mt-5 flex items-center gap-2 text-[10px] text-neutral-500">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
                Sample analytics · Not live account data
              </div>
            </div>
          </div>
        </div>

        <p className="mt-5 text-center text-[10px] leading-5 text-neutral-600">
          All values shown are illustrative demo data for interface preview.
          They do not represent actual trading performance.
        </p>
      </div>
    </section>
  );
}