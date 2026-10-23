import { useEffect, useState } from "react";
import {
  AlertCircle,
  ArrowUpRight,
  Clock3,
  ExternalLink,
  Newspaper,
  RefreshCw,
  Search,
} from "lucide-react";
import { fetchNews } from "../../services/newsAPI";

const CATEGORIES = [
  { id: "all", label: "All News" },
  { id: "crypto", label: "Crypto" },
  { id: "forex", label: "Forex" },
  { id: "india", label: "Indian Markets" },
  { id: "us", label: "US Markets" },
  { id: "ipo", label: "IPOs" },
  { id: "economy", label: "Economy" },
];

function formatPublishedTime(dateString) {
  if (!dateString) return "Time unavailable";

  const date = new Date(dateString);

  if (Number.isNaN(date.getTime())) return "Time unavailable";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
}

function NewsCard({ article }) {
  const title = article.title || "Untitled news article";
  const description =
    article.description ||
    article.content ||
    "Open the original article to read more details.";

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-xl border border-white/8 bg-[#0c0c0c] transition duration-200 hover:border-orange-500/40 hover:bg-[#101010]">
      {article.image_url ? (
        <a
          href={article.link}
          target="_blank"
          rel="noreferrer"
          className="block aspect-16/8 overflow-hidden bg-[#151515]"
          aria-label={`Read ${title}`}
        >
          <img
            src={article.image_url}
            alt=""
            loading="lazy"
            className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.03]"
            onError={(event) => {
              event.currentTarget.style.display = "none";
            }}
          />
        </a>
      ) : null}

      <div className="flex flex-1 flex-col p-5">
        <div className="mb-3 flex flex-wrap items-center gap-2 text-xs text-neutral-500">
          <span className="rounded-md border border-white/10 px-2 py-1 text-neutral-300">
            {article.category?.[0] || "Market News"}
          </span>
          <span className="flex items-center gap-1">
            <Clock3 size={12} />
            {formatPublishedTime(article.pubDate)}
          </span>
        </div>

        <h2 className="text-base font-semibold leading-6 text-white transition group-hover:text-orange-400">
          {title}
        </h2>

        <p className="mt-3 line-clamp-3 text-sm leading-6 text-neutral-400">
          {description}
        </p>

        <div className="mt-5 flex items-center justify-between gap-3 border-t border-white/[0.07] pt-4 ">
          <span className="min-w-0 truncate text-xs text-neutral-500">
            {article.source_name || "News source"}
          </span>

          {article.link ? (
            <a
              href={article.link}
              target="_blank"
              rel="noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 text-xs font-semibold text-orange-400 hover:text-orange-300"
            >
              Read article
              <ExternalLink size={13} />
            </a>
          ) : (
            <span className="text-xs text-neutral-600">
              Link unavailable
            </span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function NewsPage() {
  const [category, setCategory] = useState("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [articles, setArticles] = useState([]);
  const [nextPage, setNextPage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);

  // First page: runs on mount, when category or search change, and on Refresh.
  useEffect(() => {
    let cancelled = false;

    fetchNews({ category, search })
      .then((result) => {
        if (cancelled) return;
        setArticles(result.articles);
        setNextPage(result.nextPage);
        setError("");
        setLastUpdated(new Date());
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err.message || "Unable to load market news.");
        setArticles([]);
        setNextPage(null);
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
        setRefreshing(false);
      });

    return () => {
      cancelled = true; // ignore a stale response if the inputs changed meanwhile
    };
  }, [category, search, reloadKey]);

  function refresh() {
    setRefreshing(true);
    setError("");
    setReloadKey((key) => key + 1);
  }

  async function loadMore() {
    if (!nextPage || loadingMore) return;

    setLoadingMore(true);
    setError("");

    try {
      const result = await fetchNews({ category, search, page: nextPage });

      setArticles((current) => [
        ...current,
        ...result.articles.filter(
          (incoming) =>
            !current.some(
              (existing) => existing.article_id === incoming.article_id
            )
        ),
      ]);
      setNextPage(result.nextPage);
      setLastUpdated(new Date());
    } catch (err) {
      setError(err.message || "Unable to load more news.");
    } finally {
      setLoadingMore(false);
    }
  }

  function changeCategory(nextCategory) {
    if (nextCategory === category) return;
    setLoading(true);
    setError("");
    setCategory(nextCategory);
  }

  function handleSearch(event) {
    event.preventDefault();
    const next = searchInput.trim();
    if (next === search) return;
    setLoading(true);
    setError("");
    setSearch(next);
  }

  function clearFilters() {
    if (category !== "all" || search !== "") {
      setLoading(true);
      setError("");
    }
    setSearchInput("");
    setSearch("");
    setCategory("all");
  }

  const isInitialLoading = loading && articles.length === 0;

  return (
    <main className="min-h-screen bg-[#050505] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-360">
        {/* Page heading */}
        <section className="mb-7 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] text-orange-500">
              Market Intelligence
            </p>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Market Pulse
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-400 sm:text-base">
              Financial headlines across crypto, forex, Indian markets,
              IPOs and the global economy.
            </p>
          </div>

          <button
            type="button"
            onClick={refresh}
            disabled={loading || refreshing}
            className="inline-flex items-center justify-center gap-2 self-start rounded-lg border border-white/10 bg-[#111111] px-4 py-3 text-sm font-medium text-neutral-200 transition hover:border-orange-500/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-50 md:self-auto"
          >
            <RefreshCw
              size={15}
              className={refreshing ? "animate-spin" : ""}
            />
            Refresh news
          </button>
        </section>

        {/* Centered horizontal category navigation */}
        <section className="mb-6 border-y border-white/8 py-4">
          <p className="mb-3 text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
            Browse by market
          </p>

          <div className="flex justify-start overflow-x-auto pb-1 md:justify-center">
            <div className="flex min-w-max items-center gap-2">
              {CATEGORIES.map((item) => {
                const active = category === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => changeCategory(item.id)}
                    aria-pressed={active}
                    className={`rounded-full border px-4 py-2.5 text-sm font-medium transition ${
                      active
                        ? "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-950/20"
                        : "border-white/10 bg-[#0c0c0c] text-neutral-400 hover:border-white/20 hover:text-white"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* Search and feed status */}
        <section className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <form
            onSubmit={handleSearch}
            className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-white/10 bg-[#0c0c0c] px-4 focus-within:border-orange-500/50 sm:max-w-xl"
          >
            <Search size={18} className="shrink-0 text-neutral-500" />
            <input
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search headlines or companies..."
              className="w-full bg-transparent py-3.5 text-sm text-white outline-none placeholder:text-neutral-600"
            />
            <button
              type="submit"
              className="text-sm font-medium text-orange-400 hover:text-orange-300"
            >
              Search
            </button>
          </form>

          <div className="text-xs text-neutral-500">
            {lastUpdated
              ? `Updated ${lastUpdated.toLocaleTimeString("en-IN")}`
              : "Waiting for news"}
          </div>
        </section>

        {/* Error state */}
        {error && (
          <div
            role="alert"
            className="mb-6 flex flex-col gap-3 rounded-xl border border-red-500/20 bg-red-500/6 p-4 sm:flex-row sm:items-center sm:justify-between"
          >
            <div className="flex items-start gap-3">
              <AlertCircle className="mt-0.5 shrink-0 text-red-400" size={19} />
              <div>
                <p className="text-sm font-medium text-red-300">
                  Could not load news
                </p>
                <p className="mt-1 wrap-break-words text-sm text-neutral-400">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={refresh}
              disabled={refreshing}
              className="shrink-0 rounded-lg border border-red-500/20 px-3 py-2 text-sm text-red-300 hover:bg-red-500/10 disabled:opacity-50"
            >
              Try again
            </button>
          </div>
        )}

        {/* Loading state */}
        {isInitialLoading && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-white/8 bg-[#0b0b0b]">
            <RefreshCw className="mb-4 animate-spin text-orange-500" size={27} />
            <p className="font-medium text-white">Loading market news</p>
            <p className="mt-2 text-sm text-neutral-500">
              Fetching headlines from NewsData.io...
            </p>
          </div>
        )}

        {/* News grid */}
        {!isInitialLoading && articles.length > 0 && (
          <>
            <div className="mb-4 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">
                  {CATEGORIES.find((item) => item.id === category)?.label}
                </h2>
                <p className="mt-1 text-xs text-neutral-500">
                  {articles.length} articles loaded
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, index) => (
                <NewsCard
                  key={article.article_id || article.link || index}
                  article={article}
                />
              ))}
            </div>

            {nextPage && (
              <div className="mt-8 flex justify-center">
                <button
                  type="button"
                  disabled={loadingMore}
                  onClick={loadMore}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-[#111111] px-6 py-3 text-sm font-semibold text-white transition hover:border-orange-500/40 disabled:opacity-50"
                >
                  {loadingMore && (
                    <RefreshCw size={15} className="animate-spin" />
                  )}
                  {loadingMore ? "Loading..." : "Load more news"}
                  {!loadingMore && <ArrowUpRight size={15} />}
                </button>
              </div>
            )}
          </>
        )}

        {/* Empty state */}
        {!isInitialLoading && !error && articles.length === 0 && (
          <div className="flex min-h-64 flex-col items-center justify-center rounded-xl border border-white/8 bg-[#0b0b0b] px-5 text-center">
            <Newspaper size={30} className="mb-4 text-neutral-600" />
            <h2 className="font-semibold text-white">No articles found</h2>
            <p className="mt-2 max-w-md text-sm leading-6 text-neutral-500">
              Try another category or a different search term.
            </p>
            <button
              type="button"
              onClick={clearFilters}
              className="mt-4 text-sm font-medium text-orange-400 hover:text-orange-300"
            >
              Clear filters
            </button>
          </div>
        )}

        {/* Attribution and disclaimer */}
        <footer className="mt-12 border-t border-white/8 py-6 text-xs leading-5 text-neutral-600">
          <p>
            News content is provided by third-party publishers via NewsData.io.
            Article availability and publication times depend on the source.
          </p>
          <p className="mt-2">
            For educational and informational purposes only. This feed is not
            investment advice. Verify important information with original
            sources and official exchange announcements.
          </p>
        </footer>
      </div>
    </main>
  );
}