"use client";

import Assignment from "@/components/assignment";
import { useMascot } from "@/components/mascot-context";

export default function StudioBoard() {
  const { result, reset } = useMascot();

  return (
    <div
      className={
        result
          ? "grid gap-4"
          : "grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]"
      }
    >
      {result ? null : <Assignment />}

      <section className="flex flex-col rounded-[18px] border border-line bg-card p-5">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
            Tidigare resultat
          </h2>
          <span className="text-[12px] text-ink-muted tabular-nums">
            {result ? "1 pass" : "0 pass"}
          </span>
        </div>

        {result ? (
          <>
            <ul className="mt-4 divide-y divide-line-soft">
              <li className="flex items-center justify-between gap-3 rounded-xl border border-line-soft bg-card-raised px-4 py-3">
                <div className="min-w-0">
                  <p className="text-[13px] font-medium text-ink">
                    Övningspass
                  </p>
                  <p className="mt-0.5 text-[11.5px] text-ink-muted tabular-nums">
                    Idag {result.time}
                  </p>
                </div>
                <span className="shrink-0 text-[12.5px] font-medium text-accent tabular-nums">
                  {result.score} av {result.total} rätt
                </span>
              </li>
            </ul>

            <div className="mt-auto flex items-center justify-between gap-3 border-t border-line-soft pt-4">
              <p className="text-[11.5px] text-ink-muted">
                Passet sparas i den här fliken.
              </p>
              <button
                type="button"
                onClick={reset}
                className="h-9 shrink-0 rounded-full border border-line px-4 text-[12.5px] font-medium text-ink-soft transition-colors duration-150 hover:border-control-line hover:text-ink"
              >
                Nytt pass
              </button>
            </div>
          </>
        ) : (
          <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-14 text-center">
            <p className="text-[13.5px] font-medium text-ink">
              Inga resultat än
            </p>
            <p className="mt-1.5 max-w-[34ch] text-[12.5px] leading-[1.6] text-ink-muted">
              Varje avslutat pass sparas här, så du kan gå tillbaka och jämföra.
            </p>
          </div>
        )}
      </section>
    </div>
  );
}
