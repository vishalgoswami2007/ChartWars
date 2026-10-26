export function emaSeries(values, period) {
  const k = 2 / (period + 1);
  const out = new Array(values.length);
  let prev = values[0];
  for (let i = 0; i < values.length; i += 1) {
    prev = i === 0 ? values[0] : values[i] * k + prev * (1 - k);
    out[i] = prev;
  }
  return out;
}

export function rsiSeries(closes, period = 14) {
  const out = new Array(closes.length).fill(NaN);
  if (closes.length <= period) return out;
  let gain = 0;
  let loss = 0;
  for (let i = 1; i <= period; i += 1) {
    const d = closes[i] - closes[i - 1];
    if (d >= 0) gain += d;
    else loss -= d;
  }
  gain /= period;
  loss /= period;
  out[period] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  for (let i = period + 1; i < closes.length; i += 1) {
    const d = closes[i] - closes[i - 1];
    gain = (gain * (period - 1) + Math.max(d, 0)) / period;
    loss = (loss * (period - 1) + Math.max(-d, 0)) / period;
    out[i] = loss === 0 ? 100 : 100 - 100 / (1 + gain / loss);
  }
  return out;
}

export function atrSeries(candles, period = 14) {
  const out = new Array(candles.length);
  let prevAtr = 0;
  for (let i = 0; i < candles.length; i += 1) {
    const c = candles[i];
    const prevClose = i > 0 ? candles[i - 1].close : c.open;
    const tr = Math.max(c.high - c.low, Math.abs(c.high - prevClose), Math.abs(c.low - prevClose));
    prevAtr = i < period ? (i === 0 ? tr : (prevAtr * i + tr) / (i + 1)) : (prevAtr * (period - 1) + tr) / period;
    out[i] = prevAtr;
  }
  return out;
}

/** Reads the latest candle in context. Only uses candles that have already happened. */
export function analyze(candles) {
  const n = candles.length;
  const i = n - 1;
  const closes = candles.map((c) => c.close);
  const e9 = emaSeries(closes, 9);
  const e21 = emaSeries(closes, 21);
  const e20 = emaSeries(closes, 20);
  const e50 = emaSeries(closes, 50);
  const atrs = atrSeries(candles, 14);
  const rsis = rsiSeries(closes, 14);

  const recent = atrs.slice(-50);
  const atrAvg = recent.reduce((a, b) => a + b, 0) / recent.length;
  const prior = candles.slice(Math.max(0, n - 21), n - 1);
  const close = closes[i];

  const up = e20[i] > e50[i] && close > e50[i];
  const down = e20[i] < e50[i] && close < e50[i];

  return {
    i,
    close,
    candle: candles[i],
    prevCandle: candles[i - 1] ?? candles[i],
    e9: e9[i],
    e9p: e9[i - 1] ?? e9[i],
    e21: e21[i],
    e21p: e21[i - 1] ?? e21[i],
    e20: e20[i],
    e20p: e20[i - 1] ?? e20[i],
    e50: e50[i],
    e50p: e50[i - 1] ?? e50[i],
    rsi: Number.isFinite(rsis[i]) ? rsis[i] : 50,
    atr: atrs[i],
    atrAvg,
    atrRatio: atrAvg > 0 ? atrs[i] / atrAvg : 1,
    trend: up ? "up" : down ? "down" : "flat",
    rangeHigh: prior.length ? Math.max(...prior.map((c) => c.high)) : candles[i].high,
    rangeLow: prior.length ? Math.min(...prior.map((c) => c.low)) : candles[i].low,
  };
}