
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
import { useNavigate } from "react-router-dom";


import ChatWindow from "./friends/ChatWindow";
import UserProfileDrawer from "./friends/UserProfileDrawer";
import AlexenderChat from "./friends/AlexenderChat";

const tabs = [
  { id: "discover", label: "Discover" },
  { id: "friends", label: "My Friends" },
  { id: "requests", label: "Requests" },
  { id: "sent", label: "Sent" },
];

const previewUsers = [
  {
    id: "alexander-help",
    name: "Alexender",
    username: "@alexender",
    role: "ChartWars Assistant",
    bio: "Your guide to ChartWars features, practice rooms and account help.",
    avatar: "A",
    online: true,
    isBot: true,
    joined: "ChartWars guide",
    matches: 0,
    wins: 0,
    losses: 0,
    friends: 0,
  },
  {
    id: "cw-demo-01",
    name: "MarketPilot",
    username: "@marketpilot",
    role: "Practice enthusiast",
    bio: "Learning price action one session at a time.",
    avatar: "M",
    online: true,
    joined: "Preview profile",
    matches: 24,
    wins: 15,
    losses: 9,
    friends: 8,
  },
  {
    id: "cw-demo-02",
    name: "ChartSeeker",
    username: "@chartseeker",
    role: "Technical analysis learner",
    bio: "Focused on consistency, risk management and better decisions.",
    avatar: "C",
    online: false,
    joined: "Preview profile",
    matches: 18,
    wins: 10,
    losses: 8,
    friends: 5,
  },
  {
    id: "cw-demo-03",
    name: "CandleCraft",
    username: "@candlecraft",
    role: "Chart practice",
    bio: "Every chart is a chance to learn something new.",
    avatar: "C",
    online: false,
    joined: "Preview profile",
    matches: 31,
    wins: 19,
    losses: 12,
    friends: 11,
  },
];

const initialRequests = [];
const initialFriends = [];

