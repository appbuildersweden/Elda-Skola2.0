import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { setSessionCookie, verifyPassword } from "@/lib/auth";
import { limit, readDb, updateDb } from "@/lib/db";

const MAX_ATTEMPTS = 6;
const WINDOW = 10 * 60 * 1000;

const attempts = new Map<string, { count: number; until: number }>();

export async function POST(request: Request) {
  let body: { username?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const username = String(body?.username ?? "").trim().toLowerCase();
  const password = String(body?.password ?? "");

  if (!username || !password) {
    return NextResponse.json(
      { error: "Fyll i användarnamn och lösenord." },
      { status: 400 },
    );
  }

  const now = Date.now();
  const record = attempts.get(username);
  if (record && record.until > now && record.count >= MAX_ATTEMPTS) {
    return NextResponse.json(
      { error: "För många försök. Vänta några minuter och försök igen." },
      { status: 429 },
    );
  }

  const db = await readDb();
  const isAdmin = username === db.admin.username.toLowerCase();
  const student = db.students.find(
    (item) => item.username.toLowerCase() === username,
  );
  const stored = isAdmin ? db.admin.passwordHash : student?.passwordHash;
  const ok = Boolean(stored) && verifyPassword(password, stored as string);

  const at = new Date().toISOString();

  await updateDb((local) => {
    local.logins = limit(
      [
        ...local.logins,
        {
          id: randomUUID(),
          username,
          role: isAdmin ? "admin" : student ? "student" : "okänd",
          ok,
          at,
        } as const,
      ],
      300,
    );

    if (ok && student) {
      const found = local.students.find((item) => item.id === student.id);
      if (found) found.lastSeen = at;
    }
  });

  if (!ok) {
    const current = attempts.get(username);
    attempts.set(
      username,
      current && current.until > now
        ? { count: current.count + 1, until: current.until }
        : { count: 1, until: now + WINDOW },
    );

    return NextResponse.json(
      { error: "Fel användarnamn eller lösenord." },
      { status: 401 },
    );
  }

  attempts.delete(username);

  await setSessionCookie({
    sub: isAdmin ? "admin" : (student?.id as string),
    username,
    name: isAdmin ? "Admin" : (student?.name as string),
    role: isAdmin ? "admin" : "student",
  });

  return NextResponse.json({ ok: true, role: isAdmin ? "admin" : "student" });
}
