
import { Search, SlidersHorizontal } from "lucide-react";

const filters = [
  { label: "All assets", value: "all" },
  { label: "Gainers", value: "gainers" },
  { label: "Losers", value: "losers" },
];

export default function MarketFilters({
  search,
  onSearchChange,
  filter,
  onFilterChange,
  sort,
  onSortChange,
}) {
  return (
    <section className="flex flex-col gap-3 rounded-xl border border-white/8 bg-[#0d0d0d] p-3 sm:p-4 xl:flex-row xl:items-center xl:justify-between">
      <div className="relative min-w-0 flex-1 xl:max-w-md">
        <Search
          size={16}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
        />
        <input
          type="search"
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
          placeholder="Search coin name or symbol..."
          aria-label="Search current market page"
          className="h-10 w-full rounded-lg border border-white/8 bg-[#080808] pl-10 pr-3 text-xs text-white outline-none placeholder:text-zinc-600 focus:border-[#e87524]/60"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="flex items-center gap-1 text-zinc-500">
          <SlidersHorizontal size={14} />
          <span className="mr-1 text-[10px]">Filter</span>
        </div>

        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => onFilterChange(item.value)}
            className={`rounded-lg border px-3 py-2 text-[11px] transition ${
              filter === item.value
                ? "border-[#e87524]/40 bg-[#e87524]/10 text-[#f59a55]"
                : "border-white/8 text-zinc-400 hover:text-white"
            }`}
          >
            {item.label}
          </button>
        ))}

        <select
          value={sort}
          onChange={(event) => onSortChange(event.target.value)}
          aria-label="Sort market assets"
          className="h-9 rounded-lg border border-white/8 bg-[#080808] px-2 text-[11px] text-zinc-300 outline-none focus:border-[#e87524]/60"
        >
          <option value="market_cap_desc">Market cap ↓</option>
          <option value="market_cap_asc">Market cap ↑</option>
          <option value="volume_desc">Volume ↓</option>
          <option value="price_change_desc">24h gainers first</option>
          <option value="price_change_asc">24h losers first</option>
        </select>
      </div>
    </section>
  );
}
