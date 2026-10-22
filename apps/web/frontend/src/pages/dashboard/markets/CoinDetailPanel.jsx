
import { ArrowDownRight, ArrowUpRight, ExternalLink, X } from "lucide-react";

const money = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);

export default function CoinDetailPanel({ coin, onClose }) {
  if (!coin) return null;

  const positive = (coin.price_change_percentage_24h ?? 0) >= 0;
  const ChangeIcon = positive ? ArrowUpRight : ArrowDownRight;

  return (
    <aside className="rounded-xl border border-white/8 bg-[#0d0d0d] p-5 sm:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <img src={coin.image} alt="" className="h-10 w-10 rounded-full" />
          <div>
            <p className="text-sm font-semibold text-white">{coin.name}</p>
            <p className="mt-1 text-[10px] uppercase text-zinc-500">
              {coin.symbol} · Rank #{coin.market_cap_rank ?? "—"}
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={onClose}
          aria-label="Close coin details"
          className="rounded-md p-1.5 text-zinc-500 hover:bg-white/5 hover:text-white"
        >
          <X size={16} />
        </button>
      </div>

      <div className="mt-7">
        <p className="text-[10px] uppercase tracking-wider text-zinc-500">
          Current price
        </p>
        <p className="mt-2 text-3xl font-semibold tracking-tight text-white">
          {coin.current_price == null
            ? "—"
            : `$${new Intl.NumberFormat("en-US", {
                maximumFractionDigits: coin.current_price < 1 ? 8 : 2,
              }).format(coin.current_price)}`}
        </p>

        <p
          className={`mt-2 flex items-center gap-1 text-xs ${
            positive ? "text-emerald-400" : "text-red-400"
          }`}
        >
          <ChangeIcon size={15} />
          {coin.price_change_percentage_24h == null
            ? "24h change unavailable"
            : `${coin.price_change_percentage_24h.toFixed(2)}% over 24 hours`}
        </p>
      </div>

      <div className="mt-6 grid grid-cols-2 gap-3">
        {[
          ["Market cap", money(coin.market_cap)],
          ["24h volume", money(coin.total_volume)],
          ["24h high", money(coin.high_24h)],
          ["24h low", money(coin.low_24h)],
          ["All-time high", money(coin.ath)],
          ["Circulating supply", coin.circulating_supply == null
            ? "—"
            : new Intl.NumberFormat("en-US", {
                notation: "compact",
                maximumFractionDigits: 2,
              }).format(coin.circulating_supply)],
        ].map(([label, value]) => (
          <div key={label} className="rounded-lg border border-white/6 p-3">
            <p className="text-[10px] text-zinc-500">{label}</p>
            <p className="mt-2 truncate text-xs font-semibold text-zinc-200">
              {value}
            </p>
          </div>
        ))}
      </div>

      <a
        href={`https://www.coingecko.com/en/coins/${encodeURIComponent(coin.id)}`}
        target="_blank"
        rel="noreferrer"
        className="mt-5 inline-flex items-center gap-2 text-xs text-[#f59a55] hover:text-white"
      >
        View on CoinGecko
        <ExternalLink size={13} />
      </a>

      <p className="mt-5 border-t border-white/[0.07] pt-4 text-[10px] leading-5 text-zinc-600">
        Market data is informational and may be delayed. This panel does not
        provide investment advice.
      </p>
    </aside>
  );
}
