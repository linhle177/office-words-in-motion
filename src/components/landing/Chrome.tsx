import { useState } from "react";
import { motion, useMotionValueEvent, useScroll, useSpring } from "motion/react";

import { Button } from "@/components/ui/button";
import { useCopy } from "./copy";
import { useEarlyAccess } from "./EarlyAccess";

/** Header that steps out of the way while reading and returns when you scroll up. */
export function Nav() {
  const { scrollY } = useScroll();
  const { open } = useEarlyAccess();
  const c = useCopy();
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
          {c.brand.name}
          <span className="text-pen">.</span>
        </a>
        <nav className="hidden items-center gap-10 md:flex">
          {c.nav.links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="label-mono text-muted-foreground transition-colors hover:text-foreground"
            >
              {l.label}
            </a>
          ))}
        </nav>
        <Button variant="ink" size="pill-sm" onClick={open}>
          {c.nav.cta}
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
