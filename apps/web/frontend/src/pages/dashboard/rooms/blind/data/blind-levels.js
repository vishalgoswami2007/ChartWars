import level01 from "./blind-level-01";
import level02 from "./blind-level-02";
import level03 from "./blind-level-03";

export const TOTAL_LEVELS = 50;

export const BLIND_ROUTES = {
  rooms: "/dashboard/rooms",
  home: "/dashboard/rooms/blind",
  map: "/dashboard/rooms/blind/levels",
  level: (id) => `/dashboard/rooms/blind/level/${id}`,
};

// Proposed curriculum, not a final level list.
export const BANDS = [
  { from: 1, to: 5, title: "Candle basics, trend and bullish or bearish ideas", note: "Clear visuals and guided practice" },
  { from: 6, to: 10, title: "Hammer, Shooting Star, wicks and bodies", note: "Identify a pattern in context" },
  { from: 11, to: 20, title: "Engulfing candles, support and resistance", note: "Compare several clues" },
  { from: 21, to: 30, title: "Breakouts, pullbacks and trend continuation", note: "Mixed signals and confirmation" },
  { from: 31, to: 40, title: "False breakouts, choppy markets and risk", note: "WAIT decisions and risk evaluation" },
  { from: 41, to: 50, title: "Combined concepts and advanced scenarios", note: "Multi-step reasoning" },
];

const AUTHORED = [level01, level02, level03];

/** 50 slots. Only individually authored levels are playable; the rest are planned, not generated filler. */
export const LEVELS = Array.from({ length: TOTAL_LEVELS }, (_, i) => {
  const id = i + 1;
  const found = AUTHORED.find((l) => l.id === id);
  return found ? { ...found, authored: true } : { id, authored: false, title: null };
});

export const getLevel = (id) => LEVELS.find((l) => l.id === id) ?? null;
export const bandFor = (id) => BANDS.find((b) => id >= b.from && id <= b.to);

const BASE_TIME = 1704067200; // 2024-01-01 00:00 UTC. The chart needs a time axis; the data is illustrative.
const STEP = 3600;

/** Turns [o, h, l, c] rows into chart candles. `offset` continues the time axis for revealed candles. */
export function toSeries(rows, offset = 0) {
  return rows.map(([open, high, low, close], i) => ({
    time: BASE_TIME + (offset + i) * STEP,
    open,
    high,
    low,
    close,
  }));
}