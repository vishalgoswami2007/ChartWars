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
  ChevronDown,
  EyeOff,
  Bot,
  Trophy,
  Swords,
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
  {
    label: "Friends",
    path: "/dashboard/friendsPage",
    icon: Users,
  },
  {
    label: "Learn",
    path: "/dashboard/learn",
    icon: GraduationCap,
  },
  {
    label: "News",
    path: "/dashboard/news",
    icon: Newspaper,
  },
];

const roomLinks = [
  { label: "Online Mode", mode: "online", icon: Swords },
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
  "group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium transition-colors duration-200";

const activeItemClass = "bg-orange-500/10 text-orange-400";

const inactiveItemClass =
  "text-zinc-400 hover:bg-white/5 hover:text-zinc-100";

export default function Sidebar({
  isOpen = false,
  onClose = () => {},
}) {
  const location = useLocation();

  const currentMode = new URLSearchParams(location.search).get("mode");

  const isRoomsRoute =
    location.pathname === "/dashboard/rooms" ||
    location.pathname.startsWith("/dashboard/rooms/");

  const [roomsExpanded, setRoomsExpanded] = useState(isRoomsRoute);

  const handleRoomToggle = () => {
    setRoomsExpanded((current) => !current);
  };

  const accountIconClass =
    "flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-zinc-400 transition hover:border-orange-500/40 hover:bg-orange-500/10 hover:text-orange-400";

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
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-white/10 bg-[#0c0c0c] transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } lg:translate-x-0`}
      >
        {/* Brand */}
        <div className="flex h-20 shrink-0 items-center justify-between border-b border-white/10 px-5">
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
              <h1 className="text-sm font-bold tracking-widest text-white">
                CHARTWARS
              </h1>
              <p className="mt-1 text-[9px] uppercase tracking-wider text-zinc-500">
                Practice. Compete. Improve.
              </p>
            </div>
          </NavLink>

          <button
            type="button"
            aria-label="Close sidebar"
            onClick={onClose}
            className="rounded-md p-2 text-zinc-400 transition hover:bg-white/5 hover:text-white lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Main navigation */}
        <nav className="min-h-0 flex-1 overflow-y-auto px-3 pb-3 pt-5">
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-zinc-600">
            Workspace
          </p>

          <div className="space-y-1">
            {navigation.map(
              ({ label, path, icon: Icon, end, expandable }) => {
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
                                <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-orange-500" />
                              )}
                              <DoorOpen size={18} strokeWidth={1.8} />
                              <span>Rooms</span>
                            </>
                          )}
                        </NavLink>

                        <button
                          type="button"
                          aria-label={
                            roomsExpanded
                              ? "Collapse room links"
                              : "Expand room links"
                          }
                          aria-expanded={roomsExpanded}
                          onClick={handleRoomToggle}
                          className="ml-1 rounded-lg p-2 text-zinc-500 transition hover:bg-white/5 hover:text-white"
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
                        <div className="ml-5 space-y-1 border-l border-white/10 pl-3">
                          {roomLinks.map(
                            ({
                              label: roomLabel,
                              mode,
                              icon: RoomIcon,
                              comingSoon,
                            }) => {
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
                                    isSelected
                                      ? activeItemClass
                                      : inactiveItemClass
                                  }`}
                                >
                                  {isSelected && (
                                    <span className="absolute bottom-2 left-0 top-2 w-0.5 rounded-r-full bg-orange-500" />
                                  )}
                                  <RoomIcon size={15} strokeWidth={1.8} />
                                  <span className="min-w-0 flex-1">
                                    {roomLabel}
                                  </span>

                                  {mode === "online" && (
                                    <span className="rounded-full border border-orange-500/30 bg-orange-500/10 px-1.5 py-0.5 text-[8px] font-semibold uppercase tracking-wider text-orange-400">
                                      Live
                                    </span>
                                  )}
                                </NavLink>
                              );
                            },
                          )}
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
                          <span className="absolute bottom-2 left-0 top-2 w-1 rounded-r-full bg-orange-500" />
                        )}
                        <Icon size={18} strokeWidth={1.8} />
                        <span>{label}</span>
                      </>
                    )}
                  </NavLink>
                );
              },
            )}
          </div>
        </nav>

        {/* Compact account actions: icons only, side by side */}
        <div className="flex shrink-0 items-center justify-center gap-3 border-t border-white/10 px-4 py-3">
          <NavLink
            to="/dashboard/profile"
            onClick={onClose}
            aria-label="Profile"
            title="Profile"
            className={({ isActive }) =>
              `${accountIconClass} ${
                isActive
                  ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                  : ""
              }`
            }
          >
            <UserRound size={19} strokeWidth={1.8} />
          </NavLink>

          <NavLink
            to="/dashboard/settings"
            onClick={onClose}
            aria-label="Settings"
            title="Settings"
            className={({ isActive }) =>
              `${accountIconClass} ${
                isActive
                  ? "border-orange-500/50 bg-orange-500/10 text-orange-400"
                  : ""
              }`
            }
          >
            <Settings size={19} strokeWidth={1.8} />
          </NavLink>
        </div>
      </aside>
    </>
  );
}
