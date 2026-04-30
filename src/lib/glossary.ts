export interface GlossaryTerm {
  slug: string;
  term: string;
  category: "Containers" | "Docker images" | "Kubernetes" | "Reliability";
  definition: string;
  whyItMatters: string;
}

export const glossaryTerms: GlossaryTerm[] = [
  {
    slug: "base-image",
    term: "Base image",
    category: "Docker images",
    definition: "The parent image a Dockerfile starts from with the FROM instruction.",
    whyItMatters: "Base image choice affects size, attack surface, package availability, and update cadence.",
  },
  {
    slug: "cgroup",
    term: "cgroup",
    category: "Containers",
    definition: "A Linux kernel feature that constrains and measures resource usage for a group of processes.",
    whyItMatters: "Containers rely on cgroups for CPU and memory isolation, so they show up in performance and OOM discussions.",
  },
  {
    slug: "container-image-layer",
    term: "Container image layer",
    category: "Docker images",
    definition: "A filesystem delta created by each Dockerfile instruction and stacked to form the final image.",
    whyItMatters: "Understanding layers helps optimize build cache behavior, image size, and vulnerability management.",
  },
  {
    slug: "distroless",
    term: "Distroless image",
    category: "Docker images",
    definition: "A minimal runtime image that contains the application and its runtime dependencies but omits a full operating system userland.",
    whyItMatters: "Distroless images reduce attack surface and image size, but they also change how debugging works.",
  },
  {
    slug: "dockerignore",
    term: ".dockerignore",
    category: "Docker images",
    definition: "A file that excludes paths from the Docker build context.",
    whyItMatters: "A good .dockerignore keeps builds fast, prevents secrets from entering image context, and reduces unnecessary cache invalidation.",
  },
  {
    slug: "entrypoint-vs-cmd",
    term: "ENTRYPOINT vs CMD",
    category: "Docker images",
    definition: "Dockerfile instructions that define the container’s executable and default arguments.",
    whyItMatters: "Misusing them can make containers harder to override, debug, or stop gracefully in orchestration systems.",
  },
  {
    slug: "eviction",
    term: "Eviction",
    category: "Kubernetes",
    definition: "Kubernetes removing a pod from a node because of resource pressure or scheduling policy.",
    whyItMatters: "Evictions are a key signal that requests, limits, or cluster capacity are mismatched.",
  },
  {
    slug: "hpa",
    term: "Horizontal Pod Autoscaler (HPA)",
    category: "Kubernetes",
    definition: "A controller that changes pod replica counts based on configured metrics.",
    whyItMatters: "HPA only works well when the scaling signal matches the real bottleneck and requests are set sensibly.",
  },
  {
    slug: "image-pull-policy",
    term: "imagePullPolicy",
    category: "Kubernetes",
    definition: "A pod setting that tells Kubernetes when to pull a container image.",
    whyItMatters: "It affects rollout consistency, startup time, and whether tags can behave unpredictably across nodes.",
  },
  {
    slug: "image-sbom",
    term: "SBOM",
    category: "Docker images",
    definition: "A Software Bill of Materials listing the components present in an image or artifact.",
    whyItMatters: "SBOMs help teams respond faster to CVEs and understand exactly what is shipping in production.",
  },
  {
    slug: "init-container",
    term: "Init container",
    category: "Kubernetes",
    definition: "A container that runs to completion before the main application containers in a pod start.",
    whyItMatters: "Init containers are useful for migrations and setup work, but they can also delay readiness and complicate startup debugging.",
  },
  {
    slug: "multi-stage-build",
    term: "Multi-stage build",
    category: "Docker images",
    definition: "A Docker build pattern that uses multiple FROM stages so build tooling and final runtime content can be separated.",
    whyItMatters: "It is one of the highest-leverage ways to cut image size, reduce attack surface, and keep runtime images clean.",
  },
  {
    slug: "node-affinity",
    term: "Node affinity",
    category: "Kubernetes",
    definition: "Scheduling rules that influence which nodes a pod can run on.",
    whyItMatters: "Affinity and anti-affinity shape failure domains, cost placement, and noisy-neighbor risk.",
  },
  {
    slug: "oom-kill",
    term: "OOM kill",
    category: "Containers",
    definition: "The kernel terminating a process when memory pressure exceeds limits and no safe reclamation path remains.",
    whyItMatters: "OOM kills often point to bad memory sizing, leaks, or container limits that are too low for burst behavior.",
  },
  {
    slug: "pdb",
    term: "Pod Disruption Budget (PDB)",
    category: "Kubernetes",
    definition: "A policy that limits how many replicas of a workload can be voluntarily disrupted at the same time.",
    whyItMatters: "PDBs protect availability during node drains, upgrades, and maintenance events.",
  },
  {
    slug: "probe",
    term: "Probe",
    category: "Kubernetes",
    definition: "A liveness, readiness, or startup check used by Kubernetes to decide how to route traffic and manage pod lifecycle.",
    whyItMatters: "Poorly designed probes can create false restarts or route traffic before the service is actually ready.",
  },
  {
    slug: "requests-and-limits",
    term: "Requests and limits",
    category: "Kubernetes",
    definition: "Resource declarations that inform scheduling and cap resource usage for a container.",
    whyItMatters: "They influence density, throttling, OOM behavior, and the quality of autoscaling signals.",
  },
  {
    slug: "rootless-container",
    term: "Rootless container",
    category: "Containers",
    definition: "A container or runtime configured so the process does not run as UID 0 inside the workload.",
    whyItMatters: "Running as non-root is a basic hardening measure and often appears in platform and security interviews.",
  },
  {
    slug: "sidecar",
    term: "Sidecar",
    category: "Kubernetes",
    definition: "A helper container deployed alongside the main application container in the same pod.",
    whyItMatters: "Sidecars can add useful capabilities like proxies or log shipping, but they also add resource and lifecycle complexity.",
  },
  {
    slug: "statefulset",
    term: "StatefulSet",
    category: "Kubernetes",
    definition: "A Kubernetes workload controller for stateful applications that need stable identities and ordered behavior.",
    whyItMatters: "Choosing StatefulSet versus Deployment is a common workload-design question in interviews.",
  },
  {
    slug: "supply-chain",
    term: "Software supply chain",
    category: "Docker images",
    definition: "The upstream sources, build steps, dependencies, and signing/verifying controls involved in producing deployable artifacts.",
    whyItMatters: "Container security is not just about scanning the final image; it is about trusting how the image was produced.",
  },
];
