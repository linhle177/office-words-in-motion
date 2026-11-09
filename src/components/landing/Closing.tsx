import { useRef } from "react";
import { motion, useInView, useScroll, useTransform, type MotionValue } from "motion/react";

import { BRAND, CLOSING } from "./data";
import { useEarlyAccess } from "./EarlyAccess";

const WORDMARK = "hikidashi";

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

function AppleLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-8 w-8 fill-current">
      <path d="M16.37 12.6c-.02-2.3 1.88-3.4 1.96-3.46-1.07-1.56-2.73-1.77-3.32-1.8-1.41-.14-2.76.83-3.47.83-.72 0-1.82-.81-3-.79-1.54.02-2.96.9-3.76 2.28-1.6 2.78-.41 6.9 1.15 9.16.76 1.1 1.67 2.35 2.86 2.3 1.15-.05 1.58-.74 2.97-.74 1.38 0 1.78.74 2.99.72 1.24-.02 2.02-1.12 2.77-2.23.87-1.28 1.23-2.52 1.25-2.58-.03-.01-2.39-.92-2.4-3.69zM14.1 5.86c.63-.77 1.06-1.83.94-2.89-.91.04-2.02.61-2.67 1.37-.58.67-1.1 1.76-.96 2.8 1.02.08 2.06-.52 2.69-1.28z" />
    </svg>
  );
}

/* Google Play mark keeps its official four colours. */
function PlayLogo() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden className="h-7 w-7">
      <path fill="#00D7FE" d="M3.6 1.8 13.4 12 3.6 22.2c-.37-.2-.6-.62-.6-1.13V2.93c0-.5.23-.93.6-1.13z" />
      <path fill="#00F076" d="M16.8 8.6 13.4 12 3.6 1.8c.4-.22.92-.22 1.4.04l11.8 6.76z" />
      <path fill="#FF3A44" d="M16.8 15.4 5 22.16c-.48.26-1 .26-1.4.04L13.4 12l3.4 3.4z" />
      <path fill="#FFD500" d="M20.4 10.95c.8.46.8 1.64 0 2.1l-3.6 2.35L13.4 12l3.4-3.4 3.6 2.35z" />
    </svg>
  );
}

function StoreBadge({ store, onClick }: { store: "apple" | "google"; onClick: () => void }) {
  const apple = store === "apple";
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      aria-label={apple ? "Download on the App Store" : "Get it on Google Play"}
      className="flex h-[3.75rem] cursor-pointer items-center gap-3 rounded-xl border border-muted-foreground/50 bg-foreground pl-4 pr-6 text-left text-background"
    >
      {apple ? <AppleLogo /> : <PlayLogo />}
      <span className="flex flex-col">
        <span className={`leading-none ${apple ? "text-[0.7rem]" : "text-[0.625rem] uppercase tracking-[0.06em]"}`}>
          {apple ? "Download on the" : "Get it on"}
        </span>
        <span className="mt-1 text-[1.45rem] font-medium leading-none tracking-[-0.02em]">
          {apple ? "App Store" : "Google Play"}
        </span>
      </span>
    </motion.button>
  );
}

export function Closing() {
  const footRef = useRef<HTMLDivElement>(null);
  const headRef = useRef<HTMLHeadingElement>(null);
  const inView = useInView(headRef, { once: true, margin: "-25% 0px" });
  const { open } = useEarlyAccess();
  const { scrollYProgress } = useScroll({ target: footRef, offset: ["start end", "end end"] });

  return (
    <section id="download" className="px-6 pt-[22vh] md:px-12">
      <div className="grid gap-12 md:grid-cols-12">
        <p className="label-mono md:col-span-3">§ 04 — Download</p>
        <div className="md:col-span-9">
          <motion.h2
            ref={headRef}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="font-display text-giant tracking-[-0.035em]"
          >
            {CLOSING.headline[0]}
            <em
              style={{ "--sweep": inView ? "100%" : "0%" } as React.CSSProperties}
              className="highlight-sweep transition-[background-size] delay-500 duration-1000 ease-ink"
            >
              {CLOSING.headline[1]}
            </em>
            <span className="text-muted-foreground">{CLOSING.headline[2]}</span>
          </motion.h2>
          <p className="mt-10 max-w-xl text-xl leading-snug text-muted-foreground">
            {CLOSING.body}
          </p>
          <div className="mt-12 flex flex-wrap items-center gap-3">
            <StoreBadge store="apple" onClick={open} />
            <StoreBadge store="google" onClick={open} />
          </div>
        </div>
      </div>

      <div ref={footRef} className="mt-[24vh]">
        <p
          aria-label={BRAND.name}
          className="-mx-[0.04em] select-none whitespace-nowrap text-center font-display text-wordmark tracking-[-0.05em]"
        >
          {[...WORDMARK].map((ch, i) => (
            <Letter key={i} ch={ch} i={i} progress={scrollYProgress} />
          ))}
        </p>
        <footer className="flex flex-col gap-4 border-t border-border py-8 sm:flex-row sm:items-center sm:justify-between">
          <span className="label-mono text-muted-foreground">© 2026 {BRAND.name}</span>
          <span className="font-display text-lg text-muted-foreground">{BRAND.kanji}</span>
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
