export const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
export const sum = (list) => list.reduce((a, b) => a + b, 0);
export const mean = (list) => (list.length ? sum(list) / list.length : 0);
export const stdev = (list) => {
  if (list.length < 2) return 0;
  const m = mean(list);
  return Math.sqrt(mean(list.map((v) => (v - m) ** 2)));
};

const money = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });
const hi = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const lo = new Intl.NumberFormat("en-US", { minimumFractionDigits: 4, maximumFractionDigits: 6 });

export const fmtPrice = (v) => (Number.isFinite(v) ? (Math.abs(v) < 1 ? lo : hi).format(v) : "—");
export const fmtMoney = (v, signed = false) =>
  Number.isFinite(v) ? `${signed && v > 0 ? "+" : ""}${money.format(v)}` : "—";
export const fmtPct = (v, digits = 2) => (Number.isFinite(v) ? `${v > 0 ? "+" : ""}${v.toFixed(digits)}%` : "—");
export const fmtR = (v) => (Number.isFinite(v) ? `${v > 0 ? "+" : ""}${v.toFixed(2)}R` : "—");
export const fmtSize = (v) => (Number.isFinite(v) ? v.toFixed(v < 1 ? 6 : v < 100 ? 4 : 2) : "—");
export const tone = (v) => (v > 0 ? "text-emerald-400" : v < 0 ? "text-red-400" : "text-zinc-300");