import fs from "fs";
import path from "path";
import matter from "gray-matter";
import {
  competencyLabels,
  practiceLabels,
  type Competency,
  type Module,
  type ModuleMeta,
  type PracticeType,
} from "@/lib/course-schema";

const modulesDirectory = path.join(process.cwd(), "src/content/modules");

function slugToTitle(slug: string) {
  return slug
    .split("-")
    .slice(1)
    .join(" ")
    .replace(/\b\w/g, (character) => character.toUpperCase());
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];
}

function isCompetency(value: string): value is Competency {
  return value in competencyLabels;
}

function isPracticeType(value: string): value is PracticeType {
  return value in practiceLabels;
}

function estimateMinutes(content: string) {
  return Math.max(10, Math.round(content.split(/\s+/).filter(Boolean).length / 180));
}

function parseModuleMeta(slug: string, data: Record<string, unknown>, content: string): ModuleMeta {
  const competencies = asStringArray(data.competencies).filter(isCompetency);
  const practice = asStringArray(data.practice).filter(isPracticeType);
  const level = data.level;
  const estimatedMinutesValue =
    typeof data.estimated_minutes === "number"
      ? data.estimated_minutes
      : typeof data.estimatedMinutes === "number"
        ? data.estimatedMinutes
        : undefined;

  return {
    title: typeof data.title === "string" ? data.title : slugToTitle(slug),
    description:
      typeof data.description === "string"
        ? data.description
        : "Build the skills and judgment expected from a working SRE.",
    level: level === "Applied" || level === "Interview" ? level : "Core",
    estimatedMinutes:
      typeof estimatedMinutesValue === "number" && Number.isFinite(estimatedMinutesValue)
        ? estimatedMinutesValue
        : estimateMinutes(content),
    competencies: competencies.length > 0 ? competencies : ["foundations"],
    practice: practice.length > 0 ? practice : ["quiz"],
    practiceFocus: asStringArray(data.practice_focus),
    outcomes: asStringArray(data.outcomes),
  };
}

export function getModuleSlugs() {
  return fs.readdirSync(modulesDirectory).filter((entry) => entry.endsWith(".mdx"));
}

export function getModuleBySlug(slug: string): Module | null {
  const realSlug = slug.replace(/\.mdx$/, "");
  const fullPath = path.join(modulesDirectory, `${realSlug}.mdx`);

  if (!fs.existsSync(fullPath)) {
    return null;
  }

  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);
  const wordCount = content.split(/\s+/).filter(Boolean).length;

  return {
    slug: realSlug,
    order: Number.parseInt(realSlug.split("-")[0] ?? "999", 10),
    meta: parseModuleMeta(realSlug, data, content),
    content,
    wordCount,
  };
}

export function getAllModules() {
  return getModuleSlugs()
    .map((slug) => getModuleBySlug(slug))
    .filter((module): module is Module => module !== null)
    .sort((left, right) => {
      if (left.order === right.order) {
        return left.slug.localeCompare(right.slug);
      }

      return left.order - right.order;
    });
}

export function getNextModule(currentSlug: string) {
  const modules = getAllModules();
  const currentIndex = modules.findIndex((module) => module.slug === currentSlug);
  return currentIndex !== -1 && currentIndex < modules.length - 1 ? modules[currentIndex + 1] : null;
}

export function getPreviousModule(currentSlug: string) {
  const modules = getAllModules();
  const currentIndex = modules.findIndex((module) => module.slug === currentSlug);
  return currentIndex > 0 ? modules[currentIndex - 1] : null;
}
