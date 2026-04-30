import Link from "next/link";
import ReadinessDashboard from "@/components/ReadinessDashboard";
import { getAllModules } from "@/lib/modules";

export default function ProgressPage() {
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="mb-6 flex flex-wrap gap-3">
          <Link
            href="/"
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
          >
            Learning path
          </Link>
          <Link
            href="/glossary"
            className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-700 transition-colors hover:border-blue-500 hover:text-blue-600 dark:border-zinc-700 dark:text-zinc-200 dark:hover:text-blue-400"
          >
            Glossary
          </Link>
        </div>
        <ReadinessDashboard modules={modules} />
      </main>
    </div>
  );
}
