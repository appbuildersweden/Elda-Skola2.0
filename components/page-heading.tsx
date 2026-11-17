import type { ReactNode } from "react";

export default function PageHeading({
  kicker,
  title,
  description,
  children,
}: {
  kicker: string;
  title: string;
  description?: string;
  children?: ReactNode;
}) {
  return (
    <header className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
      <div className="max-w-[60ch]">
        <p className="text-[12px] font-medium tracking-[0.06em] text-ink-muted uppercase">
          {kicker}
        </p>
        <h1 className="mt-2 text-[26px] leading-[1.1] font-semibold tracking-[-0.02em] text-ink lg:text-[30px]">
          {title}
        </h1>
        {description ? (
          <p className="mt-2 text-[13px] leading-[1.6] text-ink-muted">
            {description}
          </p>
        ) : null}
      </div>
      {children}
    </header>
  );
}
