import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { studentGuard } from "@/lib/guard";
import { limit, updateDb } from "@/lib/db";

export async function POST(request: Request) {
  const session = await studentGuard();
  if (!session) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }

  let body: { path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const path = String(body?.path ?? "").slice(0, 200);
  if (!path.startsWith("/")) {
    return NextResponse.json({ error: "Ogiltig sida." }, { status: 400 });
  }

  const at = new Date().toISOString();

  await updateDb((db) => {
    db.activity = limit(
      [...db.activity, { id: randomUUID(), studentId: session.sub, path, at }],
      400,
    );

    const student = db.students.find((item) => item.id === session.sub);
    if (student) student.lastSeen = at;
  });

  return NextResponse.json({ ok: true });
}
