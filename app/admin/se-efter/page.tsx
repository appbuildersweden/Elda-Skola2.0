import { BugRow } from "@/components/admin/controls";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function SeEfterPage() {
  const db = await readDb();

  const logins = [...db.logins].reverse().slice(0, 30);
  const bugs = [...db.bugs].reverse();
  const open = bugs.filter((bug) => !bug.fixed);
  const fixed = bugs.filter((bug) => bug.fixed);

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Se efter
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Inloggningar och fel som dykt upp i appen. Markera en bugg som fixad
          när du åtgärdat den.
        </p>
      </div>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Buggar ({open.length} öppna)
        </h2>

        {bugs.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inga fel rapporterade. Buggar fångas automatiskt när något kraschar i
            webbläsaren.
          </p>
        ) : (
          <>
            {open.length > 0 ? (
              <ul className="space-y-2">
                {open.map((bug) => (
                  <BugRow key={bug.id} bug={bug} />
                ))}
              </ul>
            ) : (
              <p className="text-[12.5px] text-ink-muted">
                Alla rapporterade fel är markerade som fixade.
              </p>
            )}

            {fixed.length > 0 ? (
              <details className="mt-3">
                <summary className="cursor-pointer text-[12px] text-ink-muted">
                  Visar {fixed.length} fixade
                </summary>
                <ul className="mt-2 space-y-2 opacity-60">
                  {fixed.map((bug) => (
                    <BugRow key={bug.id} bug={bug} />
                  ))}
                </ul>
              </details>
            ) : null}
          </>
        )}
      </section>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Inloggningar
        </h2>

        {logins.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inga inloggningar loggade än.
          </p>
        ) : (
          <ul className="divide-y divide-line-soft">
            {logins.map((login) => (
              <li
                key={login.id}
                className="flex flex-wrap items-center justify-between gap-2 py-2 text-[12px]"
              >
                <span className="font-mono text-ink-soft">{login.username}</span>
                <span className="text-[11px] text-ink-muted">
                  {login.role} · {login.ok ? "lyckad" : "misslyckad"} ·{" "}
                  {new Date(login.at).toLocaleString("sv-SE", {
                    dateStyle: "short",
                    timeStyle: "short",
                  })}
                </span>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
