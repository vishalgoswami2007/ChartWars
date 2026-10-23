import { useCallback, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  CandlestickSeries,
  ColorType,
  createChart,
} from "lightweight-charts";
import {
  ArrowLeft,
  Maximize2,
  RefreshCw,
  TrendingUp,
  Users,
  EyeOff,
  GraduationCap,
  Trophy,
  Wallet,
  Play,
} from "lucide-react";

import {
  fetchCoinDetails,
  fetchCoinOHLC,
} from "../../../services/cryptoChartAPI";

const TIMEFRAMES = [
  { label: "1D", days: 1 },
  { label: "7D", days: 7 },
  { label: "30D", days: 30 },
  { label: "90D", days: 90 },
  { label: "1Y", days: 365 },
];

const MODES = [
  {
    id: "friends",
    title: "Friends Room",
    description: "Practice with friends",
    icon: Users,
  },
  {
    id: "blind",
    title: "Blind Room",
    description: "Predict before revealing",
    icon: EyeOff,
  },
  {
    id: "coaches",
    title: "VS Coaches",
    description: "Practice with guided hints",
    icon: GraduationCap,
  },
];

const formatPrice = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        maximumFractionDigits: value < 1 ? 6 : 2,
      }).format(value);

export default function CoinChartPage() {
  const { coinId } = useParams();
  const navigate = useNavigate();
  const chartContainerRef = useRef(null);
  const chartRef = useRef(null);
  const candleSeriesRef = useRef(null);

  const [coin, setCoin] = useState(null);
  const [candles, setCandles] = useState([]);
  const [timeframe, setTimeframe] = useState(1);
  const [selectedMode, setSelectedMode] = useState("friends");
  const [balance, setBalance] = useState("10000");
  const [duration, setDuration] = useState("5");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  const loadChart = useCallback(
    async (showLoader = true) => {
      if (!coinId) return;

      if (showLoader) setLoading(true);
      else setRefreshing(true);

      setError("");

      const controller = new AbortController();

      try {
        const [details, chartData] = await Promise.all([
          fetchCoinDetails(coinId, controller.signal),
          fetchCoinOHLC(coinId, timeframe, controller.signal),
        ]);

        if (!details) {
          throw new Error("This coin could not be found.");
        }

        setCoin(details);
        setCandles(chartData);
        setLastUpdated(new Date());
      } catch (err) {
        if (err.name !== "AbortError") {
          setError(err.message || "Unable to load the chart.");
        }
      } finally {
        setLoading(false);
        setRefreshing(false);
      }

      return () => controller.abort();
    },
    [coinId, timeframe]
  );

  useEffect(() => {
    const controller = new AbortController();
    let active = true;

    async function load() {
      setLoading(true);
      setError("");

      try {
        const [details, chartData] = await Promise.all([
          fetchCoinDetails(coinId, controller.signal),
          fetchCoinOHLC(coinId, timeframe, controller.signal),
        ]);

        if (!active) return;

        if (!details) {
          throw new Error("This coin could not be found.");
        }

        setCoin(details);
        setCandles(chartData);
        setLastUpdated(new Date());
      } catch (err) {
        if (active && err.name !== "AbortError") {
          setError(err.message || "Unable to load the chart.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    load();

    return () => {
      active = false;
      controller.abort();
    };
  }, [coinId, timeframe]);

  useEffect(() => {
    const container = chartContainerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      width: container.clientWidth,
      height: 430,
      layout: {
        background: { type: ColorType.Solid, color: "#0b0b0b" },
        textColor: "#8b8b8b",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "#1a1a1a" },
        horzLines: { color: "#1a1a1a" },
      },
      rightPriceScale: { borderColor: "#292929" },
      timeScale: {
        borderColor: "#292929",
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: { vertLine: { color: "#e87524" } },
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22c55e",
      downColor: "#ef4444",
      borderUpColor: "#22c55e",
      borderDownColor: "#ef4444",
      wickUpColor: "#22c55e",
      wickDownColor: "#ef4444",
    });

    chartRef.current = chart;
    candleSeriesRef.current = series;

    const resizeObserver = new ResizeObserver(([entry]) => {
      if (entry && chartRef.current) {
        chartRef.current.applyOptions({
          width: Math.floor(entry.contentRect.width),
        });
      }
    });

    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      chart.remove();
      chartRef.current = null;
      candleSeriesRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!candleSeriesRef.current || candles.length === 0) return;

    candleSeriesRef.current.setData(candles);
    chartRef.current?.timeScale().fitContent();
  }, [candles]);

  const enterFullscreen = async () => {
    const chartShell = chartContainerRef.current?.parentElement;

    if (!chartShell) return;

    try {
      if (!document.fullscreenElement) {
        await chartShell.requestFullscreen();
      } else {
        await document.exitFullscreen();
      }
    } catch {
      setError("Fullscreen is not available in this browser.");
    }
  };

  const startPractice = () => {
    const params = new URLSearchParams({
      mode: selectedMode,
      coin: coinId,
      balance,
      duration,
    });

    navigate(`/dashboard/rooms?${params.toString()}`);
  };

  const positive = (coin?.price_change_percentage_24h ?? 0) >= 0;

  return (
    <main className="mx-auto w-full max-w-[1800px] space-y-5 px-4 py-6 sm:px-7 lg:px-9">
      <button
        type="button"
        onClick={() => navigate("/dashboard/markets")}
        className="inline-flex items-center gap-2 text-xs text-zinc-400 transition hover:text-white"
      >
        <ArrowLeft size={15} />
        Back to markets
      </button>

      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="flex items-center gap-3">
          {coin?.image && (
            <img
              src={coin.image}
              alt=""
              className="h-10 w-10 rounded-full bg-white/5"
            />
          )}
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e87524]">
              Practice terminal
            </p>
            <h1 className="mt-1 text-xl font-semibold text-white sm:text-2xl">
              {coin?.name ?? coinId}
              <span className="ml-2 text-sm font-medium uppercase text-zinc-500">
                {coin?.symbol ?? ""}
              </span>
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[10px] text-zinc-500">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Waiting for data"}
          </span>
          <button
            type="button"
            onClick={() => {
              setRefreshing(true);
              setError("");
              Promise.all([
                fetchCoinDetails(coinId),
                fetchCoinOHLC(coinId, timeframe),
              ])
                .then(([details, data]) => {
                  setCoin(details);
                  setCandles(data);
                  setLastUpdated(new Date());
                })
                .catch((err) => setError(err.message))
                .finally(() => setRefreshing(false));
            }}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:border-[#e87524]/50 disabled:opacity-50"
          >
            <RefreshCw size={13} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      <section className="grid min-w-0 grid-cols-1 items-start gap-5 2xl:grid-cols-[minmax(0,1fr)_340px]">
        <div className="min-w-0 overflow-hidden rounded-xl border border-white/8 bg-[#0b0b0b]">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/8 p-4">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-zinc-500">
                Current price
              </p>
              <p className="mt-1 text-xl font-semibold text-white">
                {formatPrice(coin?.current_price)}
              </p>
              <p
                className={`mt-1 text-xs ${
                  positive ? "text-emerald-400" : "text-red-400"
                }`}
              >
                {coin?.price_change_percentage_24h == null
                  ? "24h change unavailable"
                  : `${positive ? "+" : ""}${coin.price_change_percentage_24h.toFixed(2)}% today`}
              </p>
            </div>

            <button
              type="button"
              onClick={enterFullscreen}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white"
            >
              <Maximize2 size={14} />
              Fullscreen
            </button>
          </div>

          <div className="flex items-center gap-2 border-b border-white/8 px-4 py-3">
            <span className="mr-2 text-[10px] text-zinc-500">Range</span>
            {TIMEFRAMES.map((item) => (
              <button
                key={item.days}
                type="button"
                onClick={() => setTimeframe(item.days)}
                className={`rounded-md px-3 py-1.5 text-[11px] transition ${
                  timeframe === item.days
                    ? "bg-[#e87524]/15 text-[#f59a55]"
                    : "text-zinc-500 hover:bg-white/5 hover:text-white"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="m-4 rounded-lg border border-red-400/20 bg-red-400/5 p-3 text-xs text-red-300">
              {error}
            </div>
          )}

          {loading && (
            <p className="px-4 pt-4 text-xs text-zinc-500">
              Loading historical candles...
            </p>
          )}

          <div ref={chartContainerRef} className="min-h-75 w-full" />

          {!loading && candles.length === 0 && !error && (
            <p className="px-4 pb-6 text-xs text-zinc-500">
              No candle data is available for this range.
            </p>
          )}

          <p className="border-t border-white/8 px-4 py-3 text-[10px] leading-5 text-zinc-600">
            Historical market data for educational practice. Prices may be
            delayed. This is not a real-money trading terminal.
          </p>
        </div>

        <aside className="space-y-4 rounded-xl border border-white/8 bg-[#0d0d0d] p-4 sm:p-5">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e87524]">
              Practice setup
            </p>
            <h2 className="mt-2 text-lg font-semibold text-white">
              Set your session
            </h2>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Configure a virtual practice round before entering a room.
            </p>
          </div>

          <div className="rounded-lg border border-white/8 bg-black/20 p-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <Wallet size={15} className="text-[#e87524]" />
              <label htmlFor="practice-balance" className="text-xs">
                Virtual starting balance (USD)
              </label>
            </div>
            <input
              id="practice-balance"
              type="number"
              min="100"
              max="1000000"
              step="100"
              value={balance}
              onChange={(event) => setBalance(event.target.value)}
              className="mt-3 w-full rounded-md border border-white/10 bg-[#080808] px-3 py-2.5 text-sm text-white outline-none focus:border-[#e87524]/60"
            />
          </div>

          <div>
            <label
              htmlFor="practice-duration"
              className="text-xs text-zinc-400"
            >
              Session duration
            </label>
            <select
              id="practice-duration"
              value={duration}
              onChange={(event) => setDuration(event.target.value)}
              className="mt-2 w-full rounded-lg border border-white/10 bg-[#080808] px-3 py-3 text-xs text-white outline-none focus:border-[#e87524]/60"
            >
              <option value="3">3 minutes</option>
              <option value="5">5 minutes</option>
              <option value="10">10 minutes</option>
              <option value="15">15 minutes</option>
            </select>
          </div>

          <div>
            <p className="mb-2 text-xs text-zinc-400">Choose practice mode</p>
            <div className="space-y-2">
              {MODES.map(({ id, title, description, icon: Icon }) => (
                <button
                  key={id}
                  type="button"
                  onClick={() => setSelectedMode(id)}
                  className={`flex w-full items-center gap-3 rounded-lg border p-3 text-left transition ${
                    selectedMode === id
                      ? "border-[#e87524]/50 bg-[#e87524]/8"
                      : "border-white/8 hover:border-white/20"
                  }`}
                >
                  <Icon
                    size={18}
                    className={
                      selectedMode === id ? "text-[#f59a55]" : "text-zinc-500"
                    }
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-xs font-medium text-zinc-200">
                      {title}
                    </span>
                    <span className="mt-1 block text-[10px] text-zinc-500">
                      {description}
                    </span>
                  </span>
                  <span
                    className={`h-3 w-3 rounded-full border ${
                      selectedMode === id
                        ? "border-[#e87524] bg-[#e87524]"
                        : "border-zinc-600"
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-white/8 p-3">
            <div className="flex items-center gap-2 text-zinc-400">
              <TrendingUp size={15} className="text-[#e87524]" />
              <span className="text-xs">Practice only</span>
            </div>
            <p className="mt-2 text-[10px] leading-5 text-zinc-500">
              No deposits, real orders, or real-money trades are placed.
            </p>
          </div>

          <button
            type="button"
            onClick={startPractice}
            disabled={!coin || Number(balance) < 100 || !Number.isFinite(Number(balance))}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#e87524] px-4 py-3 text-xs font-semibold text-black transition hover:bg-[#f59a55] disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Play size={14} fill="currentColor" />
            Start Practising
          </button>

          <button
            type="button"
            onClick={() => navigate("/dashboard/rooms?mode=tournament")}
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-white/10 px-4 py-3 text-xs text-zinc-400 transition hover:border-white/20 hover:text-white"
          >
            <Trophy size={14} />
            Tournament · Coming Soon
          </button>
        </aside>
      </section>
    </main>
  );
}