
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import LiveTickerRow from "../components/common/LiveTickerRow";

const FULLSCREEN_ROOM_MODES = [
  "online",
  "friends",
  "blind",
  "coaches",
];

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const isHomePage = location.pathname === "/dashboard";

  const isMarketsPage =
    location.pathname === "/dashboard/markets" ||
    location.pathname.startsWith("/dashboard/markets/");

  const showMarketOverview = isHomePage || isMarketsPage;

  const selectedMode = new URLSearchParams(
    location.search
  ).get("mode");

  const isFullScreenRoom =
    location.pathname === "/dashboard/rooms" &&
    FULLSCREEN_ROOM_MODES.includes(selectedMode);

    const isOnlineModeRoute = location.pathname.startsWith(
        "/dashboard/rooms/online"
      );

      if (isOnlineModeRoute) {
        return (
          <main className="min-h-dvh w-full overflow-x-hidden bg-[#050505] text-white">
            <Outlet />
          </main>
        );
      }

  // Full-screen room mode: no dashboard sidebar or navbar.
  if (isFullScreenRoom) {
    return (
      <main className="min-h-dvh w-full overflow-x-hidden overflow-y-auto bg-[#050505] text-white">
         <Outlet />
    </main>
    );
  }

  // Normal dashboard layout.
  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-65">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {showMarketOverview && <LiveTickerRow />}

        <Outlet />
      </div>
    </div>
  );
}
