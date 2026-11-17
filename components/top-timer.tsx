"use client";

import { useEffect, useState } from "react";
import { useFocusTimer } from "@/components/focus-timer-context";
import { ClockIcon } from "@/components/icons";

function format(ms: number) {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function TopTimer() {
  const { session, clear } = useFocusTimer();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!session) return;
    const interval = setInterval(() => setNow(Date.now()), 500);
    return () => clearInterval(interval);
  }, [session]);

  const remaining = session ? session.endsAt - now : 0;
  const expired = Boolean(session && remaining <= 0);

  useEffect(() => {
    if (!session || !expired) return;
    const timeout = setTimeout(() => clear(), 3000);
    return () => clearTimeout(timeout);
  }, [session, expired, clear]);

  if (!session) return null;

  const totalMs = session.minutes * 60_000;
  const left = Math.max(0, remaining);
  const done = left <= 0;
  const progress = Math.min(100, Math.max(0, (1 - left / totalMs) * 100));

  return (
    <div
      role="timer"
      aria-label={`Fokustimer ${session.title}`}
      className="relative overflow-hidden rounded-full border border-line bg-card-raised px-3 py-1.5"
    >
      <div className="flex items-center gap-2">
        <ClockIcon
          className={`size-3.5 ${done ? "text-accent" : "text-ink-muted"}`}
        />
        <span className="text-[12px] font-medium text-ink tabular-nums">
          {done ? "Klart!" : format(left)}
        </span>
        <span className="max-w-[16ch] truncate text-[11px] text-ink-muted">
          {session.title}
        </span>
      </div>

      <span
        aria-hidden
        className="absolute bottom-0 left-0 h-[2px] bg-accent transition-[width] duration-500 ease-linear"
        style={{ width: `${done ? 100 : progress}%` }}
      />
    </div>
  );
}
