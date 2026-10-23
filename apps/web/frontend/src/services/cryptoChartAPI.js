const BASE_URL = "https://api.coingecko.com/api/v3";
const API_KEY = import.meta.env.VITE_COINGECKO_DEMO_API_KEY?.trim();

export async function fetchCoinOHLC(coinId, days = 1, signal) {
  const url = new URL(`${BASE_URL}/coins/${encodeURIComponent(coinId)}/ohlc`);

  url.search = new URLSearchParams({
    vs_currency: "usd",
    days: String(days),
  }).toString();

  const headers = { accept: "application/json" };

  if (API_KEY) {
    headers["x-cg-demo-api-key"] = API_KEY;
  }

  const response = await fetch(url, { headers, signal });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("Chart rate limit reached. Please wait before retrying.");
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error("CoinGecko rejected the API key.");
    }

    throw new Error(`Unable to load chart data (${response.status}).`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected chart data response.");
  }

  return data
    .filter(
      (candle) =>
        Array.isArray(candle) &&
        candle.length >= 5 &&
        candle.slice(0, 5).every(Number.isFinite)
    )
    .map(([time, open, high, low, close]) => ({
      time: Math.floor(time / 1000),
      open,
      high,
      low,
      close,
    }));
}

export async function fetchCoinDetails(coinId, signal) {
  const url = new URL(`${BASE_URL}/coins/markets`);

  url.search = new URLSearchParams({
    vs_currency: "usd",
    ids: coinId,
    price_change_percentage: "24h",
  }).toString();

  const headers = { accept: "application/json" };

  if (API_KEY) {
    headers["x-cg-demo-api-key"] = API_KEY;
  }

  const response = await fetch(url, { headers, signal });

  if (!response.ok) {
    throw new Error(`Unable to load coin details (${response.status}).`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data[0] ?? null : null;
}