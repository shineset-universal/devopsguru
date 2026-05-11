// Phase 1 UI only — any import in Phase 2+ is a bug.

export interface MockCourse {
  id: number;
  num: string;
  iconKey: string;
  title: string;
  slug: string;
  desc: string;
  topics: string[];
  accent: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Capstone";
  weeks: string;
  capstone?: boolean;
}

export interface MockStudent {
  id: number;
  name: string;
  email: string;
  modules: string;
  status: "Active" | "Pending" | "Inactive";
  enrolledAt: string;
}

export interface MockSession {
  id: number;
  title: string;
  course: string;
  scheduledAt: string;
  durationMin: number;
  meetingUrl: string;
}

export interface MockHomework {
  id: number;
  title: string;
  course: string;
  dueDate: string;
  status: "pending" | "submitted" | "graded";
  grade?: number;
}

export const MOCK_COURSES: MockCourse[] = [
  {
    id: 1,
    num: "01",
    iconKey: "linux",
    title: "Linux Basics",
    slug: "linux-basics",
    desc: "File system navigation, shell scripting, process management and system services — the foundation every DevOps engineer needs.",
    topics: [
      "Linux command-line basics",
      "File permissions & process management",
      "Shell scripting",
      "Package management",
      "System services (systemd)",
    ],
    accent: "#00d4ff",
    level: "Beginner",
    weeks: "2 weeks",
  },
  {
    id: 2,
    num: "02",
    iconKey: "git",
    title: "Version Control with Git",
    slug: "git",
    desc: "Master branching strategies, Git workflows and team collaboration. From first commit to resolving complex merge conflicts.",
    topics: [
      "Git basics (init, clone, commit, push, pull)",
      "Branching & merging strategies",
      "GitHub / GitLab / Bitbucket",
      "Git Flow & trunk-based development",
      "Resolving merge conflicts",
    ],
    accent: "#f05033",
    level: "Beginner",
    weeks: "2 weeks",
  },
  {
    id: 3,
    num: "03",
    iconKey: "cicd",
    title: "CI/CD Pipelines",
    slug: "cicd",
    desc: "Build automated delivery pipelines with Jenkins, GitLab CI and Azure DevOps. Rolling, canary and blue-green deployments.",
    topics: [
      "Setting up CI/CD pipelines",
      "Building and testing automatically",
      "Rolling, canary & blue-green deployments",
      "Continuous Testing & Monitoring",
      "Jenkins, GitLab CI, CircleCI, Azure DevOps",
    ],
    accent: "#ff9f43",
    level: "Intermediate",
    weeks: "3 weeks",
  },
  {
    id: 4,
    num: "04",
    iconKey: "terraform",
    title: "Infrastructure as Code",
    slug: "iac",
    desc: "Provision cloud infrastructure with Terraform and manage configurations at scale using Ansible across AWS, Azure and GCP.",
    topics: [
      "IaC with Terraform",
      "Provisioning VMs, networks & storage",
      "Configuration management with Ansible",
      "Automation with playbooks & roles",
      "Managing cloud infra (AWS, Azure, GCP)",
    ],
    accent: "#7b2fff",
    level: "Intermediate",
    weeks: "3 weeks",
  },
  {
    id: 5,
    num: "05",
    iconKey: "docker",
    title: "Containerization with Docker",
    slug: "docker",
    desc: "Build, ship and run containers in production. Docker images, networking, volumes and container security from scratch.",
    topics: [
      "Introduction to Docker",
      "Building and managing Docker images",
      "Running and linking containers",
      "Networking and volumes in Docker",
      "Container security best practices",
    ],
    accent: "#2496ed",
    level: "Intermediate",
    weeks: "3 weeks",
  },
  {
    id: 6,
    num: "06",
    iconKey: "kubernetes",
    title: "Kubernetes Orchestration",
    slug: "kubernetes",
    desc: "Deploy and scale applications on Kubernetes. Pods, services, Ingress, Helm charts and real cluster management.",
    topics: [
      "Kubernetes architecture",
      "Deploying and scaling applications",
      "Managing clusters and nodes",
      "Services, Ingress & Load Balancing",
      "Helm for managing K8s applications",
    ],
    accent: "#326ce5",
    level: "Advanced",
    weeks: "4 weeks",
  },
  {
    id: 7,
    num: "07",
    iconKey: "grafana",
    title: "Monitoring & Logging",
    slug: "monitoring",
    desc: "Full-stack observability with Prometheus, Grafana and the ELK stack. Custom metrics, alerts and centralized logging.",
    topics: [
      "Monitoring with Prometheus & Grafana",
      "ELK stack (Elasticsearch, Logstash, Kibana)",
      "Centralized logging with Fluentd / Filebeat",
      "Alerts and notifications",
      "Custom metrics and tracing",
    ],
    accent: "#00ff88",
    level: "Intermediate",
    weeks: "2 weeks",
  },
  {
    id: 8,
    num: "08",
    iconKey: "gitops",
    title: "GitOps & Infra Automation",
    slug: "gitops",
    desc: "Git as the single source of truth. ArgoCD and FluxCD for automated Kubernetes delivery and infrastructure management.",
    topics: [
      "Introduction to GitOps",
      "Kubernetes deployments with ArgoCD / FluxCD",
      "Automating infrastructure changes via Git",
      "Continuous delivery with GitOps workflows",
    ],
    accent: "#f97316",
    level: "Advanced",
    weeks: "2 weeks",
  },
  {
    id: 9,
    num: "09",
    iconKey: "capstone",
    title: "Real-World DevOps Project",
    slug: "capstone",
    desc: "A complete capstone: CI/CD pipeline, Kubernetes deployment, Terraform provisioning, monitoring and GitOps delivery.",
    topics: [
      "CI/CD pipeline from scratch",
      "Microservices with Docker & Kubernetes",
      "Terraform & Ansible infra provisioning",
      "Monitoring & alerting setup",
      "GitOps-based application delivery",
    ],
    accent: "#00d4ff",
    level: "Capstone",
    weeks: "3 weeks",
    capstone: true,
  },
];

