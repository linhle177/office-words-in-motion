import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "motion/react";
import { X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { BRAND, EARLY_ACCESS } from "./data";

const Ctx = createContext<{ open: () => void }>({ open: () => {} });

export function useEarlyAccess() {
  return useContext(Ctx);
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** One "isn't out yet" sheet that every download / early-access button opens. */
export function EarlyAccessProvider({ children }: { children: ReactNode }) {
  const [isOpen, setOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [error, setError] = useState(false);
  const [done, setDone] = useState(false);

  const open = useCallback(() => setOpen(true), []);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!EMAIL.test(email.trim())) {
      setError(true);
      return;
    }
    setError(false);
    setDone(true);
  };

  return (
    <Ctx.Provider value={{ open }}>
      {children}
      <DialogPrimitive.Root open={isOpen} onOpenChange={setOpen}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-foreground/30 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogPrimitive.Content className="paper-card fixed left-1/2 top-1/2 z-[80] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-lg p-8 duration-300 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-bottom-4 md:p-12">
            <DialogPrimitive.Close className="absolute right-5 top-5 cursor-pointer rounded-full p-2 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>

            <p className="label-mono flex items-center gap-3 text-muted-foreground">
              <span className="font-display text-base normal-case tracking-normal text-foreground">
                {BRAND.kanji}
              </span>
              Early access
            </p>
            <DialogPrimitive.Title className="mt-6 font-display text-5xl leading-[0.95] tracking-[-0.025em] md:text-6xl">
              {EARLY_ACCESS.headline}
            </DialogPrimitive.Title>
            <DialogPrimitive.Description className="mt-5 max-w-md text-lg leading-relaxed text-muted-foreground">
              {EARLY_ACCESS.body}
            </DialogPrimitive.Description>

            <AnimatePresence mode="wait" initial={false}>
              {done ? (
                <motion.p
                  key="done"
                  role="status"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
                  className="mt-10 border-t border-foreground pt-6 font-display text-2xl italic"
                >
                  <span className="highlight-sweep [--sweep:100%]">{EARLY_ACCESS.done}</span>
                </motion.p>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={submit}
                  noValidate
                  exit={{ opacity: 0, y: -8 }}
                  className="mt-10"
                >
                  <label htmlFor="early-email" className="sr-only">
                    Email
                  </label>
                  <div
                    className={`flex flex-col gap-3 border-b pb-3 transition-colors sm:flex-row sm:items-end ${
                      error ? "border-pen" : "border-foreground"
                    }`}
                  >
                    <input
                      id="early-email"
                      type="email"
                      autoComplete="email"
                      inputMode="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (error) setError(false);
                      }}
                      placeholder={EARLY_ACCESS.placeholder}
                      aria-invalid={error}
                      className="min-w-0 flex-1 bg-transparent py-2 font-display text-2xl italic outline-none placeholder:text-faint md:text-3xl"
                    />
                    <Button type="submit" variant="ink" size="pill">
                      {EARLY_ACCESS.cta}
                    </Button>
                  </div>
                  {error && (
                    <p className="label-mono mt-3 text-pen" role="alert">
                      Please check that email address
                    </p>
                  )}
                </motion.form>
              )}
            </AnimatePresence>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    </Ctx.Provider>
  );
}
