import { useEffect, useRef, useState } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "motion/react";

import { FIELDS } from "./data";

/** A pinned shelf of industries that slides sideways — and leans with how fast you scroll. */
export function Fields() {
  const ref = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [distance, setDistance] = useState(0);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  const { scrollYProgress, scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });
  const x = useTransform(scrollYProgress, [0.05, 0.95], [0, -distance]);
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 40, stiffness: 300 });
  const skewX = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });

  return (
    <section id="fields" ref={ref} className="relative h-[380vh]">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-between overflow-hidden pb-12 pt-24 md:pt-28">
        <div className="flex items-baseline justify-between border-b border-border px-6 pb-4 md:px-12">
          <span className="label-mono">§ 04 — Fields</span>
          <span className="label-mono text-muted-foreground">14 industries · 3,200 terms</span>
        </div>

        <p className="max-w-xl px-6 font-display text-statement tracking-[-0.015em] md:px-12">
          Not “business English.” <em className="text-muted-foreground">Your</em> English — for
          the room you're actually in.
        </p>

        <motion.div ref={trackRef} style={{ x, skewX }} className="flex w-max items-end gap-[9vw] px-6 md:px-12">
          {FIELDS.map((f, i) => (
            <div key={f.name} className="shrink-0">
              <p className="label-mono text-muted-foreground">
                0{i + 1} — {f.count} terms
              </p>
              <p className="mt-3 font-display text-mega tracking-[-0.04em]">
                {i % 2 === 1 ? <em>{f.name}</em> : f.name}
              </p>
              <p className="mt-4 font-mono text-sm text-muted-foreground">
                {f.samples.join("  ·  ")}
              </p>
            </div>
          ))}
          <div className="shrink-0 pb-6">
            <p className="font-display text-giant italic text-faint">+ 8 more</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
