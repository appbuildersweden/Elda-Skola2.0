import { UpdateRow } from "@/components/admin/controls";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function isLive(releaseAt: string | null, released: boolean) {
  if (released) return true;
  return releaseAt ? new Date(releaseAt).getTime() <= Date.now() : false;
}

export default async function HanteringPage() {
  const db = await readDb();

  const nameById = new Map(
    db.students.map((student) => [student.id, student.name]),
  );

  const pending = db.updates
    .filter((update) => !isLive(update.releaseAt, update.released))
    .reverse();
  const live = db.updates
    .filter((update) => isLive(update.releaseAt, update.released))
    .reverse();

  function recipients(studentIds: string[]) {
    if (studentIds.length === 0) return "Alla elever";
    return studentIds.map((id) => nameById.get(id) ?? "okänd").join(", ");
  }

  function answersFor(updateId: string) {
    return db.answers
      .filter((answer) => answer.updateId === updateId)
      .map((answer) => ({
        ...answer,
        studentName: nameById.get(answer.studentId) ?? "okänd elev",
      }));
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Hantering
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Allt du delat ut ligger här. Släpp det nu eller på ett datum, ändra
          texten och läs elevernas svar.
        </p>
      </div>

      <section className="rounded-[16px] border border-accent/40 bg-card p-4">
        <div className="mb-3 flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-[14px] font-semibold text-ink">
            Att släppa ({pending.length})
          </h2>
          <span className="text-[11.5px] text-ink-muted">
            Bara du ser dessa tills de släpps
          </span>
        </div>

        {pending.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inget väntar på släpp. Dela ut en uppdatering under Utdelning så
            dyker den upp här.
          </p>
        ) : (
          <ul className="space-y-2">
            {pending.map((update) => (
              <UpdateRow
                key={update.id}
                update={update}
                recipients={recipients(update.studentIds)}
                answers={answersFor(update.id)}
              />
            ))}
          </ul>
        )}
      </section>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Släppta ({live.length})
        </h2>

        {live.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inga uppdateringar är släppta än.
          </p>
        ) : (
          <ul className="space-y-2">
            {live.map((update) => (
              <UpdateRow
                key={update.id}
                update={update}
                recipients={recipients(update.studentIds)}
                answers={answersFor(update.id)}
              />
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
