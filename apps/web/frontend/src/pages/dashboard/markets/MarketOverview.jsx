
import { Activity, Coins, TrendingUp, Wallet } from "lucide-react";

const money = (value) =>
  value == null
    ? "—"
    : new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(value);

export default function MarketOverview({ coins }) {
  const marketCap = coins.reduce(
    (total, coin) => total + (coin.market_cap || 0),
    0
  );

  const volume = coins.reduce(
    (total, coin) => total + (coin.total_volume || 0),
    0
  );

  const gainers = coins.filter(
    (coin) => (coin.price_change_percentage_24h ?? 0) > 0
  ).length;

  const cards = [
    {
      label: "Assets loaded",
      value: coins.length.toLocaleString(),
      icon: Coins,
      detail: "Current page",
    },
    {
      label: "Market cap",
      value: money(marketCap),
      icon: Wallet,
      detail: "Loaded assets combined",
    },
    {
      label: "24h volume",
      value: money(volume),
      icon: Activity,
      detail: "Loaded assets combined",
    },
    {
      label: "Positive movers",
      value: coins.length ? `${gainers} / ${coins.length}` : "—",
      icon: TrendingUp,
      detail: "24h change above zero",
    },
  ];

  return (
    <section className="grid grid-cols-2 gap-3 xl:grid-cols-4">
      {cards.map(({ label, value, icon: Icon, detail }) => (
        <article
          key={label}
          className="rounded-xl border border-white/8 bg-[#0d0d0d] p-4 sm:p-5"
        >
          <div className="flex items-center justify-between gap-2">
            <p className="text-xs text-zinc-500">{label}</p>
            <Icon size={16} className="text-[#e87524]" />
          </div>
          <p className="mt-4 truncate text-lg font-semibold text-zinc-100 sm:text-xl">
            {value}
          </p>
          <p className="mt-1 text-[10px] text-zinc-600">{detail}</p>
        </article>
      ))}
    </section>
  );
}
