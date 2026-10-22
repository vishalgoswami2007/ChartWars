
import {
  Search,
  Wallet,
  Bell,
  Menu,
  ChevronDown,
  UserRound,
} from "lucide-react";

export default function Navbar({ onMenuClick }) {
  return (
    <header className="sticky top-0 z-30 flex h-19 items-center gap-3 border-b border-white/8 bg-[#090909]/95 px-4 backdrop-blur-xl sm:px-7 lg:px-9">
      {/* Mobile sidebar toggle */}
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="rounded-lg border border-white/9 p-2 text-zinc-300 transition hover:bg-white/5 lg:hidden"
      >
        <Menu size={20} />
      </button>

      {/* Search */}
      <div className="relative max-w-115 flex-1">
        <Search
          size={17}
          className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500"
        />

        <input
          type="search"
          placeholder="Search markets, coins..."
          aria-label="Search markets and coins"
          className="h-10 w-full rounded-lg border border-white/9 bg-[#111111] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#e87524]/60"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        {/* Virtual balance placeholder */}
        <div className="hidden items-center gap-2 rounded-lg border border-white/9 bg-white/2.5 px-3 py-2 sm:flex">
          <Wallet size={16} className="text-[#f59a55]" />

          <div>
            <p className="text-[9px] uppercase tracking-wider text-zinc-500">
              Virtual balance
            </p>
            <p className="mt-0.5 text-xs font-semibold text-zinc-200">
              -- CW
            </p>
          </div>
        </div>

        {/* Notifications */}
        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative rounded-lg border border-white/9 p-2.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
        >
          <Bell size={18} />

          <span className="absolute right-2 top-2 h-1.5 w-1.5 rounded-full bg-[#e87524]" />
        </button>

        {/* Account placeholder */}
        <button
          type="button"
          aria-label="Account menu"
          className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-1 text-left transition hover:bg-white/4"
        >
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-[#191919] text-zinc-300">
            <UserRound size={16} />
          </div>

          <div className="hidden sm:block">
            <p className="text-xs font-medium text-zinc-200">
              Your account
            </p>
            <p className="mt-0.5 text-[10px] text-zinc-500">
              Trader
            </p>
          </div>

          <ChevronDown
            size={14}
            className="hidden text-zinc-500 sm:block"
          />
        </button>
      </div>
    </header>
  );
}
