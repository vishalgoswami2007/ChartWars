import { useCallback, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, ChevronDown, History, LogOut, Settings, UserRound } from "lucide-react";

import { displayName, unreadCount, useAccount } from "./accountStore";
import { Avatar } from "./avatars";
import { ConfirmDialog, card, useDismiss } from "./ui";

const ITEMS = [
  { label: "My profile", icon: UserRound, to: "/dashboard/profile" },
  { label: "Match history", icon: History, to: "/dashboard/history" },
  { label: "Notifications", icon: Bell, to: "/dashboard/notifications", badge: true },
  { label: "Settings", icon: Settings, to: "/dashboard/settings" },
];

export default function AccountMenu() {
  const navigate = useNavigate();
  const account = useAccount();
  const { profile } = account;
  const unread = unreadCount(account);
  const name = displayName(profile);

  const [open, setOpen] = useState(false);
  const [confirmOut, setConfirmOut] = useState(false);
  const ref = useRef(null);
  const menuRef = useRef(null);
  const close = useCallback(() => setOpen(false), []);
  useDismiss(ref, open, close);

  const go = (to) => {
    setOpen(false);
    navigate(to);
  };

  const onMenuKey = (event) => {
    if (event.key !== "ArrowDown" && event.key !== "ArrowUp") return;
    event.preventDefault();
    const items = [...menuRef.current.querySelectorAll("[role='menuitem']")];
    const at = items.indexOf(document.activeElement);
    const next = event.key === "ArrowDown" ? (at + 1) % items.length : (at - 1 + items.length) % items.length;
    items[next]?.focus();
  };

  const row =
    "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-left text-xs text-zinc-300 transition hover:bg-white/5 hover:text-white focus-visible:bg-white/5 focus-visible:text-white focus-visible:outline-none";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Account menu"
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg py-1.5 pl-1.5 pr-1 text-left transition hover:bg-white/4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60"
      >
        <Avatar avatar={profile.avatar} name={name} size={32} />
        <div className="hidden max-w-32 sm:block">
          <p className="truncate text-xs font-medium text-zinc-200">{name}</p>
          <p className="mt-0.5 truncate text-[10px] text-zinc-500">@{profile.username}</p>
        </div>
        <ChevronDown size={14} className={`hidden text-zinc-500 transition sm:block ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div ref={menuRef} role="menu" aria-label="Account" onKeyDown={onMenuKey} className={`${card} absolute right-0 top-full z-50 mt-2 w-64 p-2 shadow-2xl shadow-black`}>
          <div className="flex items-center gap-3 border-b border-white/8 px-3 pb-3 pt-2">
            <Avatar avatar={profile.avatar} name={name} size={40} />
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-white">{name}</p>
              <p className="truncate text-[11px] text-zinc-500">@{profile.username}</p>
            </div>
          </div>

          <div className="py-1">
            {ITEMS.map(({ label, icon: Icon, to, badge }) => (
              <button key={to} type="button" role="menuitem" autoFocus={label === "My profile"} onClick={() => go(to)} className={row}>
                <Icon size={15} className="text-zinc-500" />
                {label}
                {badge && unread > 0 && (
                  <span className="ml-auto rounded-full bg-[#e87524] px-1.5 py-0.5 text-[10px] font-semibold leading-none text-black">{unread > 9 ? "9+" : unread}</span>
                )}
              </button>
            ))}
          </div>

          <div className="border-t border-white/8 pt-1">
            <button
              type="button"
              role="menuitem"
              onClick={() => {
                setOpen(false);
                setConfirmOut(true);
              }}
              className={`${row} text-red-300 hover:text-red-200`}
            >
              <LogOut size={15} />
              Sign out
            </button>
          </div>
        </div>
      )}

      {confirmOut && (
        <ConfirmDialog
          title="Sign out?"
          body="You will go back to the login page. Your profile, wallet and history stay saved on this device."
          confirmLabel="Sign out"
          onCancel={() => setConfirmOut(false)}
          onConfirm={() => {
            setConfirmOut(false);
            navigate("/login");
          }}
        />
      )}
    </div>
  );
}