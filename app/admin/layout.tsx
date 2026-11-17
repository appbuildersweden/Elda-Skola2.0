import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import AdminNav from "@/components/admin/admin-nav";
import LogoutButton from "@/components/logout-button";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";

export const metadata = { title: "Admin · Elda Skola 2.0" };

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "admin") redirect("/");

  const db = await readDb();
  const pendingUpdates = db.updates.filter(
    (update) =>
      !update.released &&
      !(update.releaseAt && new Date(update.releaseAt).getTime() <= Date.now()),
  ).length;
  const openBugs = db.bugs.filter((bug) => !bug.fixed).length;

  return (
    <div className="flex min-h-dvh flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-line bg-panel px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:justify-between lg:gap-6 lg:border-r lg:border-b-0 lg:px-4 lg:py-5">
        <div className="flex flex-col gap-5">
          <Link href="/admin" className="flex items-center gap-2.5 rounded-lg px-1">
            <Image
              src="/elda-logo.png"
              alt="Elda Skola 2.0 logotyp"
              width={32}
              height={32}
              unoptimized
              className="size-8 shrink-0 rounded-[9px]"
            />
            <span className="font-display text-[17px] leading-none tracking-[0.01em] text-ink">
              ELDA SKOLA 2.0
            </span>
            <span className="rounded-full border border-accent px-2 py-0.5 text-[10px] font-medium text-accent">
              Admin
            </span>
          </Link>

          <AdminNav pendingUpdates={pendingUpdates} openBugs={openBugs} />
        </div>

        <div className="flex flex-col gap-2 border-t border-line-soft pt-4">
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 rounded-lg border border-line px-3 py-2 text-[12px] text-ink-soft transition-colors duration-150 hover:border-control-line hover:text-ink"
          >
            Öppna appen
          </Link>
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate font-mono text-[11px] text-ink-muted">
              {session.username}
            </span>
            <LogoutButton />
          </div>
        </div>
      </aside>

      <main className="mx-auto w-full max-w-[1180px] min-w-0 flex-1 px-4 py-5 lg:px-6 lg:py-6">
        {children}
      </main>
    </div>
  );
}
