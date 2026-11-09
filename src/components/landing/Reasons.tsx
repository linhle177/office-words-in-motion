import { useEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";

import { PHRASE, REASONS, RECALL } from "./data";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Renders copy where {braces} mark a highlighted phrase. */
function Marked({ text }: { text: string }) {
  return (
    <>
      {text.split(/(\{[^}]+\})/).map((part, i) =>
        part.startsWith("{") ? (
          <span key={i} className="highlight-sweep text-foreground [--sweep:100%]">
            {part.slice(1, -1)}
          </span>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

/** Tries to move when you touch it. Doesn't. */
function Stuck({ children }: { children: React.ReactNode }) {
  return (
    <motion.span
      className="inline-block cursor-grab italic"
      whileHover={{ x: [0, 5, -4, 3, -2, 1, 0], rotate: [0, 1, -1, 0.5, 0] }}
      whileTap={{ x: [0, 8, -6, 4, -2, 0] }}
      transition={{ duration: 0.55 }}
    >
      {children}
    </motion.span>
  );
}

/** Reason 1 — scroll drives the clock: word by word vs. one phrase. */
function AssemblyDemo() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.85", "end 0.35"] });
  const [p, setP] = useState(0);
  useMotionValueEvent(scrollYProgress, "change", setP);

  const START = 0.12;
  const STEP = 0.18;
  const shown = PHRASE.filter((_, i) => p >= START + 0.1 + i * STEP).length;
  const slowDone = START + 0.1 + (PHRASE.length - 1) * STEP;
  const slowSec = Math.max(0, Math.min(1, (p - START) / (slowDone - START))) * 3.2;
  const phraseIn = p >= START;
  const assembling = phraseIn && shown < PHRASE.length;

  return (
    <div ref={ref} className="paper-card rounded-lg p-6 md:p-8">
      <div className="flex items-baseline justify-between">
        <span className="label-mono text-muted-foreground">Word by word</span>
        <span className={`font-mono text-sm tabular-nums ${assembling ? "text-pen" : ""}`}>
          {slowSec.toFixed(1)}s
        </span>
      </div>
      <p className="mt-4 flex min-h-[3.25rem] flex-wrap items-baseline gap-x-[0.28em] font-display text-4xl md:text-5xl">
        {PHRASE.map((w, i) => (
          <motion.span
            key={w}
            animate={{ opacity: i < shown ? 1 : 0.12, y: i < shown ? 0 : 6 }}
            transition={{ duration: 0.45, ease: EASE }}
          >
            {w}
          </motion.span>
        ))}
        {assembling && (
          <motion.span
            aria-hidden
            className="ml-1 inline-block h-[0.8em] w-[2px] self-center bg-pen"
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 0.8, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
          />
        )}
      </p>

      <div className="hairline my-6" />

      <div className="flex items-baseline justify-between">
        <span className="label-mono text-muted-foreground">As a phrase</span>
        <span className="font-mono text-sm tabular-nums">{phraseIn ? "0.4" : "0.0"}s</span>
      </div>
      <p className="mt-4 min-h-[3.25rem] font-display text-4xl md:text-5xl">
        <span
          style={{ "--sweep": phraseIn ? "100%" : "0%" } as React.CSSProperties}
          className={`highlight-sweep italic transition-[background-size,opacity] duration-500 ease-ink ${
            phraseIn ? "opacity-100" : "opacity-[0.12]"
          }`}
        >
          {PHRASE.join(" ")}
        </span>
      </p>
    </div>
  );
}

/** Reason 2 — press and hold to "speak". As seconds pass, the sentence goes blank. */
function BlankDemo() {
  const [holding, setHolding] = useState(false);
  const [t, setT] = useState(0);
  const total = RECALL.seconds * 1000;

  useEffect(() => {
    if (!holding) {
      setT(0);
      return;
    }
    const start = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const v = Math.min(1, (now - start) / total);
      setT(v);
      if (v < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [holding, total]);

  const words = [...RECALL.before, "__", ...RECALL.after];
  const blank = t >= 1;
  const left = Math.ceil(RECALL.seconds * (1 - t));

  const start = () => setHolding(true);
  const stop = () => setHolding(false);

  return (
    <div className="paper-card rounded-lg p-6 md:p-8">
      <div className="flex items-baseline justify-between">
        <span className="label-mono text-muted-foreground">Reading</span>
        <span className="label-mono">Recognized ✓</span>
      </div>
      <p className="mt-4 font-display text-3xl md:text-4xl">
        {RECALL.before.join(" ")}{" "}
        <span className="highlight-sweep [--sweep:100%]">{RECALL.missing}</span>{" "}
        {RECALL.after.join(" ")}
      </p>

      <div className="hairline my-6" />

      <div className="flex items-baseline justify-between">
        <span className="label-mono text-muted-foreground">Speaking</span>
        <span className={`font-mono text-sm tabular-nums ${holding ? "text-pen" : ""}`}>
          {holding ? (blank ? "0s" : `${left}s`) : `${RECALL.seconds}s`}
        </span>
      </div>
      <p className="relative mt-4 min-h-[2.5em] font-display text-3xl md:text-4xl" aria-live="polite">
        {words.map((w, i) => {
          const fadeAt = (i + 0.5) / (words.length + 1);
          const gone = holding && t > fadeAt;
          if (w === "__") {
            return (
              <span
                key={i}
                className={`relative mx-[0.15em] inline-block w-[4.2em] border-b-2 border-dashed border-foreground align-baseline transition-opacity duration-500 ${
                  blank ? "opacity-0" : ""
                }`}
              >
                &nbsp;
                {holding && !blank && (
                  <motion.span
                    aria-hidden
                    className="absolute left-1 top-[0.15em] h-[0.8em] w-[2px] bg-pen"
                    animate={{ opacity: [1, 1, 0, 0] }}
                    transition={{ duration: 0.7, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
                  />
                )}
              </span>
            );
          }
          return (
            <span
              key={i}
              className="inline-block transition-[opacity,filter] duration-700 ease-ink"
              style={{ opacity: gone ? 0.06 : 1, filter: gone ? "blur(6px)" : "none" }}
            >
              {w}&nbsp;
            </span>
          );
        })}
        {blank && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute inset-x-0 top-0 italic text-pen"
          >
            {RECALL.blank}
          </motion.span>
        )}
      </p>

      <button
        type="button"
        onPointerDown={start}
        onPointerUp={stop}
        onPointerLeave={stop}
        onPointerCancel={stop}
        onKeyDown={(e) => {
          if ((e.key === " " || e.key === "Enter") && !e.repeat) {
            e.preventDefault();
            start();
          }
        }}
        onKeyUp={stop}
        onBlur={stop}
        onContextMenu={(e) => e.preventDefault()}
        className="relative mt-6 flex h-12 w-full cursor-pointer select-none items-center justify-center overflow-hidden rounded-full border border-foreground text-[0.9375rem] transition-colors duration-300 [touch-action:none] active:bg-foreground active:text-background"
      >
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 bg-pen/15"
          style={{ width: `${t * 100}%` }}
        />
        <span className="relative">
          {holding ? RECALL.holding : RECALL.hold}
        </span>
      </button>
    </div>
  );
}

function Bar({ label, value, max }: { label: string; value: number; max: number }) {
  return (
    <div>
      <div className="flex items-baseline justify-between">
        <span className="label-mono text-muted-foreground">{label}</span>
        <span className="font-display text-3xl tabular-nums">{value}</span>
      </div>
      <div className="mt-2 h-[6px] w-full overflow-hidden rounded-full bg-border">
        <motion.div
          className="h-full rounded-full bg-foreground"
          initial={{ width: 0 }}
          whileInView={{ width: `${(value / max) * 100}%` }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1.4, ease: EASE }}
        />
      </div>
    </div>
  );
}

function ReasonText({ no, title, body }: { no: string; title: string; body: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-15% 0px" }}
      transition={{ duration: 0.9, ease: EASE }}
    >
      <p className="label-mono text-pen">Reason {no}</p>
      <h3 className="mt-6 font-display text-statement tracking-[-0.015em]">{title}</h3>
      <p className="mt-6 max-w-md text-lg leading-relaxed text-muted-foreground">
        <Marked text={body} />
      </p>
    </motion.div>
  );
}

export function Reasons() {
  const { one, two } = REASONS;
  return (
    <section id="reasons" className="px-6 py-[18vh] md:px-12">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="label-mono md:col-span-3">§ 02 — Two reasons</p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-15% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="font-display text-headline tracking-[-0.025em] md:col-span-9"
        >
          {REASONS.headlineA}
          <br />
          <span className="text-muted-foreground">
            {REASONS.headlineB[0]}
            <Stuck>
              <span className="text-foreground">{REASONS.headlineB[1]}</span>
            </Stuck>
            {REASONS.headlineB[2]}
          </span>
        </motion.h2>
      </div>

      <div className="mt-[18vh] grid items-center gap-12 md:grid-cols-12">
        <div className="md:col-span-5">
          <ReasonText no="01" title={one.title} body={one.body} />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <AssemblyDemo />
        </div>
      </div>

      <div className="mt-[18vh] grid items-center gap-12 md:grid-cols-12">
        <div className="md:order-2 md:col-span-5 md:col-start-8">
          <ReasonText no="02" title={two.title} body={two.body} />
        </div>
        <div className="md:order-1 md:col-span-6">
          <BlankDemo />
        </div>
      </div>

      <div className="mt-[14vh] grid gap-12 border-t border-foreground pt-8 md:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 0.9, ease: EASE }}
          className="md:col-span-6"
        >
          <div aria-hidden className="flex gap-2">
            <span className="h-3 w-10 rounded-[2px] bg-foreground" />
            <span className="h-3 w-10 rounded-[2px] bg-foreground" />
            <span className="h-3 w-10 rounded-[2px] border border-dashed border-pen" />
          </div>
          <p className="mt-6 max-w-lg text-xl leading-snug">
            <span className="font-display text-4xl">{two.stat.lead}</span> {two.stat.text}
          </p>
          <p className="label-mono mt-4 text-muted-foreground">{two.stat.source}</p>
        </motion.div>
        <div className="space-y-6 md:col-span-5 md:col-start-8">
          <p className="label-mono">{two.epi.label}</p>
          <Bar label="Reading" value={two.epi.reading} max={600} />
          <Bar label="Speaking" value={two.epi.speaking} max={600} />
        </div>
      </div>
    </section>
  );
}
