import { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useTransform,
  type MotionValue,
} from "motion/react";

import { useCopy } from "./copy";

const EASE = [0.22, 1, 0.36, 1] as const;

/** A number the visitor winds up with their own scroll. */
function useScrubbed(progress: MotionValue<number>, to: number) {
  const v = useTransform(progress, [0, 1], [0, to]);
  const [val, setVal] = useState(to);
  useMotionValueEvent(v, "change", setVal);
  return val;
}

/** 100 learners. The ones who'd say "I can speak English" fill in as you scroll. */
function LearnerGrid({ filled }: { filled: number }) {
  const whole = Math.floor(filled);
  const part = filled - whole;
  return (
    <div aria-hidden className="grid w-full max-w-[34rem] grid-cols-20 gap-[5px]">
      {Array.from({ length: 100 }, (_, i) => {
        const fill = i < whole ? 1 : i === whole ? part : 0;
        return (
          <span key={i} className="relative aspect-square overflow-hidden rounded-[2px] bg-border">
            <span
              className="absolute inset-y-0 left-0 bg-foreground"
              style={{ width: `${fill * 100}%` }}
            />
          </span>
        );
      })}
    </div>
  );
}

export function Paradox() {
  const { paradox: PARADOX, ui } = useCopy();
  const oneRef = useRef<HTMLDivElement>(null);
  const twoRef = useRef<HTMLDivElement>(null);
  const gapRef = useRef<HTMLDivElement>(null);

  const one = useScroll({ target: oneRef, offset: ["start 0.95", "end 0.55"] });
  const two = useScroll({ target: twoRef, offset: ["start 0.95", "end 0.6"] });
  const gap = useScroll({ target: gapRef, offset: ["start 0.8", "end 0.5"] });

  const words = useScrubbed(one.scrollYProgress, PARADOX.words.value);
  const speak = useScrubbed(two.scrollYProgress, PARADOX.speak.value);
  const lineScale = useTransform(gap.scrollYProgress, [0, 1], [0, 1]);

  return (
    <section id="paradox" className="px-6 py-[20vh] md:px-12">
      <p className="label-mono">{ui.sections.paradox}</p>

      <div ref={oneRef} className="mt-[10vh] grid items-end gap-8 md:grid-cols-12">
        <p
          className="font-display text-mega tabular-nums tracking-[-0.04em] md:col-span-8"
          aria-label={`${PARADOX.words.value.toLocaleString("en-US")}${PARADOX.words.unit ?? ""}`}
        >
          {Math.round(words).toLocaleString("en-US")}
          {PARADOX.words.unit && (
            <span className="ml-[0.06em] text-[0.38em] tracking-normal">{PARADOX.words.unit}</span>
          )}
        </p>
        <div className="max-w-xs pb-[1.2vw] md:col-span-4">
          <p className="text-xl leading-snug">{PARADOX.words.caption}</p>
          {PARADOX.words.source && (
            <p className="label-mono mt-4 text-muted-foreground">{PARADOX.words.source}</p>
          )}
        </div>
      </div>

      <div ref={gapRef} className="flex h-[34vh] justify-center md:justify-start md:pl-[33%]">
        <motion.span
          aria-hidden
          style={{ scaleY: lineScale }}
          className="block w-px origin-top bg-foreground"
        />
      </div>

      <div ref={twoRef} className="grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-5 md:col-start-2 md:pb-[1.2vw]">
          <LearnerGrid filled={speak} />
          <p className="mt-6 max-w-sm text-xl leading-snug">{PARADOX.speak.caption}</p>
          <p className="label-mono mt-4 text-muted-foreground">{PARADOX.speak.source}</p>
        </div>
        <p
          className="font-display text-mega tabular-nums tracking-[-0.04em] md:col-span-6 md:col-start-7 md:text-right"
          aria-label={`${PARADOX.speak.value}%`}
        >
          {speak.toFixed(1)}
          <em className="text-muted-foreground">%</em>
        </p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-15% 0px" }}
        transition={{ duration: 1, ease: EASE }}
        className="mt-[22vh] grid gap-6 border-t border-border pt-8 md:grid-cols-12"
      >
        <p className="font-display text-5xl md:col-span-2 md:col-start-5">
          {PARADOX.footnote.figure}
        </p>
        <div className="md:col-span-5">
          <p className="text-lg leading-relaxed text-muted-foreground">{PARADOX.footnote.text}</p>
          <p className="label-mono mt-3 text-muted-foreground">{PARADOX.footnote.source}</p>
        </div>
      </motion.div>
    </section>
  );
}
