"use client";

import { useState } from "react";
import { useMascot } from "@/components/mascot-context";

type Question = {
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};

const questions: Question[] = [
  {
    prompt: "Vad är 1/4 + 2/4?",
    options: ["3/8", "3/4", "2/6"],
    answer: 1,
    explanation: "Nämnaren behåller du och adderar täljarna: 1 + 2 = 3, alltså 3/4.",
  },
  {
    prompt: "Vilket ord betyder ungefär samma sak som envis?",
    options: ["Ihärdig", "Förvirrad", "Nyfiken"],
    answer: 0,
    explanation: "Envis och ihärdig betyder båda att man håller fast vid sitt.",
  },
  {
    prompt: "Vad betyder ambivalent?",
    options: ["Mycket glad", "Rädd för höjder", "Motstridiga känslor"],
    answer: 2,
    explanation: "Ambivalent betyder att man känner två saker samtidigt, till exempel både ja och nej.",
  },
];

export default function Assignment() {
  const { report, finish } = useMascot();
  const [index, setIndex] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);

  const question = questions[index];
  const answered = picked !== null;
  const wasCorrect = answered && picked === question.answer;

  function choose(option: number) {
    if (answered) return;

    setPicked(option);
    const correct = option === question.answer;
    report(correct);
    if (correct) setScore((value) => value + 1);
  }

  function next() {
    if (index + 1 < questions.length) {
      setIndex(index + 1);
      setPicked(null);
      return;
    }

    setFinished(true);
    finish({
      score,
      total: questions.length,
      time: new Date().toLocaleTimeString("sv-SE", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });

    void fetch("/api/submissions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ score, total: questions.length }),
    }).catch(() => undefined);
  }

  if (finished) return null;

  return (
    <section className="rounded-[18px] border border-line bg-card p-5">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[12px] text-ink-muted">Övningsuppgift</p>
        <span className="text-[11.5px] text-ink-muted tabular-nums">
          Fråga {index + 1} av {questions.length}
        </span>
      </div>

      <h2 className="mt-1 text-[17px] leading-[1.35] font-semibold text-ink">
        {question.prompt}
      </h2>

      <div className="mt-4 space-y-2">
        {question.options.map((option, optionIndex) => {
          const isAnswer = optionIndex === question.answer;
          const isPicked = optionIndex === picked;

          return (
            <button
              key={option}
              type="button"
              onClick={() => choose(optionIndex)}
              disabled={answered}
              className={[
                "flex w-full items-center justify-between gap-3 rounded-xl border px-4 py-3 text-left text-[13px] transition-colors duration-150",
                answered && isAnswer
                  ? "border-accent bg-accent-soft text-ink"
                  : answered && isPicked
                    ? "border-control-line text-ink-soft opacity-70"
                    : answered
                      ? "border-line text-ink-muted opacity-50"
                      : "border-line text-ink-soft hover:border-control-line hover:bg-card-raised",
              ].join(" ")}
            >
              <span>{option}</span>
              {answered && isAnswer ? (
                <span className="text-[11px] font-medium text-accent">
                  Rätt svar
                </span>
              ) : null}
            </button>
          );
        })}
      </div>

      {answered ? (
        <div className="mt-4 rounded-xl border border-line-soft bg-card-raised px-4 py-3">
          <p className="text-[12.5px] font-medium text-ink">
            {wasCorrect ? "Rätt!" : "Inte riktigt."}
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-ink-muted">
            {question.explanation}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex items-center justify-between gap-3">
        <span className="text-[11.5px] text-ink-muted tabular-nums">
          {score} rätt hittills
        </span>
        <button
          type="button"
          onClick={next}
          disabled={!answered}
          className="h-9 rounded-full bg-accent px-4 text-[12.5px] font-semibold text-on-peach transition-opacity duration-150 hover:opacity-90 disabled:opacity-40"
        >
          {index + 1 < questions.length ? "Nästa fråga" : "Avsluta passet"}
        </button>
      </div>
    </section>
  );
}
