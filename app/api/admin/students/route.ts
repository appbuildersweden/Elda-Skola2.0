import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/guard";
import { hashPassword } from "@/lib/auth";
import { readDb, updateDb } from "@/lib/db";

const USERNAME = /^[a-z0-9._-]{3,32}$/;

export async function POST(request: Request) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Endast admin." }, { status: 403 });
  }

  let body: { username?: string; name?: string; password?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const username = String(body?.username ?? "").trim().toLowerCase();
  const name = String(body?.name ?? "").trim();
  const password = String(body?.password ?? "");

  if (!USERNAME.test(username)) {
    return NextResponse.json(
      {
        error:
          "Användarnamn: 3–32 tecken, bara a–z, 0–9, punkt, bindestreck eller understreck.",
      },
      { status: 400 },
    );
  }

  if (name.length < 1 || name.length > 60) {
    return NextResponse.json({ error: "Ange elevens namn." }, { status: 400 });
  }

  if (password.length < 8) {
    return NextResponse.json(
      { error: "Lösenordet måste vara minst 8 tecken." },
      { status: 400 },
    );
  }

  const db = await readDb();

  if (username === db.admin.username.toLowerCase()) {
    return NextResponse.json(
      { error: "Användarnamnet är upptaget." },
      { status: 409 },
    );
  }

  if (db.students.some((item) => item.username.toLowerCase() === username)) {
    return NextResponse.json(
      { error: "Användarnamnet finns redan." },
      { status: 409 },
    );
  }

  const student = {
    id: randomUUID(),
    username,
    name,
    passwordHash: hashPassword(password),
    createdAt: new Date().toISOString(),
    lastSeen: null,
  };

  await updateDb((local) => {
    local.students.push(student);
  });

  return NextResponse.json({
    ok: true,
    student: { id: student.id, username, name },
  });
}
