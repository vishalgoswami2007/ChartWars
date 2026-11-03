import { useEffect, useRef } from "react";
import * as LWC from "lightweight-charts";

import { emaSeries } from "./friendsData";

const MIN_RANGE = 0.0008; // y-axis kam se kam price ka 0.08% chauda
const BAR_SPACING = 8; // TradingView jaisa fixed candle width
const RIGHT_OFFSET = 6;
const EMA_PERIOD = 20;

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
      grid: { vertLines: { color: "rgba(255,255,255,0.035)" }, horzLines: { color: "rgba(255,255,255,0.035)" } },
      crosshair: {
        mode: LWC.CrosshairMode.Normal,
        vertLine: {
          color: "rgba(161,161,170,0.6)",
          style: LWC.LineStyle.Dashed,
          width: 1,
          labelBackgroundColor: "#3f3f46",
        },
        horzLine: {
          color: "rgba(161,161,170,0.6)",
          style: LWC.LineStyle.Dashed,
          width: 1,
          labelBackgroundColor: "#3f3f46",
        },
      },
      rightPriceScale: {
        borderColor: "rgba(255,255,255,0.08)",
        scaleMargins: { top: 0.12, bottom: 0.12 },
      },
      timeScale: {
        borderColor: "rgba(255,255,255,0.08)",
        timeVisible: true,
        secondsVisible: true,
        barSpacing: BAR_SPACING,
        minBarSpacing: 2,
        rightOffset: RIGHT_OFFSET,
      },
    });

    seriesRef.current = addSeries(chart, "CandlestickSeries", {
      upColor: "#26a69a",
      downColor: "#ef5350",
      borderVisible: false,
      wickUpColor: "#26a69a",
      wickDownColor: "#ef5350",
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
      chartRef.current?.timeScale().applyOptions({ barSpacing: BAR_SPACING });
      chartRef.current?.timeScale().scrollToRealTime();
      initRef.current = true;
    }
    firstRef.current = candles[0].time;
    countRef.current = candles.length;

    // EMA tabhi dikhao jab itni candles ho jaye (pehle ki values galat hoti hain)
    const ema = emaSeries(
      candles.map((c) => c.close),
      EMA_PERIOD
    );
    const emaData = [];
    for (let i = EMA_PERIOD - 1; i < candles.length; i += 1) {
      if (Number.isFinite(ema[i])) emaData.push({ time: candles[i].time, value: ema[i] });
    }
    emaRef.current?.setData(emaData);
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
    linesRef.current.push(make(position.entry, "#f97316", "ENTRY", false), make(position.stop, "#ef5350", "SL", true));
    if (position.tp) linesRef.current.push(make(position.tp, "#26a69a", "TP", true));
  }, [position]);

  // Fit button: bar width reset + latest candle pe wapas
  useEffect(() => {
    if (fitKey > 0) {
      chartRef.current?.timeScale().applyOptions({ barSpacing: BAR_SPACING });
      chartRef.current?.timeScale().scrollToRealTime();
    }
  }, [fitKey]);

  return (
    <div className="relative min-h-0 flex-1">
      <div ref={boxRef} className="absolute inset-0" />
    </div>
  );
}