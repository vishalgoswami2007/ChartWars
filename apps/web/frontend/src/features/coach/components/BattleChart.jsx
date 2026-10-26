import { useEffect, useRef } from "react";
import * as LWC from "lightweight-charts";

import { emaSeries } from "../engine/indicators";

// Works with lightweight-charts v5 (addSeries) and v4 (addCandlestickSeries / addLineSeries).
function addSeries(chart, kind, options) {
  if (typeof chart.addSeries === "function" && LWC[kind]) return chart.addSeries(LWC[kind], options);
  return kind === "CandlestickSeries" ? chart.addCandlestickSeries(options) : chart.addLineSeries(options);
}

const lineOptions = { priceLineVisible: false, lastValueVisible: false, crosshairMarkerVisible: false };

/** candles: only what has happened. lines: [{ price, color, title, dashed }]. markers: lightweight-charts markers. */
export default function BattleChart({ candles, lines, markers, showE20, showE50, follow }) {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const e20Ref = useRef(null);
  const e50Ref = useRef(null);
  const markersApiRef = useRef(null);
  const priceLinesRef = useRef([]);
  const lengthRef = useRef(0);

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

    seriesRef.current = addSeries(chart, "CandlestickSeries", {
      upColor: "#34d399",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
      priceFormat: { type: "price", precision: 2, minMove: 0.01 },
    });
    e20Ref.current = addSeries(chart, "LineSeries", { ...lineOptions, color: "#fb923c", lineWidth: 2, visible: false });
    e50Ref.current = addSeries(chart, "LineSeries", { ...lineOptions, color: "#e4e4e7", lineWidth: 1, visible: false });
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
      e20Ref.current = null;
      e50Ref.current = null;
      markersApiRef.current = null;
      priceLinesRef.current = [];
      lengthRef.current = 0;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || candles.length === 0) return;

    if (candles.length === lengthRef.current + 1 && lengthRef.current > 0) series.update(candles[candles.length - 1]);
    else series.setData(candles);
    lengthRef.current = candles.length;

    const closes = candles.map((c) => c.close);
    const toLine = (values) => candles.map((c, i) => ({ time: c.time, value: values[i] }));
    e20Ref.current?.setData(toLine(emaSeries(closes, 20)));
    e50Ref.current?.setData(toLine(emaSeries(closes, 50)));

    if (follow) {
      const n = candles.length;
      chartRef.current?.timeScale().setVisibleLogicalRange({ from: Math.max(0, n - 80), to: n + 4 });
    }
  }, [candles, follow]);

  useEffect(() => {
    e20Ref.current?.applyOptions({ visible: showE20 });
  }, [showE20]);

  useEffect(() => {
    e50Ref.current?.applyOptions({ visible: showE50 });
  }, [showE50]);

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
  }, [markers, candles]);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series) return;
    for (const line of priceLinesRef.current) {
      try {
        series.removePriceLine(line);
      } catch {
        // The chart was already disposed.
      }
    }
    priceLinesRef.current = lines.map((line) =>
      series.createPriceLine({
        price: line.price,
        color: line.color,
        lineWidth: 1,
        lineStyle: line.dashed ? LWC.LineStyle.Dashed : LWC.LineStyle.Solid,
        axisLabelVisible: true,
        title: line.title,
      })
    );
  }, [lines]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={boxRef} className="absolute inset-0" role="img" aria-label="Candlestick chart of the match" />
    </div>
  );
}