export interface CapabilityPillar {
  number: string;
  code: string;
  title: string;
  subtitle: string;
  description: string;
  iconName: string;
  technologies: string[];
  capabilitiesList: string[];
  gradientAccent: string;
}

export const capabilities: CapabilityPillar[] = [
  {
    number: "01",
    code: "ENG",
    title: "Engineering",
    subtitle: "Full-Stack Web Development",
    description:
      "Architecting robust, scalable web applications from responsive modern client interfaces to secure, performant backend REST APIs and relational database models.",
    iconName: "Code2",
    technologies: [
      "React.js",
      "Next.js",
      "Node.js",
      "Express.js",
      "TypeScript",
      "JavaScript",
      "REST APIs",
      "JWT Authentication",
      "MySQL",
      "MongoDB",
      "PostgreSQL",
      ".NET/C#",
      "PHP",
    ],
    capabilitiesList: [
      "Modular client-side state architecture and component design",
      "Secure REST API engineering with JWT session handling and RBAC",
      "Relational and document database schema design & query optimization",
      "End-to-end full-stack integration with clean, maintainable patterns",
    ],
    gradientAccent: "from-cyan-500/20 to-blue-500/10",
  },
  {
    number: "02",
    code: "AI",
    title: "Intelligence",
    subtitle: "Agentic AI & Workflow Automation",
    description:
      "Designing autonomous multi-agent systems and LLM execution pipelines that don't just generate text, but reason, orchestrate, validate, and execute complex digital operations.",
    iconName: "Cpu",
    technologies: [
      "Autonomous AI Agents",
      "LLM Integration & Chains",
      "Prompt Engineering",
      "Multi-Agent Systems",
      "AI Workflow Automation",
      "Claude API Integration",
      "Contextual AI Solutions",
      "AI-Powered Automation",
    ],
    capabilitiesList: [
      "Multi-agent task decomposition and deterministic orchestration",
      "Structured output validation and programmatic safety filtering",
      "Autonomous SEO content synthesis and automated research pipelines",
      "Custom Claude API integrations for domain-specific automation",
    ],
    gradientAccent: "from-indigo-500/20 to-purple-500/10",
  },
  {
    number: "03",
    code: "SEO",
    title: "Growth",
    subtitle: "Technical & Agentic AI SEO",
    description:
      "Engineering organic search dominance through deep technical audits, Schema.org architectures, Core Web Vitals acceleration, and autonomous AI-assisted growth workflows.",
    iconName: "TrendingUp",
    technologies: [
      "Manual & Agentic AI SEO",
      "On-Page SEO",
      "Technical SEO",
      "Keyword Research",
      "Schema & Structured Data",
      "Core Web Vitals",
      "Local SEO",
      "Google Business Profile",
      "Google Search Console",
      "Google Analytics 4",
    ],
    capabilitiesList: [
      "Crawl budget optimization, canonical structures, and indexation governance",
      "Rich snippet enhancement via precision JSON-LD structured data",
      "Sub-second Core Web Vitals optimization eliminating layout shift",
      "Local map-pack dominance and geo-targeted authority building",
    ],
    gradientAccent: "from-emerald-500/20 to-teal-500/10",
  },
];
