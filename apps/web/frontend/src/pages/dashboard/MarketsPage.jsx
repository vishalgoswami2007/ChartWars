import { useEffect, useMemo, useState } from "react";
import { AlertCircle, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { fetchMarkets } from "../../services/cryptoMarketAPI";
import MarketOverview from "./markets/MarketOverview";
import MarketFilters from "./markets/MarketFilters";
import MarketTable from "./markets/MarketTable";
import CoinDetailPanel from "./markets/CoinDetailPanel";

const PAGE_SIZE = 100;
const REQUEST_TIMEOUT_MS = 15000;

export default function MarketsPage() {
  const [coins, setCoins] = useState([]);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [sort, setSort] = useState("market_cap_desc");
  const [selectedCoin, setSelectedCoin] = useState(null);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // Fetch on mount, when the page changes, and when Refresh is pressed.
  useEffect(() => {
    const controller = new AbortController();
    let timedOut = false;

    const timeoutId = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    fetchMarkets({ page, perPage: PAGE_SIZE, signal: controller.signal })
      .then((result) => {
        setCoins(result);
        setLastUpdated(new Date());
        setError("");
      })
      .catch((err) => {
        if (err.name === "AbortError") {
          if (timedOut) {
            setError("Market request timed out. Check your connection and try again.");
          }
          return; // cancelled by cleanup: the next run takes over
        }
        setError(err instanceof Error ? err.message : "Unable to load markets.");
      })
      .finally(() => {
        clearTimeout(timeoutId);
        if (!controller.signal.aborted || timedOut) {
          setLoading(false);
          setRefreshing(false);
        }
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, [page, reloadKey]);

  const refresh = () => {
    setRefreshing(true);
    setError("");
    setReloadKey((key) => key + 1);
  };

  const visibleCoins = useMemo(() => {
    const term = search.trim().toLowerCase();

    const filtered = coins.filter((coin) => {
      const matchesSearch =
        !term ||
        coin.name.toLowerCase().includes(term) ||
        coin.symbol.toLowerCase().includes(term) ||
        coin.id.toLowerCase().includes(term);

      const change = coin.price_change_percentage_24h ?? 0;

      const matchesFilter =
        filter === "all" ||
        (filter === "gainers" && change > 0) ||
        (filter === "losers" && change < 0);

      return matchesSearch && matchesFilter;
    });

    return [...filtered].sort((a, b) => {
      switch (sort) {
        case "market_cap_asc":
          return (a.market_cap ?? 0) - (b.market_cap ?? 0);
        case "volume_desc":
          return (b.total_volume ?? 0) - (a.total_volume ?? 0);
        case "price_change_desc":
          return (
            (b.price_change_percentage_24h ?? -Infinity) -
            (a.price_change_percentage_24h ?? -Infinity)
          );
        case "price_change_asc":
          return (
            (a.price_change_percentage_24h ?? Infinity) -
            (b.price_change_percentage_24h ?? Infinity)
          );
        case "market_cap_desc":
        default:
          return (b.market_cap ?? 0) - (a.market_cap ?? 0);
      }
    });
  }, [coins, search, filter, sort]);

  const toggleWatchlist = (coinId) => {
    setWatchlist((current) =>
      current.includes(coinId)
        ? current.filter((id) => id !== coinId)
        : [...current, coinId]
    );
  };

  const handlePageChange = (nextPage) => {
    setLoading(true);
    setError("");
    setPage(nextPage);
    setSelectedCoin(null);
    setSearch("");
    setFilter("all");
  };

  return (
    <main className="mx-auto w-full max-w-[1800px] space-y-6 px-4 py-6 sm:px-7 sm:py-8 lg:px-9">
      <section className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e87524]">
            Market intelligence
          </p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
            Crypto Markets
          </h1>
          <p className="mt-2 max-w-2xl text-xs leading-5 text-zinc-500 sm:text-sm">
            Explore digital assets, compare market movements, and inspect
            prices in one trading-terminal workspace.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="text-[10px] text-zinc-500">
            <span className="mr-2 inline-block h-1.5 w-1.5 rounded-full bg-emerald-400" />
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString()}`
              : "Waiting for market data"}
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 bg-white/2.5 px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#e87524]/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? "animate-spin" : ""} />
            Refresh
          </button>
        </div>
      </section>

      {error && (
        <section
          role="alert"
          className="flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-400/4 p-4 sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={18} className="mt-0.5 shrink-0 text-red-400" />
            <div>
              <p className="text-sm font-medium text-zinc-200">
                Market data unavailable
              </p>
              <p className="mt-1 text-xs leading-5 text-zinc-500">{error}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={refresh}
            disabled={refreshing}
            className="self-start rounded-lg border border-white/10 px-3 py-2 text-xs text-zinc-300 hover:text-white disabled:opacity-50 sm:self-center"
          >
            Try again
          </button>
        </section>
      )}

      {loading && coins.length === 0 && !error ? (
        <section className="rounded-xl border border-white/8 bg-[#0d0d0d] p-10 text-center">
          <RefreshCw size={22} className="mx-auto animate-spin text-[#e87524]" />
          <p className="mt-4 text-sm text-zinc-300">Loading crypto markets</p>
          <p className="mt-1 text-xs text-zinc-600">
            Fetching asset prices from CoinGecko...
          </p>
        </section>
      ) : (
        <>
          <MarketOverview coins={coins} />

          <MarketFilters
            search={search}
            onSearchChange={setSearch}
            filter={filter}
            onFilterChange={setFilter}
            sort={sort}
            onSortChange={setSort}
          />

          {loading && coins.length > 0 && (
            <p className="text-xs text-zinc-500">Updating market data...</p>
          )}

          <div className={loading ? "opacity-60" : ""}>
            <MarketTable
              coins={visibleCoins}
              page={page}
              perPage={PAGE_SIZE}
              selectedCoinId={selectedCoin?.id}
              onSelectCoin={setSelectedCoin}
              watchlist={watchlist}
              onToggleWatchlist={toggleWatchlist}
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-[10px] leading-5 text-zinc-600">
              Showing {visibleCoins.length} matching assets on page {page}.
              Search and filters apply to the loaded page.
            </p>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1 || loading}
                className="inline-flex items-center gap-1 rounded-lg border border-white/9 px-3 py-2 text-xs text-zinc-300 hover:bg-white/4 disabled:cursor-not-allowed disabled:opacity-30"
              >
                <ChevronLeft size={14} />
                Previous
              </button>

              <span className="px-2 text-xs tabular-nums text-zinc-500">{page}</span>

              <button
                type="button"
                onClick={() => handlePageChange(page + 1)}
                disabled={loading || coins.length < PAGE_SIZE}
                className="inline-flex items-center gap-1 rounded-lg border border-white/9 px-3 py-2 text-xs text-zinc-300 hover:bg-white/4 disabled:cursor-not-allowed disabled:opacity-30"
              >
                Next
                <ChevronRight size={14} />
              </button>
            </div>
          </div>

          {selectedCoin && (
            <CoinDetailPanel
              coin={selectedCoin}
              onClose={() => setSelectedCoin(null)}
            />
          )}

          <footer className="border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-zinc-600">
            Market data provided by{" "}
            <a
              href="https://www.coingecko.com/en/api/"
              target="_blank"
              rel="noreferrer"
              className="text-zinc-400 underline underline-offset-2 hover:text-white"
            >
              CoinGecko
            </a>
            . Data can be delayed and is for educational purposes only.
          </footer>
        </>
      )}
    </main>
  );
}