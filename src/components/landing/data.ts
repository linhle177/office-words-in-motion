export type Jargon = {
  word: string;
  ipa: string;
  pos: string;
  plain: string;
};

/** The stand-up sentence, decoded one term at a time. Numbers point into JARGON. */
export const JARGON: Jargon[] = [
  {
    word: "circle back",
    ipa: "/ˈsɜː.kəl bæk/",
    pos: "phrasal verb",
    plain: "come back to this topic later",
  },
  {
    word: "deliverables",
    ipa: "/dɪˈlɪv.ər.ə.bəlz/",
    pos: "noun, plural",
    plain: "the finished work you promised to hand over",
  },
  {
    word: "loop in",
    ipa: "/luːp ɪn/",
    pos: "phrasal verb",
    plain: "add someone to the conversation",
  },
  {
    word: "stakeholders",
    ipa: "/ˈsteɪkˌhəʊl.dəz/",
    pos: "noun, plural",
    plain: "everyone who cares how this turns out",
  },
  {
    word: "EOD",
    ipa: "/ˌiː.əʊˈdiː/",
    pos: "abbreviation",
    plain: "by the end of the working day",
  },
];

export const SENTENCE: (string | number)[] = [
  "Can we ",
  0,
  " on the ",
  1,
  " and ",
  2,
  " the ",
  3,
  " before ",
  4,
  "?",
];

export const TRANSLATION =
  "Can we talk about the work again later — after we've added everyone who cares — before the day ends?";

export type FlashCard = {
  no: string;
  field: string;
  word: string;
  ipa: string;
  pos: string;
  definition: string;
  example: [string, string, string];
};

export const CARDS: FlashCard[] = [
  {
    no: "014",
    field: "Planning",
    word: "bandwidth",
    ipa: "/ˈbænd.wɪdθ/",
    pos: "noun",
    definition: "The time and energy you have left to take on more work.",
    example: ["I don't have the ", "bandwidth", " for this until after the launch."],
  },
  {
    no: "027",
    field: "Negotiation",
    word: "push back",
    ipa: "/pʊʃ bæk/",
    pos: "phrasal verb",
    definition: "To disagree politely and ask for a different plan.",
    example: ["I'd like to ", "push back", " on the Friday deadline."],
  },
  {
    no: "041",
    field: "Meetings",
    word: "action item",
    ipa: "/ˈæk.ʃən ˌaɪ.təm/",
    pos: "noun",
    definition: "A task someone agrees to do after the meeting ends.",
    example: ["Let's capture that as an ", "action item", " for Tom."],
  },
  {
    no: "058",
    field: "Estimates",
    word: "ballpark",
    ipa: "/ˈbɔːl.pɑːk/",
    pos: "adjective",
    definition: "Rough, but close enough to make a decision with.",
    example: ["Can you give me a ", "ballpark", " figure by Monday?"],
  },
  {
    no: "063",
    field: "Strategy",
    word: "align",
    ipa: "/əˈlaɪn/",
    pos: "verb",
    definition: "To agree together on the same goal or direction.",
    example: ["We need to ", "align", " on priorities before the offsite."],
  },
];

export const FIELDS = [
  { name: "Finance", count: "1,240", samples: ["accrual", "runway", "write-off"] },
  { name: "Engineering", count: "980", samples: ["ship", "tech debt", "rollback"] },
  { name: "Marketing", count: "1,105", samples: ["funnel", "positioning", "churn"] },
  { name: "Healthcare", count: "860", samples: ["triage", "handover", "discharge"] },
  { name: "Sales", count: "920", samples: ["pipeline", "close", "objection"] },
  { name: "Legal", count: "740", samples: ["liability", "clause", "redline"] },
];

/** Manifesto copy. {term|definition} becomes a hover-to-define word. */
export const MANIFESTO =
  "Textbooks taught you how to order a coffee. Your job asks you to {negotiate|to discuss until both sides agree} scope, {flag|to point out a problem early} a risk, and {pivot|to change direction quickly} without losing the room. Wordwork teaches the words in between — one meeting, one email, one Monday at a time.";

/** Total words a visitor can "learn" while reading the page. */
export const TOTAL_WORDS = JARGON.length + CARDS.length;
