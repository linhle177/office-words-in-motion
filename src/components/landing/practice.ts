export type Verdict = "exact" | "close" | "miss" | "reveal";

/**
 * Grades the visitor's reply in the practice card.
 * "exact" = they used the phrase (push back …), "close" = right idea, other words.
 */
export function checkAnswer(input: string): Exclude<Verdict, "reveal"> {
  const t = input
    .toLowerCase()
    .replace(/[^a-z\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (!t) return "miss";
  if (/\bpush(es|ed|ing)? back\b/.test(t)) return "exact";
  if (/\bpush(es|ed|ing)? (the |our |that )?(deadline|date|launch|release) back\b/.test(t))
    return "exact";
  if (/\b(postpone|delay|extend|move|reschedule|more time|later|push)/.test(t)) return "close";
  return "miss";
}
