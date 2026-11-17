export type ArtifactFormat =
  | "flashcards"
  | "quiz"
  | "anteckningar"
  | "fokustimer"
  | "laxplan";

export type Flashcard = { front: string; back: string };

export type QuizQuestion = {
  question: string;
  options: string[];
  answer: number;
};

export type NoteSection = { title: string; points: string[] };

export type PlanDay = { day: string; items: string[] };

export type TimerBlock = { label: string; minutes: number };

export type Artifact =
  | { kind: "flashcards"; intro: string; title: string; cards: Flashcard[] }
  | { kind: "quiz"; intro: string; title: string; questions: QuizQuestion[] }
  | { kind: "notes"; intro: string; title: string; sections: NoteSection[] }
  | { kind: "plan"; intro: string; title: string; days: PlanDay[] }
  | {
      kind: "timer";
      intro: string;
      title: string;
      minutes: number;
      blocks: TimerBlock[];
    };

const LIMITS: Record<ArtifactFormat, number> = {
  flashcards: 16,
  quiz: 10,
  anteckningar: 8,
  fokustimer: 8,
  laxplan: 7,
};

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

function list(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

function extractJson(raw: string): string | null {
  const cleaned = raw
    .replace(/^```(?:json)?/i, "")
    .replace(/```$/i, "")
    .trim();
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");
  if (start === -1 || end <= start) return null;
  return cleaned.slice(start, end + 1);
}

export function parseArtifact(
  format: ArtifactFormat,
  raw: string,
): Artifact | null {
  const json = extractJson(raw);
  if (!json) return null;

  let data: Record<string, unknown>;
  try {
    data = JSON.parse(json) as Record<string, unknown>;
  } catch {
    return null;
  }

  const intro = text(data.intro) || "Här är materialet jag gjorde åt dig.";
  const title = text(data.title) || "Studiematerial";
  const max = LIMITS[format];

  if (format === "flashcards") {
    const cards = list(data.cards)
      .map((item) => {
        const card = item as Record<string, unknown>;
        return { front: text(card.front), back: text(card.back) };
      })
      .filter((card) => card.front && card.back)
      .slice(0, max);

    if (cards.length === 0) return null;
    return { kind: "flashcards", intro, title, cards };
  }

  if (format === "quiz") {
    const questions = list(data.questions)
      .map((item) => {
        const question = item as Record<string, unknown>;
        const options = list(question.options)
          .map((option) => text(option))
          .filter(Boolean);
        const answer = Number(question.answer);
        return {
          question: text(question.question),
          options,
          answer:
            Number.isInteger(answer) && answer < options.length ? answer : 0,
        };
      })
      .filter((question) => question.question && question.options.length >= 2)
      .slice(0, max);

    if (questions.length === 0) return null;
    return { kind: "quiz", intro, title, questions };
  }

  if (format === "anteckningar") {
    const sections = list(data.sections)
      .map((item) => {
        const section = item as Record<string, unknown>;
        return {
          title: text(section.title),
          points: list(section.points)
            .map((point) => text(point))
            .filter(Boolean),
        };
      })
      .filter((section) => section.title && section.points.length > 0)
      .slice(0, max);

    if (sections.length === 0) return null;
    return { kind: "notes", intro, title, sections };
  }

  if (format === "laxplan") {
    const days = list(data.days)
      .map((item) => {
        const day = item as Record<string, unknown>;
        return {
          day: text(day.day),
          items: list(day.items)
            .map((entry) => text(entry))
            .filter(Boolean),
        };
      })
      .filter((day) => day.day && day.items.length > 0)
      .slice(0, max);

    if (days.length === 0) return null;
    return { kind: "plan", intro, title, days };
  }

  const minutes = Math.round(Number(data.minutes));
  const blocks = list(data.blocks)
    .map((item) => {
      const block = item as Record<string, unknown>;
      return {
        label: text(block.label),
        minutes: Math.round(Number(block.minutes)),
      };
    })
    .filter((block) => block.label && block.minutes > 0)
    .slice(0, max);

  const focus =
    Number.isFinite(minutes) && minutes >= 1 && minutes <= 180
      ? minutes
      : (blocks[0]?.minutes ?? 25);

  return { kind: "timer", intro, title, minutes: focus, blocks };
}
