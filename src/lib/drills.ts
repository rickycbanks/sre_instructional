import type { Competency } from "@/lib/course-schema";

export type RubricBand = "weak" | "acceptable" | "strong";

export interface DrillOption {
  text: string;
  score: 0 | 1 | 2;
  feedback: string;
}

export interface DecisionDrillStep {
  prompt: string;
  context?: string;
  evidence?: string[];
  options: DrillOption[];
}

export interface DecisionDrillDefinition {
  id: string;
  title: string;
  eyebrow: string;
  description: string;
  competencies: Competency[];
  steps: DecisionDrillStep[];
  rubric: Record<RubricBand, { title: string; description: string }>;
}

export interface CommandDrillDefinition {
  id: string;
  title: string;
  eyebrow: string;
  scenario: string;
  goal: string;
  competencies: Competency[];
  options: Array<{
    command: string;
    score: 0 | 1 | 2;
    feedback: string;
  }>;
  rubric: Record<RubricBand, { title: string; description: string }>;
}

export interface InterviewPrompt {
  title: string;
  category: "Systems Design" | "Troubleshooting" | "Behavioral";
  prompt: string;
  hints: string[];
  strongAnswer: string[];
}

export const decisionDrills: Record<string, DecisionDrillDefinition> = {
  "toil-tradeoffs": {
    id: "toil-tradeoffs",
    title: "Toil triage: what should an SRE automate first?",
    eyebrow: "Foundations drill",
    description: "Choose the highest-leverage SRE actions instead of reacting tactically forever.",
    competencies: ["foundations", "communication"],
    steps: [
      {
        prompt:
          "Your team spends about 10 engineer-hours every week manually replaying failed billing jobs after a flaky downstream dependency times out.",
        context: "The replay procedure is documented and usually works, but it interrupts feature delivery every week.",
        options: [
          {
            text: "Keep replaying manually because the task is already documented and low risk.",
            score: 0,
            feedback: "This accepts recurring toil and ignores the systemic cost to the team.",
          },
          {
            text: "Automate the replay workflow and add visibility so the failure path is safe and observable.",
            score: 2,
            feedback: "Strong choice. It removes linear work and improves the system’s resilience at the same time.",
          },
          {
            text: "Escalate the issue to product and ask them to stop launches until billing is rewritten.",
            score: 1,
            feedback: "Escalation may be appropriate later, but it skips the practical reliability improvement available now.",
          },
        ],
      },
      {
        prompt:
          "Leadership asks how you justify spending time on that automation instead of pushing features for the next quarter.",
        context: "They want a short answer rooted in engineering tradeoffs, not ideology.",
        options: [
          {
            text: "Explain that toil scales linearly, burns on-call capacity, and keeps the team from shipping safely.",
            score: 2,
            feedback: "Exactly right. This frames automation as capacity recovery and reliability risk reduction.",
          },
          {
            text: "Say SRE teams should never do manual work, so the feature roadmap needs to wait.",
            score: 1,
            feedback: "The principle is directionally right, but the answer is too rigid for a practical stakeholder conversation.",
          },
          {
            text: "Avoid the conversation and just build the script quietly so nobody blocks it.",
            score: 0,
            feedback: "That misses the communication part of the role and does not build trust in reliability work.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Treats toil as unavoidable work and fails to justify automation in business terms.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Recognizes toil and suggests automation, but the prioritization logic is still shallow.",
      },
      strong: {
        title: "Strong answer",
        description: "Connects toil reduction to capacity, risk, and safer delivery while communicating clearly to stakeholders.",
      },
    },
  },
  "observability-debugging": {
    id: "observability-debugging",
    title: "Observability debugging: a latency spike with healthy CPU",
    eyebrow: "Troubleshooting drill",
    description: "Practice isolating the next best question instead of jumping to blind fixes.",
    competencies: ["observability", "incident-response"],
    steps: [
      {
        prompt:
          "p99 latency for the checkout API doubled after a deploy. CPU and memory on the pods look normal, but the 95th percentile DB query time also increased.",
        evidence: [
          "Traffic volume is flat.",
          "5xx rate moved from 0.2% to 1.4%.",
          "The only production change in the last hour was a checkout service deploy.",
        ],
        options: [
          {
            text: "Check traces or request breakdowns to see whether the new code path is adding slow database work.",
            score: 2,
            feedback: "Strong. It follows the signal toward the changed dependency rather than guessing.",
          },
          {
            text: "Double the number of pods immediately because higher latency always means the service is overloaded.",
            score: 0,
            feedback: "Scaling may help saturation, but the data here points to a slower dependency after a change.",
          },
          {
            text: "Restart the database primary to clear any long-running queries.",
            score: 0,
            feedback: "That is disruptive and unsupported by the evidence you have so far.",
          },
        ],
      },
      {
        prompt:
          "Tracing shows a new recommendation lookup is being called synchronously during checkout and adds ~400ms for many requests.",
        options: [
          {
            text: "Roll back or disable the new synchronous call to restore the user path, then investigate a safer design.",
            score: 2,
            feedback: "Excellent. It prioritizes mitigation and preserves time for root-cause work later.",
          },
          {
            text: "Leave the change in place and wait for caching to warm up since the service is still mostly working.",
            score: 0,
            feedback: "That spends user pain and error budget when a recent-change mitigation is available.",
          },
          {
            text: "Increase the SLO target so the team is not penalized for a small latency increase.",
            score: 0,
            feedback: "Changing the target does not solve the incident.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Jumps to scaling or restarts without following the evidence from metrics and traces.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Investigates recent changes and dependencies, but the mitigation reasoning is not yet crisp.",
      },
      strong: {
        title: "Strong answer",
        description: "Uses signals to narrow scope quickly, mitigates by reversing the risky change, and separates mitigation from root cause.",
      },
    },
  },
  "alert-tuning": {
    id: "alert-tuning",
    title: "Alert tuning: protect sleep without missing user pain",
    eyebrow: "Alerting drill",
    description: "Pick alert logic that follows the user experience instead of paging on every internal symptom.",
    competencies: ["slos", "observability"],
    steps: [
      {
        prompt: "You are writing a paging alert for an API with a 99.9% availability SLO and heavy weekday traffic swings.",
        options: [
          {
            text: "Page on CPU > 80% for 5 minutes because saturation is always urgent.",
            score: 0,
            feedback: "Raw resource usage is a poor primary page if it is not tied to customer impact.",
          },
          {
            text: "Page on burn-rate style error-budget consumption using user-visible failures over a short and long window.",
            score: 2,
            feedback: "Strong answer. This aligns the alert directly with the SLO and filters noise.",
          },
          {
            text: "Page any time request volume drops below forecast because lower traffic may signal a bug.",
            score: 1,
            feedback: "Traffic can matter, but on its own it is often ambiguous and should rarely be the primary page.",
          },
        ],
      },
      {
        prompt: "An engineer wants to add a page for p95 latency crossing 800ms in one region for 2 minutes.",
        context: "Users are globally load-balanced and multi-region failover works correctly.",
        options: [
          {
            text: "Send it to a ticket or non-paging channel unless it also threatens the user-facing objective.",
            score: 2,
            feedback: "Correct. The signal might still be useful, but not every regional blip deserves a page.",
          },
          {
            text: "Add it as a page because more alerts always improve reliability.",
            score: 0,
            feedback: "Alert volume without clear actionability creates fatigue and worse response quality.",
          },
          {
            text: "Delete all latency alerts because availability is the only SLI that matters.",
            score: 0,
            feedback: "Latency can absolutely be user-visible and should be part of the objective when it reflects user pain.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Pages on raw symptoms or noisy infrastructure metrics without mapping them to user impact.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Recognizes the need for user-centric paging but still mixes in too much undifferentiated noise.",
      },
      strong: {
        title: "Strong answer",
        description: "Uses SLO-aligned, actionable alerts and routes secondary signals to lower-noise channels.",
      },
    },
  },
  "multi-region-design": {
    id: "multi-region-design",
    title: "Systems design: survive a launch without overbuilding",
    eyebrow: "Design drill",
    description: "Choose architecture moves that directly reduce launch risk and articulate the tradeoffs.",
    competencies: ["cloud", "release-engineering"],
    steps: [
      {
        prompt:
          "A product launch is expected to drive 20x normal read traffic in one day. What is the most important first reliability investment?",
        options: [
          {
            text: "Introduce caching/CDN coverage and verify the hot paths can shed repeated read load before it reaches the origin.",
            score: 2,
            feedback: "Strong. This addresses the likely bottleneck at the edge and reduces blast radius inside the stack.",
          },
          {
            text: "Rewrite every service in Go for better performance before the campaign begins.",
            score: 0,
            feedback: "That is too large, too risky, and disconnected from the timeline.",
          },
          {
            text: "Buy the largest database tier available and hope it absorbs the traffic spike.",
            score: 1,
            feedback: "Capacity matters, but it is not a complete design strategy and often wastes money.",
          },
        ],
      },
      {
        prompt:
          "The launch also includes a new checkout experience. How should rollout safety change for the critical path?",
        options: [
          {
            text: "Use a canary or progressive delivery path with fast rollback, guarded by key SLIs.",
            score: 2,
            feedback: "Exactly. It limits blast radius and gives operators objective rollback signals.",
          },
          {
            text: "Ship globally at once so everyone sees the same version and support stays simple.",
            score: 0,
            feedback: "Consistency is not worth the added blast radius on a high-risk launch day.",
          },
          {
            text: "Disable alerts during the first hour so the team can focus on launch communications.",
            score: 0,
            feedback: "That removes the exact feedback loops the team needs during a risky event.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Focuses on dramatic rewrites or brute-force capacity without discussing rollout safety.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Thinks about caching and capacity, but does not clearly connect the architecture to measurable launch safeguards.",
      },
      strong: {
        title: "Strong answer",
        description: "Prioritizes edge protection, progressive delivery, and fast rollback based on customer-facing signals.",
      },
    },
  },
  "behavioral-postmortem": {
    id: "behavioral-postmortem",
    title: "Behavioral drill: answer the blame question like an SRE",
    eyebrow: "Communication drill",
    description: "Practice how to redirect a heated post-incident conversation toward systems thinking.",
    competencies: ["communication", "incident-response"],
    steps: [
      {
        prompt:
          "A VP asks, 'Who caused this outage?' during the post-incident review. What is the strongest SRE framing?",
        options: [
          {
            text: "Name the engineer involved so leadership knows the immediate root cause.",
            score: 0,
            feedback: "That discourages truth-seeking and does not explain why the system allowed the mistake.",
          },
          {
            text: "Reframe toward the contributing conditions, missing safeguards, and concrete changes that prevent recurrence.",
            score: 2,
            feedback: "Strong. This keeps accountability tied to system improvement rather than personal blame.",
          },
          {
            text: "Avoid answering and say the topic is too sensitive to discuss in a review.",
            score: 0,
            feedback: "Avoidance weakens trust. The better move is to answer with better framing.",
          },
        ],
      },
      {
        prompt: "Leadership now wants to know what happens next after the review.",
        options: [
          {
            text: "Assign follow-up items with owners, dates, and reliability outcomes tied to the observed failure mode.",
            score: 2,
            feedback: "Correct. Strong postmortems turn findings into tracked system changes.",
          },
          {
            text: "Close the incident immediately because the service is back and the team needs to move on.",
            score: 0,
            feedback: "Recovery is not the end of learning.",
          },
          {
            text: "Wait for another outage to confirm the root cause before taking preventive action.",
            score: 0,
            feedback: "SRE practice is about reducing recurrence risk once the evidence is good enough to act.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Centers the discussion on individual blame or avoids communicating clearly with stakeholders.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Uses blameless language but lacks concrete prevention and follow-through.",
      },
      strong: {
        title: "Strong answer",
        description: "Reframes to systems, communicates calmly, and turns the incident into tracked prevention work.",
      },
    },
  },
  "security-secret-rotation": {
    id: "security-secret-rotation",
    title: "Security drill: contain a leaked production credential",
    eyebrow: "Response drill",
    description: "Choose the sequence that protects customers first and closes the loop with preventive changes.",
    competencies: ["security", "communication"],
    steps: [
      {
        prompt:
          "A production database password was committed to a public repository and may have been exposed for 20 minutes. What is the first priority?",
        options: [
          {
            text: "Rotate or revoke the credential immediately and validate which services depend on it.",
            score: 2,
            feedback: "Correct. Treat the credential as compromised and contain the blast radius first.",
          },
          {
            text: "Wait for the security team to complete a full forensic investigation before changing anything.",
            score: 0,
            feedback: "Investigation matters, but containment cannot wait.",
          },
          {
            text: "Delete the commit from git history and treat the issue as resolved.",
            score: 0,
            feedback: "History cleanup may help later, but the credential must still be treated as compromised.",
          },
        ],
      },
      {
        prompt: "After rotation, what follow-through shows mature operational thinking?",
        options: [
          {
            text: "Add secret scanning, reduce credential lifetime, and move the dependency to managed secret delivery.",
            score: 2,
            feedback: "Strong answer. It combines detection, shorter exposure windows, and better operational hygiene.",
          },
          {
            text: "Remind engineers to be more careful next time.",
            score: 0,
            feedback: "Training helps, but a strong SRE answer adds system-level controls.",
          },
          {
            text: "Ban engineers from local development access to production dependencies entirely.",
            score: 1,
            feedback: "There may be cases for tighter access, but the answer is incomplete without operational safeguards.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Fixates on cleanup or blame without immediate containment or preventive controls.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Handles rotation correctly but does not fully close the gap with detection and safer secret delivery.",
      },
      strong: {
        title: "Strong answer",
        description: "Contains the exposure fast, communicates clearly, and adds automated controls to reduce recurrence.",
      },
    },
  },
  "finops-rightsizing": {
    id: "finops-rightsizing",
    title: "FinOps drill: reduce cost without breaking reliability",
    eyebrow: "Tradeoff drill",
    description: "Balance efficiency work against the reliability promises users actually care about.",
    competencies: ["finops", "slos"],
    steps: [
      {
        prompt:
          "A service runs on nodes averaging 12% CPU with stable memory use. Finance wants a 25% monthly cost reduction.",
        options: [
          {
            text: "Right-size requests and node pools using production usage plus headroom tied to the SLO.",
            score: 2,
            feedback: "Strong answer. It uses measured demand and keeps reliability explicitly in the loop.",
          },
          {
            text: "Cut cluster size in half immediately because low average CPU proves the service is overprovisioned.",
            score: 0,
            feedback: "Average utilization alone is not enough to guarantee safe reductions.",
          },
          {
            text: "Reject the request entirely because reliability teams should never own efficiency work.",
            score: 0,
            feedback: "Efficiency and reliability are connected; strong SRE candidates can discuss both.",
          },
        ],
      },
      {
        prompt: "How do you explain the guardrails around that cost reduction plan?",
        options: [
          {
            text: "Track latency, saturation, and error-budget burn during the change, and roll back if those regress.",
            score: 2,
            feedback: "Correct. This shows you know how to make efficiency changes safely.",
          },
          {
            text: "Measure only monthly cloud spend because the whole point is to cut cost.",
            score: 0,
            feedback: "Cost alone is not the operating objective; it must be balanced against reliability.",
          },
          {
            text: "Skip monitoring because the lower bill will show whether the project worked.",
            score: 0,
            feedback: "That would hide the actual service impact of the change.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Treats efficiency work as either purely financial or purely optional, without reliability guardrails.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Understands rightsizing but leaves the rollback and measurement plan underspecified.",
      },
      strong: {
        title: "Strong answer",
        description: "Uses real usage data, preserves headroom, and measures service health while reducing spend.",
      },
    },
  },
  "kubernetes-release": {
    id: "kubernetes-release",
    title: "Kubernetes release drill: fix a rollout that is harming users",
    eyebrow: "Release drill",
    description: "Use Kubernetes-native safety mechanisms before the bad release becomes a long incident.",
    competencies: ["kubernetes", "release-engineering"],
    steps: [
      {
        prompt:
          "A new deployment is rolling out. Readiness probes are failing on 30% of pods and request latency is climbing.",
        options: [
          {
            text: "Pause or roll back the rollout while you inspect probe failures and rollout-specific changes.",
            score: 2,
            feedback: "Strong. Progressive delivery is only useful if the operator actually stops the blast radius.",
          },
          {
            text: "Ignore the probe failures because Kubernetes will eventually converge on a healthy state.",
            score: 0,
            feedback: "That lets the rollout keep spending error budget while the user path degrades.",
          },
          {
            text: "Increase replicas so the broken version spreads faster and stabilizes sooner.",
            score: 0,
            feedback: "Scaling a bad build rarely fixes a rollout-specific defect.",
          },
        ],
      },
      {
        prompt: "What is the best follow-up improvement after service is restored?",
        options: [
          {
            text: "Tighten deployment checks with canary analysis, probe validation, and release metrics tied to rollback criteria.",
            score: 2,
            feedback: "Excellent. This makes the next rollout safer by codifying the lessons learned.",
          },
          {
            text: "Remove readiness probes because they made the rollout look worse than it was.",
            score: 0,
            feedback: "The probes exposed the problem; they were not the problem.",
          },
          {
            text: "Run all future releases at midnight so fewer customers are online.",
            score: 1,
            feedback: "Off-peak releases can reduce impact, but the stronger answer is to improve release safety itself.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Lets bad rollouts continue or treats Kubernetes as something that will fix itself without operator intervention.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Stops the rollout but does not clearly articulate the long-term release guardrails.",
      },
      strong: {
        title: "Strong answer",
        description: "Uses rollout controls immediately and turns the incident into stronger automated deployment checks.",
      },
    },
  },
  "container-image-optimization": {
    id: "container-image-optimization",
    title: "Container drill: make the image smaller, safer, and easier to operate",
    eyebrow: "Container drill",
    description: "Choose the changes that improve image quality without making the runtime harder to reason about.",
    competencies: ["containers", "kubernetes", "security"],
    steps: [
      {
        prompt:
          "A production image is 1.6 GB, runs as root, includes build tools, and takes more than a minute to pull on scale-out events. What is the highest-leverage first improvement?",
        options: [
          {
            text: "Switch to a multi-stage build so compilation and package managers stay in the builder stage, not the runtime image.",
            score: 2,
            feedback: "Strong. Multi-stage builds cut size and attack surface without changing the application behavior contract.",
          },
          {
            text: "Keep the same image but increase node disk size so pulls hurt less.",
            score: 0,
            feedback: "That hides the symptom instead of improving artifact quality.",
          },
          {
            text: "Add more application logs to the image so there is more information when containers fail.",
            score: 0,
            feedback: "Logging does not address image size, startup latency, or security posture.",
          },
        ],
      },
      {
        prompt:
          "After slimming the image, what additional answer shows mature container operational thinking?",
        options: [
          {
            text: "Run as a non-root user, trim the build context with .dockerignore, and pin/update base images intentionally.",
            score: 2,
            feedback: "Exactly. That combines size, security, and reproducibility concerns.",
          },
          {
            text: "Use latest tags everywhere so the image stays current automatically.",
            score: 0,
            feedback: "Floating tags reduce repeatability and make rollback reasoning weaker.",
          },
          {
            text: "Move debugging tools into the production image so every container is easier to shell into.",
            score: 1,
            feedback: "There are cases for debug tooling, but shipping it by default usually works against minimal runtime images.",
          },
        ],
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Treats image optimization as only a storage problem and misses security and startup implications.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Understands smaller images are good, but the operational and security reasoning is incomplete.",
      },
      strong: {
        title: "Strong answer",
        description: "Optimizes the build pipeline, runtime footprint, and security posture together.",
      },
    },
  },
};

export const commandDrills: Record<string, CommandDrillDefinition> = {
  "linux-memory-pressure": {
    id: "linux-memory-pressure",
    title: "Linux command drill: the node is slow and swapping",
    eyebrow: "Command drill",
    scenario:
      "A service node is thrashing. The dashboard shows normal CPU, but latency is climbing and `node_memory_MemAvailable_bytes` is near zero.",
    goal: "Choose the next command that gives the most actionable evidence.",
    competencies: ["linux", "observability"],
    options: [
      {
        command: "free -h && vmstat 1 5",
        score: 2,
        feedback: "Strong. This quickly confirms memory pressure and whether the kernel is actively swapping.",
      },
      {
        command: "history | tail -20",
        score: 0,
        feedback: "Interesting later, but not the best first command for diagnosing live memory pressure.",
      },
      {
        command: "uptime",
        score: 1,
        feedback: "This is lightweight and sometimes useful, but it will not explain the memory bottleneck in enough detail.",
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Chooses commands that do not surface the active bottleneck or guide the next mitigation step.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Chooses something relevant but not the most direct command for the observed symptom.",
      },
      strong: {
        title: "Strong answer",
        description: "Picks commands that validate the suspected resource issue and give immediate operational direction.",
      },
    },
  },
  "networking-dns-debug": {
    id: "networking-dns-debug",
    title: "Networking command drill: DNS is timing out for one dependency",
    eyebrow: "Command drill",
    scenario:
      "Only one upstream hostname intermittently fails from your app pods. TLS handshakes look healthy when the hostname resolves.",
    goal: "Choose the command that narrows the issue toward DNS resolution quality first.",
    competencies: ["networking", "linux"],
    options: [
      {
        command: "dig api.partner.example +tries=1 +time=2",
        score: 2,
        feedback: "Correct. It directly measures resolution behavior and lets you compare answer timing and records.",
      },
      {
        command: "curl https://api.partner.example/healthz",
        score: 1,
        feedback: "Useful once resolution works, but it mixes DNS, TCP, TLS, and HTTP into a broader test.",
      },
      {
        command: "df -h",
        score: 0,
        feedback: "Disk usage is not the relevant first signal for an intermittent DNS failure.",
      },
    ],
    rubric: {
      weak: {
        title: "Weak answer",
        description: "Tests broad symptoms without isolating where the request path is failing.",
      },
      acceptable: {
        title: "Acceptable answer",
        description: "Chooses a generally useful command, but not the most precise one for narrowing DNS issues.",
      },
      strong: {
        title: "Strong answer",
        description: "Starts with the narrowest command that validates the failing layer before moving outward.",
      },
    },
  },
};

export const interviewPrompts: InterviewPrompt[] = [
  {
    title: "Design a global API launch",
    category: "Systems Design",
    prompt:
      "Your company is launching a public API in three regions. Walk through traffic management, dependency protection, observability, and the rollback plan you would expect before opening the floodgates.",
    hints: ["Think edge caching.", "Explain what you would measure during rollout.", "Call out one failure mode and how you would contain it."],
    strongAnswer: [
      "Progressive rollout with clear rollback triggers.",
      "User-facing SLIs and regional guardrails.",
      "Dependency protection such as timeouts, retries, and circuit breakers.",
    ],
  },
  {
    title: "Your dashboards go dark",
    category: "Troubleshooting",
    prompt:
      "Traffic appears to fall to zero across your service, but no user reports arrive and no paging alerts fire. Explain the first five minutes of investigation.",
    hints: ["Separate service health from telemetry health.", "Use independent probes.", "Describe the deadman’s switch."],
    strongAnswer: [
      "Check whether the service or the telemetry pipeline is failing.",
      "Use an external signal that does not depend on the same metrics path.",
      "Discuss how to detect silent observability failures in the future.",
    ],
  },
  {
    title: "Respond to the blame question",
    category: "Behavioral",
    prompt:
      "A leader asks who is responsible after an outage caused by a manual production action. Give the answer you would use in the room.",
    hints: ["Use blameless language.", "Show accountability without scapegoating.", "Name the prevention work."],
    strongAnswer: [
      "Reframe from person to system conditions.",
      "Explain the missing safeguard or control.",
      "End with specific follow-up actions and owners.",
    ],
  },
];
