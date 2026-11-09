import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Button } from "@/components/ui/button";
import { BRAND, HERO } from "./data";
import { useEarlyAccess } from "./EarlyAccess";

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Letters lean toward the cursor — but slowly, a beat behind you.
 * The lag is the point: today, the right English arrives after the meeting.
 */
function LaggingWord({ text }: { text: string }) {
  const refs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    let raf = 0;
    let mx = -9999;
    let my = -9999;

    const update = () => {
      raf = 0;
      for (const el of refs.current) {
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const cx = r.left + r.width / 2;
        const cy = r.top + r.height / 2;
        const d = Math.hypot(mx - cx, my - cy);
        const f = Math.max(0, 1 - d / 320);
        const dx = ((mx - cx) / 320) * f * 0.12;
        const tilt = ((mx - cx) / Math.max(r.width, 1)) * f * -2.5;
        el.style.transform = `translate(${dx.toFixed(3)}em, ${(-f * 0.12).toFixed(3)}em) rotate(${tilt.toFixed(2)}deg)`;
        el.style.color =
          f > 0.05
            ? `color-mix(in oklab, var(--pen) ${Math.round(f * 100)}%, var(--foreground))`
            : "";
      }
    };

    const onMove = (e: PointerEvent) => {
      mx = e.clientX;
      my = e.clientY;
      if (!raf) raf = requestAnimationFrame(update);
    };
    const onLeave = () => {
      mx = -9999;
      my = -9999;
      if (!raf) raf = requestAnimationFrame(update);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.addEventListener("pointerleave", onLeave);
    return () => {
      window.removeEventListener("pointermove", onMove);
      document.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <span aria-label={text} className="italic">
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          ref={(el) => {
            refs.current[i] = el;
          }}
          style={{ transitionDelay: `${120 + i * 45}ms` }}
          className="inline-block transition-[transform,color] duration-[900ms] ease-ink will-change-transform"
        >
          {ch}
        </span>
      ))}
    </span>
  );
}

function Line({
  children,
  delay,
  className = "",
  x,
}: {
  children: React.ReactNode;
  delay: number;
  className?: string;
  x: MotionValue<string>;
}) {
  return (
    <motion.span style={{ x }} className={`block ${className}`}>
      <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: "0%" }}
          transition={{ duration: 1.2, delay, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>
    </motion.span>
  );
}

/** The last line hesitates — a blinking caret, a pause — then turns up late. */
function LateLine({
  children,
  className = "",
  x,
}: {
  children: React.ReactNode;
  className?: string;
  x: MotionValue<string>;
}) {
  const [phase, setPhase] = useState<0 | 1 | 2>(0);
  useEffect(() => {
    const a = setTimeout(() => setPhase(1), 1100);
    const b = setTimeout(() => setPhase(2), 2700);
    return () => {
      clearTimeout(a);
      clearTimeout(b);
    };
  }, []);

  return (
    <motion.span style={{ x }} className={`relative block ${className}`}>
      <span className="-mb-[0.14em] block overflow-hidden pb-[0.14em]">
        <motion.span
          className="block"
          initial={{ y: "110%" }}
          animate={{ y: phase === 2 ? "0%" : "110%" }}
          transition={{ duration: 1.1, ease: EASE }}
        >
          {children}
        </motion.span>
      </span>
      {phase === 1 && (
        <motion.span
          aria-hidden
          className="absolute right-0 top-[0.12em] h-[0.78em] w-[0.05em] bg-pen"
          animate={{ opacity: [1, 1, 0, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, times: [0, 0.5, 0.5, 1] }}
        />
      )}
    </motion.span>
  );
}

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { open } = useEarlyAccess();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0vw", "-12vw"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0vw", "10vw"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0vw", "-6vw"]);
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col overflow-x-clip px-6 pb-10 pt-28 md:px-12 md:pt-32"
    >
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-border pb-4"
      >
        <span className="font-display text-2xl italic">hiki·dashi</span>
        <span className="font-mono text-sm text-muted-foreground">{BRAND.ipa}</span>
        <span className="font-display text-lg italic text-muted-foreground">{BRAND.pos}</span>
        <span className="font-display text-xl">{BRAND.kanji}</span>
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">
          {HERO.eyebrow}
        </span>
      </motion.div>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.2 }}
        className="label-mono mt-8 flex items-center gap-3 text-muted-foreground sm:hidden"
      >
        <span className="h-1.5 w-1.5 rounded-full bg-pen" />
        {HERO.eyebrow}
      </motion.p>

      <h1 className="mt-[5vh] font-display text-hero tracking-[-0.035em]">
        <Line delay={0.15} x={x1}>
          {HERO.lineOne[0]}
          <LaggingWord text={HERO.lineOne[1]} />
        </Line>
        <Line delay={0.3} x={x2} className="pl-[8vw]">
          {HERO.lineTwo}
          <span className="text-pen">.</span>
        </Line>
        <LateLine x={x3} className="text-right italic text-muted-foreground">
          {HERO.late}
        </LateLine>
      </h1>

      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 1, ease: EASE }}
        className="mt-auto grid items-end gap-8 pt-16 md:grid-cols-12"
      >
        <p className="max-w-md text-lg leading-relaxed text-muted-foreground md:col-span-5">
          <span className="font-mono text-sm text-foreground">1.</span> {HERO.subhead}
        </p>
        <div className="flex md:col-span-5 md:col-start-8 md:justify-end">
          <Button variant="ink" size="pill" onClick={open}>
            {HERO.cta}
            <span aria-hidden>→</span>
          </Button>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.4 }}
        className="label-mono pointer-events-none absolute bottom-10 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-3 text-muted-foreground lg:flex"
      >
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-border">
          <motion.span
            className="absolute inset-x-0 top-0 h-1/2 bg-foreground"
            animate={{ y: ["-100%", "200%"] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          />
        </span>
      </motion.div>
    </section>
  );
}
