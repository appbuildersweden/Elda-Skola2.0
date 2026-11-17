"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

type FocusSession = { title: string; minutes: number; endsAt: number };

type FocusState = {
  session: FocusSession | null;
  start: (minutes: number, title: string) => void;
  clear: () => void;
};

const FocusContext = createContext<FocusState | null>(null);

export function FocusTimerProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<FocusSession | null>(null);

  const start = useCallback((minutes: number, title: string) => {
    const safeMinutes = Math.min(Math.max(Math.round(minutes), 1), 180);
    setSession({
      title,
      minutes: safeMinutes,
      endsAt: Date.now() + safeMinutes * 60_000,
    });
  }, []);

  const clear = useCallback(() => setSession(null), []);

  const value = useMemo(
    () => ({ session, start, clear }),
    [session, start, clear],
  );

  return (
    <FocusContext.Provider value={value}>{children}</FocusContext.Provider>
  );
}

export function useFocusTimer() {
  const context = useContext(FocusContext);
  if (!context) {
    throw new Error("useFocusTimer måste användas innanför FocusTimerProvider");
  }
  return context;
}
