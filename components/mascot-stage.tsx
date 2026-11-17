"use client";

import Mascot from "@/components/mascot";
import { useMascot } from "@/components/mascot-context";

export default function MascotStage() {
  const { mood, message, streak } = useMascot();

  return (
    <div className="sticky top-[26vh] hidden w-[148px] shrink-0 flex-col items-center gap-3 self-start xl:flex">
      <Mascot mood={mood} className="h-[148px] w-auto" />

      <p
        aria-live="polite"
        className="flex min-h-[56px] w-full items-center justify-center rounded-2xl border border-line bg-card-raised px-3 py-2 text-center text-[11.5px] leading-[1.45] text-ink-soft"
      >
        {message ?? "Tränar medan du jobbar."}
      </p>

      <p className="text-[11px] text-ink-muted tabular-nums">
        {streak} rätt i rad
      </p>
    </div>
  );
}
