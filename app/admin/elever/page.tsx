import { CreateStudentForm } from "@/components/admin/forms";
import { readDb } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function EleverPage() {
  const db = await readDb();

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-ink">
          Elever
        </h1>
        <p className="mt-1 text-[12.5px] text-ink-muted">
          Skapa konton till elever. Eleven loggar in med bara användarnamn och
          lösenord — ingen registrering finns.
        </p>
      </div>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Nytt elevkonto
        </h2>
        <CreateStudentForm />
      </section>

      <section className="rounded-[16px] border border-line bg-card p-4">
        <h2 className="mb-3 text-[14px] font-semibold text-ink">
          Konton ({db.students.length})
        </h2>

        {db.students.length === 0 ? (
          <p className="text-[12.5px] text-ink-muted">
            Inga elevkonton än. Skapa det första ovan.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full min-w-[480px] border-collapse text-left">
              <thead>
                <tr className="text-[11px] tracking-wide text-ink-muted uppercase">
                  <th className="pb-2 font-medium">Namn</th>
                  <th className="pb-2 font-medium">Användarnamn</th>
                  <th className="pb-2 font-medium">Skapad</th>
                  <th className="pb-2 font-medium">Senast inne</th>
                </tr>
              </thead>
              <tbody>
                {[...db.students].reverse().map((student) => (
                  <tr key={student.id} className="border-t border-line-soft">
                    <td className="py-2.5 text-[12.5px] text-ink">
                      {student.name}
                    </td>
                    <td className="py-2.5 font-mono text-[12px] text-ink-soft">
                      {student.username}
                    </td>
                    <td className="py-2.5 text-[11.5px] text-ink-muted">
                      {new Date(student.createdAt).toLocaleDateString("sv-SE")}
                    </td>
                    <td className="py-2.5 text-[11.5px] text-ink-muted">
                      {student.lastSeen
                        ? new Date(student.lastSeen).toLocaleString("sv-SE", {
                            dateStyle: "short",
                            timeStyle: "short",
                          })
                        : "aldrig"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
