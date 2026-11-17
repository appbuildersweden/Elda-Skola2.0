import Link from "next/link";
import PageHeading from "@/components/page-heading";

export const metadata = { title: "Uppdrag · Elda Skola 2.0" };

export default function UppdragPage() {
  return (
    <>
      <PageHeading
        kicker="Utmana dig själv"
        title="Uppdrag"
        description="Här samlas uppdrag du kan utmana dig själv med."
      />

      <section className="flex min-h-[320px] flex-col rounded-[18px] border border-line bg-card p-5">
        <h2 className="text-[16px] font-semibold tracking-[-0.01em] text-ink">
          Tillgängliga uppdrag
        </h2>

        <div className="mt-4 flex flex-1 flex-col items-center justify-center rounded-xl border border-dashed border-line px-6 py-14 text-center">
          <p className="text-[13.5px] font-medium text-ink">Inga uppdrag än</p>
          <p className="mt-1.5 max-w-[38ch] text-[12.5px] leading-[1.6] text-ink-muted">
            Nya uppdrag dyker upp här. Under tiden kan du jobba med uppgiften i
            Studion.
          </p>
          <Link
            href="/studion"
            className="mt-4 inline-flex h-9 items-center rounded-full bg-accent px-4 text-[12.5px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90"
          >
            Öppna Studion
          </Link>
        </div>
      </section>
    </>
  );
}
