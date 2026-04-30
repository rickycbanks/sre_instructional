"use client";

import Link from "next/link";
import {
  competencyLabels,
  type Competency,
  type Module,
} from "@/lib/course-schema";
import { useLearningProgress } from "@/lib/learning-progress";

interface ReadinessDashboardProps {
  modules: Module[];
}

function getCompetencyScores(modules: Module[], completedModules: Set<string>, drillResults: Record<string, { score: number; maxScore: number; competencies: Competency[] }>) {
  return Object.entries(competencyLabels).map(([key, label]) => {
    const competency = key as Competency;
    const matchingModules = modules.filter((module) => module.meta.competencies.includes(competency));
    const moduleCompletion = matchingModules.length === 0 ? 0 : matchingModules.filter((module) => completedModules.has(module.slug)).length / matchingModules.length;
    const relatedDrills = Object.values(drillResults).filter((result) => result.competencies.includes(competency));
    const drillScore =
      relatedDrills.length === 0
        ? 0
        : relatedDrills.reduce((total, result) => total + result.score / result.maxScore, 0) / relatedDrills.length;
    const overall = Math.round((moduleCompletion * 0.4 + drillScore * 0.6) * 100);

    return {
      competency,
      label,
      overall,
      moduleCompletion: Math.round(moduleCompletion * 100),
      drillScore: Math.round(drillScore * 100),
    };
  });
}

function bandForScore(score: number) {
  if (score >= 75) {
    return "Established";
  }

  if (score >= 45) {
    return "Developing";
  }

  return "Needs focused practice";
}

export default function ReadinessDashboard({ modules }: ReadinessDashboardProps) {
  const { state, completedModuleSet } = useLearningProgress();
  const scores = getCompetencyScores(modules, completedModuleSet, state.drillResults).sort(
    (left, right) => right.overall - left.overall,
  );
  const nextModule = modules.find((module) => !completedModuleSet.has(module.slug)) ?? modules[0];

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-white p-8 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
          Progress dashboard
        </p>
        <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
          See where your platform and reliability skills are already strong and where to keep practicing.
        </h1>
        <p className="mt-3 max-w-3xl text-zinc-600 dark:text-zinc-400">
          Scores blend learning-path completion with the best recorded drill results for each competency. It is a coaching
          tool, not a certification, but it gives learners a concrete way to focus on weak spots.
        </p>

        <div className="mt-6 flex flex-wrap gap-4">
          <div className="rounded-2xl bg-zinc-50 px-5 py-4 dark:bg-black">
            <p className="text-sm text-zinc-500">Completed modules</p>
            <p className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">
              {state.completedModules.length}
              <span className="text-base font-medium text-zinc-500"> / {modules.length}</span>
            </p>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-5 py-4 dark:bg-black">
            <p className="text-sm text-zinc-500">Recorded drill attempts</p>
            <p className="text-3xl font-bold text-zinc-950 dark:text-zinc-50">{Object.keys(state.drillResults).length}</p>
          </div>
          <div className="rounded-2xl bg-zinc-50 px-5 py-4 dark:bg-black">
            <p className="text-sm text-zinc-500">Recommended next module</p>
            <p className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">{nextModule.meta.title}</p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        {scores.map((item) => (
          <article
            key={item.competency}
            className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/70"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">{item.label}</h2>
                <p className="mt-1 text-sm text-zinc-500">{bandForScore(item.overall)}</p>
              </div>
              <span className="rounded-full bg-blue-100 px-3 py-1 text-sm font-semibold text-blue-700 dark:bg-blue-950/40 dark:text-blue-300">
                {item.overall}%
              </span>
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <div className="rounded-2xl bg-white p-4 dark:bg-black">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Module coverage</p>
                <p className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{item.moduleCompletion}%</p>
              </div>
              <div className="rounded-2xl bg-white p-4 dark:bg-black">
                <p className="text-xs uppercase tracking-[0.25em] text-zinc-500">Best drill performance</p>
                <p className="mt-2 text-2xl font-bold text-zinc-950 dark:text-zinc-50">{item.drillScore}%</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      <div className="not-prose">
        <Link
          href="/"
          className="inline-flex rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
        >
          Back to learning path
        </Link>
      </div>
    </div>
  );
}
