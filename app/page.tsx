import { ArrowIcon, BellIcon, ChevronIcon, SearchIcon } from "@/components/icons";

type Course = {
  name: string;
  meta: string;
  progress: number;
  detail: string;
};

const courses: Course[] = [
  { name: "Svenska 1", meta: "Klass 9B · 24 elever", progress: 72, detail: "12 av 16 moment" },
  { name: "Matematik 2b", meta: "Klass 9B · 24 elever", progress: 58, detail: "9 av 15 moment" },
  { name: "Engelska 6", meta: "Klass 9A · 22 elever", progress: 84, detail: "11 av 13 moment" },
  { name: "Samhällskunskap 1b", meta: "Klass 9A · 22 elever", progress: 41, detail: "5 av 12 moment" },
];

type PlanItem = {
  day: string;
  month: string;
  title: string;
  course: string;
  time: string;
};

const plan: PlanItem[] = [
  { day: "18", month: "nov", title: "Inlämning: Retorikanalys", course: "Svenska 1", time: "23:59" },
  { day: "19", month: "nov", title: "Prov: Derivata och gränsvärden", course: "Matematik 2b", time: "09:00" },
  { day: "20", month: "nov", title: "Seminarium: Hållbar utveckling", course: "Samhällskunskap 1b", time: "13:15" },
  { day: "21", month: "nov", title: "Rättning: Essäutkast", course: "Svenska 1", time: "Hela dagen" },
];

const stats = [
  { label: "Aktiva kurser", value: "6", note: "1 ny denna termin" },
  { label: "Att rätta", value: "12", note: "4 inlämnade i dag" },
  { label: "Närvaro", value: "94 %", note: "Upp 2,1 pe sedan i höstas" },
];

function StatCard({ label, value, note }: (typeof stats)[number]) {
  return (
    <div className="rounded-xl border border-line bg-white px-5 py-4">
      <p className="text-[12px] font-medium text-muted">{label}</p>
      <p className="mt-2 font-display text-[32px] leading-none tracking-tight text-ink">
        {value}
      </p>
      <p className="mt-2.5 text-[12px] text-muted">{note}</p>
    </div>
  );
}

export default function Page() {
  return (
    <>
      <header className="flex flex-wrap items-end justify-between gap-4 border-b border-line px-5 py-5 lg:px-10 lg:py-6">
        <div>
          <p className="text-[12px] font-medium text-muted">Tisdag 17 november</p>
          <h1 className="mt-1 font-display text-[27px] leading-tight text-ink lg:text-[30px]">
            God morgon, Anna
          </h1>
        </div>

        <div className="flex items-center gap-2 lg:gap-3">
          <div className="relative hidden sm:block">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted" />
            <input
              type="search"
              aria-label="Sök kurs, elev eller uppgift"
              placeholder="Sök kurs, elev eller uppgift"
              className="h-9 w-56 rounded-lg border border-line bg-white pr-3 pl-9 text-[13px] text-ink placeholder:text-muted focus:border-line focus:outline-none lg:w-64"
            />
          </div>

          <button
            type="button"
            aria-label="Notiser"
            className="relative flex size-9 items-center justify-center rounded-lg border border-line bg-white text-ink-soft hover:bg-surface"
          >
            <BellIcon className="size-4" />
            <span className="absolute top-2 right-2.5 size-1.5 rounded-full bg-ember" />
          </button>

          <span
            aria-hidden
            className="flex size-9 items-center justify-center rounded-full border border-line bg-surface text-[12px] font-medium text-ink-soft"
          >
            AL
          </span>
        </div>
      </header>

      <div className="space-y-5 px-5 py-6 lg:space-y-6 lg:px-10 lg:py-8">
        <section aria-label="Nyckeltal" className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </section>

        <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr] lg:gap-6">
          {/* Courses */}
          <section aria-labelledby="courses-heading" className="rounded-xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="courses-heading" className="text-[14px] font-medium text-ink">
                Dina kurser
              </h2>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-ink"
              >
                Alla kurser
                <ChevronIcon className="size-3.5" />
              </a>
            </div>

            <ul className="divide-y divide-line-soft">
              {courses.map((course) => (
                <li key={course.name}>
                  <a href="#" className="block px-5 py-4 hover:bg-surface">
                    <div className="flex items-baseline justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate text-[13.5px] font-medium text-ink">
                          {course.name}
                        </p>
                        <p className="mt-0.5 truncate text-[12px] text-muted">
                          {course.meta}
                        </p>
                      </div>
                      <div className="flex shrink-0 items-baseline gap-2">
                        <span className="text-[12px] text-muted tabular-nums">
                          {course.detail}
                        </span>
                        <span className="text-[12.5px] font-medium text-ink tabular-nums">
                          {course.progress} %
                        </span>
                      </div>
                    </div>

                    <div
                      className="mt-3 h-1 w-full overflow-hidden rounded-full bg-track"
                      role="progressbar"
                      aria-valuenow={course.progress}
                      aria-valuemin={0}
                      aria-valuemax={100}
                      aria-label={`Framsteg i ${course.name}`}
                    >
                      <div
                        className="h-full rounded-full bg-ember"
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                  </a>
                </li>
              ))}
            </ul>
          </section>

          {/* Plan */}
          <section aria-labelledby="plan-heading" className="rounded-xl border border-line bg-white">
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h2 id="plan-heading" className="text-[14px] font-medium text-ink">
                Den här veckan
              </h2>
              <a
                href="#"
                className="inline-flex items-center gap-1 text-[12.5px] text-muted hover:text-ink"
              >
                Kalender
                <ArrowIcon className="size-3.5" />
              </a>
            </div>

            <ul className="divide-y divide-line-soft">
              {plan.map((item) => (
                <li key={`${item.day}-${item.title}`}>
                  <a href="#" className="flex items-start gap-3.5 px-5 py-3.5 hover:bg-surface">
                    <span className="flex w-11 shrink-0 flex-col items-center rounded-lg border border-line-soft bg-surface py-1.5 leading-none">
                      <span className="font-display text-[16px] text-ink">{item.day}</span>
                      <span className="mt-0.5 text-[10.5px] text-muted">{item.month}</span>
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-medium text-ink">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block truncate text-[12px] text-muted">
                        {item.course} · {item.time}
                      </span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>

            <div className="border-t border-line px-5 py-3.5">
              <a
                href="#"
                className="inline-flex items-center gap-1.5 text-[12.5px] font-medium text-ember hover:opacity-80"
              >
                Lägg till händelse
                <ArrowIcon className="size-3.5" />
              </a>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
