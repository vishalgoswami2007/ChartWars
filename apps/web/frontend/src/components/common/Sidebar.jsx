
import { NavLink } from "react-router-dom";
import {
  House,
  ChartNoAxesCombined,
  DoorOpen,
  Users,
  GraduationCap,
  Newspaper,
  Settings,
  UserRound,
  X,
  Flame,
} from "lucide-react";

import logo from "../../assets/logo.png";

const navigation = [
  { label: "Home", path: "/dashboard", icon: House, end: true },
  { label: "Markets", path: "/dashboard/markets", icon: ChartNoAxesCombined },
  { label: "Rooms", path: "/dashboard/rooms", icon: DoorOpen },
  { label: "Friends", path: "/dashboard/friends", icon: Users },
  { label: "Learn", path: "/dashboard/learn", icon: GraduationCap },
  { label: "News", path: "/dashboard/news", icon: Newspaper },
];

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-62.5 flex-col
          border-r border-white/8 bg-[#0c0c0c]
          transition-transform duration-300 ease-in-out
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
          lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-21 shrink-0 items-center justify-between border-b border-white/8 px-5">
          <NavLink
            to="/dashboard"
            onClick={onClose}
            className="flex items-center gap-3"
          >
            <img
              src={logo}
              alt="ChartWars"
              className="h-10 w-10 object-contain"
            />

            <div>
              <h1 className="text-[14px] font-bold tracking-[0.19em] text-white">
                CHARTWARS
              </h1>
              <p className="mt-1 text-[9px] uppercase tracking-[0.16em] text-zinc-500">
                Practice. Compete. Improve.
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-md p-2 text-zinc-400 hover:bg-white/6 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 pb-4 pt-7">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map(({ label, path, icon: Icon, end }) => (
              <NavLink
                key={path}
                to={path}
                end={end}
                onClick={onClose}
                className={({ isActive }) =>
                  `group relative flex items-center gap-3 rounded-lg px-3 py-3
                  text-[13px] font-medium transition-colors duration-200 ${
                    isActive
                      ? "bg-[#e87524]/12 text-[#f59a55]"
                      : "text-zinc-400 hover:bg-white/4.5 hover:text-zinc-100"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {isActive && (
                      <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-r-full bg-[#e87524]" />
                    )}

                    <Icon size={18} strokeWidth={1.8} />
                    <span>{label}</span>
                  </>
                )}
              </NavLink>
            ))}
          </div>

          {/* Account navigation */}
          <div className="mt-8 border-t border-white/8 pt-5">
            <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-zinc-600">
              Account
            </p>

            <NavLink
              to="/dashboard/profile"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] transition ${
                  isActive
                    ? "bg-[#e87524]/12 text-[#f59a55]"
                    : "text-zinc-400 hover:bg-white/4.5 hover:text-white"
                }`
              }
            >
              <UserRound size={18} strokeWidth={1.8} />
              Profile
            </NavLink>

            <NavLink
              to="/dashboard/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-lg px-3 py-3 text-[13px] transition ${
                  isActive
                    ? "bg-[#e87524]/12 text-[#f59a55]"
                    : "text-zinc-400 hover:bg-white/4.5 hover:text-white"
                }`
              }
            >
              <Settings size={18} strokeWidth={1.8} />
              Settings
            </NavLink>
          </div>
        </nav>

        {/* Bottom learning note */}
        <div className="m-4 rounded-xl border border-white/8 bg-white/2.5 p-4">
          <div className="mb-2 flex items-center gap-2 text-[#f59a55]">
            <Flame size={16} />
            <span className="text-xs font-semibold">Keep improving</span>
          </div>

          <p className="text-[11px] leading-5 text-zinc-500">
            Practice your analysis, learn from each round, and sharpen your
            skills.
          </p>
        </div>
      </aside>
    </>
  );
}
