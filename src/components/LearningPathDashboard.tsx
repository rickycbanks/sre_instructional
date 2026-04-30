"use client";

import Link from "next/link";
import {
  competencyLabels,
  type Competency,
  type Module,
} from "@/lib/course-schema";
import { useLearningProgress } from "@/lib/learning-progress";

interface LearningPathDashboardProps {
  modules: Module[];
}

function getCompetencyCoverage(modules: Module[], completedModules: Set<string>) {
  return Object.entries(competencyLabels).map(([key, label]) => {
    const typedKey = key as Competency;
    const matchingModules = modules.filter((module) => module.meta.competencies.includes(typedKey));
    const completed = matchingModules.filter((module) => completedModules.has(module.slug)).length;
    const progress = matchingModules.length === 0 ? 0 : Math.round((completed / matchingModules.length) * 100);

    return {
      key: typedKey,
      label,
      progress,
    };
  });
}

export default function LearningPathDashboard({ modules }: LearningPathDashboardProps) {
  const { state, completedModuleSet } = useLearningProgress();
  const completedModules = state.completedModules.length;
  const totalModules = modules.length;
  const progressByCompetency = getCompetencyCoverage(modules, completedModuleSet)
    .sort((left, right) => right.progress - left.progress);
  const strongest = progressByCompetency.filter((item) => item.progress >= 50).slice(0, 3);
  const needsWork = progressByCompetency.filter((item) => item.progress < 50).slice(0, 3);
  const recommendedModule = modules.find((module) => !completedModuleSet.has(module.slug)) ?? modules[0];

  return (
    <section className="mb-12 not-prose">
      <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
            Applied learning path
          </p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight text-zinc-950 dark:text-zinc-50">
            Learn the concepts, then practice the judgment platform teams actually rely on.
          </h2>
          <p className="mt-3 max-w-2xl text-zinc-600 dark:text-zinc-400">
            Each module now mixes explanations with drills in troubleshooting, systems design, Linux, Kubernetes,
            alerting, and behavioral communication.
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-black">
              <p className="text-sm text-zinc-500">Modules completed</p>
              <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
                {completedModules}
                <span className="text-base font-medium text-zinc-500"> / {totalModules}</span>
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-black">
              <p className="text-sm text-zinc-500">Practice records</p>
              <p className="mt-1 text-3xl font-bold text-zinc-950 dark:text-zinc-50">
                {Object.keys(state.drillResults).length}
              </p>
            </div>
            <div className="rounded-2xl bg-zinc-50 p-4 dark:bg-black">
              <p className="text-sm text-zinc-500">Recommended next step</p>
              <p className="mt-1 text-lg font-semibold text-zinc-950 dark:text-zinc-50">
                {recommendedModule.meta.title}
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/70">
          <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">Current progress snapshot</p>

          <div className="mt-4 space-y-4">
            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Strongest coverage</p>
              <div className="flex flex-wrap gap-2">
                {(strongest.length > 0 ? strongest : progressByCompetency.slice(0, 3)).map((item) => (
                  <span
                    key={item.key}
                    className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 dark:bg-green-950/40 dark:text-green-300"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Still to strengthen</p>
              <div className="flex flex-wrap gap-2">
                {needsWork.map((item) => (
                  <span
                    key={item.key}
                    className="rounded-full bg-amber-100 px-3 py-1 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300"
                  >
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            <Link
              href="/progress"
              className="inline-flex rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Open progress dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
