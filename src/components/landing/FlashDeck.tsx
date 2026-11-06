import { useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useTransform,
  type PanInfo,
} from "motion/react";

import { Button } from "@/components/ui/button";
import { CARDS, type FlashCard } from "./data";
import { useLearned } from "./learned";

const EASE = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  { n: "01", t: "Collect", d: "Words pulled from your field, your role, and the meetings on your calendar." },
  { n: "02", t: "Swipe", d: "Five cards each morning. Keep what you know, learn what you don't." },
  { n: "03", t: "Say it", d: "Rehearse each word out loud in a 60-second mock meeting before 9:30." },
];

function Card({
  card,
  depth,
  onSwipe,
}: {
  card: FlashCard;
  depth: number;
  onSwipe: (dir: 1 | -1) => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, [-260, 260], [-14, 14]);
  const knownOpacity = useTransform(x, [30, 130], [0, 1]);
  const teachOpacity = useTransform(x, [-130, -30], [1, 0]);
  const isTop = depth === 0;

  const handleDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 110 || Math.abs(info.velocity.x) > 650) {
      onSwipe(info.offset.x > 0 ? 1 : -1);
    }
  };

  return (
    <motion.article
      variants={{
        exit: (dir: number) => ({
          x: dir * 680,
          rotate: dir * 22,
          opacity: 0,
          transition: { duration: 0.55, ease: EASE },
        }),
      }}
      style={{ x, rotate, zIndex: 10 - depth }}
      initial={{ scale: 0.9, y: 40, opacity: 0 }}
      animate={{
        scale: 1 - depth * 0.045,
        y: depth * 18,
        opacity: depth > 2 ? 0 : 1,
      }}
      exit="exit"
      transition={{ duration: 0.6, ease: EASE }}
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      dragElastic={0.9}
      onDragEnd={handleDragEnd}
      whileDrag={{ scale: 1.02 }}
      aria-hidden={!isTop}
      className={`paper-card absolute inset-0 flex select-none flex-col rounded-2xl p-7 md:p-10 ${
        isTop ? "cursor-grab touch-pan-y active:cursor-grabbing" : "pointer-events-none"
      }`}
    >
      <div className="label-mono flex justify-between text-muted-foreground">
        <span>No. {card.no}</span>
        <span>{card.field}</span>
      </div>

      <motion.span
        style={{ opacity: knownOpacity }}
        className="label-mono absolute right-8 top-16 rotate-6 rounded-sm border-2 border-foreground px-3 py-2 text-foreground"
      >
        I know it
      </motion.span>
      <motion.span
        style={{ opacity: teachOpacity }}
        className="label-mono absolute left-8 top-16 -rotate-6 rounded-sm border-2 border-pen px-3 py-2 text-pen"
      >
        Teach me
      </motion.span>

      <div className="mt-auto">
        <h3 className="font-display text-flash tracking-[-0.03em]">{card.word}</h3>
        <p className="mt-3 flex items-baseline gap-3">
          <span className="font-mono text-sm text-muted-foreground">{card.ipa}</span>
          <span className="font-display text-lg italic text-muted-foreground">{card.pos}</span>
        </p>
        <p className="mt-5 text-lg leading-snug">{card.definition}</p>
        <div className="hairline my-6" />
        <p className="label-mono text-muted-foreground">At work</p>
        <p className="mt-3 font-display text-2xl italic leading-snug">
          “{card.example[0]}
          <span className="highlight-sweep [--sweep:100%]">{card.example[1]}</span>
          {card.example[2]}”
        </p>
      </div>
    </motion.article>
  );
}

export function FlashDeck() {
  const [deck, setDeck] = useState(CARDS);
  const [dir, setDir] = useState<1 | -1>(1);
  const { learn } = useLearned();

  const swipe = (d: 1 | -1) => {
    const top = deck[0];
    if (!top) return;
    setDir(d);
    learn(top.word);
    setDeck((prev) => prev.slice(1));
  };

  const done = CARDS.length - deck.length;

  return (
    <section id="method" className="px-6 py-[18vh] md:px-12">
      <div className="grid gap-16 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="label-mono">§ 03 — The method</p>
          <h2 className="mt-8 font-display text-headline tracking-[-0.025em]">
            Five words a day. <em className="text-muted-foreground">Swipe the ones you already own.</em>
          </h2>
          <ol className="mt-16 space-y-0">
            {STEPS.map((s, i) => (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-10% 0px" }}
                transition={{ duration: 0.8, delay: i * 0.12, ease: EASE }}
                className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-6"
              >
                <span className="font-mono text-sm text-muted-foreground">{s.n}</span>
                <div>
                  <p className="font-display text-2xl">{s.t}</p>
                  <p className="mt-1 text-muted-foreground">{s.d}</p>
                </div>
              </motion.li>
            ))}
          </ol>
        </div>

        <div className="md:col-span-6 md:col-start-7">
          <div className="label-mono mb-6 flex justify-between text-muted-foreground">
            <span>Today's five — try it</span>
            <span className="tabular-nums text-foreground">
              {String(Math.min(done + 1, CARDS.length)).padStart(2, "0")} / 0{CARDS.length}
            </span>
          </div>

          <div className="relative h-[34rem] md:h-[36rem]">
            <AnimatePresence custom={dir}>
              {deck.map((card, i) => (
                <Card key={card.word} card={card} depth={i} onSwipe={swipe} />
              ))}
            </AnimatePresence>

            <AnimatePresence>
              {deck.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.7, ease: EASE } }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-start justify-center rounded-2xl border border-dashed border-border p-10"
                >
                  <p className="label-mono text-pen">Done for today</p>
                  <p className="mt-6 font-display text-headline tracking-[-0.02em]">
                    That's five. <em>See you tomorrow.</em>
                  </p>
                  <Button variant="line" size="pill" className="mt-10" onClick={() => setDeck(CARDS)}>
                    Shuffle again
                  </Button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="mt-10 flex items-center justify-between">
            <Button
              variant="line"
              size="pill"
              disabled={deck.length === 0}
              onClick={() => swipe(-1)}
            >
              ← Teach me
            </Button>
            <span className="label-mono hidden text-muted-foreground sm:inline">or drag the card</span>
            <Button variant="ink" size="pill" disabled={deck.length === 0} onClick={() => swipe(1)}>
              I know it →
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
