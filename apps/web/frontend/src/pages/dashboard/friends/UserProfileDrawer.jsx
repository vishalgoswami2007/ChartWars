
import {
  Activity,
  CalendarDays,
  Check,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Swords,
  Trophy,
  UserPlus,
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

function getJoinedLabel(user) {
  if (user?.joinedAt) {
    const joined = new Date(user.joinedAt);

    if (!Number.isNaN(joined.getTime())) {
      return joined.toLocaleDateString("en", {
        month: "short",
        year: "numeric",
      });
    }
  }

  return user?.joinedLabel || "Not available";
}

function Stat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3">
      <Icon size={17} className="mb-3 text-[#E87524]" />
      <p className="text-xl font-semibold text-white">{value}</p>
      <p className="mt-1 text-xs text-zinc-500">{label}</p>
    </div>
  );
}

export default function UserProfileDrawer({
  user,
  onClose,
  onAddFriend,
  onMessage,
}) {
  if (!user) return null;

  const name = user.name || "ChartWars Member";
  const initials = getInitials(name);
  const matches = Number(user.matches ?? 0);
  const wins = Number(user.wins ?? 0);
  const losses = Number(user.losses ?? 0);
  const winRate =
    matches > 0 ? `${Math.round((wins / matches) * 100)}%` : "—";

  const isFriend = Boolean(user.isFriend);
  const requestSent = Boolean(user.requestSent);

  function addFriend() {
    onAddFriend?.(user);
  }

  function messageUser() {
    onMessage?.(user);
  }

  return (
    <div className="fixed inset-0 z-65 flex justify-end bg-black/65 backdrop-blur-sm">
      <button
        type="button"
        aria-label="Close profile"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />

      <aside className="relative flex h-full w-full max-w-md flex-col overflow-y-auto border-l border-zinc-800 bg-[#0b0b0c] shadow-2xl">
        <div className="relative h-36 shrink-0 bg-linear-to-br from-orange-950 via-zinc-900 to-[#0b0b0c]">
          <div className="absolute inset-0 opacity-30 bg-[radial-gradient(circle_at_75%_30%,#E87524_0,transparent_38%)]" />
          <button
            type="button"
            aria-label="Close profile"
            onClick={onClose}
            className="absolute right-4 top-4 rounded-lg border border-white/10 bg-black/30 p-2 text-zinc-300 transition hover:bg-black/60 hover:text-white"
          >
            <X size={18} />
          </button>
          <span className="absolute bottom-4 left-5 flex items-center gap-2 rounded-full border border-white/10 bg-black/35 px-3 py-1.5 text-[11px] text-zinc-300">
            <ShieldCheck size={14} className="text-[#E87524]" />
            ChartWars profile preview
          </span>
        </div>

        <div className="px-5 pb-8">
          <div className="-mt-10 flex items-end justify-between gap-3">
            <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-[#0b0b0c] bg-zinc-800 text-xl font-bold text-zinc-200">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={name}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials
              )}
            </div>

            {user.verified && (
              <span className="mb-1 inline-flex items-center gap-1 rounded-full border border-sky-900/60 bg-sky-950/50 px-2.5 py-1 text-[11px] text-sky-300">
                <Check size={12} />
                Verified
              </span>
            )}
          </div>

          <div className="mt-4">
            <h2 className="text-2xl font-semibold tracking-tight text-white">
              {name}
            </h2>
            {user.username && (
              <p className="mt-1 text-sm text-zinc-500">
                @{String(user.username).replace(/^@/, "")}
              </p>
            )}
            {user.bio && (
              <p className="mt-4 whitespace-pre-wrap text-sm leading-6 text-zinc-300">
                {user.bio}
              </p>
            )}
            {!user.bio && (
              <p className="mt-3 text-sm text-zinc-600">
                This member hasn’t added a bio yet.
              </p>
            )}
          </div>

          <div className="mt-5 flex flex-wrap gap-2">
            {isFriend ? (
              <button
                type="button"
                onClick={messageUser}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E87524] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                <MessageCircle size={17} />
                Message
              </button>
            ) : requestSent ? (
              <button
                type="button"
                disabled
                className="inline-flex flex-1 cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900 px-4 py-3 text-sm font-medium text-zinc-400"
              >
                <Check size={17} />
                Request sent
              </button>
            ) : (
              <button
                type="button"
                onClick={addFriend}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-[#E87524] px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-500"
              >
                <UserPlus size={17} />
                Add friend
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-zinc-800 px-4 py-3 text-sm font-medium text-zinc-300 transition hover:bg-zinc-900"
            >
              Close
            </button>
          </div>

          <div className="mt-7">
            <div className="mb-3 flex items-center gap-2">
              <Activity size={16} className="text-[#E87524]" />
              <h3 className="text-sm font-semibold text-white">
                Practice statistics
              </h3>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <Stat icon={Swords} label="Matches" value={matches} />
              <Stat icon={Trophy} label="Wins" value={wins} />
              <Stat icon={Activity} label="Losses" value={losses} />
              <Stat icon={Check} label="Win rate" value={winRate} />
            </div>
            <p className="mt-2 text-[11px] leading-5 text-zinc-600">
              Statistics are preview values until connected to a real ChartWars
              account.
            </p>
          </div>

          <div className="mt-7 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4">
            <div className="flex items-start gap-3">
              <CalendarDays
                size={18}
                className="mt-0.5 shrink-0 text-zinc-500"
              />
              <div>
                <p className="text-xs text-zinc-500">Member since</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">
                  {getJoinedLabel(user)}
                </p>
              </div>
            </div>

            <div className="mt-4 flex items-start gap-3">
              <Clock3
                size={18}
                className="mt-0.5 shrink-0 text-zinc-500"
              />
              <div>
                <p className="text-xs text-zinc-500">Availability</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">
                  {user.online ? "Online" : "Status unavailable"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
