import type { Metadata } from "next";
import { MDXRemote } from "next-mdx-remote/rsc";
import Link from "next/link";
import { notFound } from "next/navigation";
import remarkGfm from "remark-gfm";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import CloudReferenceCard from "@/components/CloudReferenceCard";
import CommandChallenge from "@/components/CommandChallenge";
import DecisionDrill from "@/components/DecisionDrill";
import PracticeSandbox from "@/components/PracticeSandbox";
import ModuleProgressCard from "@/components/ModuleProgressCard";
import Quiz from "@/components/Quiz";
import ReadinessDashboard from "@/components/ReadinessDashboard";
import SLOCalculator from "@/components/SLOCalculator";
import ScenarioSimulator from "@/components/ScenarioSimulator";
import { competencyLabels, practiceLabels } from "@/lib/course-schema";
import {
  getAllModules,
  getModuleBySlug,
  getNextModule,
  getPreviousModule,
} from "@/lib/modules";

const components = {
  SLOCalculator,
  CloudReferenceCard,
  Quiz,
  ScenarioSimulator,
  PracticeSandbox,
  DecisionDrill,
  CommandChallenge,
  ReadinessDashboard,
};

const mdxOptions = {
  mdxOptions: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      [rehypeAutolinkHeadings, { behavior: "wrap" }] as [typeof rehypeAutolinkHeadings, { behavior: "wrap" }],
    ],
  },
};

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllModules().map((module) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const currentModule = getModuleBySlug(slug);

  if (!currentModule) {
    return {
      title: "Module not found",
    };
  }

  return {
    title: currentModule.meta.title,
    description: currentModule.meta.description,
  };
}

export default async function ModulePage({ params }: PageProps) {
  const { slug } = await params;
  const currentModule = getModuleBySlug(slug);

  if (!currentModule) {
    notFound();
  }

  const nextModule = getNextModule(slug);
  const previousModule = getPreviousModule(slug);

  return (
    <div className="min-h-screen bg-white text-black dark:bg-black dark:text-zinc-50">
      <header className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-black/80">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 transition-colors hover:text-blue-600 dark:text-zinc-300 dark:hover:text-blue-400"
          >
            ← Back to learning path
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/glossary"
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
            >
              Glossary
            </Link>
            <Link
              href="/progress"
              className="rounded-full border border-zinc-200 px-3 py-1 text-xs font-semibold text-zinc-600 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-300 dark:hover:text-blue-400"
            >
              Progress
            </Link>
            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-600 dark:bg-zinc-900 dark:text-zinc-300">
              {currentModule.slug.toUpperCase()}
            </span>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-10 px-6 py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <article className="min-w-0">
          <div className="mb-10 not-prose">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-blue-600 dark:text-blue-400">
              {currentModule.meta.level} module
            </p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              {currentModule.meta.title}
            </h1>
            <p className="mt-4 max-w-3xl text-lg text-zinc-600 dark:text-zinc-400">{currentModule.meta.description}</p>

            <div className="mt-6 flex flex-wrap gap-2">
              {currentModule.meta.competencies.map((competency) => (
                <span
                  key={competency}
                  className="rounded-full border border-zinc-200 bg-zinc-50 px-3 py-1 text-xs text-zinc-700 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300"
                >
                  {competencyLabels[competency]}
                </span>
              ))}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {currentModule.meta.practice.map((item) => (
                <span
                  key={item}
                  className="rounded-full bg-blue-50 px-3 py-1 text-xs text-blue-700 dark:bg-blue-950/30 dark:text-blue-300"
                >
                  {practiceLabels[item]}
                </span>
              ))}
            </div>

            {currentModule.meta.practiceFocus.length > 0 ? (
              <div className="mt-6 rounded-3xl border border-zinc-200 bg-zinc-50 p-6 dark:border-zinc-800 dark:bg-zinc-900/50">
                <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Practice focus</h2>
                <ul className="mt-3 space-y-2 text-sm text-zinc-600 dark:text-zinc-400">
                  {currentModule.meta.practiceFocus.map((item) => (
                    <li key={item}>• {item}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>

          <div className="prose prose-zinc max-w-none dark:prose-invert lg:prose-lg">
            <MDXRemote source={currentModule.content} components={components} options={mdxOptions} />
          </div>

          <div className="mt-12 grid gap-4 not-prose md:grid-cols-2">
            {previousModule ? (
              <Link
                href={`/modules/${previousModule.slug}`}
                className="rounded-3xl border border-zinc-200 bg-zinc-50 p-6 transition-colors hover:border-blue-500 dark:border-zinc-800 dark:bg-zinc-900"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-500">Previous module</p>
                <p className="mt-3 text-lg font-semibold text-zinc-950 dark:text-zinc-50">{previousModule.meta.title}</p>
              </Link>
            ) : (
              <div />
            )}

            {nextModule ? (
              <Link
                href={`/modules/${nextModule.slug}`}
                className="rounded-3xl bg-blue-600 p-6 text-white transition-colors hover:bg-blue-700"
              >
                <p className="text-xs font-semibold uppercase tracking-[0.25em] text-blue-100">Next module</p>
                <p className="mt-3 text-lg font-semibold">{nextModule.meta.title}</p>
              </Link>
            ) : null}
          </div>
        </article>

        <div className="space-y-6 lg:sticky lg:top-24 lg:self-start">
          <ModuleProgressCard
            slug={currentModule.slug}
            title={currentModule.meta.title}
            competencies={currentModule.meta.competencies}
            practice={currentModule.meta.practice}
          />

          {currentModule.meta.outcomes.length > 0 ? (
            <aside className="not-prose rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">By the end of this module</h2>
              <ul className="mt-4 space-y-3 text-sm text-zinc-600 dark:text-zinc-400">
                {currentModule.meta.outcomes.map((item) => (
                  <li key={item}>• {item}</li>
                ))}
              </ul>
            </aside>
          ) : null}

          <aside className="not-prose rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
            <h2 className="text-lg font-semibold text-zinc-950 dark:text-zinc-50">Need a quick definition?</h2>
            <p className="mt-3 text-sm text-zinc-600 dark:text-zinc-400">
              Jump to the glossary for container, Docker, Kubernetes, and reliability terms while you work through the module.
            </p>
            <Link
              href="/glossary"
              className="mt-4 inline-flex rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
            >
              Open glossary
            </Link>
          </aside>
        </div>
      </main>
    </div>
  );
}
