
import { useState } from "react";
import { NavLink, useLocation } from "react-router-dom";
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
  ChevronDown,
  EyeOff,
  Bot,
  Trophy,
} from "lucide-react";

import logo from "../../assets/logo.png";

const navigation = [
  { label: "Home", path: "/dashboard", icon: House, end: true },
  {
    label: "Markets",
    path: "/dashboard/markets",
    icon: ChartNoAxesCombined,
  },
  {
    label: "Leaderboard",
    path: "/dashboard/leaderboard",
    icon: Trophy,
  },
  {
    label: "Rooms",
    path: "/dashboard/rooms",
    icon: DoorOpen,
    expandable: true,
  },
  { label: "Friends", path: "/dashboard/friendsPage", icon: Users },
  { label: "Learn", path: "/dashboard/learn", icon: GraduationCap },
  { label: "News", path: "/dashboard/news", icon: Newspaper },
];


const roomLinks = [
  { label: "Friends Room", mode: "friends", icon: Users },
  { label: "Blind Room", mode: "blind", icon: EyeOff },
  { label: "VS Coaches", mode: "coaches", icon: Bot },
  {
    label: "Tournament",
    mode: "tournament",
    icon: Trophy,
    comingSoon: true,
  },
];


const baseItemClass =
  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-3 text-[13px] font-medium transition-colors duration-200";

const activeItemClass = "bg-[#e87524]/12 text-[#f59a55]";
const inactiveItemClass =
  "text-zinc-400 hover:bg-white/[0.045] hover:text-zinc-100";

export default function Sidebar({ isOpen = false, onClose = () => {} }) {
  const location = useLocation();
  const [roomsExpanded, setRoomsExpanded] = useState(
    location.pathname.startsWith("/dashboard/rooms"),
  );

  const currentMode = new URLSearchParams(location.search).get("mode");

  const isRoomsRoute =
    location.pathname === "/dashboard/rooms" ||
    location.pathname.startsWith("/dashboard/rooms/");

  const handleRoomToggle = () => {
    setRoomsExpanded((current) => !current);
  };

  return (
    <>
      {isOpen && (
        <button
          type="button"
          aria-label="Close sidebar backdrop"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-62.5 flex-col border-r border-white/8 bg-[#0c0c0c] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
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
            className="rounded-md p-2 text-zinc-400 transition hover:bg-white/6 hover:text-white lg:hidden"
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
            {navigation.map(({ label, path, icon: Icon, end, expandable }) => {
              if (expandable) {
                return (
                  <div key={path} className="space-y-1">
                    <div className="flex items-center">
                      <NavLink
                        to={path}
                        onClick={onClose}
                        className={({ isActive }) =>
                          `${baseItemClass} flex-1 ${
                            isActive || isRoomsRoute
                              ? activeItemClass
                              : inactiveItemClass
                          }`
                        }
                      >
                        {({ isActive }) => (
                          <>
                            {(isActive || isRoomsRoute) && (
                              <span className="absolute bottom-2 left-0 top-2 w-0.75 rounded-r-full bg-[#e87524]" />
                            )}
                            <DoorOpen size={18} strokeWidth={1.8} />
                            <span>Rooms</span>
                          </>
                        )}
                      </NavLink>

                      <button
                        type="button"
                        aria-label={roomsExpanded ? "Collapse room links" : "Expand room links"}
                        aria-expanded={roomsExpanded}
                        onClick={handleRoomToggle}
                        className="ml-1 rounded-lg p-2 text-zinc-500 transition hover:bg-white/6 hover:text-white"
                      >
                        <ChevronDown
                          size={15}
                          className={`transition-transform ${
                            roomsExpanded ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                    </div>

                    {roomsExpanded && (
                      <div className="ml-5.25 space-y-1 border-l border-white/9 pl-3">
                        {roomLinks.map(({ label: roomLabel, mode, icon: RoomIcon, comingSoon }) => {
                          const isSelected =
                            isRoomsRoute && currentMode === mode;

                          const roomPath = `/dashboard/rooms?mode=${mode}`;

                          if (comingSoon) {
                            return (
                              <div
                                key={mode}
                                title="Tournament mode is coming soon"
                                className="flex cursor-not-allowed items-center gap-2 rounded-lg px-3 py-2.5 text-zinc-600"
                              >
                                <RoomIcon size={15} strokeWidth={1.8} />
                                <span className="min-w-0 flex-1 text-[11px]">
                                  {roomLabel}
                                </span>
                                <span className="text-[8px] font-semibold uppercase tracking-wider text-zinc-600">
                                  Soon
                                </span>
                              </div>
                            );
                          }

                          return (
                            <NavLink
                              key={mode}
                              to={roomPath}
                              onClick={onClose}
                              className={`${baseItemClass} gap-2 px-3 py-2.5 text-[11px] ${
                                isSelected ? activeItemClass : inactiveItemClass
                              }`}
                            >
                              {isSelected && (
                                <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full bg-[#e87524]" />
                              )}
                              <RoomIcon size={15} strokeWidth={1.8} />
                              <span>{roomLabel}</span>
                            </NavLink>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <NavLink
                  key={path}
                  to={path}
                  end={end}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `${baseItemClass} ${
                      isActive ? activeItemClass : inactiveItemClass
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
              );
            })}
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
                `${baseItemClass} ${
                  isActive ? activeItemClass : inactiveItemClass
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
                `${baseItemClass} ${
                  isActive ? activeItemClass : inactiveItemClass
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
