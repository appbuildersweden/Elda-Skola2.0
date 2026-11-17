import type { SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 24 24",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.6,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

export function OverviewIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="3" width="7.5" height="7.5" rx="2" />
      <rect x="3" y="13.5" width="7.5" height="7.5" rx="2" />
      <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="2" />
    </svg>
  );
}

export function CoursesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
      <path d="M19 18v3H6.5A2.5 2.5 0 0 1 4 18.5" />
    </svg>
  );
}

export function TasksIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 4h6a1 1 0 0 1 1 1v1H8V5a1 1 0 0 1 1-1Z" />
      <path d="M8 6H6.5A1.5 1.5 0 0 0 5 7.5v12A1.5 1.5 0 0 0 6.5 21h11a1.5 1.5 0 0 0 1.5-1.5v-12A1.5 1.5 0 0 0 17.5 6H16" />
      <path d="M9 12.5l2 2 4-4.5" />
    </svg>
  );
}

export function CalendarIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <rect x="3.5" y="5" width="17" height="15.5" rx="2.5" />
      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  );
}

export function StudentsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="9" cy="8.5" r="3.5" />
      <path d="M3 20a6 6 0 0 1 12 0" />
      <path d="M16 5.2a3.5 3.5 0 0 1 0 6.6M17.5 14.6A5.2 5.2 0 0 1 21 19.4" />
    </svg>
  );
}

export function GradesIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3.5l2.6 5.4 5.9.8-4.3 4.2 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 9.7l5.9-.8z" />
    </svg>
  );
}

export function SettingsIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="3" />
      <path d="M19.4 15a1.7 1.7 0 0 0 .34 1.87l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.7 1.7 0 0 0-2.9 1.2v.17a2 2 0 1 1-4 0v-.09a1.7 1.7 0 0 0-2.9-1.2l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06A1.7 1.7 0 0 0 4 15a1.7 1.7 0 0 0-1.6-1.1H2.2a2 2 0 1 1 0-4h.1A1.7 1.7 0 0 0 4 8.9a1.7 1.7 0 0 0-.34-1.87l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06A1.7 1.7 0 0 0 9.4 3.4a1.7 1.7 0 0 0 1-1.55V1.7a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.87-.35l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06A1.7 1.7 0 0 0 21 9.4v.1a1.7 1.7 0 0 0 1.55 1" />
    </svg>
  );
}

export function SearchIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="11" cy="11" r="6.5" />
      <path d="M16 16l4 4" />
    </svg>
  );
}

export function BellIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18 9a6 6 0 1 0-12 0c0 4-1.5 5.5-1.5 5.5h15S18 13 18 9" />
      <path d="M10.2 18.5a2 2 0 0 0 3.6 0" />
    </svg>
  );
}

export function FlameIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 3s4.5 4.2 4.5 8.4a4.5 4.5 0 1 1-9 0C7.5 9.4 9 8 9 8s.4 2.4 1.8 3c1.2-2.2 1.2-5.2 1.2-8Z" />
    </svg>
  );
}

export function ArrowIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M7 17L17 7M9 7h8v8" />
    </svg>
  );
}

export function AwardIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="9" r="5.5" />
      <path d="M8.2 13.6L7 21l5-2.6 5 2.6-1.2-7.4" />
    </svg>
  );
}

export function ClockIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 1.8" />
    </svg>
  );
}

export function PlusIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

export function TargetIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <circle cx="12" cy="12" r="4.5" />
      <circle cx="12" cy="12" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function ChatIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M20 12a7.5 7.5 0 0 1-7.5 7.5H8L4 22v-4.6A7.5 7.5 0 0 1 4.5 12a7.5 7.5 0 0 1 7.5-7.5h.5A7.5 7.5 0 0 1 20 12Z" />
      <path d="M9 11h6M9 14.5h4" />
    </svg>
  );
}

export function CapIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M2.5 8.5 12 4l9.5 4.5L12 13z" />
      <path d="M6 10.8V16c0 1.7 2.7 3 6 3s6-1.3 6-3v-5.2" />
      <path d="M21.5 8.5V15" />
    </svg>
  );
}

export function StudioIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H11v16H6.5A2.5 2.5 0 0 0 4 22.5z" />
      <path d="M20 6.5A2.5 2.5 0 0 0 17.5 4H13v16h4.5a2.5 2.5 0 0 1 2.5 2.5z" />
    </svg>
  );
}

export function PaperclipIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M18.5 11.5l-6.6 6.6a4.2 4.2 0 0 1-6-6l7-7a2.9 2.9 0 0 1 4.1 4.1l-7 7a1.6 1.6 0 0 1-2.3-2.3l6.2-6.2" />
    </svg>
  );
}

export function CloseIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  );
}

export function ChevronIcon(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M9 5l7 7-7 7" />
    </svg>
  );
}
