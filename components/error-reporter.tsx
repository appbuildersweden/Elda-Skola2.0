"use client";

import { useEffect } from "react";

const seen = new Map<string, number>();

function report(message: string) {
  const key = message.slice(0, 120);
  const now = Date.now();
  const last = seen.get(key) ?? 0;
  if (now - last < 15_000) return;
  seen.set(key, now);

  void fetch("/api/bugs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      message: message.slice(0, 500),
      path: window.location.pathname,
    }),
    keepalive: true,
  }).catch(() => undefined);
}

export default function ErrorReporter() {
  useEffect(() => {
    const onError = (event: ErrorEvent) => {
      report(event.message || "Okänt fel");
    };

    const onRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      report(
        reason instanceof Error
          ? `${reason.name}: ${reason.message}`
          : String(reason),
      );
    };

    window.addEventListener("error", onError);
    window.addEventListener("unhandledrejection", onRejection);

    return () => {
      window.removeEventListener("error", onError);
      window.removeEventListener("unhandledrejection", onRejection);
    };
  }, []);

  return null;
}
