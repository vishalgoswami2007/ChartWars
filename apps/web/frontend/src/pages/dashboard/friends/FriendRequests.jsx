import React from "react";
import {
  Check,
  Clock3,
  MessageCircle,
  Search,
  ShieldCheck,
  UserRoundPlus,
  Users,
  X,
} from "lucide-react";

function getInitials(name = "User") {
  return name
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function Avatar({ user }) {
  return (
    <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-sm font-semibold text-zinc-200">
      {user.avatar ? (
        <img
          src={user.avatar}
          alt={user.name || "Member"}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(user.name)
      )}
    </div>
  );
}

function EmptyState({ type, onDiscover }) {
  const isSent = type === "sent";

  return (
    <div className="px-5 py-12 text-center sm:py-16">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900 text-zinc-500">
        {isSent ? <Clock3 size={23} /> : <Users size={23} />}
      </div>

      <h3 className="mt-4 text-base font-semibold text-white">
        {isSent ? "No pending requests" : "You're all caught up"}
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-zinc-500">
        {isSent
          ? "Friend requests you send will appear here while they wait for a response."
          : "When someone sends you a friend request, you can review it here."}
      </p>

      {!isSent && (
        <button
          type="button"
          onClick={onDiscover}
          className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#E87524] px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-orange-500"
        >
          <UserRoundPlus size={16} />
          Discover members
        </button>
      )}
    </div>
  );
}

function RequestRow({
  user,
  type,
  onAccept,
  onReject,
  onCancel,
  onProfile,
}) {
  const isSent = type === "sent";

  return (
    <article className="flex flex-col gap-4 border-b border-zinc-900 px-4 py-4 last:border-b-0 sm:flex-row sm:items-center sm:px-5">
      <button
        type="button"
        onClick={() => onProfile?.(user)}
        aria-label={`View ${user.name || "member"} profile`}
        className="shrink-0 self-start rounded-full focus:outline-none focus:ring-2 focus:ring-[#E87524]"
      >
        <Avatar user={user} />
      </button>

      <div className="min-w-0 flex-1">
        <button
          type="button"
          onClick={() => onProfile?.(user)}
          className="max-w-full truncate text-left text-sm font-semibold text-zinc-100 hover:text-orange-300"
        >
          {user.name || "ChartWars Member"}
        </button>

        {user.username && (
          <p className="mt-1 truncate text-xs text-zinc-500">
            @{String(user.username).replace(/^@/, "")}
          </p>
        )}

        {user.bio && (
          <p className="mt-2 line-clamp-2 text-xs leading-5 text-zinc-400">
            {user.bio}
          </p>
        )}

        <p className="mt-2 flex items-center gap-1.5 text-[11px] text-zinc-600">
          <Clock3 size={12} />
          {isSent ? "Waiting for response" : "Wants to connect with you"}
          {user.preview ? " · Preview" : ""}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        {isSent ? (
          <button
            type="button"
            onClick={() => onCancel?.(user)}
            className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-300 sm:flex-none"
          >
            <X size={14} />
            Cancel request
          </button>
        ) : (
          <>
            <button
              type="button"
              onClick={() => onReject?.(user)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-zinc-700 px-3 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-red-900 hover:bg-red-950/30 hover:text-red-300 sm:flex-none"
            >
              <X size={14} />
              Decline
            </button>

            <button
              type="button"
              onClick={() => onAccept?.(user)}
              className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-[#E87524] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-orange-500 sm:flex-none"
            >
              <Check size={14} />
              Accept
            </button>
          </>
        )}
      </div>
    </article>
  );
}

export default function FriendRequest({
  requests = [],
  sentRequests = [],
  onAccept,
  onReject,
  onCancel,
  onProfile,
  onDiscover,
  initialTab = "received",
}) {
  const [activeTab, setActiveTab] = React.useState(initialTab);
  const [search, setSearch] = React.useState("");

  const isSent = activeTab === "sent";
  const source = isSent ? sentRequests : requests;
  const query = search.trim().toLowerCase();

  const filteredRequests = source.filter((user) => {
    const name = (user.name || "").toLowerCase();
    const username = (user.username || "").toLowerCase();
    return name.includes(query) || username.includes(query);
  });

  const tabs = [
    {
      id: "received",
      label: "Received",
      count: requests.length,
    },
    {
      id: "sent",
      label: "Sent",
      count: sentRequests.length,
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0c]">
      <div className="border-b border-zinc-800 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-orange-900/50 bg-orange-950/30 text-[#E87524]">
            <UserRoundPlus size={20} />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-base font-semibold text-white">
              Friend requests
            </h2>
            <p className="mt-1 text-xs leading-5 text-zinc-500">
              Manage connection requests from the ChartWars community.
            </p>
          </div>

          <div className="hidden items-center gap-1.5 rounded-full border border-zinc-800 px-2.5 py-1.5 text-[10px] text-zinc-500 sm:flex">
            <ShieldCheck size={13} />
            Requests preview
          </div>
        </div>

        <div className="mt-5 flex gap-5 border-b border-zinc-900">
          {tabs.map((tab) => {
            const active = activeTab === tab.id;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => {
                  setActiveTab(tab.id);
                  setSearch("");
                }}
                className={`relative -mb-px flex items-center gap-2 border-b-2 pb-3 text-sm transition ${
                  active
                    ? "border-[#E87524] font-semibold text-white"
                    : "border-transparent text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}
                <span
                  className={`rounded-md px-1.5 py-0.5 text-[10px] ${
                    active
                      ? "bg-orange-950/50 text-orange-300"
                      : "bg-zinc-900 text-zinc-500"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        <label className="mt-4 flex items-center gap-2.5 rounded-xl border border-zinc-800 bg-zinc-950 px-3.5 py-3 focus-within:border-zinc-600">
          <Search size={16} className="shrink-0 text-zinc-600" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search requests by name or username..."
            aria-label="Search friend requests"
            className="min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-zinc-600"
          />
        </label>
      </div>

      {filteredRequests.length === 0 ? (
        <EmptyState
          type={isSent ? "sent" : "received"}
          onDiscover={onDiscover}
        />
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5">
            <p className="text-xs text-zinc-500">
              {filteredRequests.length}{" "}
              {filteredRequests.length === 1 ? "request" : "requests"}
            </p>
            <p className="text-[10px] text-zinc-600">
              {isSent ? "Awaiting response" : "Review each request"}
            </p>
          </div>

          {filteredRequests.map((user, index) => (
            <RequestRow
              key={user.id || user.username || `${user.name}-${index}`}
              user={user}
              type={activeTab}
              onAccept={onAccept}
              onReject={onReject}
              onCancel={onCancel}
              onProfile={onProfile}
            />
          ))}
        </>
      )}

      <div className="flex items-start gap-2 border-t border-zinc-900 bg-zinc-950/50 px-4 py-3 sm:px-5">
        <MessageCircle size={14} className="mt-0.5 shrink-0 text-zinc-600" />
        <p className="text-[10px] leading-5 text-zinc-600">
          This component uses the data and callbacks supplied by its parent.
          Requests are not saved to a server until backend integration is added.
        </p>
      </div>
    </section>
  );
}
