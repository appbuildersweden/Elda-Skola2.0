import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/guard";
import { readDb, updateDb, type Attachment } from "@/lib/db";

const MAX_FILE = 2_000_000;

function clean(value: unknown, max: number): string {
  return String(value ?? "").trim().slice(0, max);
}

function readAttachment(value: unknown): Attachment | null | "invalid" {
  if (!value) return null;
  const raw = value as Partial<Attachment>;
  const name = clean(raw.name, 120);
  const type = clean(raw.type, 100);
  const dataUrl = typeof raw.dataUrl === "string" ? raw.dataUrl : "";
  const size = Number(raw.size);

  if (!name || !dataUrl.startsWith("data:")) return "invalid";
  if (!Number.isFinite(size) || size > MAX_FILE) return "invalid";

  return {
    name,
    type: type || "application/octet-stream",
    size,
    dataUrl,
  };
}

export async function POST(request: Request) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Endast admin." }, { status: 403 });
  }

  let body: {
    title?: string;
    notes?: string;
    releaseAt?: string | null;
    studentIds?: string[];
    asksAnswer?: boolean;
    attachment?: unknown;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const title = clean(body?.title, 100);
  const notes = clean(body?.notes, 4000);
  const releaseAt = body?.releaseAt ? String(body.releaseAt) : null;
  const asksAnswer = Boolean(body?.asksAnswer);

  if (title.length < 2) {
    return NextResponse.json(
      { error: "Uppdateringen behöver en titel." },
      { status: 400 },
    );
  }

  const attachment = readAttachment(body?.attachment);
  if (attachment === "invalid") {
    return NextResponse.json(
      { error: "Bilagan är för stor (max 2 MB) eller kunde inte läsas." },
      { status: 400 },
    );
  }

  const db = await readDb();
  const requested = Array.isArray(body?.studentIds)
    ? body.studentIds.filter((id): id is string => typeof id === "string")
    : [];

  const studentIds = requested.filter((id) =>
    db.students.some((student) => student.id === id),
  );

  await updateDb((local) => {
    local.updates.push({
      id: randomUUID(),
      title,
      notes,
      releaseAt,
      released: false,
      createdAt: new Date().toISOString(),
      studentIds,
      asksAnswer,
      attachment,
    });
  });

  return NextResponse.json({ ok: true });
}

export async function PATCH(request: Request) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Endast admin." }, { status: 403 });
  }

  let body: {
    id?: string;
    title?: string;
    notes?: string;
    releaseAt?: string | null;
    released?: boolean;
    studentIds?: string[];
    asksAnswer?: boolean;
  };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const id = clean(body?.id, 64);
  if (!id) {
    return NextResponse.json({ error: "Okänd uppdatering." }, { status: 400 });
  }

  const result = await updateDb((db) => {
    const update = db.updates.find((item) => item.id === id);
    if (!update) return null;

    if (typeof body.title === "string") {
      const title = clean(body.title, 100);
      if (title.length >= 2) update.title = title;
    }
    if (typeof body.notes === "string") update.notes = clean(body.notes, 4000);
    if (body.releaseAt !== undefined) {
      update.releaseAt = body.releaseAt ? String(body.releaseAt) : null;
    }
    if (typeof body.released === "boolean") update.released = body.released;
    if (typeof body.asksAnswer === "boolean") {
      update.asksAnswer = body.asksAnswer;
    }
    if (Array.isArray(body.studentIds)) {
      const known = new Set(db.students.map((student) => student.id));
      update.studentIds = body.studentIds.filter(
        (studentId): studentId is string =>
          typeof studentId === "string" && known.has(studentId),
      );
    }

    return update;
  });

  if (!result) {
    return NextResponse.json(
      { error: "Uppdateringen hittades inte." },
      { status: 404 },
    );
  }

  return NextResponse.json({ ok: true });
}
