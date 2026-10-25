// Initial values. Tune them after real testing; they are not final.
export const TOTAL_HINTS = 6;

export const SCORING = {
  reasoningPass: 60, // reasoning score needed to pass (decision must also be acceptable)
  decisionWeight: 0.35,
  reasoningWeight: 0.65,
  hintPenaltyEach: 4, // points removed from the final score per hint used on a level
  hintPenaltyMax: 12, // hints never remove more than this and never block progress
  starTwo: 70, // final score for 2 stars
  starThree: 85, // final score for 3 stars
  minWords: 10,
  maxChars: 600,
};

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));

/** decision: { score, acceptable }. Returns the numbers shown on the result screen. */
export function calculateResult({ decision, reasoningScore, hintsUsed }) {
  const hintPenalty = Math.min(SCORING.hintPenaltyMax, Math.max(0, hintsUsed) * SCORING.hintPenaltyEach);
  const passed = Boolean(decision.acceptable) && reasoningScore >= SCORING.reasoningPass;
  const base = decision.score * SCORING.decisionWeight + reasoningScore * SCORING.reasoningWeight;
  const finalScore = clamp(Math.round(base - hintPenalty), 0, 100);
  const stars = !passed ? 0 : finalScore >= SCORING.starThree ? 3 : finalScore >= SCORING.starTwo ? 2 : 1;

  return {
    passed,
    finalScore,
    stars,
    hintPenalty,
    decisionScore: decision.score,
    reasoningScore,
  };
}