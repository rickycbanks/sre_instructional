"use client";

import { useMemo, useState } from "react";
import { commandDrills } from "@/lib/drills";
import { useLearningProgress } from "@/lib/learning-progress";
import type { RubricBand } from "@/lib/drills";

interface CommandChallengeProps {
  drillId: keyof typeof commandDrills;
}

function bandFromScore(score: number) {
  if (score >= 1) {
    return "strong";
  }

  if (score >= 0.5) {
    return "acceptable";
  }

  return "weak";
}

export default function CommandChallenge({ drillId }: CommandChallengeProps) {
  const drill = commandDrills[drillId];
  const { recordDrillResult } = useLearningProgress();
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const selected = selectedOption === null ? null : drill.options[selectedOption];
  const band = useMemo(
    () => (submitted ? (bandFromScore((selected?.score ?? 0) / 2) as RubricBand) : null),
    [selected?.score, submitted],
  );

  const submit = () => {
    if (selectedOption === null || submitted) {
      return;
    }

    setSubmitted(true);
    recordDrillResult(drill.id, {
      title: drill.title,
      score: drill.options[selectedOption].score,
      maxScore: 2,
      competencies: drill.competencies,
    });
  };

  const reset = () => {
    setSelectedOption(null);
    setSubmitted(false);
  };

  return (
    <div className="my-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm not-prose dark:border-zinc-800 dark:bg-zinc-900">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{drill.eyebrow}</p>
      <h3 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{drill.title}</h3>
      <p className="mt-2 text-zinc-600 dark:text-zinc-400">{drill.scenario}</p>

      <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-black">
        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-500">Goal</p>
        <p className="mt-2 text-lg font-medium text-zinc-950 dark:text-zinc-50">{drill.goal}</p>
      </div>

      <div className="mt-6 grid gap-3">
        {drill.options.map((option, index) => (
          <button
            key={option.command}
            type="button"
            disabled={submitted}
            onClick={() => setSelectedOption(index)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              selectedOption === index
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/20"
                : "border-zinc-200 bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-black"
            }`}
          >
            <code className="block overflow-x-auto whitespace-pre-wrap rounded-xl bg-zinc-950 px-4 py-3 text-sm text-zinc-100">
              {option.command}
            </code>
            {submitted && selectedOption === index ? (
              <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{option.feedback}</p>
            ) : null}
          </button>
        ))}
      </div>

      {submitted && band ? (
        <div className="mt-6 rounded-2xl border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-black">
          <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{drill.rubric[band].title}</p>
          <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{drill.rubric[band].description}</p>
        </div>
      ) : null}

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {submitted ? (
          <button
            type="button"
            onClick={reset}
            className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Retry command drill
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={selectedOption === null}
            className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Submit answer
          </button>
        )}
      </div>
    </div>
  );
}
