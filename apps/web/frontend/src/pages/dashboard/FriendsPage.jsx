import { useMemo, useState } from "react";
import {
  Search,
  Users,
  UserPlus,
  MessageCircle,
  UserRound,
  Clock3,
  ArrowUpRight,
  SlidersHorizontal,
  ShieldCheck,
  Sparkles,
  X,
  Check,
  CircleHelp,
} from "lucide-react";

import { useDiscover, useFriends } from "../../features/social/useFriends";
import { avatarSrc, displayName, handleOf } from "../../features/social/people";
import ChatWindow from "./friends/ChatWindow";
import UserProfileDrawer from "./friends/UserProfileDrawer";
import AlexenderChat from "./friends/AlexenderChat";

const tabs = [
  { id: "discover", label: "Discover" },
  { id: "friends", label: "My Friends" },
  { id: "requests", label: "Requests" },
  { id: "sent", label: "Sent" },
];

function Avatar({ user, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-lg",
  };
  const src = avatarSrc(user);

  if (src) {
    return (
      <img
        src={src}
        alt=""
        className={`${sizes[size]} shrink-0 rounded-full border border-white/10 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full border border-[#e87524]/25 bg-[#e87524]/10 font-semibold text-[#f5a36b]`}
    >
      {displayName(user).charAt(0).toUpperCase()}
    </div>
  );
}

export default function FriendsPage() {
  const [activeTab, setActiveTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [onlineOnly, setOnlineOnly] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [showAlexender, setShowAlexender] = useState(false);
  const [notice, setNotice] = useState("");

  const { friends, requests, sent, loading, error, sendRequest, respond, unfriend, clearUnread } =
    useFriends(chatId);
  const discover = useDiscover(
    activeTab === "discover" ? search.trim() : "",
    friends.length + requests.length + sent.length
  );

  const visibleUsers = useMemo(() => {
    const q = search.trim().toLowerCase();
    const match = (u) => `${displayName(u)} ${u.username ?? ""}`.toLowerCase().includes(q);

    let list;
    if (activeTab === "friends") list = friends.filter(match);
    else if (activeTab === "requests") list = requests.map((r) => ({ ...r.from, requestId: r.id })).filter(match);
    else if (activeTab === "sent") list = sent.map((s) => ({ ...s.to, requestId: s.id })).filter(match);
    else list = discover.users; // server pe hi search ho chuka hai

    return onlineOnly ? list.filter((u) => u.online) : list;
  }, [activeTab, search, friends, requests, sent, discover.users, onlineOnly]);

  // Drawer me live flags: friend hai ya request bheji hui hai
  const profile = useMemo(() => {
    if (!selectedUser) return null;
    const friend = friends.find((f) => f.id === selectedUser.id);
    return {
      ...selectedUser,
      ...(friend ?? {}),
      isFriend: Boolean(friend),
      requestSent: sent.some((s) => s.to.id === selectedUser.id),
    };
  }, [selectedUser, friends, sent]);

  const chatUser = friends.find((f) => f.id === chatId) ?? null;
  const onlineFriends = friends.filter((f) => f.online).slice(0, 5);
  const unreadTotal = friends.reduce((n, f) => n + (f.unread ?? 0), 0);
  const conversations = friends.filter((f) => f.lastMessage).length + (showAlexender ? 1 : 0);
  const listLoading = activeTab === "discover" ? discover.loading : loading;

  const handleAdd = async (user) => {
    const err = await sendRequest(user.id);
    setNotice(err ?? `Friend request sent to ${displayName(user)}.`);
  };

  const handleAccept = async (user) => {
    const err = await respond(user.requestId, true);
    setNotice(err ?? `You and ${displayName(user)} are now friends.`);
  };

  const handleDecline = async (user) => {
    const err = await respond(user.requestId, false);
    setNotice(err ?? "Request declined.");
  };

  const handleCancel = async (user) => {
    const err = await unfriend(user.id);
    setNotice(err ?? `Request to ${displayName(user)} cancelled.`);
  };

  const handleRemove = async (user) => {
    if (!window.confirm(`Remove ${displayName(user)} from your friends?`)) return;
    const err = await unfriend(user.id);
    if (!err) {
      setSelectedUser(null);
      if (chatId === user.id) setChatId(null);
    }
    setNotice(err ?? `${displayName(user)} was removed from your friends.`);
  };

  const openChat = (user) => {
    setSelectedUser(null);
    setChatId(user.id);
    clearUnread(user.id);
  };

  return (
    <main className="min-h-full bg-[#080808] px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-375">
        {/* Feature summary */}
        <section className="mb-7 grid gap-3 sm:grid-cols-3">
          <SummaryCard icon={Users} label="My friends" value={friends.length} detail="Accepted friends" />
          <SummaryCard icon={Clock3} label="Pending requests" value={requests.length} detail="Incoming requests" />
          <SummaryCard icon={MessageCircle} label="Conversations" value={conversations} detail="Friends and assistant" />
        </section>

        {/* Main workspace */}
        <section className="overflow-hidden rounded-2xl border border-white/8 bg-[#0d0d0d]">
          <div className="border-b border-white/[0.07] p-4 sm:p-5">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex flex-wrap gap-1 rounded-xl border border-white/[0.07] bg-black/30 p-1">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSearch("");
                    }}
                    className={`rounded-lg px-3 py-2 text-xs font-medium transition sm:px-4 ${
                      activeTab === tab.id ? "bg-[#e87524]/15 text-[#f5a36b]" : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "requests" && requests.length > 0 && (
                      <span className="ml-2 rounded-full bg-[#e87524] px-1.5 py-0.5 text-[9px] text-black">
                        {requests.length}
                      </span>
                    )}
                    {tab.id === "friends" && unreadTotal > 0 && (
                      <span className="ml-2 rounded-full bg-[#e87524] px-1.5 py-0.5 text-[9px] text-black">
                        {unreadTotal > 99 ? "99+" : unreadTotal}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block min-w-0 sm:min-w-65">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={activeTab === "discover" ? "Search people..." : "Search this list..."}
                    className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#e87524]/50"
                  />
                </label>

                <button
                  type="button"
                  aria-pressed={onlineOnly}
                  onClick={() => setOnlineOnly((v) => !v)}
                  className={`inline-flex items-center justify-center gap-2 rounded-lg border px-3 py-2.5 text-xs transition ${
                    onlineOnly
                      ? "border-[#e87524]/50 bg-[#e87524]/10 text-[#f5a36b]"
                      : "border-white/10 text-zinc-400 hover:bg-white/4 hover:text-white"
                  }`}
                >
                  <SlidersHorizontal size={15} />
                  {onlineOnly ? "Online only" : "Filters"}
                </button>
              </div>
            </div>
          </div>

          {error && (
            <p role="alert" className="border-b border-red-500/20 bg-red-500/8 px-4 py-3 text-xs text-red-300 sm:px-5">
              {error}
            </p>
          )}

          {notice && (
            <div className="flex items-start justify-between gap-3 border-b border-[#e87524]/20 bg-[#e87524]/6 px-4 py-3 text-xs text-[#f5a36b] sm:px-5">
              <p>{notice}</p>
              <button
                type="button"
                aria-label="Dismiss message"
                onClick={() => setNotice("")}
                className="shrink-0 text-zinc-500 hover:text-white"
              >
                <X size={15} />
              </button>
            </div>
          )}

          <div className="grid min-h-115 xl:grid-cols-[minmax(0,1fr)_320px]">
            {/* User list */}
            <div className="min-w-0 p-4 sm:p-5">
              {activeTab === "discover" && (
                <div className="mb-5 flex items-start gap-3 rounded-xl border border-[#e87524]/15 bg-[#e87524]/4.5 p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e87524]/10 text-[#f5a36b]">
                    <Sparkles size={17} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-zinc-200">Grow your ChartWars circle</p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Discover people, send requests, and open a profile to learn more about a trader.
                    </p>
                  </div>
                </div>
              )}

              {visibleUsers.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {visibleUsers.map((user) => (
                    <UserRow
                      key={user.requestId ?? user.id}
                      user={user}
                      tab={activeTab}
                      onProfile={setSelectedUser}
                      onAdd={handleAdd}
                      onAccept={handleAccept}
                      onDecline={handleDecline}
                      onCancel={handleCancel}
                      onChat={openChat}
                    />
                  ))}
                </div>
              ) : listLoading ? (
                <p className="py-16 text-center text-xs text-zinc-500">Loading...</p>
              ) : (
                <div className="flex min-h-75 flex-col items-center justify-center px-4 text-center">
                  <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl border border-white/8 bg-white/2.5 text-zinc-500">
                    {activeTab === "requests" ? (
                      <UserPlus size={23} />
                    ) : activeTab === "friends" ? (
                      <Users size={23} />
                    ) : (
                      <Search size={23} />
                    )}
                  </div>
                  <h3 className="text-base font-medium text-zinc-200">
                    {search || onlineOnly
                      ? "No matching people"
                      : activeTab === "friends"
                        ? "Your circle starts here"
                        : activeTab === "requests"
                          ? "You're all caught up"
                          : activeTab === "sent"
                            ? "No sent requests"
                            : "No people found"}
                  </h3>
                  <p className="mt-2 max-w-sm text-xs leading-5 text-zinc-500">
                    {activeTab === "friends"
                      ? "Discover people and add friends to start building your community."
                      : activeTab === "requests"
                        ? "Incoming friend requests will appear here."
                        : activeTab === "sent"
                          ? "Requests you send will appear here."
                          : "Try another search."}
                  </p>

                  {activeTab !== "discover" && (
                    <button
                      type="button"
                      onClick={() => setActiveTab("discover")}
                      className="mt-5 rounded-lg border border-white/10 px-4 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-[#e87524]/40 hover:text-white"
                    >
                      Discover people
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Right rail */}
            <aside className="border-t border-white/[0.07] bg-black/15 p-4 sm:p-5 xl:border-l xl:border-t-0">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-semibold">Your community</h2>
                <span className="text-[10px] uppercase tracking-wider text-emerald-400">Live</span>
              </div>

              <button
                type="button"
                onClick={() => setShowAlexender(true)}
                className="group mb-5 flex w-full items-center gap-3 rounded-xl border border-[#e87524]/20 bg-[#e87524]/5.5 p-3 text-left transition hover:border-[#e87524]/40 hover:bg-[#e87524]/9"
              >
                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e87524]/30 bg-[#e87524]/10 text-sm font-bold text-[#f5a36b]">
                  A
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#101010] bg-emerald-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-zinc-100">Alexender</p>
                    <ShieldCheck size={13} className="text-[#e87524]" />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">ChartWars help assistant</p>
                </div>
                <MessageCircle size={16} className="text-zinc-500 transition group-hover:text-[#f5a36b]" />
              </button>

              <div className="mb-5">
                <p className="mb-2 text-[10px] uppercase tracking-wider text-zinc-600">Online now</p>
                {onlineFriends.length === 0 ? (
                  <p className="text-xs text-zinc-600">No friends online right now.</p>
                ) : (
                  <ul className="space-y-1.5">
                    {onlineFriends.map((friend) => (
                      <li key={friend.id}>
                        <button
                          type="button"
                          onClick={() => openChat(friend)}
                          className="flex w-full items-center gap-2.5 rounded-lg border border-white/[0.07] px-2.5 py-2 text-left transition hover:border-[#e87524]/40"
                        >
                          <span className="relative">
                            <Avatar user={friend} size="sm" />
                            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0d0d0d] bg-emerald-400" />
                          </span>
                          <span className="min-w-0 flex-1 truncate text-xs text-zinc-200">{displayName(friend)}</span>
                          <MessageCircle size={14} className="text-zinc-500" />
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CircleHelp size={16} className="text-[#f5a36b]" />
                  <h3 className="text-xs font-semibold text-zinc-200">Quick help</h3>
                </div>
                <p className="text-xs leading-5 text-zinc-500">
                  Need help finding friends, managing requests or learning how rooms work?
                </p>
                <button
                  type="button"
                  onClick={() => setShowAlexender(true)}
                  className="mt-4 inline-flex items-center gap-2 text-xs font-semibold text-[#f5a36b] transition hover:text-white"
                >
                  Ask Alexender
                  <ArrowUpRight size={14} />
                </button>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* Profile drawer */}
      {profile && (
        <UserProfileDrawer
          user={profile}
          onClose={() => setSelectedUser(null)}
          onAddFriend={handleAdd}
          onMessage={openChat}
          onRemoveFriend={handleRemove}
        />
      )}

      {/* Chat window. key se friend badalne par chat reset hoti hai */}
      {chatUser && (
        <ChatWindow
          key={chatUser.id}
          user={chatUser}
          onClose={() => setChatId(null)}
          onProfile={() => {
            setSelectedUser(chatUser);
            setChatId(null);
          }}
        />
      )}

      {/* Alexender help chat */}
      {showAlexender && <AlexenderChat onClose={() => setShowAlexender(false)} />}
    </main>
  );
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#0d0d0d] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">{value}</p>
          <p className="mt-1 text-[10px] text-zinc-600">{detail}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/2.5 text-[#f5a36b]">
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, tab, onProfile, onAdd, onAccept, onDecline, onCancel, onChat }) {
  const isFriend = tab === "friends";
  const isRequest = tab === "requests";
  const isSent = tab === "sent";
  const name = displayName(user);
  const last = user.lastMessage;
  const unread = user.unread ?? 0;

  const detail =
    isFriend && last
      ? `${last.mine ? "You: " : ""}${last.text}`
      : `${user.online ? "Online" : "Offline"}${user.bio ? ` · ${user.bio}` : ""}`;

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => onProfile(user)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="relative shrink-0">
          <Avatar user={user} />
          {user.online && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0d0d0d] bg-emerald-400" />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <span className="block truncate text-sm font-medium text-zinc-100">{name}</span>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {handleOf(user)}
            {user.elo != null ? ` · ELO ${user.elo}` : ""}
          </p>
          <p className={`mt-1 truncate text-[11px] ${unread > 0 ? "font-medium text-zinc-300" : "text-zinc-600"}`}>
            {detail}
          </p>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
        <button
          type="button"
          onClick={() => onProfile(user)}
          className="rounded-lg border border-white/9 p-2.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          aria-label={`View ${name}'s profile`}
          title="View profile"
        >
          <UserRound size={15} />
        </button>

        {isFriend ? (
          <button
            type="button"
            onClick={() => onChat(user)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e87524] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-[#f28b3f]"
          >
            <MessageCircle size={14} />
            Message
            {unread > 0 && (
              <span className="rounded-full bg-black px-1.5 py-0.5 text-[10px] text-[#f5a36b]">
                {unread > 99 ? "99+" : unread}
              </span>
            )}
          </button>
        ) : isRequest ? (
          <>
            <button
              type="button"
              onClick={() => onDecline(user)}
              className="rounded-lg border border-white/10 px-3 py-2.5 text-xs text-zinc-400 transition hover:border-red-400/30 hover:text-red-300"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => onAccept(user)}
              className="inline-flex items-center gap-2 rounded-lg bg-[#e87524] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-[#f28b3f]"
            >
              <Check size={14} />
              Accept
            </button>
          </>
        ) : isSent ? (
          <button
            type="button"
            onClick={() => onCancel(user)}
            className="rounded-lg border border-white/10 px-3 py-2.5 text-xs text-zinc-400 transition hover:border-red-400/30 hover:text-red-300"
          >
            Cancel
          </button>
        ) : (
          <button
            type="button"
            onClick={() => onAdd(user)}
            className="inline-flex items-center gap-2 rounded-lg border border-[#e87524]/30 bg-[#e87524]/[0.07] px-3 py-2.5 text-xs font-semibold text-[#f5a36b] transition hover:bg-[#e87524]/15"
          >
            <UserPlus size={14} />
            Add friend
          </button>
        )}
      </div>
    </div>
  );
}