import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionStyle,
  type MotionValue,
} from "motion/react";

import { JARGON, SENTENCE, TRANSLATION } from "./data";
import { useLearned } from "./learned";

const START = 0.06;
const END = 0.82;
const SLOT = (END - START) / JARGON.length;
const DONE_AT = 0.88;

function JargonWord({
  index,
  progress,
  active,
}: {
  index: number;
  progress: MotionValue<number>;
  active: boolean;
}) {
  const from = START + index * SLOT;
  const sweep = useTransform(progress, [from, from + SLOT * 0.55], ["0%", "100%"]);
  return (
    <motion.span
      style={{ "--sweep": sweep } as unknown as MotionStyle}
      className={`highlight-sweep relative text-foreground transition-[font-style] ${
        active ? "italic" : ""
      }`}
    >
      {JARGON[index]?.word}
    </motion.span>
  );
}

export function MeetingScene() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const [active, setActive] = useState(-1);
  const { learn } = useLearned();

  const dim = useTransform(scrollYProgress, [0.02, 0.1], [1, 0.28]);

  useMotionValueEvent(scrollYProgress, "change", (v) => {
    let next: number;
    if (v >= DONE_AT) next = JARGON.length;
    else next = Math.min(JARGON.length - 1, Math.floor((v - START) / SLOT));
    if (v < START) next = -1;
    setActive(next);
  });

  useEffect(() => {
    for (let i = 0; i <= Math.min(active, JARGON.length - 1); i++) {
      const j = JARGON[i];
      if (j) learn(j.word);
    }
  }, [active, learn]);

  const done = active >= JARGON.length;
  const current = active >= 0 && !done ? (JARGON[active] ?? null) : null;

  return (
    <section id="decode" ref={ref} className="relative h-[520vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col px-6 pb-24 pt-24 md:pb-10 md:px-12 md:pt-28">
        <div className="flex items-baseline justify-between border-b border-border pb-4">
          <span className="label-mono">§ 01 — The 9:30 stand-up</span>
          <span className="label-mono text-muted-foreground">
            <span className="hidden sm:inline">{done ? "Decoded" : "Scroll to decode"} · </span>
            <span className="tabular-nums text-foreground">
              {String(Math.max(0, Math.min(active + 1, JARGON.length))).padStart(2, "0")}
            </span>{" "}
            / {String(JARGON.length).padStart(2, "0")}
          </span>
        </div>

        <div className="flex flex-1 flex-col justify-center">
          <p className="label-mono mb-6 text-muted-foreground">
            Maya Chen, Head of Operations · 9:31 AM
          </p>
          <p className="max-w-6xl font-display text-scene tracking-[-0.02em]">
            {SENTENCE.map((seg, i) =>
              typeof seg === "number" ? (
                <JargonWord key={i} index={seg} progress={scrollYProgress} active={seg === active} />
              ) : (
                <motion.span key={i} style={{ opacity: dim }}>
                  {seg}
                </motion.span>
              ),
            )}
          </p>
        </div>

        <div className="min-h-[9.5rem] border-t border-border pt-6">
          <AnimatePresence mode="wait">
            {current && (
              <motion.div
                key={current.word}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4 md:grid-cols-12 md:gap-8"
              >
                <div className="md:col-span-4">
                  <p className="font-display text-4xl italic md:text-5xl">{current.word}</p>
                  <p className="mt-2 flex items-baseline gap-3">
                    <span className="font-mono text-sm text-muted-foreground">{current.ipa}</span>
                    <span className="font-display text-lg italic text-muted-foreground">
                      {current.pos}
                    </span>
                  </p>
                </div>
                <div className="md:col-span-6 md:col-start-6">
                  <p className="label-mono mb-3 text-pen">In plain English</p>
                  <p className="text-xl leading-snug md:text-2xl">{current.plain}.</p>
                </div>
              </motion.div>
            )}
            {done && (
              <motion.div
                key="done"
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                className="grid gap-4 md:grid-cols-12 md:gap-8"
              >
                <p className="label-mono text-pen md:col-span-4">Translation</p>
                <p className="font-display text-2xl italic leading-snug md:col-span-7 md:col-start-6 md:text-3xl">
                  “{TRANSLATION}”
                </p>
              </motion.div>
            )}
            {active < 0 && (
              <motion.p
                key="intro"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="max-w-md text-lg text-muted-foreground"
              >
                Five words stand between you and this sentence. Keep scrolling — Wordwork will
                take them one at a time.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
