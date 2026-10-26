import { useState } from "react";
import { Link } from "react-router-dom";
import { Bell, Lightbulb, Sparkles, Trophy, UserPlus, X } from "lucide-react";

import { clearNotifications, markAllRead, markRead, removeNotification, timeAgo, unreadCount, useAccount } from "../../features/account/accountStore";
import { ConfirmDialog, EmptyState, PageShell, btnDanger, btnGhost, card, useNow } from "../../features/account/ui";

const ICONS = { welcome: Sparkles, match: Trophy, invite: UserPlus, tip: Lightbulb, system: Bell };

export default function NotificationsPage() {
  const account = useAccount();
  const now = useNow();
  const [tab, setTab] = useState("all");
  const [confirmClear, setConfirmClear] = useState(false);

  const unread = unreadCount(account);
  const list = account.notifications.filter((n) => tab === "all" || !n.read);

  const tabClass = (active) =>
    `rounded-full border px-3.5 py-1.5 text-xs transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#e87524]/60 ${
      active ? "border-[#e87524] bg-[#e87524] font-semibold text-black" : "border-white/10 text-zinc-400 hover:border-white/25 hover:text-white"
    }`;

  return (
    <PageShell
      eyebrow="Your account"
      title="Notifications"
      description="Welcome messages, room invitations and match results."
      right={
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={unread === 0} onClick={markAllRead} className={btnGhost}>Mark all as read</button>
          <button type="button" disabled={account.notifications.length === 0} onClick={() => setConfirmClear(true)} className={btnDanger}>Clear all</button>
        </div>
      }
    >
      <div className="flex flex-wrap items-center gap-2" role="group" aria-label="Filter notifications">
        <button type="button" aria-pressed={tab === "all"} onClick={() => setTab("all")} className={tabClass(tab === "all")}>All</button>
        <button type="button" aria-pressed={tab === "unread"} onClick={() => setTab("unread")} className={tabClass(tab === "unread")}>Unread {unread > 0 && `(${unread})`}</button>
        <Link to="/dashboard/settings" className="ml-auto text-xs text-[#f59a55] underline-offset-4 hover:underline">Notification settings</Link>
      </div>

      {list.length === 0 ? (
        <EmptyState
          title={tab === "unread" ? "You are all caught up" : "No notifications"}
          text={tab === "unread" ? "There is nothing unread right now." : "Match results and room invitations will appear here."}
        />
      ) : (
        <ul className={`${card} divide-y divide-white/6`}>
          {list.map((n) => {
            const Icon = ICONS[n.type] ?? Bell;
            return (
              <li key={n.id} className="group flex items-stretch">
                <button
                  type="button"
                  onClick={() => markRead(n.id)}
                  aria-label={`${n.title}${n.read ? "" : ", unread"}. Mark as read`}
                  className="flex min-w-0 flex-1 items-start gap-3 px-4 py-3.5 text-left transition hover:bg-white/3 focus-visible:bg-white/3 focus-visible:outline-none"
                >
                  <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg border ${n.read ? "border-white/10 text-zinc-500" : "border-[#e87524]/40 bg-[#e87524]/10 text-[#f59a55]"}`}>
                    <Icon size={15} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className={`truncate text-sm ${n.read ? "text-zinc-300" : "font-semibold text-white"}`}>{n.title}</span>
                      {!n.read && <span className="size-1.5 shrink-0 rounded-full bg-[#e87524]" aria-hidden="true" />}
                    </span>
                    {n.body && <span className="mt-0.5 block text-xs leading-5 text-zinc-500">{n.body}</span>}
                    <span className="mt-1 block text-[11px] text-zinc-600">{timeAgo(n.at, now)}</span>
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => removeNotification(n.id)}
                  aria-label={`Delete ${n.title}`}
                  className="px-3 text-zinc-600 transition hover:text-red-300 focus-visible:text-red-300 focus-visible:outline-none"
                >
                  <X size={14} />
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {confirmClear && (
        <ConfirmDialog
          title="Clear all notifications?"
          body="Every notification on this device will be deleted."
          confirmLabel="Clear all"
          danger
          onCancel={() => setConfirmClear(false)}
          onConfirm={() => {
            clearNotifications();
            setConfirmClear(false);
          }}
        />
      )}
    </PageShell>
  );
}