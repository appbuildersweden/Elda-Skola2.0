"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import RichText from "@/components/rich-text";
import { CloseIcon, PaperclipIcon } from "@/components/icons";

type Student = { id: string; name: string; username: string };
type Attachment = { name: string; type: string; size: number; dataUrl: string };

const MAX_FILE = 2_000_000;

const field =
  "mt-1.5 h-10 w-full rounded-[10px] border border-control-line bg-card-raised px-3 text-[13px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";

function kilobytes(bytes: number) {
  return `${Math.max(1, Math.round(bytes / 1024))} kB`;
}

export default function UpdateComposer({ students }: { students: Student[] }) {
  const router = useRouter();
  const areaRef = useRef<HTMLTextAreaElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [attachment, setAttachment] = useState<Attachment | null>(null);
  const [asksAnswer, setAsksAnswer] = useState(false);
  const [selected, setSelected] = useState<string[]>([]);
  const [releaseAt, setReleaseAt] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  function wrap(before: string, after = before) {
    const area = areaRef.current;
    if (!area) return;

    const start = area.selectionStart;
    const end = area.selectionEnd;
    const value = area.value;
    const next = `${value.slice(0, start)}${before}${value.slice(start, end)}${after}${value.slice(end)}`;

    setNotes(next);
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(start + before.length, end + before.length);
    });
  }

  function prefix(marker: string) {
    const area = areaRef.current;
    if (!area) return;

    const start = area.selectionStart;
    const value = area.value;
    const lineStart = value.lastIndexOf("\n", start - 1) + 1;
    const next = `${value.slice(0, lineStart)}${marker}${value.slice(lineStart)}`;

    setNotes(next);
    requestAnimationFrame(() => {
      area.focus();
      area.setSelectionRange(start + marker.length, start + marker.length);
    });
  }

  async function attach(file: File | undefined) {
    if (!file) return;

    setError(null);

    if (file.size > MAX_FILE) {
      setError("Filen är för stor. Max 2 MB.");
      return;
    }

    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result));
      reader.onerror = () => reject(new Error("läsning misslyckades"));
      reader.readAsDataURL(file);
    }).catch(() => null);

    if (!dataUrl) {
      setError("Kunde inte läsa filen.");
      return;
    }

    setAttachment({
      name: file.name,
      type: file.type || "application/octet-stream",
      size: file.size,
      dataUrl,
    });
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);
    setDone(null);

    try {
      const response = await fetch("/api/admin/updates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title,
          notes,
          releaseAt: releaseAt ? new Date(releaseAt).toISOString() : null,
          studentIds: selected,
          asksAnswer,
          attachment,
        }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Något gick fel.");
        return;
      }

      setDone("Sparad — ligger i kön \"Att släppa\".");
      setTitle("");
      setNotes("");
      setAttachment(null);
      setAsksAnswer(false);
      setSelected([]);
      setReleaseAt("");
      router.refresh();
    } catch {
      setError("Kunde inte nå servern.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <label className="block">
        <span className="block text-[11.5px] font-medium text-ink-soft">
          Titel
        </span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Ny övning i bråkräkning"
          className={field}
          required
        />
      </label>

      <div>
        <span className="block text-[11.5px] font-medium text-ink-soft">
          Text
        </span>

        <div className="mt-1.5 overflow-hidden rounded-[12px] border border-control-line bg-card-raised focus-within:border-accent">
          <div className="flex items-center gap-1 border-b border-line-soft px-2 py-1.5">
            {[
              { label: "B", title: "Fet", run: () => wrap("**") },
              { label: "I", title: "Kursiv", run: () => wrap("*") },
              { label: "H2", title: "Rubrik", run: () => prefix("## ") },
              { label: "•", title: "Punktlista", run: () => prefix("- ") },
              { label: "1.", title: "Numrerad lista", run: () => prefix("1. ") },
            ].map((tool) => (
              <button
                key={tool.label}
                type="button"
                onClick={tool.run}
                title={tool.title}
                aria-label={tool.title}
                className="flex size-7 items-center justify-center rounded-md text-[12px] text-ink-soft transition-colors duration-150 hover:bg-card hover:text-ink"
              >
                {tool.label}
              </button>
            ))}

            <span className="mx-1 h-4 w-px bg-line" />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="flex h-7 items-center gap-1.5 rounded-md px-2 text-[11.5px] text-ink-soft transition-colors duration-150 hover:bg-card hover:text-ink"
            >
              <PaperclipIcon className="size-3.5" />
              Bifoga fil
            </button>

            {attachment ? (
              <span className="ml-auto flex max-w-[220px] items-center gap-1.5 rounded-full border border-line bg-card py-0.5 pr-1 pl-2 text-[11px] text-ink-soft">
                <span className="truncate">{attachment.name}</span>
                <span className="shrink-0 text-ink-muted">
                  {kilobytes(attachment.size)}
                </span>
                <button
                  type="button"
                  onClick={() => setAttachment(null)}
                  aria-label="Ta bort bilaga"
                  className="flex size-4 items-center justify-center rounded-full text-ink-muted hover:bg-line hover:text-ink"
                >
                  <CloseIcon className="size-2.5" />
                </button>
              </span>
            ) : null}
          </div>

          <textarea
            ref={areaRef}
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={"Skriv texten här. Använd B, I, H2 och listknapparna ovan."}
            className="min-h-[132px] w-full resize-y bg-transparent px-3 py-2.5 text-[13px] leading-[1.6] text-ink placeholder:text-ink-muted focus:outline-none"
          />
        </div>

        <input
          ref={fileRef}
          type="file"
          className="hidden"
          onChange={(event) => {
            void attach(event.target.files?.[0]);
            event.target.value = "";
          }}
        />
      </div>

      {notes.trim().length > 0 ? (
        <div className="rounded-[12px] border border-line-soft bg-card px-3.5 py-3">
          <p className="mb-1.5 text-[10.5px] tracking-wide text-ink-muted uppercase">
            Förhandsvisning
          </p>
          <div className="text-[12.5px] text-ink-soft">
            <RichText text={notes} />
          </div>
        </div>
      ) : null}

      <label className="flex items-start gap-2.5 rounded-[12px] border border-line bg-card-raised px-3.5 py-2.5">
        <input
          type="checkbox"
          checked={asksAnswer}
          onChange={(event) => setAsksAnswer(event.target.checked)}
          className="mt-0.5 size-4 accent-[#f4792f]"
        />
        <span>
          <span className="block text-[12.5px] font-medium text-ink">
            Eleven svarar i ett eget dokument
          </span>
          <span className="block text-[11.5px] text-ink-muted">
            Varje elev får ett eget textfält. Du läser svaren här i panelen.
          </span>
        </span>
      </label>

      <fieldset>
        <legend className="text-[11.5px] font-medium text-ink-soft">
          Dela ut till
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
          <button
            type="button"
            onClick={() => setSelected([])}
            className={
              selected.length === 0
                ? "rounded-full border border-accent bg-accent-soft px-3 py-1 text-[12px] text-ink"
                : "rounded-full border border-line px-3 py-1 text-[12px] text-ink-soft hover:border-control-line"
            }
          >
            Alla elever
          </button>

          {students.map((student) => {
            const active = selected.includes(student.id);
            return (
              <button
                key={student.id}
                type="button"
                onClick={() =>
                  setSelected(
                    active
                      ? selected.filter((id) => id !== student.id)
                      : [...selected, student.id],
                  )
                }
                className={
                  active
                    ? "rounded-full border border-accent bg-accent-soft px-3 py-1 text-[12px] text-ink"
                    : "rounded-full border border-line px-3 py-1 text-[12px] text-ink-soft hover:border-control-line"
                }
              >
                {student.name}
              </button>
            );
          })}
        </div>
      </fieldset>

      <label className="block sm:max-w-[280px]">
        <span className="block text-[11.5px] font-medium text-ink-soft">
          Släpps automatiskt (valfritt)
        </span>
        <input
          type="datetime-local"
          value={releaseAt}
          onChange={(event) => setReleaseAt(event.target.value)}
          className={field}
        />
      </label>

      {error ? <p className="text-[12px] text-accent">{error}</p> : null}
      {done ? <p className="text-[12px] text-[#6aa87c]">{done}</p> : null}

      <button
        type="submit"
        disabled={pending}
        className="h-9 rounded-full bg-accent px-4 text-[12.5px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-50"
      >
        {pending ? "Sparar…" : "Skapa uppdatering"}
      </button>
    </form>
  );
}
