"use client";

import { useState } from "react";

export default function AnswerDocument({
  updateId,
  initial,
  savedAt,
}: {
  updateId: string;
  initial: string;
  savedAt: string | null;
}) {
  const [content, setContent] = useState(initial);
  const [stamp, setStamp] = useState(savedAt);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function save() {
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ updateId, content }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Kunde inte spara.");
        return;
      }

      setStamp(data.savedAt as string);
    } catch {
      setError("Kunde inte nå servern.");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="mt-3 rounded-xl border border-line bg-card px-3.5 py-3">
      <p className="text-[11.5px] font-medium text-ink-soft">Ditt svar</p>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Skriv ditt svar här…"
        className="mt-1.5 min-h-[120px] w-full resize-y rounded-lg border border-control-line bg-card-raised px-3 py-2 text-[12.5px] leading-[1.6] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
      />

      <div className="mt-2 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={save}
          disabled={pending}
          className="h-8 rounded-full bg-accent px-3.5 text-[12px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Sparar…" : "Spara svar"}
        </button>

        {stamp ? (
          <span className="text-[11.5px] text-ink-muted">
            Sparat{" "}
            {new Date(stamp).toLocaleTimeString("sv-SE", {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        ) : (
          <span className="text-[11.5px] text-ink-muted">
            Inte sparat än
          </span>
        )}

        {error ? <span className="text-[11.5px] text-accent">{error}</span> : null}
      </div>
    </div>
  );
}