function Avatar({ user, size = "md" }) {
  const sizes = {
    sm: "h-9 w-9 text-xs",
    md: "h-11 w-11 text-sm",
    lg: "h-14 w-14 text-lg",
  };

  if (user?.avatarUrl) {
    return (
      <img
        src={user.avatarUrl}
        alt=""
        className={`${sizes[size]} shrink-0 rounded-full border border-white/10 object-cover`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} flex shrink-0 items-center justify-center rounded-full border border-[#e87524]/25 bg-[#e87524]/10 font-semibold text-[#f5a36b]`}
    >
      {(user?.name || "U").charAt(0).toUpperCase()}
    </div>
  );
}

export default function FriendsPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("discover");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [chatUser, setChatUser] = useState(null);
  const [showAlexender, setShowAlexender] = useState(false);
  const [requests, setRequests] = useState(initialRequests);
  const [friends, setFriends] = useState(initialFriends);
  const [sentRequests, setSentRequests] = useState([]);
  const [notice, setNotice] = useState("");

  // These profiles are UI previews only, not real registered ChartWars users.
  const visibleUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (activeTab === "friends") {
      return friends.filter((user) =>
        `${user.name} ${user.username}`.toLowerCase().includes(query),
      );
    }

    if (activeTab === "requests") {
      return requests.filter((user) =>
        `${user.name} ${user.username}`.toLowerCase().includes(query),
      );
    }

    if (activeTab === "sent") {
      return sentRequests.filter((user) =>
        `${user.name} ${user.username}`.toLowerCase().includes(query),
      );
    }

    return previewUsers.filter((user) => {
      const matchesSearch =
        `${user.name} ${user.username} ${user.role}`
          .toLowerCase()
          .includes(query);

      return (
        matchesSearch &&
        !user.isBot &&
        !friends.some((friend) => friend.id === user.id) &&
        !sentRequests.some((friend) => friend.id === user.id)
      );
    });
  }, [activeTab, search, friends, requests, sentRequests]);

  const sendRequest = (user) => {
    if (user.isBot) {
      setShowAlexender(true);
      return;
    }

    if (
      friends.some((friend) => friend.id === user.id) ||
      sentRequests.some((friend) => friend.id === user.id)
    ) {
      return;
    }

    setSentRequests((current) => [...current, user]);
    setNotice(`Friend request prepared for ${user.name}.`);
  };

  const acceptRequest = (user) => {
    setRequests((current) => current.filter((item) => item.id !== user.id));
    setFriends((current) =>
      current.some((item) => item.id === user.id) ? current : [...current, user],
    );
    setNotice(`${user.name} added to your local preview friends list.`);
  };

  const cancelRequest = (user) => {
    setSentRequests((current) =>
      current.filter((item) => item.id !== user.id),
    );
    setNotice(`Removed ${user.name} from the local sent-request preview.`);
  };

  const openChat = (user) => {
    if (user.isBot) {
      setShowAlexender(true);
      return;
    }

    setChatUser(user);
  };

  const handleProfile = (user) => {
    setSelectedUser(user);
  };

  
  return (
    <main className="min-h-full bg-[#080808] px-4 py-5 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto max-w-375">
        {/* Page heading */}
        <header className="mb-7 flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
          <div>
            <div className="mb-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.23em] text-[#e87524]">
              <Users size={14} />
              Community
            </div>

            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              Friends
              <span className="ml-3 text-zinc-600">/</span>
              <span className="ml-3 text-zinc-400">Connect & compete</span>
            </h1>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400">
              Find your people, build your trading circle, and keep every
              practice conversation in one place.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/dashboard/markets")}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-lg bg-[#e87524] px-4 py-3 text-sm font-semibold text-black transition hover:bg-[#f28b3f]"
          >
            Explore markets
            <ArrowUpRight size={16} />
          </button>
        </header>

        {/* Feature summary */}
        <section className="mb-7 grid gap-3 sm:grid-cols-3">
          <SummaryCard
            icon={Users}
            label="My friends"
            value={friends.length}
            detail="In this preview session"
          />
          <SummaryCard
            icon={Clock3}
            label="Pending requests"
            value={requests.length}
            detail="Incoming requests"
          />
          <SummaryCard
            icon={MessageCircle}
            label="Conversations"
            value={friends.length + (showAlexender ? 1 : 0)}
            detail="Friends and assistant"
          />
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
                      activeTab === tab.id
                        ? "bg-[#e87524]/15 text-[#f5a36b]"
                        : "text-zinc-500 hover:text-white"
                    }`}
                  >
                    {tab.label}
                    {tab.id === "requests" && requests.length > 0 && (
                      <span className="ml-2 rounded-full bg-[#e87524] px-1.5 py-0.5 text-[9px] text-black">
                        {requests.length}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <label className="relative block min-w-0 sm:min-w-65">
                  <Search
                    size={16}
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500"
                  />
                  <input
                    type="search"
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder={
                      activeTab === "discover"
                        ? "Search people..."
                        : "Search this list..."
                    }
                    className="w-full rounded-lg border border-white/10 bg-black/30 py-2.5 pl-9 pr-3 text-sm text-white outline-none transition placeholder:text-zinc-600 focus:border-[#e87524]/50"
                  />
                </label>

                <button
                  type="button"
                  onClick={() =>
                    setNotice(
                      "Online filters will use real account presence after backend integration.",
                    )
                  }
                  className="inline-flex items-center justify-center gap-2 rounded-lg border border-white/10 px-3 py-2.5 text-xs text-zinc-400 transition hover:bg-white/4 hover:text-white"
                >
                  <SlidersHorizontal size={15} />
                  Filters
                </button>
              </div>
            </div>
          </div>

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
                    <p className="text-sm font-medium text-zinc-200">
                      Grow your ChartWars circle
                    </p>
                    <p className="mt-1 text-xs leading-5 text-zinc-500">
                      Discover people, send requests, and open a profile to
                      learn more about a trader.
                    </p>
                  </div>
                </div>
              )}

              {visibleUsers.length > 0 ? (
                <div className="divide-y divide-white/6">
                  {visibleUsers.map((user) => (
                    <UserRow
                      key={user.id}
                      user={user}
                      tab={activeTab}
                      onProfile={handleProfile}
                      onAdd={sendRequest}
                      onAccept={acceptRequest}
                      onCancel={cancelRequest}
                      onChat={openChat}
                    />
                  ))}
                </div>
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
                    {search
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
                          : "Try another search. Registered-user discovery will connect to the backend later."}
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
                <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                  Preview
                </span>
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
                    <p className="text-sm font-semibold text-zinc-100">
                      Alexender
                    </p>
                    <ShieldCheck size={13} className="text-[#e87524]" />
                  </div>
                  <p className="mt-1 text-[11px] text-zinc-500">
                    ChartWars help assistant
                  </p>
                </div>
                <MessageCircle
                  size={16}
                  className="text-zinc-500 transition group-hover:text-[#f5a36b]"
                />
              </button>

              <div className="rounded-xl border border-white/[0.07] bg-white/2 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <CircleHelp size={16} className="text-[#f5a36b]" />
                  <h3 className="text-xs font-semibold text-zinc-200">
                    Quick help
                  </h3>
                </div>

                <p className="text-xs leading-5 text-zinc-500">
                  Need help finding friends, managing requests or learning
                  how rooms work?
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

              <div className="mt-5 border-t border-white/[0.07] pt-4">
                <p className="text-[10px] leading-5 text-zinc-600">
                  Demo profiles are illustrative UI previews. Actual registered
                  users, requests and messages will come from your secured API.
                </p>
              </div>
            </aside>
          </div>
        </section>
      </div>

      {/* Profile drawer */}
      {selectedUser && (
        <UserProfileDrawer
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onAddFriend={sendRequest}
          onMessage={openChat}
        />
      )}

      {/* Chat window */}
      {chatUser && (
        <ChatWindow
          user={chatUser}
          onClose={() => setChatUser(null)}
          onProfile={() => {
            setSelectedUser(chatUser);
            setChatUser(null);
          }}
        />
      )}

      {/* Alexender help chat */}
      {showAlexender && (
        <AlexenderChat onClose={() => setShowAlexender(false)} />
      )}
    </main>
  );
}

function SummaryCard({ icon: Icon, label, value, detail }) {
  return (
    <div className="rounded-xl border border-white/8 bg-[#0d0d0d] p-4 sm:p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs text-zinc-500">{label}</p>
          <p className="mt-2 text-2xl font-semibold tracking-tight text-zinc-100">
            {value}
          </p>
          <p className="mt-1 text-[10px] text-zinc-600">{detail}</p>
        </div>
        <div className="flex h-9 w-9 items-center justify-center rounded-lg border border-white/[0.07] bg-white/2.5 text-[#f5a36b]">
          <Icon size={17} />
        </div>
      </div>
    </div>
  );
}

function UserRow({ user, tab, onProfile, onAdd, onAccept, onCancel, onChat }) {
  const isBot = user.isBot;
  const isFriend = tab === "friends";
  const isRequest = tab === "requests";
  const isSent = tab === "sent";

  return (
    <div className="flex flex-col gap-3 py-4 first:pt-0 last:pb-0 sm:flex-row sm:items-center">
      <button
        type="button"
        onClick={() => onProfile(user)}
        className="flex min-w-0 flex-1 items-center gap-3 text-left"
      >
        <div className="relative shrink-0">
          <Avatar user={user} />
          {!isBot && (
            <span
              className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-[#0d0d0d] ${
                user.online ? "bg-emerald-400" : "bg-zinc-600"
              }`}
            />
          )}
        </div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="truncate text-sm font-medium text-zinc-100">
              {user.name}
            </span>
            {isBot && <ShieldCheck size={13} className="text-[#e87524]" />}
          </div>
          <p className="mt-1 truncate text-xs text-zinc-500">
            {user.username}
            {user.role ? ` · ${user.role}` : ""}
          </p>
          <p className="mt-1 truncate text-[11px] text-zinc-600">
            {user.online ? "Online" : "Offline"} · {user.bio}
          </p>
        </div>
      </button>

      <div className="flex shrink-0 items-center gap-2 pl-12 sm:pl-0">
        <button
          type="button"
          onClick={() => onProfile(user)}
          className="rounded-lg border border-white/9 p-2.5 text-zinc-400 transition hover:bg-white/5 hover:text-white"
          aria-label={`View ${user.name}'s profile`}
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
          </button>
        ) : isRequest ? (
          <button
            type="button"
            onClick={() => onAccept(user)}
            className="inline-flex items-center gap-2 rounded-lg bg-[#e87524] px-3 py-2.5 text-xs font-semibold text-black transition hover:bg-[#f28b3f]"
          >
            <Check size={14} />
            Accept
          </button>
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
