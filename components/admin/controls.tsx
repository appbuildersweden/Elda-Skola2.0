"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import RichText from "@/components/rich-text";
import type { Answer, Bug, Update } from "@/lib/db";

function toLocalInput(value: string | null) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const offset = date.getTimezoneOffset() * 60_000;
  return new Date(date.getTime() - offset).toISOString().slice(0, 16);
}

function stamp(value: string) {
  return new Date(value).toLocaleString("sv-SE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

export function UpdateRow({
  update,
  recipients,
  answers,
}: {
  update: Update;
  recipients: string;
  answers: (Answer & { studentName: string })[];
}) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(update.title);
  const [notes, setNotes] = useState(update.notes);
  const [releaseAt, setReleaseAt] = useState(toLocalInput(update.releaseAt));
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const live =
    update.released ||
    (update.releaseAt ? new Date(update.releaseAt).getTime() <= Date.now() : false);

  async function patch(body: Record<string, unknown>) {
    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/admin/updates", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: update.id, ...body }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Kunde inte spara.");
        return;
      }

      setEditing(false);
      router.refresh();
    } catch {
      setError("Kunde inte nå servern.");
    } finally {
      setPending(false);
    }
  }

  return (
    <li className="rounded-xl border border-line-soft bg-card-raised p-3.5">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="text-[13px] font-medium text-ink">{update.title}</p>
          <p className="mt-0.5 text-[11.5px] text-ink-muted">
            {live ? "Släppt" : "Väntar på släpp"} · {recipients}
            {update.asksAnswer ? " · svarar i dokument" : ""}
            {update.releaseAt
              ? ` · planerad ${stamp(update.releaseAt)}`
              : ""}
          </p>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {live ? (
            <button
              type="button"
              disabled={pending}
              onClick={() => patch({ released: false, releaseAt: null })}
              className="h-7 rounded-full border border-line px-2.5 text-[11px] text-ink-soft hover:border-control-line disabled:opacity-50"
            >
              Dra tillbaka
            </button>
          ) : (
            <button
              type="button"
              disabled={pending}
              onClick={() => patch({ released: true })}
              className="h-7 rounded-full bg-accent px-2.5 text-[11px] font-semibold text-on-peach disabled:opacity-50"
            >
              Släpp nu
            </button>
          )}
          <button
            type="button"
            onClick={() => setEditing((value) => !value)}
            className="h-7 rounded-full border border-line px-2.5 text-[11px] text-ink-soft hover:border-control-line"
          >
            {editing ? "Stäng" : "Ändra"}
          </button>
        </div>
      </div>

      {update.notes ? (
        <div className="mt-2 text-[12px] text-ink-soft">
          <RichText text={update.notes} />
        </div>
      ) : null}

      {update.attachment ? (
        <a
          href={update.attachment.dataUrl}
          download={update.attachment.name}
          className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft hover:border-control-line hover:text-ink"
        >
          Bilaga: {update.attachment.name}
        </a>
      ) : null}

      {update.asksAnswer ? (
        <details className="mt-2.5 rounded-lg border border-line-soft bg-card px-3 py-2">
          <summary className="cursor-pointer text-[11.5px] text-ink-soft">
            Elevsvar ({answers.length})
          </summary>

          {answers.length === 0 ? (
            <p className="mt-1.5 text-[11.5px] text-ink-muted">
              Ingen elev har svarat än.
            </p>
          ) : (
            <ul className="mt-2 space-y-2">
              {answers.map((answer) => (
                <li
                  key={answer.id}
                  className="rounded-md border border-line-soft bg-card-raised px-2.5 py-2"
                >
                  <p className="flex flex-wrap items-baseline justify-between gap-2 text-[11px] text-ink-muted">
                    <span className="font-medium text-ink-soft">
                      {answer.studentName}
                    </span>
                    <span>{stamp(answer.updatedAt)}</span>
                  </p>
                  <p className="mt-1 text-[12px] leading-[1.55] whitespace-pre-wrap text-ink-soft">
                    {answer.content.trim() || "(tomt svar)"}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </details>
      ) : null}

      {editing ? (
        <div className="mt-3 space-y-2 border-t border-line-soft pt-3">
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            className="h-9 w-full rounded-[10px] border border-control-line bg-card px-3 text-[12.5px] text-ink focus:border-accent focus:outline-none"
          />
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            className="min-h-[90px] w-full rounded-[10px] border border-control-line bg-card px-3 py-2 text-[12.5px] text-ink focus:border-accent focus:outline-none"
          />
          <label className="block text-[11.5px] text-ink-soft">
            Släpps
            <input
              type="datetime-local"
              value={releaseAt}
              onChange={(event) => setReleaseAt(event.target.value)}
              className="mt-1 h-9 w-full max-w-[260px] rounded-[10px] border border-control-line bg-card px-3 text-[12.5px] text-ink focus:border-accent focus:outline-none"
            />
          </label>

          {error ? <p className="text-[11.5px] text-accent">{error}</p> : null}

          <button
            type="button"
            disabled={pending}
            onClick={() =>
              patch({
                title,
                notes,
                releaseAt: releaseAt ? new Date(releaseAt).toISOString() : null,
              })
            }
            className="h-8 rounded-full bg-accent px-3.5 text-[12px] font-semibold text-on-peach disabled:opacity-50"
          >
            {pending ? "Sparar…" : "Spara ändringar"}
          </button>
        </div>
      ) : null}
    </li>
  );
}

export function BugRow({ bug }: { bug: Bug }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function toggle() {
    setPending(true);
    await fetch("/api/admin/bugs", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: bug.id, fixed: !bug.fixed }),
    }).catch(() => undefined);
    setPending(false);
    router.refresh();
  }

  return (
    <li className="flex flex-wrap items-start justify-between gap-3 rounded-xl border border-line-soft bg-card-raised px-3.5 py-3">
      <div className="min-w-0">
        <p className="text-[12.5px] leading-[1.5] text-ink">{bug.message}</p>
        <p className="mt-0.5 text-[11px] text-ink-muted">
          {bug.username} · {bug.path || "okänd sida"} ·{" "}
          {new Date(bug.at).toLocaleString("sv-SE", {
            dateStyle: "short",
            timeStyle: "short",
          })}
        </p>
      </div>
      <button
        type="button"
        onClick={toggle}
        disabled={pending}
        className={
          bug.fixed
            ? "h-7 shrink-0 rounded-full border border-line px-2.5 text-[11px] text-ink-muted disabled:opacity-50"
            : "h-7 shrink-0 rounded-full bg-accent px-2.5 text-[11px] font-semibold text-on-peach disabled:opacity-50"
        }
      >
        {bug.fixed ? "Öppna igen" : "Markera fixad"}
      </button>
    </li>
  );
}