export const MOCK_STUDENTS: MockStudent[] = [
  {
    id: 1,
    name: "Aram Hakobyan",
    email: "aram@example.com",
    modules: "Linux + Docker + K8s",
    status: "Active",
    enrolledAt: "2026-04-01",
  },
  {
    id: 2,
    name: "Ani Petrosyan",
    email: "ani@example.com",
    modules: "Linux + Git",
    status: "Active",
    enrolledAt: "2026-04-10",
  },
  {
    id: 3,
    name: "Narek Vardanyan",
    email: "narek@example.com",
    modules: "CI/CD + Terraform",
    status: "Pending",
    enrolledAt: "2026-05-01",
  },
];

export const MOCK_SESSIONS: MockSession[] = [
  {
    id: 1,
    title: "Kubernetes Networking Deep Dive",
    course: "Kubernetes Orchestration",
    scheduledAt: "2026-05-15T18:00:00Z",
    durationMin: 90,
    meetingUrl: "https://zoom.us/j/placeholder",
  },
  {
    id: 2,
    title: "GitOps with ArgoCD — Live Demo",
    course: "GitOps & Infra Automation",
    scheduledAt: "2026-05-22T18:00:00Z",
    durationMin: 90,
    meetingUrl: "https://zoom.us/j/placeholder",
  },
];

export const MOCK_HOMEWORK: MockHomework[] = [
  {
    id: 1,
    title: "Write a shell script to monitor disk usage",
    course: "Linux Basics",
    dueDate: "2026-05-14",
    status: "pending",
  },
  {
    id: 2,
    title: "Set up a multi-stage Docker build",
    course: "Containerization with Docker",
    dueDate: "2026-05-16",
    status: "submitted",
  },
  {
    id: 3,
    title: "Deploy a Node.js app to Kubernetes with Helm",
    course: "Kubernetes Orchestration",
    dueDate: "2026-05-20",
    status: "graded",
    grade: 92,
  },
];
