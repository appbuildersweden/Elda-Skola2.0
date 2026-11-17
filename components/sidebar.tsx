"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType, SVGProps } from "react";
import {
  CapIcon,
  ChatIcon,
  StudioIcon,
  TargetIcon,
} from "@/components/icons";

type NavItem = {
  label: string;
  hint: string;
  href: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const nav: NavItem[] = [
  {
    label: "Uppdrag",
    hint: "Utmana dig själv",
    href: "/uppdrag",
    icon: TargetIcon,
  },
  { label: "Chat", hint: "AI-elever", href: "/chat", icon: ChatIcon },
  {
    label: "Studion",
    hint: "Plugg och resultat",
    href: "/studion",
    icon: StudioIcon,
  },
  {
    label: "Läxhjälpen",
    hint: "AI-lärare",
    href: "/laxhjalpen",
    icon: CapIcon,
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex w-full shrink-0 flex-col gap-4 border-b border-line bg-panel px-4 py-4 lg:sticky lg:top-0 lg:h-dvh lg:w-[248px] lg:gap-6 lg:border-r lg:border-b-0 lg:px-4 lg:py-5">
      <div className="flex flex-col gap-5">
        <Link href="/" className="flex items-center gap-2.5 rounded-lg px-1">
          <Image
            src="/elda-logo.png"
            alt="Elda-Skola logotyp"
            width={32}
            height={32}
            unoptimized
            className="size-8 shrink-0 rounded-[9px]"
          />
          <span className="font-display text-[17px] leading-none tracking-[0.01em] text-ink">
            ELDA SKOLA 2.0
          </span>
        </Link>

        <nav aria-label="Huvudmeny">
          <ul className="-mx-1 flex gap-1 overflow-x-auto px-1 pb-1 lg:mx-0 lg:flex-col lg:gap-0.5 lg:overflow-visible lg:px-0 lg:pb-0">
            {nav.map(({ label, hint, href, icon: Icon }) => {
              const active = pathname === href;

              return (
                <li key={label} className="shrink-0 lg:shrink">
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
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      </div>

    </aside>
  );
}
