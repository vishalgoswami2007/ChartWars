import { useSyncExternalStore } from "react";

export const HISTORY_DAYS = 10;
export const START_BALANCE = 10000;
export const RATING = 1200; // provisional until the backend ranks players
export const TIER = "Unranked";
export const MODE_LABEL = { online: "Online", friends: "Friends", blind: "Blind Room", coach: "Vs Coach" };
export const RESULT_LABEL = { win: "Win", loss: "Loss", draw: "Draw", pass: "Passed", fail: "Not yet" };

const KEY = "cw.account.v1";
const DAY = 86_400_000;
const MAX_HISTORY = 500;
const MAX_LEDGER = 200;
const MAX_NOTIFICATIONS = 50;

/* ---------- Formatting ---------- */

const whole = new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 });
const cents = new Intl.NumberFormat("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const formatCW = (v) => (Number.isFinite(v) ? whole.format(Math.round(v)) : "—");
export const formatPnl = (v) =>
  Number.isFinite(v) ? `${v > 0 ? "+" : v < 0 ? "-" : ""}$${cents.format(Math.abs(v))}` : "—";
export const pnlTone = (v) => (v > 0 ? "text-emerald-400" : v < 0 ? "text-red-400" : "text-zinc-300");

export function timeAgo(at, now) {
  const s = Math.max(0, Math.round((now - at) / 1000));
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

export function dayLabel(at, now) {
  const d = new Date(at);
  const n = new Date(now);
  const startNow = new Date(n.getFullYear(), n.getMonth(), n.getDate()).getTime();
  const startThen = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const diff = Math.round((startNow - startThen) / DAY);
  if (diff === 0) return "Today";
  if (diff === 1) return "Yesterday";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

export const displayName = (profile) => profile.fullName.trim() || profile.username;
export const initials = (name) =>
  name
    .split(/\s+|_/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join("") || "T";
export const unreadCount = (state) => state.notifications.filter((n) => !n.read).length;

/* ---------- State shape, cleaning and pruning ---------- */

const uid = (prefix) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 7)}`;
const arr = (v) => (Array.isArray(v) ? v : []);
const str = (v, fallback = "") => (typeof v === "string" ? v : fallback);
const num = (v, fallback = 0) => (Number.isFinite(v) ? v : fallback);
const flag = (v, fallback) => (typeof v === "boolean" ? v : fallback);

function defaults() {
  const now = Date.now();
  return {
    v: 1,
    profile: {
      username: `trader_${Math.floor(1000 + Math.random() * 9000)}`,
      fullName: "",
      bio: "",
      avatar: { kind: "preset", id: "twin" },
      createdAt: now,
    },
    settings: {
      notify: { match: true, invites: true, tips: true },
      privacy: { showProfile: true, showOnLeaderboard: true, allowInvites: true },
    },
    wallet: {
      balance: START_BALANCE,
      ledger: [{ id: "start", at: now, type: "start", amount: 0, balance: START_BALANCE, label: "Starting balance" }],
    },
    history: [],
    stats: { matches: 0, wins: 0, losses: 0, draws: 0, netPnl: 0, blindPassed: 0 },
    notifications: [
      {
        id: "welcome",
        at: now,
        type: "welcome",
        title: "Welcome to ChartWars",
        body: "Practise with virtual funds, challenge friends and review every decision. Your results will show up here.",
        read: false,
      },
    ],
  };
}

function clean(raw) {
  const d = defaults();
  if (!raw || typeof raw !== "object") return d;
  const p = raw.profile ?? {};
  const a = p.avatar ?? {};
  const avatar =
    a.kind === "upload" && typeof a.src === "string" && a.src.startsWith("data:image/")
      ? { kind: "upload", src: a.src }
      : { kind: "preset", id: str(a.id, d.profile.avatar.id) };
  const n = raw.settings?.notify ?? {};
  const pv = raw.settings?.privacy ?? {};
  const s = raw.stats ?? {};

  return {
    v: 1,
    profile: {
      username: /^[a-z0-9_]{3,20}$/.test(str(p.username)) ? p.username : d.profile.username,
      fullName: str(p.fullName).slice(0, 40),
      bio: str(p.bio).slice(0, 120),
      avatar,
      createdAt: num(p.createdAt, d.profile.createdAt),
    },
    settings: {
      notify: { match: flag(n.match, true), invites: flag(n.invites, true), tips: flag(n.tips, true) },
      privacy: {
        showProfile: flag(pv.showProfile, true),
        showOnLeaderboard: flag(pv.showOnLeaderboard, true),
        allowInvites: flag(pv.allowInvites, true),
      },
    },
    wallet: {
      balance: Math.max(0, num(raw.wallet?.balance, START_BALANCE)),
      ledger: arr(raw.wallet?.ledger)
        .filter((l) => l && typeof l.id === "string" && Number.isFinite(l.at))
        .map((l) => ({ id: l.id, at: l.at, type: str(l.type, "match"), amount: num(l.amount), balance: num(l.balance), label: str(l.label) })),
    },
    history: arr(raw.history)
      .filter((h) => h && typeof h.id === "string" && Number.isFinite(h.at) && MODE_LABEL[h.mode])
      .map((h) => ({ id: h.id, at: h.at, mode: h.mode, title: str(h.title), result: str(h.result), pnl: Number.isFinite(h.pnl) ? h.pnl : null, detail: str(h.detail) })),
    stats: {
      matches: num(s.matches),
      wins: num(s.wins),
      losses: num(s.losses),
      draws: num(s.draws),
      netPnl: num(s.netPnl),
      blindPassed: num(s.blindPassed),
    },
    notifications: arr(raw.notifications)
      .filter((x) => x && typeof x.id === "string" && Number.isFinite(x.at))
      .map((x) => ({ id: x.id, at: x.at, type: str(x.type, "system"), title: str(x.title), body: str(x.body), read: Boolean(x.read) })),
  };
}

/** History and the ledger keep only the last 10 days. Stats and the balance are not pruned. */
function prune(s) {
  const cutoff = Date.now() - HISTORY_DAYS * DAY;
  return {
    ...s,
    history: s.history.filter((h) => h.at >= cutoff).sort((x, y) => y.at - x.at).slice(0, MAX_HISTORY),
    wallet: { ...s.wallet, ledger: s.wallet.ledger.filter((l) => l.at >= cutoff).sort((x, y) => y.at - x.at).slice(0, MAX_LEDGER) },
    notifications: [...s.notifications].sort((x, y) => y.at - x.at).slice(0, MAX_NOTIFICATIONS),
  };
}

/* ---------- Store ---------- */

function read() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function persist(next) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
    return true;
  } catch {
    return false; // storage is blocked or full: the app keeps working for this session
  }
}

const listeners = new Set();
const stored = read();
let state = prune(clean(stored));
if (!stored) persist(state);

function commit(next) {
  state = next;
  const ok = persist(next);
  listeners.forEach((listener) => listener());
  return ok;
}

const subscribe = (listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

// Keep other tabs in step with this one.
window.addEventListener("storage", (event) => {
  if (event.key === KEY || event.key === null) {
    state = prune(clean(read()));
    listeners.forEach((listener) => listener());
  }
});


export const useAccount = () => useSyncExternalStore(subscribe, () => state);

/* ---------- Actions ---------- */

export const updateProfile = (patch) => commit({ ...state, profile: { ...state.profile, ...patch } });
export const setAvatar = (avatar) => commit({ ...state, profile: { ...state.profile, avatar } });

export function updateSettings(group, key, value) {
  commit({ ...state, settings: { ...state.settings, [group]: { ...state.settings[group], [key]: value } } });
}

const NOTIFY_GATE = { match: "match", invite: "invites", tip: "tips" };

export function addNotification({ type = "system", title, body = "" }) {
  const gate = NOTIFY_GATE[type];
  if (gate && !state.settings.notify[gate]) return;
  const item = { id: uid("n"), at: Date.now(), type, title, body, read: false };
  commit(prune({ ...state, notifications: [item, ...state.notifications] }));
}

export const markRead = (id) =>
  commit({ ...state, notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) });
export const markAllRead = () => commit({ ...state, notifications: state.notifications.map((n) => ({ ...n, read: true })) });
export const removeNotification = (id) => commit({ ...state, notifications: state.notifications.filter((n) => n.id !== id) });
export const clearNotifications = () => commit({ ...state, notifications: [] });
export const clearHistory = () => commit({ ...state, history: [] });

export function resetWallet() {
  const now = Date.now();
  const entry = { id: uid("l"), at: now, type: "reset", amount: START_BALANCE - state.wallet.balance, balance: START_BALANCE, label: "Wallet reset" };
  commit(prune({ ...state, wallet: { balance: START_BALANCE, ledger: [entry, ...state.wallet.ledger] } }));
}

/**
 * Call this once when a match or level ends.
 * match: { id?, mode, title, result, pnl?, detail? }. result: win | loss | draw | pass | fail.
 * pnl is the match profit or loss in dollars (null for the Blind Room). It moves the wallet 1:1.
 */
export function recordMatch(match) {
  const s = state;
  const id = match.id ?? uid("m");
  if (s.history.some((h) => h.id === id)) return; // never record the same match twice

  const now = Date.now();
  const pnl = Number.isFinite(match.pnl) ? match.pnl : null;
  const entry = { id, at: now, mode: match.mode, title: match.title, result: match.result, pnl, detail: match.detail ?? "" };

  let wallet = s.wallet;
  if (pnl !== null) {
    const balance = Math.max(0, wallet.balance + pnl);
    const ledgerEntry = { id: `l_${id}`, at: now, type: "match", amount: balance - wallet.balance, balance, label: match.title };
    wallet = { balance, ledger: [ledgerEntry, ...wallet.ledger] };
  }

  const stats = { ...s.stats, netPnl: s.stats.netPnl + (pnl ?? 0) };
  if (match.mode === "blind") {
    if (match.result === "pass") stats.blindPassed += 1;
  } else {
    stats.matches += 1;
    if (match.result === "win") stats.wins += 1;
    else if (match.result === "loss") stats.losses += 1;
    else stats.draws += 1;
  }

  commit(prune({ ...s, history: [entry, ...s.history], wallet, stats }));

  addNotification({
    type: "match",
    title: `${MODE_LABEL[match.mode]}: ${RESULT_LABEL[match.result] ?? "Finished"}`,
    body: `${match.title}${pnl !== null ? ` · ${formatPnl(pnl)}` : ""}`,
  });
}

/* ---------- Data tools ---------- */

export function exportData() {
  const copy = { ...state, profile: { ...state.profile } };
  if (copy.profile.avatar.kind === "upload") copy.profile.avatar = { kind: "upload", src: "[photo omitted from export]" };
  return JSON.stringify({ exportedAt: new Date().toISOString(), data: copy }, null, 2);
}

/** Removes every ChartWars value stored on this device and starts again from a fresh account. */
export function deleteAllData() {
  for (const store of [window.localStorage, window.sessionStorage]) {
    try {
      Object.keys(store)
        .filter((key) => key.startsWith("cw.") || key.startsWith("chartwars."))
        .forEach((key) => store.removeItem(key));
    } catch {
      // Storage is blocked. Nothing to remove.
    }
  }
  commit(prune(clean(null)));
}