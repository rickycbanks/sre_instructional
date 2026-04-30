import Link from "next/link";
import { glossaryTerms } from "@/lib/glossary";

function groupByLetter() {
  const groups = new Map<string, typeof glossaryTerms>();

  for (const term of [...glossaryTerms].sort((left, right) => left.term.localeCompare(right.term))) {
    const letter = term.term[0]?.toUpperCase() ?? "#";
    const existing = groups.get(letter) ?? [];
    existing.push(term);
    groups.set(letter, existing);
  }

  return Array.from(groups.entries());
}

export default function GlossaryPage() {
  const groups = groupByLetter();

  return (
    <div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <header className="mb-12 flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-blue-600 dark:text-blue-400">
              Reference glossary
            </p>
            <h1 className="mt-4 max-w-4xl text-5xl font-bold tracking-tight text-zinc-950 dark:text-zinc-50">
              Container, Docker, Kubernetes, and reliability terms you can jump to quickly.
            </h1>
            <p className="mt-4 max-w-3xl text-lg leading-relaxed text-zinc-600 dark:text-zinc-400">
              Use this as a refresher while you work through modules or prepare for interviews. Each term includes a
              plain-language definition and why it matters in real operational conversations.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              href="/"
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
            >
              Back to learning path
            </Link>
            <Link
              href="/readiness"
              className="rounded-xl bg-zinc-950 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-white dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              Readiness dashboard
            </Link>
          </div>
        </header>

        <nav className="mb-8 flex flex-wrap gap-2">
          {groups.map(([letter]) => (
            <a
              key={letter}
              href={`#letter-${letter}`}
              className="rounded-full border border-zinc-200 bg-white px-3 py-1 text-sm text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:text-blue-400"
            >
              {letter}
            </a>
          ))}
        </nav>

        <div className="space-y-10">
          {groups.map(([letter, entries]) => (
            <section key={letter} id={`letter-${letter}`} className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
              <h2 className="text-2xl font-semibold text-zinc-950 dark:text-zinc-50">{letter}</h2>
              <div className="mt-6 grid gap-4">
                {entries.map((entry) => (
                  <article
                    key={entry.slug}
                    id={entry.slug}
                    className="rounded-2xl border border-zinc-200 bg-zinc-50 p-5 dark:border-zinc-800 dark:bg-black"
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <h3 className="text-xl font-semibold text-zinc-950 dark:text-zinc-50">{entry.term}</h3>
                      <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700 dark:bg-blue-950/30 dark:text-blue-300">
                        {entry.category}
                      </span>
                    </div>
                    <p className="mt-3 text-zinc-700 dark:text-zinc-300">{entry.definition}</p>
                    <p className="mt-3 text-sm text-zinc-500 dark:text-zinc-400">
                      <span className="font-semibold text-zinc-700 dark:text-zinc-300">Why it matters:</span>{" "}
                      {entry.whyItMatters}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
