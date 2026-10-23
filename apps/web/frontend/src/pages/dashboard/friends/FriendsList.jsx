
import {
  ArrowUpRight,
  MessageCircle,
  MoreHorizontal,
  UserPlus,
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
  const name = user?.name || "User";

  return (
    <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-zinc-700 bg-zinc-800 text-xs font-bold text-zinc-200">
      {user?.avatar ? (
        <img
          src={user.avatar}
          alt={name}
          className="h-full w-full object-cover"
        />
      ) : (
        getInitials(name)
      )}
      <span
        className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0b0b0c] ${
          user?.online ? "bg-emerald-500" : "bg-zinc-600"
        }`}
      />
    </div>
  );
}

export default function FriendsList({
  users = [],
  mode = "friends",
  onProfile,
  onMessage,
  onAddFriend,
  onAccept,
  onReject,
  onCancel,
  emptyTitle,
  emptyDescription,
}) {
  if (!users.length) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-950/40 px-5 py-12 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-zinc-800 bg-zinc-900 text-zinc-500">
          <UserPlus size={20} />
        </div>
        <h3 className="mt-4 text-sm font-semibold text-zinc-200">
          {emptyTitle || "Nothing to show yet"}
        </h3>
        <p className="mx-auto mt-2 max-w-sm text-xs leading-5 text-zinc-500">
          {emptyDescription ||
            "When people appear here, you’ll be able to connect with them."}
        </p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-800 bg-[#0b0b0c]">
      {users.map((user, index) => {
        const name = user.name || "ChartWars Member";
        const isRequest = mode === "requests";
        const isSent = mode === "sent";
        const isDiscover = mode === "discover";

        return (
          <div
            key={user.id || user.username || `${name}-${index}`}
            className={`flex items-center gap-3 px-4 py-4 transition hover:bg-zinc-900/60 sm:px-5 ${
              index < users.length - 1 ? "border-b border-zinc-900" : ""
            }`}
          >
            <button
              type="button"
              onClick={() => onProfile?.(user)}
              className="shrink-0 rounded-full focus:outline-none focus:ring-2 focus:ring-[#E87524]"
              aria-label={`View ${name}'s profile`}
            >
              <Avatar user={user} />
            </button>

            <button
              type="button"
              onClick={() => onProfile?.(user)}
              className="min-w-0 flex-1 text-left"
            >
              <span className="flex items-center gap-2">
                <span className="truncate text-sm font-semibold text-zinc-100">
                  {name}
                </span>
                {user.verified && (
                  <span className="shrink-0 rounded-full border border-sky-900/70 px-1.5 py-0.5 text-[9px] text-sky-300">
                    Verified
                  </span>
                )}
              </span>
              <span className="mt-1 block truncate text-xs text-zinc-500">
                {user.username
                  ? `@${String(user.username).replace(/^@/, "")}`
                  : user.bio || "ChartWars member"}
              </span>
              <span className="mt-1.5 block text-[10px] text-zinc-600">
                {user.online ? "Online" : "Offline / status unavailable"}
                {user.preview ? " · Preview profile" : ""}
              </span>
            </button>

            <div className="flex shrink-0 items-center gap-1.5">
              {isRequest ? (
                <>
                  <button
                    type="button"
                    onClick={() => onAccept?.(user)}
                    className="rounded-lg bg-[#E87524] px-3 py-2 text-xs font-semibold text-white transition hover:bg-orange-500"
                  >
                    Accept
                  </button>
                  <button
                    type="button"
                    onClick={() => onReject?.(user)}
                    className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:bg-zinc-800"
                  >
                    Decline
                  </button>
                </>
              ) : isSent ? (
                <button
                  type="button"
                  onClick={() => onCancel?.(user)}
                  className="rounded-lg border border-zinc-800 px-3 py-2 text-xs text-zinc-400 transition hover:border-red-900/70 hover:text-red-300"
                >
                  Cancel
                </button>
              ) : isDiscover ? (
                <button
                  type="button"
                  onClick={() => onAddFriend?.(user)}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-orange-900/60 bg-orange-950/30 px-3 py-2 text-xs font-semibold text-orange-300 transition hover:bg-orange-950/60"
                >
                  <UserPlus size={14} />
                  <span className="hidden sm:inline">Add</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => onMessage?.(user)}
                  aria-label={`Message ${name}`}
                  title="Open preview chat"
                  className="rounded-lg border border-zinc-800 p-2.5 text-zinc-400 transition hover:border-orange-900/60 hover:text-orange-300"
                >
                  <MessageCircle size={16} />
                </button>
              )}

              <button
                type="button"
                onClick={() => onProfile?.(user)}
                aria-label={`More about ${name}`}
                title="View profile"
                className="hidden rounded-lg p-2.5 text-zinc-600 transition hover:bg-zinc-800 hover:text-zinc-300 sm:inline-flex"
              >
                <MoreHorizontal size={17} />
              </button>

              <button
                type="button"
                onClick={() => onProfile?.(user)}
                aria-label={`Open ${name}'s profile`}
                className="hidden p-1 text-zinc-600 transition hover:text-zinc-300 lg:inline-flex"
              >
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
