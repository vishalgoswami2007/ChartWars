
const BASE_URL = "https://api.coingecko.com/api/v3";

const API_KEY = import.meta.env.VITE_COINGECKO_DEMO_API_KEY?.trim();

export async function fetchMarkets({
  page = 1,
  perPage = 100,
  signal,
} = {}) {
  const url = new URL(`${BASE_URL}/coins/markets`);

  url.search = new URLSearchParams({
    vs_currency: "usd",
    order: "market_cap_desc",
    per_page: String(perPage),
    page: String(page),
    sparkline: "true",
    price_change_percentage: "1h,24h,7d",
  }).toString();

  const headers = {
    accept: "application/json",
  };

  if (API_KEY) {
    headers["x-cg-demo-api-key"] = API_KEY;
  }

  let response;

  try {
    response = await fetch(url.toString(), {
      method: "GET",
      headers,
      signal,
    });
  } catch (error) {
    // Preserve cancellation and timeout errors.
    if (error.name === "AbortError") {
      throw error;
    }

    throw new Error(
      "Cannot connect to CoinGecko. Check your internet connection, then try again."
    );
  }

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error(
        "CoinGecko rate limit reached. Wait a little before retrying."
      );
    }

    if (response.status === 401 || response.status === 403) {
      throw new Error(
        "CoinGecko rejected the API key. Check your .env configuration."
      );
    }

    throw new Error(
      `CoinGecko request failed with status ${response.status}.`
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("CoinGecko returned an invalid response.");
  }

  if (!Array.isArray(data)) {
    throw new Error("Unexpected response from CoinGecko.");
  }

  return data;
}
