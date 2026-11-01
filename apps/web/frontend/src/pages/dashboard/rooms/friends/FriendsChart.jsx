import { useEffect, useRef } from "react";
import * as LWC from "lightweight-charts";

import { emaSeries } from "./friendsData";

const MIN_RANGE = 0.0008; // y-axis kam se kam price ka 0.08% chauda
const VISIBLE = 60; // shuru me itni candles dikhao

// Works with lightweight-charts v5 (addSeries) and v4 (addCandlestickSeries / addLineSeries).
function addSeries(chart, kind, options) {
  if (typeof chart.addSeries === "function" && LWC[kind]) return chart.addSeries(LWC[kind], options);
  return kind === "CandlestickSeries" ? chart.addCandlestickSeries(options) : chart.addLineSeries(options);
}

export default function FriendsChart({ candles, position, showEma, fitKey }) {
  const boxRef = useRef(null);
  const chartRef = useRef(null);
  const seriesRef = useRef(null);
  const emaRef = useRef(null);
  const linesRef = useRef([]);
  const initRef = useRef(false);
  const countRef = useRef(0);
  const firstRef = useRef(null);

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
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: true,
        barSpacing: 10,
        rightOffset: 4,
      },
    });

    seriesRef.current = addSeries(chart, "CandlestickSeries", {
      upColor: "#34d399",
      downColor: "#f87171",
      borderVisible: false,
      wickUpColor: "#34d399",
      wickDownColor: "#f87171",
      autoscaleInfoProvider: (original) => {
        const res = original();
        if (!res?.priceRange) return res;
        const { minValue, maxValue } = res.priceRange;
        const mid = (minValue + maxValue) / 2;
        const min = mid * MIN_RANGE;
        if (maxValue - minValue < min) {
          return { ...res, priceRange: { minValue: mid - min / 2, maxValue: mid + min / 2 } };
        }
        return res;
      },
    });
    emaRef.current = addSeries(chart, "LineSeries", {
      color: "#fb923c",
      lineWidth: 2,
      priceLineVisible: false,
      lastValueVisible: false,
      crosshairMarkerVisible: false,
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
      emaRef.current = null;
      linesRef.current = [];
      initRef.current = false;
      countRef.current = 0;
      firstRef.current = null;
    };
  }, []);

  useEffect(() => {
    const series = seriesRef.current;
    if (!series || candles.length === 0) return;

    const last = candles[candles.length - 1];
    const appendOnly =
      initRef.current && candles[0].time === firstRef.current && candles.length - countRef.current <= 1;

    if (appendOnly) {
      series.update(last);
    } else {
      if (!initRef.current) {
        const p = last.close;
        series.applyOptions({ priceFormat: { type: "price", precision: p < 1 ? 6 : 2, minMove: p < 1 ? 0.000001 : 0.01 } });
      }
      series.setData(candles);
      chartRef.current?.timeScale().setVisibleLogicalRange({
        from: Math.max(0, candles.length - VISIBLE),
        to: candles.length + 3,
      });
      initRef.current = true;
    }
    firstRef.current = candles[0].time;
    countRef.current = candles.length;

    const ema = emaSeries(
      candles.map((c) => c.close),
      20
    );
    emaRef.current?.setData(candles.map((c, i) => ({ time: c.time, value: ema[i] })));
  }, [candles]);

  useEffect(() => {
    emaRef.current?.applyOptions({ visible: showEma });
  }, [showEma]);

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
    linesRef.current = [];
    if (!position) return;

    const make = (price, color, title, dashed) =>
      series.createPriceLine({
        price,
        color,
        lineWidth: 1,
        lineStyle: dashed ? LWC.LineStyle.Dashed : LWC.LineStyle.Solid,
        axisLabelVisible: true,
        title,
      });
    linesRef.current.push(make(position.entry, "#f97316", "ENTRY", false), make(position.stop, "#f87171", "SL", true));
    if (position.tp) linesRef.current.push(make(position.tp, "#34d399", "TP", true));
  }, [position]);

  useEffect(() => {
    if (fitKey > 0) chartRef.current?.timeScale().fitContent();
  }, [fitKey]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={boxRef} className="absolute inset-0" />
    </div>
  );
}