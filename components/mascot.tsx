"use client";

export type Mood = "idle" | "correct" | "wrong" | "done";

const bulbColors = ["#e0574f", "#f2b440", "#f4792f", "#e7879b"];

export default function Mascot({
  mood = "idle",
  className,
}: {
  mood?: Mood;
  className?: string;
}) {
  const happy = mood === "correct" || mood === "done";

  return (
    <svg
      viewBox="0 0 160 170"
      role="img"
      aria-label="Elda, din träningskompis"
      className={`mascot mascot-${mood} ${className ?? ""}`}
    >
      <defs>
        <linearGradient id="mascot-fur" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#f59341" />
          <stop offset="1" stopColor="#d75f1e" />
        </linearGradient>
        <linearGradient id="mascot-body" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ef8737" />
          <stop offset="1" stopColor="#c95418" />
        </linearGradient>
      </defs>

      <g className="mascot-all">
        <g className="mascot-torso">
          {/* feet */}
          <rect x="56" y="116" width="16" height="9" rx="4.5" fill="#b8470f" />
          <rect x="88" y="116" width="16" height="9" rx="4.5" fill="#b8470f" />

          {/* body */}
          <rect x="52" y="76" width="56" height="44" rx="14" fill="url(#mascot-body)" />
          <rect x="52" y="99" width="56" height="8" fill="#f4f2ee" opacity="0.85" />

          {/* head */}
          <rect x="46" y="22" width="68" height="58" rx="16" fill="url(#mascot-fur)" />
          <rect x="46" y="22" width="68" height="16" rx="16" fill="#ffffff" opacity="0.12" />

          {/* headband */}
          <rect x="43" y="32" width="74" height="12" rx="5" fill="#f4f2ee" />

          {/* christmas lights on the band */}
          {Array.from({ length: 7 }).map((_, i) => (
            <circle
              key={i}
              className="mascot-bulb"
              cx={52 + i * 9}
              cy={38}
              r={2.5}
              fill={bulbColors[i % bulbColors.length]}
              style={{ animationDelay: `${(i % 4) * 0.18}s` }}
            />
          ))}

          {/* eyes */}
          {mood === "wrong" ? (
            <g stroke="#3d1f0c" strokeWidth="2.6" strokeLinecap="round">
              <path d="M64 52l10 10M74 52l-10 10" />
              <path d="M86 52l10 10M96 52l-10 10" />
            </g>
          ) : happy ? (
            <g stroke="#3d1f0c" strokeWidth="2.6" strokeLinecap="round" fill="none">
              <path d="M64 58c2-6 8-6 10 0" />
              <path d="M86 58c2-6 8-6 10 0" />
            </g>
          ) : (
            <g
              stroke="#3d1f0c"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            >
              <path d="M64 51l7 6-7 6" />
              <path d="M96 51l-7 6 7 6" />
            </g>
          )}

          {/* mouth */}
          {mood === "wrong" ? (
            <path
              d="M75 70c2-4 8-4 10 0"
              stroke="#3d1f0c"
              strokeWidth="2.4"
              strokeLinecap="round"
              fill="none"
            />
          ) : happy ? (
            <path d="M74 65c2 6 10 6 12 0z" fill="#3d1f0c" />
          ) : (
            <circle cx="80" cy="67" r="2.2" fill="#3d1f0c" />
          )}
        </g>

        {/* arms with dumbbells */}
        <g className="mascot-arm-left">
          <rect x="36" y="88" width="14" height="8" rx="4" fill="#e0672a" />
          <rect x="16" y="89" width="24" height="6" rx="3" fill="#a9a49d" />
          <rect x="12" y="85" width="7" height="14" rx="3" fill="#cfcac3" />
          <rect x="30" y="85" width="7" height="14" rx="3" fill="#cfcac3" />
        </g>
        <g className="mascot-arm-right">
          <rect x="110" y="88" width="14" height="8" rx="4" fill="#e0672a" />
          <rect x="120" y="89" width="24" height="6" rx="3" fill="#a9a49d" />
          <rect x="141" y="85" width="7" height="14" rx="3" fill="#cfcac3" />
          <rect x="123" y="85" width="7" height="14" rx="3" fill="#cfcac3" />
        </g>
      </g>
    </svg>
  );
}