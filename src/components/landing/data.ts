/** All landing copy for Hikidashi. Edit words here; components only arrange them. */

export const BRAND = {
  name: "Hikidashi",
  kanji: "引き出し",
  ipa: "/hi.ki.da.ɕi/",
  pos: "noun",
};

/* ── Screen 1 · Hero ─────────────────────────────────────────── */
export const HERO = {
  eyebrow: "Workplace English vocabulary, learned in phrases",
  /** Line one is split so "English" can react to the cursor. */
  lineOne: ["Don't let ", "English"] as const,
  lineTwo: "hold you back",
  late: "at work.",
  subhead:
    "Hikidashi teaches you new work phrases, then has you practice them until you can actively use them.",
  cta: "Download the app",
};

/* ── Screen 2 · The paradox ──────────────────────────────────── */
export const PARADOX = {
  // 3,000 is a working assumption — confirm before launch.
  words: { value: 3000, caption: "English words taught in Japanese schools." },
  speak: {
    value: 19.7,
    caption: "of English learners in Japan would say “I can speak English.”",
    source: "IIBC, 2026",
  },
  footnote: {
    figure: "61%",
    text: "of office workers who want better English say it has already caused them trouble at work.",
    source: "ECC, 2026",
  },
};

/* ── Screen 3 · Two reasons ──────────────────────────────────── */
export const REASONS = {
  headlineA: "Most of the words are there.",
  headlineB: ["Two things keep them ", "stuck", "."] as const,
  one: {
    title: "You learned them one at a time.",
    // "about half" is a working assumption — confirm before launch.
    body: "But about half of everyday English comes in ready-made phrases. Fluent speakers pull out {“push back the deadline”} in one go. You're assembling it word by word, while everyone waits.",
  },
  two: {
    title: "You learned them to recognize, not to use.",
    body: "Reading asks you to recognize a word. Speaking asks you to find it yourself, in a few seconds. That's when your mind goes blank.",
    stat: {
      lead: "Nearly 1 in 3",
      text: "learners in Japan say they can't think of the word when they need it.",
      source: "IIBC, 2026",
    },
    epi: { label: "Japan, EF EPI 2025", reading: 454, speaking: 393 },
  },
};

/** The phrase both demos in Screen 3 are built around. */
export const PHRASE = ["push", "back", "the", "deadline"];

/** Recall demo: the sentence the visitor tries to finish under time pressure. */
export const RECALL = {
  before: ["We", "need", "to"],
  missing: "push back",
  after: ["the", "deadline."],
  seconds: 3,
  blank: "That's when your mind goes blank.",
  hold: "Press and hold to answer out loud",
  holding: "Keep holding… find the words",
};

/* ── Screen 4 · Hikidashi ────────────────────────────────────── */
export const METHOD = {
  headline: "Hikidashi works on both.",
  note: "means “drawer.” Phrases go in ready to use, and come out when you need them.",
  /** {braces} mark the part that gets the highlighter. */
  steps: [
    {
      reason: 1,
      title: "Learn phrases, not single words.",
      body: "New phrases for the moments you face at work, built mostly from words you already know. “{Push back the deadline},” not just “deadline.”",
    },
    {
      reason: 2,
      title: "Practice finding them yourself.",
      body: "A work scene with one line missing. Type it or say it out loud.",
    },
    {
      reason: 2,
      title: "Review each one right before you'd forget it.",
      body: "",
    },
  ],
};

/** The practice card visual: a meeting, the manager's line, your missing reply. */
export const PRACTICE = {
  tag: "Practice · Scene 14",
  scene: "Weekly sync · Tue 10:00",
  speaker: "Your manager",
  line: "The client added two more screens. Can we still launch on Friday?",
  hint: "Ask for more time — in one phrase.",
  answer: ["Honestly, we may need to ", "push back the deadline", " to Monday."] as const,
  schedule: ["Today", "2 days", "6 days", "2 weeks", "1 month"],
};

/* ── Screen 5 · Early access ─────────────────────────────────── */
export const CLOSING = {
  headline: ["Have the right English ", "ready", " for your next meeting."] as const,
  body: "Learn new work phrases and practice them until you can actively use them. Just 5 minutes a day, on the train to work.",
};

export const EARLY_ACCESS = {
  headline: "Hikidashi isn't out yet.",
  body: "We're building it now. Leave your email and we'll send one message when it launches.",
  placeholder: "you@company.com",
  cta: "Notify me",
  done: "You're on the list. One email, on launch day.",
};
