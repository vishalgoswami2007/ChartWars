import { SCORING, calculateResult } from "./blind-scoring";

// Rule-based checker. It compares the answer with concepts and synonyms written in advance for each level.
// It does NOT understand language like a person: wording that the level does not list can be missed,
// and a negation guard only covers the simple "not X" case.

const CONNECTORS = [
  "because", "since", "therefore", "thus", "hence", "which", "means", "shows", "show", "showing",
  "indicates", "indicate", "suggests", "suggest", "signals", "signal", "confirms", "implies",
  "so", "due to", "as a result", "that is why",
];
const connectorRe = new RegExp(`\\b(?:${CONNECTORS.map((c) => c.replace(/\s+/g, "\\s+")).join("|")})\\b`);
const NEGATIONS = "not|no|never|without|isn t|isnt|aren t|arent|doesn t|doesnt|don t|dont";

const CAP_SHORT = 35;
const CAP_REPETITIVE = 40;
const CAP_NO_CONNECTOR = 55;
const MISCONCEPTION_PENALTY = 20;

export const normalize = (value) =>
  String(value ?? "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

export const countWords = (value) => {
  const clean = normalize(value);
  return clean ? clean.split(" ").length : 0;
};

const escapeRe = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
const cache = new Map();

function termRegexes(term) {
  let found = cache.get(term);
  if (!found) {
    const body = normalize(term).split(" ").map(escapeRe).join("\\s+");
    found = {
      plain: new RegExp(`\\b${body}(?:s|es)?\\b`),
      negated: new RegExp(`\\b(?:${NEGATIONS})\\s+(?:[a-z0-9]+\\s+){0,2}${body}(?:s|es)?\\b`),
    };
    cache.set(term, found);
  }
  return found;
}

/** A term counts only when it appears and is not directly negated ("not an uptrend"). */
const hasTerm = (clean, term) => {
  const { plain, negated } = termRegexes(term);
  return plain.test(clean) && !negated.test(clean);
};

export function evaluateBlindAnswer({ level, decision, text }) {
  const clean = normalize(text);
  const tokens = clean ? clean.split(" ") : [];
  const words = tokens.length;
  const unique = new Set(tokens).size;

  const rule = level.decisions[decision];
  const decisionResult = rule
    ? { id: decision, score: rule.score, acceptable: Boolean(rule.acceptable), feedback: rule.feedback }
    : { id: decision, score: 0, acceptable: false, feedback: "Choose BUY, SELL or WAIT." };

  const matched = [];
  const missing = [];
  let raw = 0;
  for (const concept of level.concepts) {
    const hit = concept.terms.find((term) => hasTerm(clean, term));
    if (hit) {
      matched.push({ id: concept.id, label: concept.label, term: hit });
      raw += concept.weight;
    } else {
      missing.push({ id: concept.id, label: concept.label, required: Boolean(concept.required) });
    }
  }

  const matchedIds = new Set(matched.map((m) => m.id));
  const missingRequired = level.concepts.filter((c) => c.required && !matchedIds.has(c.id));
  const missingGroups = (level.requiredAnyOf ?? []).filter((group) => !group.some((id) => matchedIds.has(id)));

  const flags = {
    tooShort: words < SCORING.minWords,
    noConnector: !connectorRe.test(clean),
    repetitive: words >= SCORING.minWords && unique / words < 0.55,
  };

  const notes = [];
  let score = raw;
  if (flags.tooShort) {
    score = Math.min(score, CAP_SHORT);
    notes.push(`Your answer is very short. Write at least ${SCORING.minWords} words and explain why.`);
  }
  if (flags.repetitive) {
    score = Math.min(score, CAP_REPETITIVE);
    notes.push("Your answer repeats the same words. Use different sentences to explain your thinking.");
  }
  if (flags.noConnector) {
    score = Math.min(score, CAP_NO_CONNECTOR);
    notes.push("Explain the link between what you see and your decision, with words like 'because', 'so' or 'which shows'.");
  }
  if (missingRequired.length > 0 || missingGroups.length > 0) {
    score = Math.min(score, SCORING.reasoningPass - 1);
  }

  const misconceptions = (level.misconceptions ?? [])
    .filter((m) => m.patterns.some((pattern) => hasTerm(clean, pattern)))
    .map((m) => ({ id: m.id, message: m.message }));
  score = Math.max(0, score - misconceptions.length * MISCONCEPTION_PENALTY);

  return {
    words,
    decision: decisionResult,
    reasoning: { score: Math.round(score), rawScore: raw, matched, missing, missingGroups, flags, notes, misconceptions },
  };
}

/** Runs each level's authored test answers and returns the ones that do not behave as expected. */
export function runSelfTests(levels) {
  const failures = [];
  for (const level of levels) {
    for (const test of level.testAnswers ?? []) {
      const evaluation = evaluateBlindAnswer({ level, decision: test.decision, text: test.text });
      const result = calculateResult({
        decision: evaluation.decision,
        reasoningScore: evaluation.reasoning.score,
        hintsUsed: 0,
      });
      if (result.passed !== test.expectPass) {
        failures.push({ level: level.id, name: test.name, expected: test.expectPass, got: result.passed });
      }
    }
  }
  return failures;
}