
import { useState } from "react";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import LiveTickerRow from "../components/common/LiveTickerRow";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  const hideMarketOverview =
    location.pathname === "/dashboard/learn" ||
    location.pathname.startsWith("/dashboard/learn/") ||
    location.pathname === "/dashboard/news";

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-65">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        {!hideMarketOverview && <LiveTickerRow />}

        <Outlet />
      </div>
    </div>
  );
}
