import AnswerDocument from "@/components/answer-document";
import RichText from "@/components/rich-text";
import { getSession } from "@/lib/auth";
import { readDb } from "@/lib/db";
import PageHeading from "@/components/page-heading";

export const metadata = { title: "Översikt · Elda Skola 2.0" };

function isLive(releaseAt: string | null, released: boolean) {
  if (released) return true;
  return releaseAt ? new Date(releaseAt).getTime() <= Date.now() : false;
}

function formatDate(value: string | null) {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleDateString("sv-SE", { day: "numeric", month: "short" });
}

export default async function Page() {
  const session = await getSession();
  const db = await readDb();

  const tasks = session
    ? db.tasks
        .filter((task) => task.studentIds.includes(session.sub))
        .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1))
    : [];

  const updates = db.updates
    .filter((update) => isLive(update.releaseAt, update.released))
    .filter((update) => {
      const targets = update.studentIds ?? [];
      if (targets.length === 0) return true;
      return session ? targets.includes(session.sub) : false;
    })
    .sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));

  return (
    <>
      <PageHeading
        kicker="Översikt"
        title={session ? `Hej ${session.name.split(" ")[0]}` : "Översikt"}
        description="Här ser du uppgifterna du fått och det senaste från skolan."
      />

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1.3fr)_minmax(0,1fr)]">
        <section className="flex flex-col rounded-[18px] border border-line bg-card p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
              Dina uppgifter
            </h2>
            <span className="text-[12px] text-ink-muted tabular-nums">
              {tasks.length} st
            </span>
          </div>

          {tasks.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
              <p className="text-[13.5px] font-medium text-ink">
                Inga uppgifter än
              </p>
              <p className="mt-1.5 max-w-[36ch] text-[12.5px] leading-[1.6] text-ink-muted">
                När din lärare delar ut något dyker det upp här.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2">
              {tasks.map((task) => (
                <li
                  key={task.id}
                  className="rounded-xl border border-line-soft bg-card-raised px-4 py-3"
                >
                  <div className="flex items-baseline justify-between gap-3">
                    <p className="text-[13px] font-medium text-ink">
                      {task.title}
                    </p>
                    {task.dueAt ? (
                      <span className="shrink-0 text-[11px] text-ink-muted">
                        till {formatDate(task.dueAt)}
                      </span>
                    ) : null}
                  </div>
                  {task.description ? (
                    <p className="mt-1 text-[12px] leading-[1.55] whitespace-pre-wrap text-ink-soft">
                      {task.description}
                    </p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="flex flex-col rounded-[18px] border border-line bg-card p-5">
          <div className="flex items-baseline justify-between gap-3">
            <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
              Nyheter
            </h2>
            <span className="text-[12px] text-ink-muted tabular-nums">
              {updates.length} st
            </span>
          </div>

          {updates.length === 0 ? (
            <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-12 text-center">
              <p className="text-[13.5px] font-medium text-ink">
                Inget nytt just nu
              </p>
              <p className="mt-1.5 max-w-[32ch] text-[12.5px] leading-[1.6] text-ink-muted">
                Uppdateringar dyker upp här när de släpps.
              </p>
            </div>
          ) : (
            <ul className="mt-4 space-y-2.5">
              {updates.map((update) => {
                const answer = session
                  ? db.answers.find(
                      (item) =>
                        item.updateId === update.id &&
                        item.studentId === session.sub,
                    )
                  : undefined;

                return (
                  <li
                    key={update.id}
                    className="rounded-xl border border-line-soft bg-card-raised px-4 py-3"
                  >
                    <p className="text-[12.5px] font-medium text-ink">
                      {update.title}
                    </p>

                    {update.notes ? (
                      <div className="mt-1.5 text-[12px] text-ink-soft">
                        <RichText text={update.notes} />
                      </div>
                    ) : null}

                    {update.attachment ? (
                      <a
                        href={update.attachment.dataUrl}
                        download={update.attachment.name}
                        className="mt-2 inline-flex items-center gap-1.5 rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-soft transition-colors duration-150 hover:border-control-line hover:text-ink"
                      >
                        Bilaga: {update.attachment.name}
                      </a>
                    ) : null}

                    {update.asksAnswer ? (
                      <AnswerDocument
                        updateId={update.id}
                        initial={answer?.content ?? ""}
                        savedAt={answer?.updatedAt ?? null}
                      />
                    ) : null}
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
