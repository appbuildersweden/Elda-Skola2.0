import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import ActivityPing from "@/components/activity-ping";
import LogoutButton from "@/components/logout-button";
import MascotStage from "@/components/mascot-stage";
import { MascotProvider } from "@/components/mascot-context";
import { FocusTimerProvider } from "@/components/focus-timer-context";
import TopTimer from "@/components/top-timer";
import Sidebar from "@/components/sidebar";
import { CoursesIcon, SearchIcon, TasksIcon } from "@/components/icons";
import { getSession } from "@/lib/auth";

export default async function AppLayout({ children }: { children: ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <FocusTimerProvider>
      <div className="flex min-h-dvh flex-col lg:flex-row">
        <Sidebar />

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-3 border-b border-line bg-panel px-4 lg:px-6">
            <div className="relative w-full max-w-[320px]">
              <SearchIcon className="pointer-events-none absolute top-1/2 left-0 size-4 -translate-y-1/2 text-ink-muted" />
              <input
                type="search"
                aria-label="Sök kurs, uppgift eller elev"
                placeholder="Sök kurs, uppgift eller elev"
                className="h-9 w-full border-b border-transparent bg-transparent pr-2 pl-7 text-base text-ink transition-colors duration-150 hover:border-line focus:border-control-line focus:outline-none sm:text-[13px]"
              />
            </div>

            <div className="ml-auto flex items-center gap-2">
              <span className="hidden h-8 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[12px] text-ink-soft md:flex">
                <CoursesIcon className="size-3.5 text-ink-muted" />
                0 kurser
              </span>
              <span className="hidden h-8 items-center gap-1.5 rounded-full border border-line bg-card px-3 text-[12px] text-ink-soft md:flex">
                <TasksIcon className="size-3.5 text-ink-muted" />
                0 uppgifter
              </span>

              <span className="flex h-8 max-w-[180px] items-center gap-2 rounded-full border border-line bg-card px-3">
                <span
                  aria-hidden
                  className="flex size-5 items-center justify-center rounded-full bg-accent text-[10px] font-bold text-on-peach"
                >
                  {session.name.slice(0, 1).toUpperCase()}
                </span>
                <span className="truncate text-[12px] text-ink-soft">
                  {session.name}
                </span>
              </span>

              <LogoutButton />
              <TopTimer />
            </div>
          </header>

          <MascotProvider>
            <ActivityPing enabled={session.role === "student"} />
            <div className="flex flex-1 items-start gap-2 px-4 py-5 lg:px-6 lg:py-6">
              <MascotStage />
              <main className="min-w-0 flex-1 space-y-4">{children}</main>
            </div>
          </MascotProvider>
        </div>
      </div>
    </FocusTimerProvider>
  );
}
