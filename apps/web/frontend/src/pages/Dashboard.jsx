import { useState } from "react";
import Sidebar from "../components/common/Sidebar";
import Navbar from "../components/common/Navbar";
import LiveTickerRow from "../components/common/LiveTickerRow";
import MainHome from "../components/dashboard/MainHome";

export default function Dashboard() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <div className="min-h-screen bg-[#050505] text-white">
      <Sidebar isOpen={isSidebarOpen} onClose={closeSidebar} />

      <div className="min-h-screen lg:pl-65">
        <Navbar onMenuClick={() => setIsSidebarOpen(true)} />

        <LiveTickerRow />

        <MainHome />
      </div>
    </div>
  );
}
