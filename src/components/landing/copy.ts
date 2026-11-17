import { createContext, useContext } from "react";

import {
  BRAND,
  CLOSING,
  EARLY_ACCESS,
  HERO,
  METHOD,
  NAV,
  PARADOX,
  PHRASE,
  PRACTICE,
  REASONS,
  RECALL,
  UI,
} from "./data";

/**
 * One bundle of page copy per language. English lives in data.ts, Japanese in data.ja.ts;
 * components read whichever bundle the route provides through useCopy().
 */
export type Copy = {
  lang: "en" | "ja";
  brand: { name: string; kanji: string };
  /** The dictionary entry at the top of the hero. */
  dict: { head: string; ipa?: string; pos: string; kanji: string; sense?: string };
  nav: { links: readonly { href: string; label: string }[]; cta: string };
  hero: {
    eyebrow: string;
    /** [before, word that reacts to the cursor, after] */
    lineOne: readonly [string, string, string?];
    lineTwo: string;
    late: string;
    subhead: string;
    cta: string;
  };
  paradox: {
    words: { value: number; unit?: string; caption: string; source?: string };
    speak: { value: number; caption: string; source: string };
    footnote: { figure: string; text: string; source: string };
  };
  reasons: {
    headlineA: string;
    /** [before, the word that tries to move and can't, after] */
    headlineB: readonly [string, string, string];
    one: { title: string; body: string };
    two: {
      title: string;
      body: string;
      stat: { lead: string; text: string; source: string };
      epi: { label: string; reading: number; speaking: number };
    };
  };
  phrase: readonly string[];
  recall: {
    before: readonly string[];
    missing: string;
    after: readonly string[];
    seconds: number;
    blank: string;
    hold: string;
    holding: string;
  };
  method: {
    headline: string;
    /** Shown in large type before the note (the kanji in English; empty in Japanese). */
    noteLead: string;
    note: string;
    steps: readonly { reason: number; title: string; body: string; curve?: boolean }[];
  };
  practice: {
    tag: string;
    scene: string;
    speaker: string;
    line: string;
    /** Optional small translation under the manager's line. */
    lineGloss?: string;
    hint: string;
    answer: readonly [string, string, string];
    schedule: readonly string[];
  };
  closing: { headline: readonly [string, string, string]; body: string };
  earlyAccess: {
    headline: string;
    body: string;
    placeholder: string;
    cta: string;
    done: string;
    /** Consent line under the form (required for Japanese marketing email). */
    consent?: string;
  };
  ui: typeof UI;
};

export const EN: Copy = {
  lang: "en",
  brand: { name: BRAND.name, kanji: BRAND.kanji },
  dict: { head: "hiki·dashi", ipa: BRAND.ipa, pos: BRAND.pos, kanji: BRAND.kanji },
  nav: NAV,
  hero: HERO,
  paradox: PARADOX,
  reasons: REASONS,
  phrase: PHRASE,
  recall: RECALL,
  method: { ...METHOD, noteLead: BRAND.kanji },
  practice: PRACTICE,
  closing: CLOSING,
  earlyAccess: EARLY_ACCESS,
  ui: UI,
};

const CopyContext = createContext<Copy>(EN);

export const CopyProvider = CopyContext.Provider;

export function useCopy() {
  return useContext(CopyContext);
}
