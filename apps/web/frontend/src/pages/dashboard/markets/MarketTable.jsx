
import {  Star } from "lucide-react";

const money = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);

const price = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "decimal",
        maximumFractionDigits: value < 1 ? 6 : 2,
      }).format(value);

function Change({ value }) {
  if (value == null) {
    return <span className="text-zinc-600">—</span>;
  }

  const positive = value >= 0;

  return (
    <span className={positive ? "text-emerald-400" : "text-red-400"}>
      {positive ? "+" : ""}
      {value.toFixed(2)}%
    </span>
  );
}

function Sparkline({ values = [], positive }) {
  const points = values.filter(Number.isFinite);

  if (points.length < 2) {
    return <span className="text-zinc-700">—</span>;
  }

  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;

  const coordinates = points
    .map((value, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 28 - ((value - min) / range) * 24;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg viewBox="0 0 100 32" className="h-8 w-24" aria-label="7 day price trend">
      <polyline
        points={coordinates}
        fill="none"
        stroke={positive ? "#34d399" : "#f87171"}
        strokeWidth="1.8"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function MarketTable({
  coins,
  page,
  perPage,
  selectedCoinId,
  onSelectCoin,
  watchlist,
  onToggleWatchlist,
}) {
  const columns = [
    "Asset",
    "Price (USD)",
    "1h",
    "24h",
    "7d",
    "7d trend",
    "24h volume",
    "Market cap",
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-white/8 bg-[#0b0b0b]">
      <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-4 sm:px-5">
        <div>
          <h2 className="text-sm font-semibold text-white">All crypto assets</h2>
          <p className="mt-1 text-[10px] text-zinc-500">
            Market data supplied by CoinGecko
          </p>
        </div>
        <span className="rounded-md border border-white/8 px-2 py-1 text-[10px] text-zinc-500">
          Page {page}
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-255 border-collapse text-left">
          <thead className="bg-white/2.5">
            <tr>
              <th className="px-4 py-3 text-[10px] font-medium text-zinc-500">
                #
              </th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="whitespace-nowrap px-4 py-3 text-[10px] font-medium text-zinc-500"
                >
                  {column}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {coins.map((coin, index) => {
              const selected = selectedCoinId === coin.id;
              const positive = (coin.price_change_percentage_7d_in_currency ?? 0) >= 0;
              const isWatched = watchlist.includes(coin.id);

              return (
                <tr
                  key={coin.id}
                  onClick={() => onSelectCoin(coin)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter" || event.key === " ") {
                      event.preventDefault();
                      onSelectCoin(coin);
                    }
                  }}
                  tabIndex={0}
                  aria-selected={selected}
                  className={`cursor-pointer border-t border-white/5 transition hover:bg-white/[0.035] focus:outline-none focus:bg-white/4 ${
                    selected ? "bg-[#e87524]/6" : ""
                  }`}
                >
                  <td className="px-4 py-4 text-xs text-zinc-600">
                    {(page - 1) * perPage + index + 1}
                  </td>

                  <td className="px-4 py-4">
                    <div className="flex min-w-46.25 items-center gap-2.5">
                      <button
                        type="button"
                        aria-label={isWatched ? `Remove ${coin.name} from watchlist` : `Add ${coin.name} to watchlist`}
                        title={isWatched ? "Remove from watchlist" : "Add to watchlist"}
                        onClick={(event) => {
                          event.stopPropagation();
                          onToggleWatchlist(coin.id);
                        }}
                        className={`shrink-0 transition ${
                          isWatched ? "text-[#f59a55]" : "text-zinc-700 hover:text-zinc-300"
                        }`}
                      >
                        <Star size={14} fill={isWatched ? "currentColor" : "none"} />
                      </button>

                      <img
                        src={coin.image}
                        alt=""
                        loading="lazy"
                        className="h-7 w-7 rounded-full bg-white/4"
                      />

                      <div className="min-w-0">
                        <p className="max-w-31..25 truncate text-xs font-semibold text-zinc-100">
                          {coin.name}
                        </p>
                        <p className="mt-0.5 text-[10px] uppercase text-zinc-500">
                          {coin.symbol}
                        </p>
                      </div>
                    </div>
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-xs font-medium tabular-nums text-zinc-200">
                    ${price(coin.current_price)}
                  </td>

                  <td className="px-4 py-4 text-xs tabular-nums">
                    <Change value={coin.price_change_percentage_1h_in_currency} />
                  </td>

                  <td className="px-4 py-4 text-xs tabular-nums">
                    <Change value={coin.price_change_percentage_24h} />
                  </td>

                  <td className="px-4 py-4 text-xs tabular-nums">
                    <Change value={coin.price_change_percentage_7d_in_currency} />
                  </td>

                  <td className="px-4 py-4">
                    <Sparkline
                      values={coin.sparkline_in_7d?.price}
                      positive={positive}
                    />
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-xs tabular-nums text-zinc-400">
                    {money(coin.total_volume)}
                  </td>

                  <td className="whitespace-nowrap px-4 py-4 text-xs tabular-nums text-zinc-400">
                    {money(coin.market_cap)}
                  </td>
                </tr>
              );
            })}

            {coins.length === 0 && (
              <tr>
                <td colSpan={columns.length + 1} className="px-4 py-12 text-center">
                  <p className="text-sm text-zinc-400">No matching assets</p>
                  <p className="mt-1 text-xs text-zinc-600">
                    Try another search or filter.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
