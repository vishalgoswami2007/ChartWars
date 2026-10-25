import { levelState } from "./blind-progress";

/** How many hints of this level are already revealed (they stay revealed for free). */
export const revealedCount = (progress, levelId) => levelState(progress, levelId).hintsUsed;

export const canSpendHint = (progress, level) =>
  progress.hintsRemaining > 0 && revealedCount(progress, level.id) < level.hints.length;

/** Spends one token and reveals the next authored hint of the level. Never reveals the answer. */
export function spendHint(progress, level) {
  if (!canSpendHint(progress, level)) return progress;
  const prev = levelState(progress, level.id);
  return {
    ...progress,
    hintsRemaining: progress.hintsRemaining - 1,
    levels: { ...progress.levels, [level.id]: { ...prev, hintsUsed: prev.hintsUsed + 1 } },
  };
}