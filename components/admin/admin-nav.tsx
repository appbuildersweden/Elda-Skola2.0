"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  BellIcon,
  GradesIcon,
  OverviewIcon,
  SettingsIcon,
  StudentsIcon,
  TasksIcon,
} from "@/components/icons";

type Item = {
  href: string;
  label: string;
  hint: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  badge?: number;
};

export default function AdminNav({
  pendingUpdates = 0,
  openBugs = 0,
}: {
  pendingUpdates?: number;
  openBugs?: number;
}) {
  const pathname = usePathname();

  const items: Item[] = [
    {
      href: "/admin",
      label: "Översikt",
      hint: "Allt i korthet",
      icon: OverviewIcon,
    },
    {
      href: "/admin/utdelning",
      label: "Utdelning",
      hint: "Ge ut uppgifter",
      icon: TasksIcon,
    },
    {
      href: "/admin/hantering",
      label: "Hantering",
      hint: "Uppdateringar och släpp",
      icon: BellIcon,
      badge: pendingUpdates,
    },
    {
      href: "/admin/elever",
      label: "Elever",
      hint: "Konton",
      icon: StudentsIcon,
    },
    {
      href: "/admin/kontroll",
      label: "Kontroll",
      hint: "Svar och aktivitet",
      icon: GradesIcon,
    },
    {
      href: "/admin/se-efter",
      label: "Se efter",
      hint: "Inlogg och buggar",
      icon: SettingsIcon,
      badge: openBugs,
    },
  ];

  return (
    <nav aria-label="Adminmeny">
      <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
        {items.map(({ href, label, hint, icon: Icon, badge }) => {
          const active =
            href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);

          return (
            <li key={href} className="shrink-0 lg:shrink">
              <Link
                href={href}
                aria-current={active ? "page" : undefined}
                title={hint}
                className={[
                  "flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-[13px] transition-colors duration-150 lg:gap-3",
                  active
                    ? "bg-card-raised font-medium text-ink"
                    : "text-ink-soft hover:bg-card hover:text-ink",
                ].join(" ")}
              >
                <Icon
                  className={[
                    "size-4 shrink-0",
                    active ? "text-accent" : "text-ink-muted",
                  ].join(" ")}
                  strokeWidth={active ? 1.9 : 1.6}
                />
                <span className="whitespace-nowrap">{label}</span>
                {badge && badge > 0 ? (
                  <span className="ml-1 rounded-full bg-accent px-1.5 text-[10px] font-semibold text-on-peach tabular-nums lg:ml-auto">
                    {badge}
                  </span>
                ) : null}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
