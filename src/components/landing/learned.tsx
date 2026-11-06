import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";

type LearnedCtx = {
  learned: string[];
  learn: (word: string) => void;
};

const LearnedContext = createContext<LearnedCtx | null>(null);

export function LearnedProvider({ children }: { children: ReactNode }) {
  const [learned, setLearned] = useState<string[]>([]);
  const learn = useCallback((word: string) => {
    setLearned((prev) => (prev.includes(word) ? prev : [...prev, word]));
  }, []);
  const value = useMemo(() => ({ learned, learn }), [learned, learn]);
  return <LearnedContext.Provider value={value}>{children}</LearnedContext.Provider>;
}

export function useLearned() {
  const ctx = useContext(LearnedContext);
  if (!ctx) throw new Error("useLearned must be used inside LearnedProvider");
  return ctx;
}
