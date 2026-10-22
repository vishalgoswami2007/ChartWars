import { useState } from "react";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import LiveTickerRow from "../components/common/LiveTickerRow";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <div className="min-h-screen lg:pl-65">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <LiveTickerRow />

        <Outlet />
      </div>
    </div>
  );
}