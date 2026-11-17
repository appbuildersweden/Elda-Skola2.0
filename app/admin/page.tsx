import Link from "next/link";
import { readDb } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

function live(releaseAt: string | null, released: boolean) {
  if (released) return true;
  return releaseAt ? new Date(releaseAt).getTime() <= Date.now() : false;
}

export default async function AdminHome() {
  const session = await getSession();
  const db = await readDb();

  const cards = [
    {
      href: "/admin/utdelning",
      label: "Utdelning",
      value: db.tasks.length,
      hint: "utdelade uppgifter",
    },
    {
      href: "/admin/hantering",
      label: "Hantering",
      value: `${db.updates.filter((update) => live(update.releaseAt, update.released)).length}/${db.updates.length}`,
      hint: "släppta av totalt",
    },
    {
      href: "/admin/elever",
      label: "Elever",
      value: db.students.length,
      hint: "konton",
    },
    {
      href: "/admin/kontroll",
      label: "Kontroll",
      value: db.submissions.length,
      hint: "inlämnade pass",
    },
    {
      href: "/admin/se-efter",
      label: "Se efter",
      value: db.bugs.filter((bug) => !bug.fixed).length,
      hint: "öppna buggar",
    },
  ];

  return (
    <div className="space-y-5">
      <div>
        <p className="text-[11px] font-medium tracking-[0.18em] text-ink-muted uppercase">
          Adminpanel
        </p>
        <h1 className="mt-1 text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Hej {session?.username}
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Allt du styr över i skolan, på ett ställe.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.href}
            href={card.href}
            className="rounded-[16px] border border-line bg-card p-4 transition-colors duration-150 hover:border-control-line"
          >
            <p className="text-[12px] text-ink-muted">{card.label}</p>
            <p className="mt-1.5 text-[26px] leading-none font-semibold text-ink tabular-nums">
              {card.value}
            </p>
            <p className="mt-1.5 text-[11.5px] text-ink-muted">{card.hint}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
