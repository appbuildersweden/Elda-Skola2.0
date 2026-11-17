"use client";

import { useEffect, useRef, useState } from "react";
import ArtifactPreview from "@/components/artifact-preview";
import RichText from "@/components/rich-text";
import { useFocusTimer } from "@/components/focus-timer-context";
import { CloseIcon, PaperclipIcon } from "@/components/icons";
import type { Artifact, ArtifactFormat } from "@/lib/artifacts";

type Message = {
  role: "user" | "assistant";
  content: string;
  files?: string[];
  artifact?: Artifact;
};

type Attachment = { name: string; text: string };

const NOT_ANSWERED =
  "Jag kan inte svara på den frågan just nu. Försök gärna igen, eller fråga din lärare om det är brådskande.";

const MAX_FILES = 3;
const MAX_CHARS = 20000;
const TEXT_TYPES = /\.(txt|md|markdown|csv|json|log|text)$/i;

export default function AiChat({
  persona,
  title,
  intro,
  placeholder,
  suggestions = [],
}: {
  persona: "elev" | "larare";
  title: string;
  intro: string;
  placeholder: string;
  suggestions?: { label: string; prompt: string; format?: ArtifactFormat }[];
}) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [files, setFiles] = useState<Attachment[]>([]);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const { start: startTimer } = useFocusTimer();

  useEffect(() => {
    const list = listRef.current;
    if (list) list.scrollTop = list.scrollHeight;
  }, [messages, pending]);

  async function attach(selected: FileList | null) {
    if (!selected || selected.length === 0) return;

    setError(null);
    const next: Attachment[] = [...files];

    for (const file of Array.from(selected)) {
      if (next.length >= MAX_FILES) {
        setError(`Du kan bifoga högst ${MAX_FILES} filer.`);
        break;
      }

      if (!TEXT_TYPES.test(file.name) && !file.type.startsWith("text/")) {
        setError(
          `"${file.name}" går inte att läsa. Bifoga textfiler: .txt, .md, .csv eller .json.`,
        );
        continue;
      }

      if (file.size > 200_000) {
        setError(`"${file.name}" är för stor. Max 200 kB per fil.`);
        continue;
      }

      const text = (await file.text()).slice(0, MAX_CHARS);
      if (text.trim().length === 0) {
        setError(`"${file.name}" var tom.`);
        continue;
      }

      next.push({ name: file.name, text });
    }

    setFiles(next);
  }

  async function send(
    text: string,
    attached: Attachment[] = [],
    format?: ArtifactFormat,
  ) {
    const value = text.trim();
    if ((!value && attached.length === 0) || pending) return;

    const block = attached
      .map((file) => `\n\n[Bilaga: ${file.name}]\n${file.text}`)
      .join("");

    const next: Message[] = [
      ...messages,
      {
        role: "user",
        content: value || "Läs igenom bilagan.",
        files: attached.map((file) => file.name),
      },
    ];

    const payload = [
      ...messages.map(({ role, content }) => ({ role, content })),
      { role: "user" as const, content: `${value}${block}`.trim() },
    ];

    setMessages(next);
    setInput("");
    setFiles([]);
    setError(null);
    setPending(true);

    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ persona, messages: payload, format }),
      });
      const data = await response.json();

      if (!response.ok || !data?.reply) {
        setMessages([
          ...next,
          { role: "assistant", content: NOT_ANSWERED },
        ]);
        setError(data?.error ?? "Något gick fel.");
        return;
      }

      const artifact: Artifact | undefined = data.artifact;

      setMessages([
        ...next,
        { role: "assistant", content: data.reply, artifact },
      ]);

      if (artifact?.kind === "timer") {
        startTimer(artifact.minutes, artifact.title);
      }
    } catch {
      setMessages([...next, { role: "assistant", content: NOT_ANSWERED }]);
      setError("Kunde inte nå AI-tjänsten. Försök igen om en stund.");
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="flex min-h-[440px] flex-col rounded-[18px] border border-line bg-card p-5">
      <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
        {title}
      </h2>

      <div
        ref={listRef}
        aria-live="polite"
        className="mt-4 flex-1 space-y-3 overflow-y-auto overscroll-contain pr-1"
      >
        {messages.length === 0 ? (
          <p className="max-w-[52ch] text-[12.5px] leading-[1.6] text-ink-muted">
            {intro}
          </p>
        ) : null}

        {messages.map((message, index) => (
          <div
            key={index}
            className={message.role === "user" ? "flex flex-col items-end" : ""}
          >
            {message.role === "user" ? (
              <p className="ml-auto w-fit max-w-[85%] rounded-2xl rounded-br-md bg-accent px-3.5 py-2 text-[13px] leading-[1.5] whitespace-pre-wrap text-on-peach">
                {message.content}
              </p>
            ) : (
              <div
                className={
                  message.artifact
                    ? "w-full max-w-[560px]"
                    : "mr-auto w-fit max-w-[92%]"
                }
              >
                <div className="rounded-2xl rounded-bl-md border border-line bg-card-raised px-3.5 py-2.5 text-[13px] text-ink-soft">
                  <RichText text={message.content} />
                </div>
                {message.artifact ? (
                  <ArtifactPreview artifact={message.artifact} />
                ) : null}
              </div>
            )}

            {message.files && message.files.length > 0 ? (
              <p className="mt-1 flex flex-wrap justify-end gap-1.5">
                {message.files.map((name) => (
                  <span
                    key={name}
                    className="flex items-center gap-1 rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-muted"
                  >
                    <PaperclipIcon className="size-3" />
                    {name}
                  </span>
                ))}
              </p>
            ) : null}
          </div>
        ))}

        {pending ? (
          <p className="mr-auto w-fit rounded-2xl rounded-bl-md border border-line bg-card-raised px-3.5 py-2 text-[12.5px] text-ink-muted">
            Skriver…
          </p>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-3 text-[12px] text-accent">
          {error}
        </p>
      ) : null}

      {suggestions.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1.5">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.label}
              type="button"
              onClick={() => send(suggestion.prompt, files, suggestion.format)}
              disabled={pending}
              className="rounded-full border border-line px-3 py-1.5 text-[12px] text-ink-soft transition-colors duration-150 hover:bg-card-raised hover:text-ink disabled:opacity-50"
            >
              {suggestion.label}
            </button>
          ))}
        </div>
      ) : null}

      {files.length > 0 ? (
        <ul className="mt-3 flex flex-wrap gap-1.5">
          {files.map((file) => (
            <li
              key={file.name}
              className="flex items-center gap-1.5 rounded-full border border-line bg-card-raised py-1 pr-1.5 pl-2.5 text-[11.5px] text-ink-soft"
            >
              <PaperclipIcon className="size-3 text-ink-muted" />
              <span className="max-w-[24ch] truncate">{file.name}</span>
              <button
                type="button"
                onClick={() =>
                  setFiles(files.filter((item) => item.name !== file.name))
                }
                aria-label={`Ta bort ${file.name}`}
                className="flex size-5 items-center justify-center rounded-full text-ink-muted transition-colors duration-150 hover:bg-line hover:text-ink"
              >
                <CloseIcon className="size-3" />
              </button>
            </li>
          ))}
        </ul>
      ) : null}

      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input, files);
        }}
        className="mt-3 flex items-center gap-2 border-t border-line-soft pt-3"
      >
        <input
          ref={fileRef}
          type="file"
          multiple
          accept=".txt,.md,.markdown,.csv,.json,.log,text/plain"
          className="hidden"
          onChange={(event) => {
            void attach(event.target.files);
            event.target.value = "";
          }}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={pending}
          aria-label="Bifoga fil"
          title="Bifoga textfil (.txt, .md, .csv, .json)"
          className="flex size-10 shrink-0 items-center justify-center rounded-[10px] border border-control-line text-ink-soft transition-colors duration-150 hover:bg-card-raised hover:text-ink disabled:opacity-40"
        >
          <PaperclipIcon className="size-4" />
        </button>
        <input
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={placeholder}
          aria-label={placeholder}
          className="h-10 min-w-0 flex-1 rounded-[10px] border border-control-line bg-card-raised px-3 text-base text-ink placeholder:text-ink-muted focus:outline-none sm:text-[13px]"
        />
        <button
          type="submit"
          disabled={pending || (input.trim().length === 0 && files.length === 0)}
          className="h-10 shrink-0 rounded-[10px] bg-accent px-4 text-[12.5px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-40"
        >
          Skicka
        </button>
      </form>
    </section>
  );
}
