import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import LiveTickerRow from "../components/common/LiveTickerRow";
import { loadAccount, useAccount } from "../features/account/accountStore";

const FULLSCREEN_ROOM_MODES = ["online", "friends", "blind", "coaches"];

function BootScreen({ error, onRetry }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-3 bg-[#050505] px-6 text-center text-white">
      {error ? (
        <>
          <p className="text-sm font-medium">Could not reach the ChartWars server</p>
          <p className="max-w-sm text-xs text-zinc-500">{error}</p>
          <button
            type="button"
            onClick={onRetry}
            className="rounded-lg bg-[#e87524] px-4 py-2.5 text-xs font-semibold text-black transition hover:bg-[#f59a55]"
          >
            Try again
          </button>
        </>
      ) : (
        <>
          <div
            className="size-8 animate-spin rounded-full border-2 border-white/15 border-t-[#e87524]"
            role="status"
            aria-label="Loading"
          />
          <p className="text-xs text-zinc-500">Loading your account...</p>
        </>
      )}
    </div>
  );
}

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [booted, setBooted] = useState(false);
  const { status, error } = useAccount();
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    loadAccount().finally(() => {
      if (alive) setBooted(true);
    });
    return () => {
      alive = false;
    };
  }, []);

  const retry = () => {
    setBooted(false);
    loadAccount().finally(() => setBooted(true));
  };

  const isHomePage = location.pathname === "/dashboard";

  const isMarketsPage =
    location.pathname === "/dashboard/markets" ||
    location.pathname.startsWith("/dashboard/markets/");

  const showMarketOverview = isHomePage || isMarketsPage;

  const selectedMode = new URLSearchParams(location.search).get("mode");

  const isOnlineModeRoute = location.pathname.startsWith("/dashboard/rooms/online");

  const isSelectedRoomMode =
    location.pathname === "/dashboard/rooms" &&
    FULLSCREEN_ROOM_MODES.includes(selectedMode);

  const isFullScreenRoom = isOnlineModeRoute || isSelectedRoomMode;

  // Sign out / delete ke time page khali rahe, navigate khud ho jayega
  if (status === "leaving") return null;
  if (!booted && status !== "ready") return <BootScreen />;
  if (status === "signedOut") return <Navigate to="/login" replace />;
  if (status === "error") return <BootScreen error={error} onRetry={retry} />;

  // Full-screen room: hide dashboard sidebar and navbar.
  if (isFullScreenRoom) {
    return (
      <main className="h-dvh w-full overflow-hidden bg-[#050505] text-white">
        <Outlet />
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />

      <div className="min-h-screen lg:pl-65">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {showMarketOverview && <LiveTickerRow />}

        <Outlet />
      </div>
    </div>
  );
}