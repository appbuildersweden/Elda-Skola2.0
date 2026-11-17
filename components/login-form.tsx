"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function LoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (pending) return;

    setPending(true);
    setError(null);

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data?.error ?? "Kunde inte logga in.");
        return;
      }

      router.replace(data.role === "admin" ? "/admin" : "/");
      router.refresh();
    } catch {
      setError("Kunde inte nå servern. Försök igen.");
    } finally {
      setPending(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div>
        <label
          htmlFor="username"
          className="block text-[12px] font-medium text-ink-soft"
        >
          Användarnamn
        </label>
        <input
          id="username"
          name="username"
          autoComplete="username"
          autoCapitalize="none"
          spellCheck={false}
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-[10px] border border-control-line bg-card-raised px-3 text-[14px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          placeholder="t.ex. ella.lind"
          required
        />
      </div>

      <div>
        <label
          htmlFor="password"
          className="block text-[12px] font-medium text-ink-soft"
        >
          Lösenord
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          className="mt-1.5 h-11 w-full rounded-[10px] border border-control-line bg-card-raised px-3 text-[14px] text-ink placeholder:text-ink-muted focus:border-accent focus:outline-none"
          placeholder="Ditt lösenord"
          required
        />
      </div>

      {error ? (
        <p role="alert" className="text-[12.5px] text-accent">
          {error}
        </p>
      ) : null}

      <button
        type="submit"
        disabled={pending}
        className="h-11 w-full rounded-full bg-accent text-[13px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-60"
      >
        {pending ? "Loggar in…" : "Logga in"}
      </button>

      <p className="text-[11.5px] leading-[1.6] text-ink-muted">
        Konton skapas av skolan. Det går inte att registrera sig själv — har du
        inget konto, kontakta din lärare eller admin.
      </p>
    </form>
  );
}
