import type { Artifact } from "@/lib/artifacts";
import { ClockIcon } from "@/components/icons";

const label = {
  flashcards: "Flashcards",
  quiz: "Quiz",
  notes: "Anteckningar",
  plan: "Läxplanerare",
  timer: "Fokustimer",
} as const;

export default function ArtifactPreview({ artifact }: { artifact: Artifact }) {
  return (
    <div className="mt-2 overflow-hidden rounded-xl border border-line bg-card">
      <div className="flex items-center justify-between gap-3 border-b border-line-soft px-3.5 py-2">
        <span className="text-[11.5px] font-medium text-ink-soft">
          {artifact.title}
        </span>
        <span className="rounded-full border border-line px-2 py-0.5 text-[10.5px] text-ink-muted">
          Förhandsvisning · {label[artifact.kind]}
        </span>
      </div>

      <div className="px-3.5 py-3">
        {artifact.kind === "flashcards" ? (
          <ul className="grid gap-2 sm:grid-cols-2">
            {artifact.cards.map((card, index) => (
              <li
                key={index}
                className="rounded-lg border border-line-soft bg-card-raised px-3 py-2"
              >
                <p className="text-[10.5px] text-ink-muted tabular-nums">
                  Kort {index + 1}
                </p>
                <p className="mt-0.5 text-[12.5px] font-medium text-ink">
                  {card.front}
                </p>
                <p className="mt-1 text-[12px] leading-[1.5] text-ink-soft">
                  {card.back}
                </p>
              </li>
            ))}
          </ul>
        ) : null}

        {artifact.kind === "quiz" ? (
          <ol className="space-y-3">
            {artifact.questions.map((question, index) => (
              <li key={index}>
                <p className="text-[12.5px] font-medium text-ink">
                  {index + 1}. {question.question}
                </p>
                <ul className="mt-1.5 space-y-1">
                  {question.options.map((option, optionIndex) => (
                    <li
                      key={optionIndex}
                      className={
                        optionIndex === question.answer
                          ? "flex items-center gap-2 rounded-md border border-accent/40 bg-accent-soft px-2.5 py-1.5 text-[12px] text-ink"
                          : "flex items-center gap-2 rounded-md border border-line-soft px-2.5 py-1.5 text-[12px] text-ink-soft"
                      }
                    >
                      <span className="text-[10.5px] font-medium text-ink-muted">
                        {String.fromCharCode(65 + optionIndex)}
                      </span>
                      {option}
                      {optionIndex === question.answer ? (
                        <span className="ml-auto text-[10.5px] font-medium text-accent">
                          rätt
                        </span>
                      ) : null}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ol>
        ) : null}

        {artifact.kind === "notes" ? (
          <div className="space-y-3">
            {artifact.sections.map((section, index) => (
              <div key={index}>
                <p className="text-[12.5px] font-semibold text-ink">
                  {section.title}
                </p>
                <ul className="mt-1 space-y-1">
                  {section.points.map((point, pointIndex) => (
                    <li key={pointIndex} className="flex gap-2 text-[12px] leading-[1.5] text-ink-soft">
                      <span aria-hidden className="mt-[6px] size-1 shrink-0 rounded-full bg-accent" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ) : null}

        {artifact.kind === "plan" ? (
          <ul className="space-y-2">
            {artifact.days.map((day, index) => (
              <li
                key={index}
                className="rounded-lg border border-line-soft bg-card-raised px-3 py-2"
              >
                <p className="text-[12px] font-medium text-ink">{day.day}</p>
                <ul className="mt-1 space-y-0.5">
                  {day.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="text-[12px] leading-[1.5] text-ink-soft">
                      {item}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        ) : null}

        {artifact.kind === "timer" ? (
          <div>
            <p className="flex items-center gap-2 text-[13px] font-semibold text-ink">
              <ClockIcon className="size-4 text-accent" />
              {artifact.minutes} minuter fokus
            </p>
            <ul className="mt-2 space-y-1">
              {artifact.blocks.map((block, index) => (
                <li
                  key={index}
                  className="flex items-baseline justify-between gap-3 text-[12px] text-ink-soft"
                >
                  <span>{block.label}</span>
                  <span className="shrink-0 text-[11.5px] text-ink-muted tabular-nums">
                    {block.minutes} min
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-[11.5px] text-ink-muted">
              Timern startar uppe till höger och går inte att stänga av förrän
              tiden är ute.
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}
