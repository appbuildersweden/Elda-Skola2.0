"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LogoutButton({ className }: { className?: string }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function logout() {
    if (pending) return;
    setPending(true);
    await fetch("/api/auth/logout", { method: "POST" }).catch(() => undefined);
    router.replace("/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={pending}
      className={
        className ??
        "h-8 rounded-full border border-line px-3 text-[11.5px] text-ink-soft transition-colors duration-150 hover:border-control-line hover:text-ink disabled:opacity-50"
      }
    >
      {pending ? "Loggar ut…" : "Logga ut"}
    </button>
  );
}
