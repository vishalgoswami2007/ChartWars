import { useCallback, useRef, useState } from "react";

import { LEVELS } from "../data/blind-levels";
import { TOTAL_HINTS } from "./blind-scoring";

const KEY = "cw.blind.progress.v1";

const toInt = (value, lo, hi) => {
  const n = Math.floor(Number(value));
  return Number.isFinite(n) ? Math.min(hi, Math.max(lo, n)) : lo;
};

export const emptyLevelState = () => ({ attempts: 0, bestScore: 0, stars: 0, passed: false, hintsUsed: 0 });
export const emptyProgress = () => ({ v: 1, hintsRemaining: TOTAL_HINTS, levels: {} });

/** Rebuilds a safe object from whatever is in storage, so corrupt data cannot break the app. */
function sanitize(raw) {
  const out = emptyProgress();
  if (!raw || typeof raw !== "object") return out;
  out.hintsRemaining = toInt(raw.hintsRemaining ?? TOTAL_HINTS, 0, TOTAL_HINTS);
  const levels = raw.levels && typeof raw.levels === "object" ? raw.levels : {};
  for (const [key, value] of Object.entries(levels)) {
    const id = Number(key);
    if (!Number.isInteger(id) || id < 1 || id > 50 || !value || typeof value !== "object") continue;
    out.levels[id] = {
      attempts: toInt(value.attempts, 0, 9999),
      bestScore: toInt(value.bestScore, 0, 100),
      stars: toInt(value.stars, 0, 3),
      passed: Boolean(value.passed),
      hintsUsed: toInt(value.hintsUsed, 0, 3),
    };
  }
  return out;
}

export function loadProgress() {
  try {
    const raw = window.localStorage.getItem(KEY);
    return sanitize(raw ? JSON.parse(raw) : null);
  } catch {
    return emptyProgress();
  }
}

export function saveProgress(progress) {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // Storage is unavailable (private mode or full). The session still works.
  }
}

export const levelState = (progress, id) => progress.levels[id] ?? emptyLevelState();

/** Level 1 starts unlocked. Every other level opens after the previous one is passed. */
export const isUnlocked = (progress, id) => id === 1 || Boolean(progress.levels[id - 1]?.passed);

export function recordAttempt(progress, id, outcome) {
  const prev = levelState(progress, id);
  return {
    ...progress,
    levels: {
      ...progress.levels,
      [id]: {
        ...prev,
        attempts: prev.attempts + 1,
        bestScore: Math.max(prev.bestScore, outcome.finalScore),
        stars: Math.max(prev.stars, outcome.stars),
        passed: prev.passed || outcome.passed,
      },
    },
  };
}

export function summarize(progress) {
  const authored = LEVELS.filter((l) => l.authored);
  const completed = authored.filter((l) => progress.levels[l.id]?.passed).length;
  const totalStars = authored.reduce((sum, l) => sum + (progress.levels[l.id]?.stars ?? 0), 0);
  const next = authored.find((l) => isUnlocked(progress, l.id) && !progress.levels[l.id]?.passed) ?? null;
  return { authoredCount: authored.length, completed, totalStars, next };
}

/** React hook: progress state that is saved on every change. */
export function useBlindProgress() {
  const [progress, setProgress] = useState(loadProgress);
  const ref = useRef(progress);

  const update = useCallback((fn) => {
    const next = sanitize(fn(ref.current));
    ref.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  const reset = useCallback(() => {
    const next = emptyProgress();
    ref.current = next;
    saveProgress(next);
    setProgress(next);
  }, []);

  return { progress, update, reset };
}