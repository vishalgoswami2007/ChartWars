import { Bell, Menu, Search } from "lucide-react";
import { useNavigate } from "react-router-dom";

import AccountMenu from "../../features/account/AccountMenu";
import WalletMenu from "../../features/account/WalletMenu";
import { unreadCount, useAccount } from "../../features/account/accountStore";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();
  const unread = unreadCount(useAccount());

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
        <Search size={17} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="search"
          placeholder="Search markets, coins..."
          aria-label="Search markets and coins"
          className="h-10 w-full rounded-lg border border-white/9 bg-[#111111] pl-10 pr-4 text-xs text-white outline-none transition placeholder:text-zinc-600 focus:border-[#e87524]/60"
        />
      </div>

      {/* Right actions */}
      <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-4">
        <WalletMenu />

        <button
          type="button"
          onClick={() => navigate("/dashboard/notifications")}
          aria-label={unread > 0 ? `Notifications, ${unread} unread` : "Notifications"}
          title="Notifications"
          className="relative rounded-lg border border-white/9 p-2.5 text-zinc-400 transition hover:bg-white/5 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60"
        >
          <Bell size={18} />
          {unread > 0 && (
            <span className="absolute -right-1.5 -top-1.5 flex min-w-4 items-center justify-center rounded-full bg-[#e87524] px-1 text-[9px] font-bold leading-4 text-black">
              {unread > 9 ? "9+" : unread}
            </span>
          )}
        </button>

        <AccountMenu />
      </div>
    </header>
  );
}