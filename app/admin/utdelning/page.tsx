import { CreateTaskForm } from "@/components/admin/forms";
import UpdateComposer from "@/components/admin/update-composer";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function UtdelningPage() {
  const db = await readDb();

  const students = db.students.map((student) => ({
    id: student.id,
    name: student.name,
    username: student.username,
  }));

  const nameById = new Map(students.map((student) => [student.id, student.name]));

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Utdelning
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Skriv ett utskick, bifoga filer, välj elever och dela ut. Det hamnar i
          kön under Hantering tills du släpper det.
        </p>
      </div>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Ny uppdatering
        </h2>
        <UpdateComposer students={students} />
      </section>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Ny uppgift
        </h2>
        <CreateTaskForm students={students} />
      </section>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Utdelat ({db.tasks.length})
        </h2>

        {db.tasks.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inga uppgifter utdelade än.
          </p>
        ) : (
          <ul className="space-y-2">
            {[...db.tasks].reverse().map((task) => (
              <li
                key={task.id}
                className="rounded-xl border border-line-soft bg-card-raised px-3.5 py-3"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <p className="text-[13px] font-medium text-ink">
                    {task.title}
                  </p>
                  <span className="text-[11px] text-ink-muted">
                    {task.studentIds
                      .map((id) => nameById.get(id) ?? "okänd")
                      .join(", ")}
                  </span>
                </div>
                {task.description ? (
                  <p className="mt-1 text-[12px] leading-[1.55] whitespace-pre-wrap text-ink-soft">
                    {task.description}
                  </p>
                ) : null}
                {task.dueAt ? (
                  <p className="mt-1 text-[11px] text-ink-muted">
                    Klart senast{" "}
                    {new Date(task.dueAt).toLocaleDateString("sv-SE")}
                  </p>
                ) : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
