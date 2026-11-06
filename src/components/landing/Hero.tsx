import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Button } from "@/components/ui/button";

const EASE = [0.22, 1, 0.36, 1] as const;

/** Letters lean toward the visitor's cursor and blush with the editor's pen. */
function ProximityWord({ text }: { text: string }) {
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
        const f = Math.max(0, 1 - d / 280);
        const tilt = ((mx - cx) / Math.max(r.width, 1)) * f * -2.5;
        el.style.transform = `translateY(${(-f * 0.14).toFixed(3)}em) rotate(${tilt.toFixed(2)}deg)`;
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
    <span aria-label={text}>
      {[...text].map((ch, i) => (
        <span
          key={i}
          aria-hidden
          ref={(el) => {
            refs.current[i] = el;
          }}
          className="inline-block transition-[transform,color] duration-500 ease-ink will-change-transform"
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

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });

  const x1 = useTransform(scrollYProgress, [0, 1], ["0vw", "-14vw"]);
  const x2 = useTransform(scrollYProgress, [0, 1], ["0vw", "12vw"]);
  const x3 = useTransform(scrollYProgress, [0, 1], ["0vw", "-8vw"]);
  const fade = useTransform(scrollYProgress, [0, 0.5], [1, 0]);

  return (
    <section
      id="top"
      ref={ref}
      className="relative flex min-h-[100svh] flex-col px-6 pb-10 pt-28 md:px-12 md:pt-32"
    >
      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 0.1 }}
        className="flex flex-wrap items-baseline gap-x-6 gap-y-2 border-b border-border pb-4"
      >
        <span className="font-display text-2xl italic">word·work</span>
        <span className="font-mono text-sm text-muted-foreground">/ˈwɜːd.wɜːk/</span>
        <span className="font-display text-lg italic text-muted-foreground">noun</span>
        <span className="label-mono ml-auto hidden text-muted-foreground sm:inline">
          Entry 01 of 3,200
        </span>
      </motion.div>

      <h1 className="mt-[5vh] font-display text-mega tracking-[-0.035em]">
        <Line delay={0.15} x={x1}>
          Speak the
        </Line>
        <Line delay={0.28} x={x2} className="pl-[9vw] italic">
          <ProximityWord text="language" />
        </Line>
        <Line delay={0.41} x={x3} className="text-right">
          of work<span className="text-pen">.</span>
        </Line>
      </h1>

      <motion.div
        style={{ opacity: fade }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.9, ease: EASE }}
        className="mt-auto grid items-end gap-8 pt-16 md:grid-cols-12"
      >
        <p className="max-w-sm text-lg leading-relaxed text-muted-foreground md:col-span-5">
          <span className="font-mono text-sm text-foreground">1.</span> Workplace English, learned
          five words a day — for people who already speak English and want to sound like they run
          the meeting.
        </p>
        <div className="flex flex-wrap items-center gap-3 md:col-span-5 md:col-start-8 md:justify-end">
          <Button asChild variant="ink" size="pill">
            <a href="#download">Start with five words</a>
          </Button>
          <Button asChild variant="line" size="pill">
            <a href="#decode">See how it reads</a>
          </Button>
        </div>
      </motion.div>

      <motion.div
        aria-hidden
        style={{ opacity: fade }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
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
