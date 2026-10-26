import { analyze } from "./indicators";
import { rOf } from "./tradeSimulator";

/** Plain-language observations about the chart so far. They describe, they do not predict. */
export function coachTips({ candles, position, level, rules }) {
  if (candles.length < 30) return [];
  const a = analyze(candles);
  const verbose = level === "beginner";
  const tips = [];
  const add = (id, tone, long, short) => tips.push({ id, tone, text: verbose ? long : short });

  if (a.trend === "up") {
    add("trend-up", "info", "Price is above its 20 and 50 period averages. The trend is up, so ideas in that direction have more support.", "Trend filter: up.");
  } else if (a.trend === "down") {
    add("trend-down", "info", "Price is below its 20 and 50 period averages. The trend is down, so buying a falling market needs a strong reason.", "Trend filter: down.");
  } else {
    add("trend-flat", "info", "The averages are tangled, so there is no clear trend. Waiting is a valid choice.", "No clear trend.");
  }

  if (a.rsi >= 70) add("rsi-high", "warn", "RSI is high. Moves may be stretched, so avoid chasing.", "RSI stretched high.");
  else if (a.rsi <= 30) add("rsi-low", "warn", "RSI is low. Selling pressure may be stretched, so avoid chasing it down.", "RSI stretched low.");

  const toHigh = a.rangeHigh - a.close;
  const toLow = a.close - a.rangeLow;
  if (a.close > a.rangeHigh) {
    add("break-up", "warn", "Price closed above the recent range. Fresh breakouts can fail, so watch the next candles.", "Close above the range: confirm.");
  } else if (a.close < a.rangeLow) {
    add("break-down", "warn", "Price closed below the recent range. Fresh breakouts can fail, so watch the next candles.", "Close below the range: confirm.");
  } else if (toHigh >= 0 && toHigh <= 0.5 * a.atr) {
    add("near-high", "info", "Price is testing the recent high. A breakout needs a close above it, and many fail.", "Testing the range high.");
  } else if (toLow >= 0 && toLow <= 0.5 * a.atr) {
    add("near-low", "info", "Price is testing the recent low. A breakout needs a close below it, and many fail.", "Testing the range low.");
  }

  if (a.atrRatio >= 1.6) add("vol-high", "warn", "Volatility is high. Candles are bigger than usual, so use a wider stop or a smaller size.", "Volatility elevated.");
  else if (a.atrRatio <= 0.7) add("vol-low", "info", "Volatility is low and price is quiet. Quiet markets can move fast afterwards.", "Volatility compressed.");

  if (a.trend === "up" && Math.abs(a.close - a.e20) <= 0.4 * a.atr) {
    add("pullback-up", "good", "Price pulled back to the 20-period average in an uptrend. A confirming candle would strengthen the idea.", "Pullback to EMA 20 in an uptrend.");
  } else if (a.trend === "down" && Math.abs(a.close - a.e20) <= 0.4 * a.atr) {
    add("pullback-down", "good", "Price bounced up to the 20-period average in a downtrend. A confirming candle would strengthen the idea.", "Bounce to EMA 20 in a downtrend.");
  }

  if (position) {
    if (rOf(position, a.close) >= 1) {
      add("protect", "good", "Your trade is up about 1R. Many traders protect profit once they reach this point.", "Position at +1R.");
    }
    if (Math.abs(a.close - position.stop) <= 0.4 * a.atr) {
      add("near-stop", "warn", "Price is close to your stop-loss. The plan is already set, so let it work.", "Price near your stop.");
    }
    if (rules.requireTp && !position.tp) {
      add("no-tp", "warn", "This level expects a take-profit plan, and this trade has none.", "No take-profit set.");
    }
  }
  return tips;
}