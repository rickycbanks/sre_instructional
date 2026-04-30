# SRE Interview Learning Path

This project is a **Next.js + MDX learning path** for technically literate learners who want to become interview-ready for Site Reliability Engineering roles.

It keeps the structure of a guided course, but each module is designed to move beyond passive reading:

- **curriculum coverage** across SRE foundations, SLOs, observability, incident response, cloud/IaC, service mesh, security, FinOps, Linux/networking, and Kubernetes release safety
- **interactive drills** for decision-making, alert tuning, troubleshooting, and command selection
- **rubric-based feedback** that distinguishes weak, acceptable, and strong answers
- **browser-local progress tracking** for module completion, drill performance, and readiness summaries

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- MDX content rendered through the App Router

## Getting started

```bash
npm install
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000).

## Project structure

```text
src/
  app/
    page.tsx                     # learning path homepage
    readiness/page.tsx           # learner readiness dashboard
    modules/[slug]/page.tsx      # module page renderer
  components/
    DecisionDrill.tsx            # scenario-based interview drills
    CommandChallenge.tsx         # command/diagnosis drills
    LearningPathDashboard.tsx    # homepage progress summary
    ModuleProgressCard.tsx       # per-module completion + quick links
    ReadinessDashboard.tsx       # competency summary view
  content/modules/*.mdx          # curriculum content
  lib/
    drills.ts                    # typed drill definitions
    learning-progress.ts         # browser-local persistence
    modules.ts                   # module metadata + parsing
```

## Content model

Each module is still authored in MDX, but frontmatter now carries richer metadata:

- level
- estimated time
- competencies
- practice types
- interview focus
- outcomes

Interactive exercises are embedded directly inside MDX using reusable components such as:

- `Quiz`
- `DecisionDrill`
- `CommandChallenge`
- `SLOCalculator`
- `InterviewSandbox`

## Product goal

The target outcome is not just "understand SRE concepts." It is:

> learn the ideas, practice the judgment, and build the communication patterns that help someone get hired into an SRE role.

## GitHub Pages deployment

This repository now includes `.github/workflows/deploy-pages.yml`, which:

1. installs dependencies
2. builds a static Next.js export
3. uploads the `out/` directory to GitHub Pages

The workflow automatically sets a repo-aware base path so it works for either:

- `username.github.io` user/org Pages repositories
- normal project repositories published under `https://username.github.io/repository-name/`
