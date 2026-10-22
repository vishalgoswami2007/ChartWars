import { ArrowUpRight, ArrowDownRight, Radio } from "lucide-react";

const tickerData = [
  { symbol: "BTC", name: "Bitcoin", price: "—", change: 1.82 },
  { symbol: "ETH", name: "Ethereum", price: "—", change: 0.74 },
  { symbol: "SOL", name: "Solana", price: "—", change: -0.63 },
  { symbol: "BNB", name: "BNB", price: "—", change: 0.41 },
  { symbol: "XRP", name: "XRP", price: "—", change: -0.28 },
];

export default function LiveTickerRow() {
  return (
    <section
      aria-label="Cryptocurrency market overview"
      className="border-b border-white/[0.07] bg-[#0b0b0b] px-4 py-3 sm:px-7 lg:px-9"
    >
      <div className="mb-3 flex items-center gap-2">
        <Radio size={13} className="text-[#e87524]" />
        <span className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-400">
          Market overview
        </span>
        <span className="rounded border border-white/8 px-1.5 py-0.5 text-[9px] text-zinc-600">
          PREVIEW
        </span>
      </div>

      <div className="flex gap-3 overflow-x-auto pb-1">
        {tickerData.map((coin) => {
          const isPositive = coin.change >= 0;
          const ChangeIcon = isPositive ? ArrowUpRight : ArrowDownRight;

          return (
            <article
              key={coin.symbol}
              className="min-w-36.25 flex-1 rounded-lg border border-white/[0.07] bg-white/2 px-3 py-2.5 transition hover:border-white/[0.14]"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-zinc-200">
                  {coin.symbol}
                </span>
                <span className="text-[10px] text-zinc-600">{coin.name}</span>
              </div>

              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-sm font-semibold tabular-nums text-white">
                  {coin.price}
                </span>
                <span
                  className={`flex items-center gap-0.5 text-[10px] font-medium ${
                    isPositive ? "text-emerald-400" : "text-red-400"
                  }`}
                >
                  <ChangeIcon size={13} />
                  {Math.abs(coin.change).toFixed(2)}%
                </span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
