import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { TOTAL_WORDS } from "./data";
import { useLearned } from "./learned";

const LINKS = [
  { href: "#decode", label: "Decode" },
  { href: "#method", label: "Method" },
  { href: "#fields", label: "Fields" },
];

/** Header that steps out of the way while reading and returns when you scroll up. */
export function Nav() {
  const { scrollY } = useScroll();
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useMotionValueEvent(scrollY, "change", (v) => {
    const prev = scrollY.getPrevious() ?? 0;
    setHidden(v > prev && v > 240);
    setScrolled(v > 24);
  });

  return (
    <motion.header
      animate={{ y: hidden ? "-110%" : "0%" }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 ${
        scrolled ? "bg-background/85 backdrop-blur-md" : "bg-transparent"
      }`}
    >
      <div className="flex items-center justify-between px-6 py-5 md:px-12">
        <a href="#top" className="font-display text-2xl tracking-tight">
          Wordwork<span className="text-pen">.</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button asChild variant="ink" size="pill-sm">
          <a href="#download">Get the app</a>
        </Button>
      </div>
    </motion.header>
  );
}

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed inset-x-0 top-0 z-[60] h-[2px] origin-left bg-pen"
    />
  );
}

/** A quiet tally of the words the visitor has picked up just by reading the page. */
export function LearnedCounter() {
  const { learned } = useLearned();
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (v) => {
    const nearEnd = v > document.documentElement.scrollHeight - window.innerHeight * 1.6;
    setVisible(v > 500 && !nearEnd);
  });

  const last = learned[learned.length - 1];
  const pct = (learned.length / TOTAL_WORDS) * 100;

  return (
    <AnimatePresence>
      {visible && (
        <motion.aside
          aria-live="polite"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="paper-card fixed bottom-5 left-5 z-40 flex items-center gap-4 rounded-full py-2 pl-4 pr-5 md:bottom-8 md:left-8"
        >
          <span className="label-mono text-muted-foreground">Learned here</span>
          <span className="font-mono text-sm tabular-nums">
            <motion.span
              key={learned.length}
              initial={{ y: -8, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="inline-block"
            >
              {String(learned.length).padStart(2, "0")}
            </motion.span>
            <span className="text-faint"> / {TOTAL_WORDS}</span>
          </span>
          <span className="relative hidden h-[3px] w-16 overflow-hidden rounded-full bg-muted sm:block">
            <motion.span
              className="absolute inset-y-0 left-0 bg-foreground"
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            />
          </span>
          <AnimatePresence mode="wait">
            {last && (
              <motion.span
                key={last}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 6 }}
                className="hidden font-display text-lg italic sm:inline"
              >
                + {last}
              </motion.span>
            )}
          </AnimatePresence>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
