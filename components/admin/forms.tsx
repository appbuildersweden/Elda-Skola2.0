"use client";

import { useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

const field =
  "mt-1.5 h-10 w-full rounded-[10px] border border-control-line bg-card-raised px-3 text-[13px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";
const area =
  "mt-1.5 min-h-[76px] w-full rounded-[10px] border border-control-line bg-card-raised px-3 py-2 text-[13px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none";
const submit =
  "h-9 rounded-full bg-accent px-4 text-[12.5px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-50";

function useSubmit() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

  async function run(url: string, method: string, body: unknown, note: string) {
    setPending(true);
    setError(null);
    setDone(null);

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Något gick fel.");
        return false;
      }

      setDone(note);
      router.refresh();
      return true;
    } catch {
      setError("Kunde inte nå servern.");
      return false;
    } finally {
      setPending(false);
    }
  }

  return { pending, error, done, run };
}

function Feedback({
  error,
  done,
}: {
  error: string | null;
  done: string | null;
}) {
  if (error) return <p className="mt-2 text-[12px] text-accent">{error}</p>;
  if (done) return <p className="mt-2 text-[12px] text-[#6aa87c]">{done}</p>;
  return null;
}

function Label({ children }: { children: ReactNode }) {
  return (
    <span className="block text-[11.5px] font-medium text-ink-soft">
      {children}
    </span>
  );
}

export function CreateStudentForm() {
  const { pending, error, done, run } = useSubmit();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const ok = await run(
          "/api/admin/students",
          "POST",
          { username, name, password },
          "Kontot är skapat.",
        );
        if (ok) {
          setUsername("");
          setName("");
          setPassword("");
        }
      }}
      className="space-y-3"
    >
      <div className="grid gap-3 sm:grid-cols-2">
        <label>
          <Label>Namn</Label>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Ella Lind"
            className={field}
            required
          />
        </label>
        <label>
          <Label>Användarnamn</Label>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            placeholder="ella.lind"
            autoCapitalize="none"
            className={field}
            required
          />
        </label>
      </div>

      <label className="block">
        <Label>Lösenord (minst 8 tecken)</Label>
        <input
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Delas ut till eleven"
          minLength={8}
          className={field}
          required
        />
      </label>

      <Feedback error={error} done={done} />

      <button type="submit" disabled={pending} className={submit}>
        {pending ? "Skapar…" : "Skapa elevkonto"}
      </button>
    </form>
  );
}

export function CreateTaskForm({
  students,
}: {
  students: { id: string; name: string; username: string }[];
}) {
  const { pending, error, done, run } = useSubmit();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [dueAt, setDueAt] = useState("");
  const [selected, setSelected] = useState<string[]>([]);

  if (students.length === 0) {
    return (
      <p className="text-[12.5px] text-ink-muted">
        Skapa ett elevkonto först — då kan du dela ut uppgifter.
      </p>
    );
  }

  return (
    <form
      onSubmit={async (event) => {
        event.preventDefault();
        const ok = await run(
          "/api/admin/tasks",
          "POST",
          {
            title,
            description,
            dueAt: dueAt ? new Date(dueAt).toISOString() : null,
            studentIds: selected,
          },
          "Uppgiften är utdelad.",
        );
        if (ok) {
          setTitle("");
          setDescription("");
          setDueAt("");
          setSelected([]);
        }
      }}
      className="space-y-3"
    >
      <label className="block">
        <Label>Titel</Label>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Bråk – addition"
          className={field}
          required
        />
      </label>

      <label className="block">
        <Label>Beskrivning</Label>
        <textarea
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Vad eleven ska göra"
          className={area}
        />
      </label>

      <label className="block sm:max-w-[260px]">
        <Label>Klart senast (valfritt)</Label>
        <input
          type="date"
          value={dueAt}
          onChange={(event) => setDueAt(event.target.value)}
          className={field}
        />
      </label>

      <fieldset>
        <legend className="text-[11.5px] font-medium text-ink-soft">
          Dela ut till
        </legend>
        <div className="mt-2 flex flex-wrap gap-1.5">
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
          <button
            type="button"
            onClick={() =>
              setSelected(
                selected.length === students.length
                  ? []
                  : students.map((student) => student.id),
              )
            }
            className="rounded-full border border-dashed border-line px-3 py-1 text-[12px] text-ink-muted"
          >
            {selected.length === students.length ? "Rensa" : "Alla"}
          </button>
        </div>
      </fieldset>

      <Feedback error={error} done={done} />

      <button type="submit" disabled={pending} className={submit}>
        {pending ? "Delar ut…" : "Dela ut uppgift"}
      </button>
    </form>
  );
}
