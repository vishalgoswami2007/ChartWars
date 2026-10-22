
const BASE_URL = "https://api.coingecko.com/api/v3";

const API_KEY = import.meta.env.VITE_COINGECKO_DEMO_API_KEY?.trim();

export async function fetchMarkets({ page = 1, perPage = 100 } = {}) {
  const url = new URL(`${BASE_URL}/coins/markets`);

  url.search = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(perPage),
    page: String(page),
    sparkline: "true",
    price_change_percentage: "1h,24h,7d",
  }).toString();

  const headers = { accept: "application/json" };

  if (API_KEY) {
    headers["x-cg-demo-api-key"] = API_KEY;
  }

  const response = await fetch(url, { headers });

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "CoinGecko rate limit reached. Please wait before refreshing."
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "CoinGecko API key was rejected. Check your .env configuration."
      );
    }

    throw new Error(`Market data request failed (${response.status}).`);
  }

  const data = await response.json();

  if (!Array.isArray(data)) {
    throw new Error("Unexpected market data response.");
  }

  return data;
}
