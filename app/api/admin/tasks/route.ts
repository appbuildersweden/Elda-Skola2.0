import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/guard";
import { readDb, updateDb } from "@/lib/db";

export async function POST(request: Request) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Endast admin." }, { status: 403 });
  }

  let body: {
    title?: string;
    description?: string;
    dueAt?: string | null;
    studentIds?: string[];
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const title = String(body?.title ?? "").trim();
  const description = String(body?.description ?? "").trim();
  const dueAt = body?.dueAt ? String(body.dueAt) : null;
  const studentIds = Array.isArray(body?.studentIds)
    ? body.studentIds.filter((id): id is string => typeof id === "string")
    : [];

  if (title.length < 2 || title.length > 100) {
    return NextResponse.json(
      { error: "Uppgiften behöver en titel (2–100 tecken)." },
      { status: 400 },
    );
  }

  if (studentIds.length === 0) {
    return NextResponse.json(
      { error: "Välj minst en elev." },
      { status: 400 },
    );
  }

  const db = await readDb();
  const valid = studentIds.filter((id) =>
    db.students.some((student) => student.id === id),
  );

  if (valid.length === 0) {
    return NextResponse.json({ error: "Okända elever." }, { status: 400 });
  }

  await updateDb((local) => {
    local.tasks.push({
      id: randomUUID(),
      title,
      description,
      dueAt,
      studentIds: valid,
      createdAt: new Date().toISOString(),
    });
  });

  return NextResponse.json({ ok: true });
}
