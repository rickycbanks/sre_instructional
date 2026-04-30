"use client";

import { useMemo, useState } from "react";
import { decisionDrills } from "@/lib/drills";
import { useLearningProgress } from "@/lib/learning-progress";
import type { RubricBand } from "@/lib/drills";

interface DecisionDrillProps {
  drillId: keyof typeof decisionDrills;
}

function bandFromScore(score: number) {
  if (score >= 0.8) {
    return "strong";
  }

  if (score >= 0.5) {
    return "acceptable";
  }

  return "weak";
}

export default function DecisionDrill({ drillId }: DecisionDrillProps) {
  const drill = decisionDrills[drillId];
  const { recordDrillResult } = useLearningProgress();
  const [stepIndex, setStepIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [scores, setScores] = useState<number[]>([]);

  const step = drill.steps[stepIndex];
  const isComplete = stepIndex >= drill.steps.length;
  const totalScore = useMemo(() => scores.reduce((sum, value) => sum + value, 0), [scores]);
  const maxScore = drill.steps.length * 2;
  const band = bandFromScore(maxScore === 0 ? 0 : totalScore / maxScore) as RubricBand;

  const advance = () => {
    if (selectedOption === null) {
      return;
    }

    const option = step.options[selectedOption];
    const nextScores = [...scores, option.score];
    const nextStepIndex = stepIndex + 1;

    setScores(nextScores);
    setSelectedOption(null);
    setStepIndex(nextStepIndex);

    if (nextStepIndex === drill.steps.length) {
      recordDrillResult(drill.id, {
        title: drill.title,
        score: nextScores.reduce((sum, value) => sum + value, 0),
        maxScore,
        competencies: drill.competencies,
      });
    }
  };

  const reset = () => {
    setStepIndex(0);
    setSelectedOption(null);
    setScores([]);
  };

  if (isComplete) {
    return (
      <div className="my-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm not-prose dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{drill.eyebrow}</p>
        <h3 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{drill.title}</h3>
        <p className="mt-3 text-zinc-600 dark:text-zinc-400">
          Score: <span className="font-semibold text-zinc-950 dark:text-zinc-50">{totalScore}</span> / {maxScore}
        </p>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {(Object.entries(drill.rubric) as Array<[RubricBand, (typeof drill.rubric)[RubricBand]]>).map(([key, rubric]) => (
            <div
              key={key}
              className={`rounded-2xl border p-4 ${
                band === key
                  ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-950/30"
                  : "border-zinc-200 bg-white dark:border-zinc-800 dark:bg-black"
              }`}
            >
              <p className="text-sm font-semibold text-zinc-950 dark:text-zinc-50">{rubric.title}</p>
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{rubric.description}</p>
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={reset}
          className="mt-6 rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          Retry drill
        </button>
      </div>
    );
  }

  return (
    <div className="my-10 rounded-3xl border border-zinc-200 bg-zinc-50 p-8 shadow-sm not-prose dark:border-zinc-800 dark:bg-zinc-900">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">{drill.eyebrow}</p>
          <h3 className="mt-3 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{drill.title}</h3>
          <p className="mt-2 max-w-3xl text-zinc-600 dark:text-zinc-400">{drill.description}</p>
        </div>
        <span className="rounded-full bg-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300">
          Step {stepIndex + 1} / {drill.steps.length}
        </span>
      </div>

      <div className="mt-6 rounded-2xl bg-white p-6 dark:bg-black">
        <p className="text-lg font-semibold leading-relaxed text-zinc-950 dark:text-zinc-50">{step.prompt}</p>
        {step.context ? <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">{step.context}</p> : null}
        {step.evidence && step.evidence.length > 0 ? (
          <ul className="mt-4 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
            {step.evidence.map((item) => (
              <li key={item} className="rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 dark:border-zinc-800 dark:bg-zinc-950">
                {item}
              </li>
            ))}
          </ul>
        ) : null}
      </div>

      <div className="mt-6 grid gap-3">
        {step.options.map((option, index) => (
          <button
            key={option.text}
            type="button"
            onClick={() => setSelectedOption(index)}
            className={`rounded-2xl border p-4 text-left transition-all ${
              selectedOption === index
                ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500/20 dark:bg-blue-950/20"
                : "border-zinc-200 bg-white hover:border-blue-400 dark:border-zinc-800 dark:bg-black"
            }`}
          >
            <p className="font-medium text-zinc-950 dark:text-zinc-50">{option.text}</p>
            {selectedOption === index ? (
              <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">{option.feedback}</p>
            ) : null}
          </button>
        ))}
      </div>

      <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={advance}
          disabled={selectedOption === null}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {stepIndex === drill.steps.length - 1 ? "Finish drill" : "Next step"}
        </button>
      </div>
    </div>
  );
}
