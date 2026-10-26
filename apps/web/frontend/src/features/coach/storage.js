const RESULT_KEY = "cw.coach.result.v1";
const HISTORY_KEY = "cw.coach.history.v1";

function read(store, key, fallback) {
  try {
    const raw = store.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function write(store, key, value) {
  try {
    store.setItem(key, JSON.stringify(value));
  } catch {
    // Storage is unavailable (private mode or full). The app still works without it.
  }
}

export const saveResult = (summary) => write(window.sessionStorage, RESULT_KEY, summary);
export const loadResult = () => read(window.sessionStorage, RESULT_KEY, null);

export const loadHistory = () => {
  const list = read(window.localStorage, HISTORY_KEY, []);
  return Array.isArray(list) ? list : [];
};

export function pushHistory(summary) {
  const entry = {
    id: summary.id,
    at: summary.at,
    difficulty: summary.difficulty,
    title: summary.scenarioTitle,
    winner: summary.verdict.winner,
    userPnl: summary.user.pnl,
    botPnl: summary.bot.pnl,
  };
  write(window.localStorage, HISTORY_KEY, [entry, ...loadHistory()].slice(0, 20));
}