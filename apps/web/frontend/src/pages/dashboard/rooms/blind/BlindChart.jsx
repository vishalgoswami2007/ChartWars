import { useEffect, useRef } from "react";
import * as LWC from "lightweight-charts";

// Works with lightweight-charts v5 (addSeries) and v4 (addCandlestickSeries).
function addCandles(chart, options) {
  if (typeof chart.addSeries === "function" && LWC.CandlestickSeries) return chart.addSeries(LWC.CandlestickSeries, options);
  return chart.addCandlestickSeries(options);
}

const LINE_COLORS = { support: "#34d399", resistance: "#f87171", neutral: "#f97316" };

/**
 * data: candles to draw. lines: [{ price, label, kind }]. markers: [{ time, position, color, shape, text }].
 * The parent must keep `data`, `lines` and `markers` stable between renders (useMemo).
 */
export default function BlindChart({ data, lines, markers }) {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const markersApiRef = useRef(null);
  const linesRef = useRef([]);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return undefined;

    const chart = LWC.createChart(el, {
      width: el.clientWidth,
      height: el.clientHeight,
      layout: {
        background: { type: "solid", color: "transparent" },
        textColor: "#a1a1aa",
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
      },
      grid: { vertLines: { color: "rgba(255,255,255,0.04)" }, horzLines: { color: "rgba(255,255,255,0.04)" } },
      crosshair: {
        mode: LWC.CrosshairMode.Normal,
        vertLine: { color: "rgba(249,115,22,0.6)", labelBackgroundColor: "#f97316" },
        horzLine: { color: "rgba(249,115,22,0.6)", labelBackgroundColor: "#f97316" },
      },
      rightPriceScale: { borderColor: "rgba(255,255,255,0.08)" },
      timeScale: { borderColor: "rgba(255,255,255,0.08)", timeVisible: true, secondsVisible: false },
    });

    seriesRef.current = addCandles(chart, {
      upColor: "#34d399",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    });
    chartRef.current = chart;

    const observer = new ResizeObserver(([entry]) => {
      const { width, height } = entry.contentRect;
      if (width > 0 && height > 0) chart.applyOptions({ width, height });
    });
    observer.observe(el);

    return () => {
      observer.disconnect();
      chart.remove();
      chartRef.current = null;
      seriesRef.current = null;
      markersApiRef.current = null;
      linesRef.current = [];
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    series.setData(data);
    chartRef.current?.timeScale().fitContent();
  }, [data]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    const sorted = [...markers].sort((a, b) => a.time - b.time);
    if (typeof LWC.createSeriesMarkers === "function") {
      if (markersApiRef.current) markersApiRef.current.setMarkers(sorted);
      else markersApiRef.current = LWC.createSeriesMarkers(series, sorted); // v5
    } else if (typeof series.setMarkers === "function") {
      series.setMarkers(sorted); // v4
    }
  }, [markers, data]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    for (const line of linesRef.current) {
      try {
        series.removePriceLine(line);
      } catch {
        // The chart was already disposed.
      }
    }
    linesRef.current = lines.map((line) =>
      series.createPriceLine({
        price: line.price,
        color: LINE_COLORS[line.kind] ?? LINE_COLORS.neutral,
        lineWidth: 1,
        lineStyle: LWC.LineStyle.Dashed,
        axisLabelVisible: true,
        title: line.label,
      })
    );
  }, [lines]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={boxRef} className="absolute inset-0" role="img" aria-label="Candlestick chart for this level" />
    </div>
  );
}