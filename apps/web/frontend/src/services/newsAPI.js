
const BASE_URL = "https://newsdata.io/api/1";

const API_KEY = import.meta.env.VITE_NEWSDATA_API_KEY?.trim();

const CATEGORY_CONFIG = {
  all: {
    endpoint: "latest",
  },
  crypto: {
    endpoint: "crypto",
  },
  forex: {
    endpoint: "latest",
    query: "forex OR currency OR USD INR",
  },
  india: {
    endpoint: "market",
    query: "India OR NSE OR BSE OR Nifty OR Sensex",
  },
  us: {
    endpoint: "market",
    query: "US stock market OR Nasdaq OR S&P 500",
  },
  ipo: {
    endpoint: "market",
    query: "IPO OR initial public offering",
  },
  economy: {
    endpoint: "latest",
    query: "inflation OR interest rates OR central bank OR economy",
  },
};

export async function fetchNews({
  category = "all",
  search = "",
  page = "",
} = {}) {
  if (!API_KEY) {
    throw new Error(
      "News API key missing. Add VITE_NEWSDATA_API_KEY to your .env file."
    );
  }

  const config = CATEGORY_CONFIG[category] ?? CATEGORY_CONFIG.all;
  const url = new URL(`${BASE_URL}/${config.endpoint}`);

  url.searchParams.set("apikey", API_KEY);
  url.searchParams.set("language", "en");
  url.searchParams.set("removeduplicate", "1");
  url.searchParams.set("size", "10");

  const query = [config.query, search.trim()]
    .filter(Boolean)
    .join(" ");

  if (query) {
    url.searchParams.set("q", query);
  }

  if (page) {
    url.searchParams.set("page", page);
  }

  const response = await fetch(url);

  if (!response.ok) {
    if (response.status === 429) {
      throw new Error("News API rate limit reached. Please try again later.");
    }

    throw new Error(`News request failed (${response.status}).`);
  }

  const data = await response.json();

  if (data.status !== "success" || !Array.isArray(data.results)) {
    throw new Error(
      data.results?.message ||
        data.message ||
        "News provider returned an unexpected response."
    );
  }

  return {
    articles: data.results,
    nextPage: data.nextPage ?? null,
  };
}
