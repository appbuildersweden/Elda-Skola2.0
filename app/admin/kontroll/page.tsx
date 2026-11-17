import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

function clock(value: string) {
  return new Date(value).toLocaleTimeString("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function day(value: string) {
  return new Date(value).toLocaleDateString("sv-SE", {
    day: "numeric",
    month: "short",
  });
}

export default async function KontrollPage() {
  const db = await readDb();
  const now = Date.now();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Kontroll
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Se hur eleverna svarar och vad de gör inne i appen just nu. Bara
          aktivitet medan de är inloggade loggas.
        </p>
      </div>

      {db.students.length === 0 ? (
        <p className="rounded-[16px] border border-line bg-card p-4 text-[12.5px] text-ink-muted">
          Inga elever än — skapa konton under Elever.
        </p>
      ) : (
        <div className="space-y-3">
          {[...db.students].reverse().map((student) => {
            const submissions = db.submissions
              .filter((item) => item.studentId === student.id)
              .slice(-5)
              .reverse();

            const activity = db.activity
              .filter((item) => item.studentId === student.id)
              .slice(-6)
              .reverse();

            const online =
              student.lastSeen !== null &&
              now - new Date(student.lastSeen).getTime() < 2 * 60 * 1000;

            const best = db.submissions
              .filter((item) => item.studentId === student.id)
              .reduce(
                (top, item) =>
                  item.total > 0 && item.score / item.total > top
                    ? item.score / item.total
                    : top,
                0,
              );

            return (
              <section
                key={student.id}
                className="rounded-[16px] border border-line bg-card p-4"
              >
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-[14px] font-semibold text-ink">
                    {student.name}
                  </p>
                  <span className="font-mono text-[11.5px] text-ink-muted">
                    {student.username}
                  </span>
                  <span
                    className={
                      online
                        ? "ml-auto rounded-full border border-[#6aa87c] px-2 py-0.5 text-[10.5px] text-[#6aa87c]"
                        : "ml-auto rounded-full border border-line px-2 py-0.5 text-[10.5px] text-ink-muted"
                    }
                  >
                    {online ? "inne nu" : `senast ${student.lastSeen ? clock(student.lastSeen) : "aldrig"}`}
                  </span>
                </div>

                <div className="mt-3 grid gap-3 lg:grid-cols-2">
                  <div className="rounded-xl border border-line-soft bg-card-raised px-3.5 py-3">
                    <p className="text-[11.5px] font-medium text-ink-soft">
                      Svar och resultat
                    </p>
                    {submissions.length === 0 ? (
                      <p className="mt-1.5 text-[12px] text-ink-muted">
                        Inga avslutade pass än.
                      </p>
                    ) : (
                      <>
                        <ul className="mt-1.5 space-y-1">
                          {submissions.map((item) => (
                            <li
                              key={item.id}
                              className="flex items-baseline justify-between gap-3 text-[12px] text-ink-soft"
                            >
                              <span>
                                {day(item.at)} {clock(item.at)}
                              </span>
                              <span className="tabular-nums">
                                {item.score} av {item.total} rätt
                              </span>
                            </li>
                          ))}
                        </ul>
                        <p className="mt-1.5 text-[11px] text-ink-muted">
                          Bästa resultat: {Math.round(best * 100)} %
                        </p>
                      </>
                    )}
                  </div>

                  <div className="rounded-xl border border-line-soft bg-card-raised px-3.5 py-3">
                    <p className="text-[11.5px] font-medium text-ink-soft">
                      I appen
                    </p>
                    {activity.length === 0 ? (
                      <p className="mt-1.5 text-[12px] text-ink-muted">
                        Ingen aktivitet loggad.
                      </p>
                    ) : (
                      <ul className="mt-1.5 space-y-1">
                        {activity.map((item) => (
                          <li
                            key={item.id}
                            className="flex items-baseline justify-between gap-3 text-[12px] text-ink-soft"
                          >
                            <span className="font-mono text-[11.5px]">
                              {item.path}
                            </span>
                            <span className="shrink-0 text-[11px] text-ink-muted tabular-nums">
                              {clock(item.at)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
