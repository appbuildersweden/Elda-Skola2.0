import { randomUUID } from "node:crypto";
import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { limit, updateDb } from "@/lib/db";

export async function POST(request: Request) {
  let body: { message?: string; path?: string };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const message = String(body?.message ?? "").trim().slice(0, 500);
  if (message.length === 0) {
    return NextResponse.json({ error: "Tomt fel." }, { status: 400 });
  }

  const session = await getSession();
  const path = String(body?.path ?? "").slice(0, 200);

  await updateDb((db) => {
    db.bugs = limit(
      [
        ...db.bugs,
        {
          id: randomUUID(),
          message,
          path,
          username: session?.username ?? "utloggad",
          at: new Date().toISOString(),
          fixed: false,
        },
      ],
      200,
    );
  });

  return NextResponse.json({ ok: true });
}
