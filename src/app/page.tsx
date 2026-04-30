import Link from "next/link";
import LearningPathDashboard from "@/components/LearningPathDashboard";
import { competencyLabels, practiceLabels } from "@/lib/course-schema";
import { getAllModules } from "@/lib/modules";

export default function Home() {
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
            SRE learning path
          </p>
          <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
            Train for SRE interviews with a guided path that emphasizes judgment, not memorization.
          </h1>
          <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
            The curriculum stays structured and beginner-friendly, but every module now pushes toward the skills hiring
            loops probe: troubleshooting, systems design, Linux, Kubernetes, alerting, and blameless communication.
          </p>
        </header>

        <LearningPathDashboard modules={modules} />

        <section className="mb-14 grid gap-4 rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">Competency coverage</h2>
              <p className="mt-2 text-zinc-600 dark:text-zinc-400">
                The path is designed to build the core interview surfaces an SRE candidate is usually judged on.
              </p>
            </div>
            <Link
              href="/readiness"
              className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Open readiness dashboard
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {Object.entries(competencyLabels).map(([key, label]) => (
              <span
                key={key}
                className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-sm text-zinc-700 dark:border-zinc-700 dark:bg-black dark:text-zinc-300"
              >
                {label}
              </span>
            ))}
          </div>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          {modules.map((module) => (
            <Link
              key={module.slug}
              href={`/modules/${module.slug}`}
              className="group rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-500 hover:shadow-lg dark:border-zinc-800 dark:bg-zinc-900"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
                    Module {String(module.order).padStart(2, "0")}
                  </p>
                  <h2 className="mt-3 text-2xl font-semibold text-zinc-950 transition-colors group-hover:text-blue-600 dark:text-zinc-50 dark:group-hover:text-blue-400">
                    {module.meta.title}
                  </h2>
                </div>
                <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-black dark:text-zinc-300">
                  {module.meta.level}
                </span>
              </div>

              <p className="mt-3 text-zinc-600 dark:text-zinc-400">{module.meta.description}</p>

              <div className="mt-5 flex flex-wrap gap-2">
                {module.meta.competencies.map((competency) => (
                  <span
                    key={competency}
                    className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-600 dark:border-zinc-700 dark:bg-black dark:text-zinc-300"
                  >
                    {competencyLabels[competency]}
                  </span>
                ))}
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {module.meta.practice.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                  >
                    {practiceLabels[item]}
                  </span>
                ))}
              </div>

              <div className="mt-6 flex items-center justify-between text-sm text-zinc-500 dark:text-zinc-400">
                <span>{module.meta.estimatedMinutes} min</span>
                <span className="font-medium text-blue-600 dark:text-blue-400">Start module →</span>
              </div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
