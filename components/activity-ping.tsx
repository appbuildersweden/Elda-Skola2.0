"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export default function ActivityPing({ enabled }: { enabled: boolean }) {
  const pathname = usePathname();

  useEffect(() => {
    if (!enabled) return;

    const send = () => {
      void fetch("/api/activity", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path: pathname }),
        keepalive: true,
      }).catch(() => undefined);
    };

    send();
    const interval = setInterval(send, 60_000);
    return () => clearInterval(interval);
  }, [enabled, pathname]);

  return null;
}
