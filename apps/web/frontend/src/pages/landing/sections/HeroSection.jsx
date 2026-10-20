import { ArrowDownRight, ArrowRight, ShieldCheck } from "lucide-react";
import Container from "../../../components/ui/Container";
import Button from "../../../components/ui/Button";

const candles = [
  { x: 38, y: 150, h: 37, up: true },
  { x: 74, y: 162, h: 28, up: false },
  { x: 110, y: 130, h: 42, up: true },
  { x: 146, y: 140, h: 32, up: false },
  { x: 182, y: 112, h: 40, up: true },
  { x: 218, y: 120, h: 34, up: false },
  { x: 254, y: 92, h: 44, up: true },
  { x: 290, y: 102, h: 30, up: false },
  { x: 326, y: 70, h: 42, up: true },
  { x: 362, y: 78, h: 30, up: false },
  { x: 398, y: 52, h: 43, up: true },
];

function ChartPreview() {
  return (
    <div className="cw-card overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[#202a33] px-4 py-4">
        <div>
          <p className="text-sm font-semibold text-white">BTC / USDT</p>
          <p className="mt-1 text-xs text-[#8193a5]">5 minute · Sample preview</p>
        </div>

        <span className="border border-[#00e887]/30 px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#00e887]">
          Simulation
        </span>
      </div>

      <div className="cw-chart-grid px-2 py-5 sm:px-4">
        <svg
          viewBox="0 0 440 220"
          role="img"
          aria-label="Illustrative candlestick chart showing rising and falling candles"
          className="w-full"
        >
          {[35, 75, 115, 155, 195].map((y) => (
            <line
              key={y}
              x1="0"
              y1={y}
              x2="440"
              y2={y}
              stroke="#27323b"
              strokeWidth="1"
            />
          ))}

          {candles.map((candle) => (
            <g key={candle.x}>
              <line
                x1={candle.x}
                y1={candle.y - 12}
                x2={candle.x}
                y2={candle.y + candle.h}
                stroke={candle.up ? "#00e887" : "#ff5364"}
                strokeWidth="2"
              />

              <rect
                x={candle.x - 7}
                y={candle.y}
                width="14"
                height={candle.h * 0.62}
                fill={candle.up ? "#00e887" : "#ff5364"}
              />
            </g>
          ))}

          <line
            x1="0"
            y1="52"
            x2="440"
            y2="52"
            stroke="#00e887"
            strokeDasharray="5 5"
            strokeOpacity="0.6"
          />
        </svg>
      </div>

      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-[#202a33] px-4 py-3 text-xs">
        <span className="text-[#8c9bad]">Virtual balance</span>
        <span className="font-semibold text-white">$20,000</span>
        <span className="text-[#00e887]">Risk-first practice</span>
      </div>
    </div>
  );
}

export default function HeroSection() {
  return (
    <section className="cw-grid-bg cw-hero-glow">
      <Container>
        <div className="grid cw-hero items-center gap-12 py-16 md:py-20 lg:grid-cols-[1fr_1.05fr] lg:gap-16 lg:py-24">
          <div className="max-w-2xl">
            <div className="mb-6 inline-flex items-center gap-2 border border-[#00e887]/20 bg-[#00e887]/5 px-3 py-2">
              <ShieldCheck size={14} className="text-[#00e887]" />
              <span className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#00e887] sm:text-xs">
                Virtual funds · Educational practice
              </span>
            </div>

            <h1 className="text-4xl font-bold leading-[1.08] tracking-[-0.045em] text-white sm:text-5xl md:text-6xl xl:text-7xl">
              Trade the market.
              <span className="mt-2 block text-[#00e887]">
                Master your strategy.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-7 text-[#93a2b2] sm:text-lg sm:leading-8">
              Practise with historical markets, challenge your friends, and
              build better trading discipline — one decision at a time.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button to="/signup">
                Start practising <ArrowRight size={17} />
              </Button>

              <Button
                href="#how-it-works"
                variant="secondary"
              >
                Explore how it works <ArrowDownRight size={17} />
              </Button>
            </div>

            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-[#8193a5]">
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e887]" />
                Virtual funds only
              </span>
              <span className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[#00e887]" />
                Practice at your pace
              </span>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -inset-5 -z-10 bg-[#00e887]/5 blur-3xl" />
            <ChartPreview />

            <div className="mt-3 flex items-center justify-between gap-3 text-[10px] text-[#6f8091] sm:text-xs">
              <span>ILLUSTRATIVE CHART · NOT LIVE MARKET DATA</span>
              <span>CHARTWARS SIMULATOR</span>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}