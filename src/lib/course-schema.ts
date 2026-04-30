export const competencyLabels = {
  foundations: "Foundations",
  slos: "SLOs",
  observability: "Observability",
  "incident-response": "Incident response",
  linux: "Linux",
  networking: "Networking",
  kubernetes: "Kubernetes",
  cloud: "Cloud",
  "release-engineering": "Release engineering",
  security: "Security",
  finops: "FinOps",
  communication: "Communication",
} as const;

export const practiceLabels = {
  quiz: "Knowledge check",
  calculator: "Calculator",
  "decision-drill": "Decision drill",
  "command-drill": "Command drill",
  "design-drill": "Design drill",
  "behavioral-drill": "Behavioral drill",
  capstone: "Capstone",
  reference: "Reference",
} as const;

export type Competency = keyof typeof competencyLabels;
export type PracticeType = keyof typeof practiceLabels;

export interface ModuleMeta {
  title: string;
  description: string;
  level: "Core" | "Applied" | "Interview";
  estimatedMinutes: number;
  competencies: Competency[];
  practice: PracticeType[];
  interviewFocus: string[];
  outcomes: string[];
}

export interface Module {
  slug: string;
  order: number;
  meta: ModuleMeta;
  content: string;
  wordCount: number;
}
