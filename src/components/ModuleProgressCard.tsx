"use client";

import Link from "next/link";
import { competencyLabels, practiceLabels, type Competency, type PracticeType } from "@/lib/course-schema";
import { useLearningProgress } from "@/lib/learning-progress";

interface ModuleProgressCardProps {
  slug: string;
  title: string;
  competencies: Competency[];
  practice: PracticeType[];
}

export default function ModuleProgressCard({
  slug,
  title,
  competencies,
  practice,
}: ModuleProgressCardProps) {
  const { completedModuleSet, setModuleCompleted } = useLearningProgress();
  const isComplete = completedModuleSet.has(slug);

  return (
    <aside className="not-prose rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/60">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-600 dark:text-blue-400">
            Module progress
          </p>
          <h2 className="mt-2 text-xl font-semibold text-zinc-900 dark:text-zinc-50">{title}</h2>
        </div>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            isComplete
              ? "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300"
              : "bg-zinc-200 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          {isComplete ? "Completed" : "In progress"}
        </span>
      </div>

      <div className="space-y-4 text-sm">
        <div>
          <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Competencies</p>
          <div className="flex flex-wrap gap-2">
            {competencies.map((competency) => (
              <span
                key={competency}
                className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-300"
              >
                {competencyLabels[competency]}
              </span>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-2 font-semibold text-zinc-900 dark:text-zinc-100">Practice in this module</p>
          <div className="flex flex-wrap gap-2">
            {practice.map((item) => (
              <span
                key={item}
                className="rounded-full border border-blue-200 bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:border-blue-900 dark:bg-blue-950/30 dark:text-blue-300"
              >
                {practiceLabels[item]}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => setModuleCompleted(slug, !isComplete)}
          className="rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
        >
          {isComplete ? "Mark as not done" : "Mark module complete"}
        </button>
        <Link
          href="/progress"
          className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
        >
          View progress
        </Link>
      </div>
    </aside>
  );
}
