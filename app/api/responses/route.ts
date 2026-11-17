import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { studentGuard } from "@/lib/guard";
import { updateDb } from "@/lib/db";

export async function POST(request: Request) {
  const session = await studentGuard();
  if (!session) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }

  let body: { updateId?: string; content?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const updateId = String(body?.updateId ?? "");
  const content = String(body?.content ?? "").slice(0, 20000);

  if (!updateId) {
    return NextResponse.json({ error: "Okänt dokument." }, { status: 400 });
  }

  const result = await updateDb((db) => {
    const update = db.updates.find((item) => item.id === updateId);
    if (!update || !update.asksAnswer) return "missing";

    const allowed =
      update.studentIds.length === 0 || update.studentIds.includes(session.sub);
    if (!allowed) return "forbidden";

    const at = new Date().toISOString();
    const existing = db.answers.find(
      (answer) =>
        answer.updateId === updateId && answer.studentId === session.sub,
    );

    if (existing) {
      existing.content = content;
      existing.updatedAt = at;
    } else {
      db.answers.push({
        id: randomUUID(),
        updateId,
        studentId: session.sub,
        content,
        updatedAt: at,
      });
    }

    return at;
  });

  if (result === "missing") {
    return NextResponse.json(
      { error: "Dokumentet finns inte." },
      { status: 404 },
    );
  }

  if (result === "forbidden") {
    return NextResponse.json(
      { error: "Dokumentet är inte utdelat till dig." },
      { status: 403 },
    );
  }

  return NextResponse.json({ ok: true, savedAt: result });
}
