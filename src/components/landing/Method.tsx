import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { Mic } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useCopy } from "./copy";
import { checkAnswer, type Verdict } from "./practice";

const EASE = [0.22, 1, 0.36, 1] as const;

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

/* eslint-disable @typescript-eslint/no-explicit-any */
type Recognition = any;
function getRecognitionCtor(): (new () => Recognition) | null {
  if (typeof window === "undefined") return null;
  const w = window as any;
  return w.SpeechRecognition || w.webkitSpeechRecognition || null;
}
/* eslint-enable @typescript-eslint/no-explicit-any */

function Zone({ on, n, children }: { on: boolean; n: number; children: React.ReactNode }) {
  return (
    <div
      className={`relative -mx-3 rounded-md px-3 py-2 transition-colors duration-500 ease-ink ${
        on ? "bg-highlight/35" : "bg-transparent"
      }`}
    >
      <AnimatePresence>
        {on && (
          <motion.span
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.6 }}
            className="absolute -left-7 top-2 hidden h-5 w-5 items-center justify-center rounded-full bg-pen font-mono text-[0.625rem] text-background md:flex"
          >
            {n}
          </motion.span>
        )}
      </AnimatePresence>
      {children}
    </div>
  );
}

/** Memory fades, a review lifts it back up — and each time it fades more slowly. */
function ForgettingCurve() {
  const d =
    "M4 8 C 30 48, 50 62, 70 64 L70 8 C 110 40, 140 52, 168 54 L168 8 C 220 32, 260 42, 300 44 L300 8 C 370 24, 420 32, 476 34";
  return (
    <svg viewBox="0 0 480 72" aria-hidden className="h-16 w-full overflow-visible">
      <line x1="0" y1="70" x2="480" y2="70" className="stroke-border" strokeWidth="1" />
      <motion.path
        d={d}
        fill="none"
        className="stroke-foreground"
        strokeWidth="1.5"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.6, ease: EASE }}
      />
      {[70, 168, 300].map((x, i) => (
        <motion.circle
          key={x}
          cx={x}
          cy={8}
          r={4}
          className="fill-pen"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.4 + i * 0.35, duration: 0.4 }}
        />
      ))}
    </svg>
  );
}

