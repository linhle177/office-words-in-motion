import { useRef } from "react";
import { motion, useScroll, useTransform, type MotionValue } from "motion/react";

import { Button } from "@/components/ui/button";

const WORDMARK = "wordwork";

function Letter({ ch, i, progress }: { ch: string; i: number; progress: MotionValue<number> }) {
  const start = i * 0.05;
  const y = useTransform(progress, [start, start + 0.5], ["105%", "0%"]);
  return (
    <span className="-mx-[0.08em] inline-block overflow-hidden px-[0.08em] pb-[0.06em]">
      <motion.span style={{ y }} className={`inline-block ${i >= 4 ? "italic" : ""}`}>
        {ch}
      </motion.span>
    </span>
  );
}

export function Closing() {
  const footRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: footRef, offset: ["start end", "end end"] });

  return (
    <section id="download" className="px-6 pt-[22vh] md:px-12">
      <div className="grid gap-12 md:grid-cols-12">
        <p className="label-mono md:col-span-3">§ 05 — Begin</p>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-giant tracking-[-0.035em]"
          >
            Start with <em>five</em> words.
            <br />
            <span className="text-muted-foreground">Finish the meeting.</span>
          </motion.h2>
          <div className="mt-14 flex flex-wrap items-center gap-3">
            <Button asChild variant="ink" size="pill">
              <a href="#download">Download for iPhone</a>
            </Button>
            <Button asChild variant="line" size="pill">
              <a href="#download">Get it on Android</a>
            </Button>
            <span className="label-mono ml-2 text-muted-foreground">Free to start</span>
          </div>
        </div>
      </div>

      <div ref={footRef} className="mt-[24vh]">
        <p
          aria-label="Wordwork"
          className="-mx-[0.04em] select-none whitespace-nowrap text-center font-display text-wordmark tracking-[-0.05em]"
        >
          {[...WORDMARK].map((ch, i) => (
            <Letter key={i} ch={ch} i={i} progress={scrollYProgress} />
          ))}
        </p>
        <footer className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="label-mono text-muted-foreground">© 2026 Wordwork</span>
          <span className="font-display text-lg italic text-muted-foreground">
            Speak the language of work.
          </span>
          <nav className="flex gap-8">
            <a href="#top" className="label-mono text-muted-foreground hover:text-foreground">
              Privacy
            </a>
            <a href="#top" className="label-mono text-muted-foreground hover:text-foreground">
              Terms
            </a>
            <a href="#top" className="label-mono text-muted-foreground hover:text-foreground">
              Back to top ↑
            </a>
          </nav>
        </footer>
      </div>
    </section>
  );
}
