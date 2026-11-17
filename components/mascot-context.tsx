"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Mood } from "@/components/mascot";

export type PassResult = { score: number; total: number; time: string };

type MascotState = {
  mood: Mood;
  message: string | null;
  streak: number;
  result: PassResult | null;
  report: (correct: boolean) => void;
  finish: (result: PassResult) => void;
  reset: () => void;
};

const MascotContext = createContext<MascotState | null>(null);

export function MascotProvider({ children }: { children: ReactNode }) {
  const [mood, setMood] = useState<Mood>("idle");
  const [message, setMessage] = useState<string | null>(null);
  const [streak, setStreak] = useState(0);
  const [result, setResult] = useState<PassResult | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const report = useCallback((correct: boolean) => {
    if (timer.current) clearTimeout(timer.current);

    if (correct) {
      setStreak((value) => value + 1);
      setMood("correct");
      setMessage("Rätt! Snyggt jobbat.");
    } else {
      setStreak(0);
      setMood("wrong");
      setMessage("Fel den här gången. Vi reser oss och kör igen.");
    }

    timer.current = setTimeout(
      () => {
        setMood("idle");
        setMessage(null);
      },
      correct ? 1100 : 1700,
    );
  }, []);

  const finish = useCallback((finished: PassResult) => {
    if (timer.current) clearTimeout(timer.current);
    setResult(finished);
    setMood("done");
    setMessage("Bra jobbat! Hoppas vi ses igen.");
  }, []);

  const reset = useCallback(() => {
    if (timer.current) clearTimeout(timer.current);
    setMood("idle");
    setMessage(null);
    setStreak(0);
    setResult(null);
  }, []);

  return (
    <MascotContext.Provider
      value={{ mood, message, streak, result, report, finish, reset }}
    >
      {children}
    </MascotContext.Provider>
  );
}

export function useMascot() {
  const context = useContext(MascotContext);
  if (!context) {
    throw new Error("useMascot måste användas innanför MascotProvider");
  }
  return context;
}