/** The practice card: a meeting, the manager's line, and your missing reply. */
function PracticeCard({ focus }: { focus: number }) {
  const { practice: PRACTICE, ui } = useCopy();
  const L = ui.practice;
  const [value, setValue] = useState("");
  const [verdict, setVerdict] = useState<Verdict | null>(null);
  const [listening, setListening] = useState(false);
  const [canSpeak, setCanSpeak] = useState(false);
  const recRef = useRef<{ stop: () => void } | null>(null);

  useEffect(() => {
    setCanSpeak(!!getRecognitionCtor());
    return () => recRef.current?.stop();
  }, []);

  const grade = (text: string) => setVerdict(checkAnswer(text));

  const say = () => {
    if (listening) {
      recRef.current?.stop();
      return;
    }
    const Ctor = getRecognitionCtor();
    if (!Ctor) return;
    const rec = new Ctor();
    rec.lang = "en-US";
    rec.interimResults = true;
    rec.maxAlternatives = 1;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    rec.onresult = (e: any) => {
      const results = Array.from(
        e.results as ArrayLike<{ 0: { transcript: string }; isFinal: boolean }>,
      );
      const text = results.map((r) => r[0].transcript).join(" ");
      setValue(text);
      if (results[results.length - 1]?.isFinal) grade(text);
    };
    rec.onend = () => setListening(false);
    rec.onerror = () => setListening(false);
    recRef.current = rec;
    setVerdict(null);
    setListening(true);
    rec.start();
  };

  const reset = () => {
    setValue("");
    setVerdict(null);
  };

  const filed = verdict !== null;

  return (
    <div className="paper-card rounded-lg">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2 border-b border-border px-6 py-4 md:px-8">
        <span className="label-mono">{PRACTICE.tag}</span>
        <span className="label-mono text-muted-foreground">{PRACTICE.scene}</span>
      </div>

      <div className="space-y-6 px-6 py-8 md:px-8">
        <div>
          <p className="label-mono text-muted-foreground">{PRACTICE.speaker}</p>
          <p className="mt-3 font-display text-3xl leading-[1.08] tracking-[-0.01em] md:text-[2.15rem]">
            “{PRACTICE.line}”
          </p>
          {PRACTICE.lineGloss && (
            <p className="mt-2 text-sm text-muted-foreground">{PRACTICE.lineGloss}</p>
          )}
        </div>

        <Zone on={focus === 1} n={2}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              grade(value);
            }}
          >
            <label htmlFor="practice-line" className="label-mono text-muted-foreground">
              {L.you}
            </label>
            <input
              id="practice-line"
              value={value}
              onChange={(e) => {
                setValue(e.target.value);
                if (verdict) setVerdict(null);
              }}
              placeholder={L.placeholder}
              autoComplete="off"
              className="mt-2 w-full border-b-2 border-dashed border-foreground bg-transparent pb-2 font-display text-2xl italic outline-none placeholder:text-faint focus:border-solid md:text-3xl"
            />
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Button type="submit" variant="ink" size="pill-sm" disabled={!value.trim()}>
                {L.check}
              </Button>
              {canSpeak && (
                <Button
                  type="button"
                  variant="line"
                  size="pill-sm"
                  onClick={say}
                  aria-pressed={listening}
                  className={listening ? "border-pen text-pen" : ""}
                >
                  <Mic />
                  {listening ? L.listening : L.say}
                </Button>
              )}
              <button
                type="button"
                onClick={() => setVerdict("reveal")}
                className="label-mono ml-auto cursor-pointer text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                {L.showMe}
              </button>
            </div>
          </form>
        </Zone>

        <Zone on={focus === 0} n={1}>
          <AnimatePresence mode="wait" initial={false}>
            {verdict ? (
              <motion.div
                key="answer"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.45, ease: EASE }}
                aria-live="polite"
              >
                <p
                  className={`label-mono ${verdict === "exact" ? "text-pen" : "text-muted-foreground"}`}
                >
                  {L.verdict[verdict]}
                </p>
                <p className="mt-3 font-display text-2xl leading-snug md:text-[1.75rem]">
                  {PRACTICE.answer[0]}
                  <span className="highlight-sweep italic [--sweep:100%]">
                    {PRACTICE.answer[1]}
                  </span>
                  {PRACTICE.answer[2]}
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="label-mono mt-4 cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  {L.tryAgain}
                </button>
              </motion.div>
            ) : (
              <motion.p
                key="hint"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-muted-foreground"
              >
                <span className="label-mono mr-3 text-foreground">{L.hint}</span>
                {PRACTICE.hint}
              </motion.p>
            )}
          </AnimatePresence>
        </Zone>
      </div>

      <div className="border-t border-border px-6 py-5 md:px-8">
        <Zone on={focus === 2} n={3}>
          <div className="flex items-center justify-between gap-4">
            <span className="label-mono text-muted-foreground">{L.review}</span>
            <ol className="flex flex-1 items-center justify-end gap-1 sm:gap-2">
              {PRACTICE.schedule.map((s, i) => {
                const done = filed && i === 0;
                const next = filed ? i === 1 : i === 0;
                return (
                  <li key={s} className="flex items-center gap-1 sm:gap-2">
                    {i > 0 && <span aria-hidden className="h-px w-2 bg-border sm:w-4" />}
                    <span className="flex flex-col items-center gap-1.5">
                      <span
                        className={`h-2.5 w-2.5 rounded-full border transition-colors duration-500 ${
                          done
                            ? "border-foreground bg-foreground"
                            : next
                              ? "border-pen bg-pen/20"
                              : "border-faint"
                        }`}
                      />
                      <span
                        className={`font-mono text-[0.625rem] whitespace-nowrap ${
                          next ? "text-pen" : "text-muted-foreground"
                        }`}
                      >
                        {s}
                      </span>
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>
        </Zone>
      </div>
    </div>
  );
}

export function Method() {
  const { method: METHOD, ui } = useCopy();
  const [open, setOpen] = useState(0);

  return (
    <section id="method" className="px-6 py-[20vh] md:px-12">
      <div className="grid gap-10 md:grid-cols-12">
        <p className="label-mono md:col-span-3">{ui.sections.method}</p>
        <div className="md:col-span-9">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-15% 0px" }}
            transition={{ duration: 1, ease: EASE }}
            className="font-display text-giant tracking-[-0.035em]"
          >
            {METHOD.headline}
          </motion.h2>
          <p className="mt-8 max-w-xl text-xl leading-snug text-muted-foreground">
            {METHOD.noteLead && (
              <>
                <span className="mr-1 font-display text-3xl text-foreground">
                  {METHOD.noteLead}
                </span>{" "}
              </>
            )}
            {METHOD.note}
          </p>
        </div>
      </div>

      <div className="mt-[14vh] grid items-start gap-12 md:grid-cols-12">
        <div className="md:col-span-6" role="list">
          {METHOD.steps.map((s, i) => {
            const isOpen = open === i;
            return (
              <div
                key={s.title}
                role="listitem"
                className={`overflow-hidden border-t border-foreground ${i === METHOD.steps.length - 1 ? "border-b" : ""}`}
              >
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onMouseEnter={() => setOpen(i)}
                  onFocus={() => setOpen(i)}
                  onClick={() => setOpen(i)}
                  className="group flex w-full cursor-pointer items-center gap-5 py-7 text-left"
                >
                  <span className="label-mono w-6 shrink-0 text-muted-foreground">0{i + 1}</span>
                  <motion.span
                    animate={{ x: isOpen ? 14 : 0 }}
                    transition={{ duration: 0.5, ease: EASE }}
                    className="min-w-0 flex-1 font-display text-3xl leading-[1.05] tracking-[-0.01em] md:text-4xl"
                  >
                    {s.title}
                  </motion.span>
                  <span
                    className={`label-mono shrink-0 transition-colors ${isOpen ? "text-pen" : "text-faint"}`}
                  >
                    → <span className="hidden sm:inline">{ui.reason} </span>0{s.reason}
                  </span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      transition={{ duration: 0.55, ease: EASE }}
                      className="overflow-hidden"
                    >
                      <div className="drawer-inset mb-6 rounded-md px-6 py-5 md:ml-11">
                        {s.body && (
                          <p className="text-lg leading-relaxed text-muted-foreground">
                            <Marked text={s.body} />
                          </p>
                        )}
                        {(s.curve || !s.body) && (
                          <div className={s.body ? "mt-4" : ""}>
                            <ForgettingCurve />
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-10% 0px" }}
          transition={{ duration: 1, ease: EASE }}
          className="md:sticky md:top-28 md:col-span-5 md:col-start-8"
        >
          <PracticeCard focus={open} />
        </motion.div>
      </div>
    </section>
  );
}
