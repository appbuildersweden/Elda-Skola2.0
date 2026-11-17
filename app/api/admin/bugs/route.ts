import { NextResponse } from "next/server";
import { adminGuard } from "@/lib/guard";
import { updateDb } from "@/lib/db";

export async function PATCH(request: Request) {
  if (!(await adminGuard())) {
    return NextResponse.json({ error: "Endast admin." }, { status: 403 });
  }

  let body: { id?: string; fixed?: boolean };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Ogiltig förfrågan." }, { status: 400 });
  }

  const id = String(body?.id ?? "");
  const fixed = Boolean(body?.fixed);

  const found = await updateDb((db) => {
    const bug = db.bugs.find((item) => item.id === id);
    if (!bug) return false;
    bug.fixed = fixed;
    return true;
  });

  if (!found) {
    return NextResponse.json({ error: "Buggen hittades inte." }, { status: 404 });
  }

  return NextResponse.json({ ok: true });
}
