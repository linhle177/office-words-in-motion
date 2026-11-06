import { useEffect, useRef, useState } from "react";
import { animate, motion, useInView, useScroll, useTransform } from "motion/react";

const STATS = [
  { value: 5, suffix: " min", label: "a day, before your first meeting" },
  { value: 3200, suffix: "", label: "workplace terms, phrases and idioms" },
  { value: 14, suffix: "", label: "industries, from finance to healthcare" },
];

function CountUp({ to, suffix }: { to: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-15% 0px" });
  const [val, setVal] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, to, {
      duration: 1.8,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setVal(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {val.toLocaleString("en-US")}
      <em className="text-muted-foreground">{suffix}</em>
    </span>
  );
}

export function Stats() {
  return (
    <section className="px-6 py-[16vh] md:px-12">
      <div className="grid md:grid-cols-3">
        {STATS.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10% 0px" }}
            transition={{ duration: 0.9, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="border-t border-foreground py-8 md:pr-10"
          >
            <p className="font-display text-giant tracking-[-0.03em]">
              <CountUp to={s.value} suffix={s.suffix} />
            </p>
            <p className="mt-4 max-w-[16rem] text-muted-foreground">{s.label}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function Quote() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const rotate = useTransform(scrollYProgress, [0, 1], [-18, 18]);
  const y = useTransform(scrollYProgress, [0, 1], ["30%", "-30%"]);
  const scale = useTransform(scrollYProgress, [0.1, 0.45], [0.94, 1]);

  return (
    <section ref={ref} className="relative overflow-hidden px-6 py-[22vh] md:px-12">
      <motion.span
        aria-hidden
        style={{ rotate, y }}
        className="pointer-events-none absolute -top-[0.1em] left-[4vw] font-display text-[clamp(14rem,32vw,30rem)] leading-none text-pen opacity-90"
      >
        “
      </motion.span>
      <motion.figure style={{ scale }} className="relative mx-auto max-w-5xl md:pl-[10vw]">
        <blockquote className="font-display text-headline italic tracking-[-0.02em]">
          I used to rehearse every sentence before a meeting. Now I just{" "}
          <span className="highlight-sweep not-italic [--sweep:100%]">talk</span>.
        </blockquote>
        <figcaption className="mt-10 flex items-center gap-4">
          <span className="hairline w-12" />
          <span className="label-mono text-muted-foreground">
            Linh Trần — Product Manager, Ho Chi Minh City
          </span>
        </figcaption>
      </motion.figure>
    </section>
  );
}
