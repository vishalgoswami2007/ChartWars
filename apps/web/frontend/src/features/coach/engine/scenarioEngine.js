const BASE_TIME = 1704067200; // 2024-01-01 00:00 UTC. The chart needs a time axis; the data is illustrative.
const STEP = 3600;

export function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A random number that depends only on (seed, index, salt), so decisions can be replayed exactly. */
export const hashRand = (seed, index, salt = 0) =>
  mulberry32((Math.imul(seed, 374761393) + Math.imul(index + 1, 668265263) + Math.imul(salt + 1, 2147483629)) >>> 0)();

function buildScenario(def, warmup) {
  const rng = mulberry32(def.seed);
  const gauss = () => Math.sqrt(-2 * Math.log(1 - rng())) * Math.cos(2 * Math.PI * rng());

  const candles = [];
  const regimes = [];
  let price = def.start ?? 100;

  for (const seg of def.segments) {
    const anchor = price;
    for (let k = 0; k < seg.len; k += 1) {
      const open = price;
      const pull = seg.kind === "range" ? -0.08 * ((open - anchor) / anchor) : 0;
      const close = Math.max(open * (1 + seg.drift + pull + seg.vol * gauss()), 0.01);
      const high = Math.max(open, close) * (1 + Math.abs(gauss()) * seg.vol * 0.6);
      const low = Math.min(open, close) * (1 - Math.abs(gauss()) * seg.vol * 0.6);
      candles.push({ time: BASE_TIME + candles.length * STEP, open, high, low, close });
      regimes.push({ kind: seg.kind, label: seg.label });
      price = close;
    }
  }
  return { id: def.id, candles, regimes, warmup, total: candles.length };
}

const cache = new Map();

export function buildScenarioCached(def, warmup) {
  const key = `${def.id}:${warmup}`;
  if (!cache.has(key)) cache.set(key, buildScenario(def, warmup));
  return cache.get(key);
}