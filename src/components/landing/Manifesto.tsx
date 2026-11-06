import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { MANIFESTO } from "./data";

type Token = { text: string; def?: string };

function tokenize(src: string): Token[] {
  const out: Token[] = [];
  for (const part of src.split(/(\{[^}]+\})/)) {
    if (!part) continue;
    if (part.startsWith("{")) {
      const [text = "", def] = part.slice(1, -1).split("|");
      out.push(def ? { text, def } : { text });
    } else {
      for (const w of part.split(/\s+/)) if (w) out.push({ text: w });
    }
  }
  return out;
}

const TOKENS = tokenize(MANIFESTO);

function Word({
  token,
  index,
  progress,
}: {
  token: Token;
  index: number;
  progress: MotionValue<number>;
}) {
  const n = TOKENS.length;
  const opacity = useTransform(progress, [index / n, (index + 1.5) / n], [0.13, 1]);

  if (token.def) {
    return (
      <motion.span style={{ opacity }} className="group relative mr-[0.3em] inline-block">
        <span
          tabIndex={0}
          className="term-underline cursor-help italic outline-none transition-colors group-hover:text-pen group-focus-within:text-pen"
        >
          {token.text}
        </span>
        <span
          role="tooltip"
          className="pointer-events-none absolute bottom-full left-0 z-10 mb-3 w-64 translate-y-1 rounded-md bg-popover px-4 py-3 font-sans text-sm not-italic leading-snug tracking-normal text-popover-foreground opacity-0 transition-all duration-300 ease-ink group-hover:translate-y-0 group-hover:opacity-100 group-focus-within:translate-y-0 group-focus-within:opacity-100"
        >
          <span className="label-mono mb-2 block opacity-60">{token.text}</span>
          {token.def}.
        </span>
      </motion.span>
    );
  }
  return (
    <motion.span style={{ opacity }} className="inline-block">
      {token.text}&nbsp;
    </motion.span>
  );
}

export function Manifesto() {
  const ref = useRef<HTMLParagraphElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.45"] });

  return (
    <section className="px-6 py-[22vh] md:px-12">
      <div className="grid gap-10 md:grid-cols-12">
        <div className="md:col-span-3">
          <p className="label-mono">§ 02 — Why</p>
          <p className="mt-4 max-w-[14rem] text-sm text-muted-foreground">
            Hover the underlined words. That's how every page of the app works.
          </p>
        </div>
        <p
          ref={ref}
          className="font-display text-headline tracking-[-0.02em] md:col-span-9"
        >
          {TOKENS.map((t, i) => (
            <Word key={i} token={t} index={i} progress={scrollYProgress} />
          ))}
        </p>
      </div>
    </section>
  );
}
