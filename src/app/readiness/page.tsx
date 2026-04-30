import ReadinessDashboard from "@/components/ReadinessDashboard";
import { getAllModules } from "@/lib/modules";

export default function ReadinessPage() {
  const modules = getAllModules();

  return (
    <div className="min-h-screen bg-zinc-50 text-black dark:bg-black dark:text-zinc-50">
      <main className="mx-auto max-w-6xl px-6 py-20">
        <ReadinessDashboard modules={modules} />
      </main>
    </div>
  );
}
