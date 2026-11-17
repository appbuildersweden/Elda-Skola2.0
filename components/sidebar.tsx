import type { ComponentType, SVGProps } from "react";
import {
  CalendarIcon,
  CoursesIcon,
  FlameIcon,
  GradesIcon,
  OverviewIcon,
  SettingsIcon,
  StudentsIcon,
  TasksIcon,
} from "@/components/icons";

type NavItem = {
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  active?: boolean;
  badge?: string;
};

const mainNav: NavItem[] = [
  { label: "Översikt", icon: OverviewIcon, active: true },
  { label: "Kurser", icon: CoursesIcon },
  { label: "Uppgifter", icon: TasksIcon, badge: "12" },
  { label: "Kalender", icon: CalendarIcon },
  { label: "Elever", icon: StudentsIcon },
  { label: "Betyg", icon: GradesIcon },
];

const secondaryNav: NavItem[] = [{ label: "Inställningar", icon: SettingsIcon }];

function NavLink({ label, icon: Icon, active, badge }: NavItem) {
  return (
    <a
      href="#"
      aria-current={active ? "page" : undefined}
      className={[
        "group relative flex shrink-0 items-center gap-2.5 rounded-lg px-3 py-2 text-[13.5px] transition-colors lg:gap-3",
        active
          ? "bg-surface font-medium text-ink ring-1 ring-line"
          : "text-ink-soft hover:bg-surface hover:text-ink",
      ].join(" ")}
    >
      <Icon
        className={[
          "size-4 shrink-0",
          active
            ? "text-ember"
            : "text-muted group-hover:text-ink-soft",
        ].join(" ")}
      />
      <span>{label}</span>
      {badge ? (
        <span className="ml-auto rounded-md bg-ember-soft px-1.5 py-0.5 text-[11px] font-medium text-ember tabular-nums">
          {badge}
        </span>
      ) : null}
    </a>
  );
}

export default function Sidebar() {
  return (
    <aside className="flex w-full shrink-0 flex-col gap-6 border-b border-line bg-white px-4 py-4 lg:sticky lg:top-0 lg:h-screen lg:w-[264px] lg:gap-8 lg:border-r lg:border-b-0 lg:px-4 lg:py-6">
      {/* Wordmark */}
      <div className="flex items-center gap-2.5 px-1">
        <span className="flex size-7 items-center justify-center rounded-full border border-line bg-white">
          <FlameIcon className="size-3.5 text-ember" />
        </span>
        <span className="font-display text-[23px] leading-none tracking-[0.055em] text-ink">
          ELDA-SKOLA
        </span>
      </div>

      {/* Navigation */}
      <nav aria-label="Huvudmeny" className="flex min-w-0 flex-col gap-5">
        <div className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
          {mainNav.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>

        <div className="flex flex-col gap-0.5 border-t border-line-soft pt-4">
          <p className="hidden px-3 pb-2 text-[11px] font-medium tracking-[0.08em] text-muted uppercase lg:block">
            Konto
          </p>
          {secondaryNav.map((item) => (
            <NavLink key={item.label} {...item} />
          ))}
        </div>
      </nav>

      {/* Profile */}
      <div className="mt-auto hidden items-center gap-3 rounded-xl border border-line bg-surface px-3 py-2.5 lg:flex">
        <span
          aria-hidden
          className="flex size-8 items-center justify-center rounded-full bg-white text-[12px] font-medium text-ink-soft ring-1 ring-line"
        >
          AL
        </span>
        <span className="min-w-0 leading-tight">
          <span className="block truncate text-[13px] font-medium text-ink">
            Anna Lind
          </span>
          <span className="block truncate text-[11.5px] text-muted">
            Lärare · Svenska
          </span>
        </span>
      </div>
    </aside>
  );
}
