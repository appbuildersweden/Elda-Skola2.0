import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { studentGuard } from "@/lib/guard";
import { limit, updateDb } from "@/lib/db";

export async function POST(request: Request) {
  const session = await studentGuard();
  if (!session) {
    return NextResponse.json({ error: "Inte inloggad." }, { status: 401 });
  }

  let body: { score?: number; total?: number };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const score = Math.round(Number(body?.score));
  const total = Math.round(Number(body?.total));

  if (!Number.isFinite(score) || !Number.isFinite(total) || total <= 0) {
    return NextResponse.json({ error: "Ogiltigt resultat." }, { status: 400 });
  }

  const at = new Date().toISOString();

  await updateDb((db) => {
    db.submissions = limit(
      [
        ...db.submissions,
        { id: randomUUID(), studentId: session.sub, score, total, at },
      ],
      500,
    );
  });

  return NextResponse.json({ ok: true });
}
