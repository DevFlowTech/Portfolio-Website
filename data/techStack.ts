export interface TechCategory {
  id: string;
  name: string;
  count: string;
  description: string;
  skills: {
    name: string;
    level: "Core" | "Advanced" | "Proficient";
    highlight?: boolean;
  }[];
}

export const techCategories: TechCategory[] = [
  {
    id: "frontend",
    name: "Frontend",
    count: "05",
    description: "Modern, type-safe, and high-performance UI engineering.",
    skills: [
      { name: "React.js", level: "Core", highlight: true },
      { name: "Next.js", level: "Core", highlight: true },
      { name: "TypeScript", level: "Core", highlight: true },
      { name: "JavaScript", level: "Core" },
      { name: "Tailwind CSS", level: "Advanced" },
    ],
  },
  {
    id: "backend",
    name: "Backend",
    count: "06",
    description: "Robust server runtimes, secure APIs, and modular microservices.",
    skills: [
      { name: "Node.js", level: "Core", highlight: true },
      { name: "Express.js", level: "Core", highlight: true },
      { name: "REST APIs", level: "Core", highlight: true },
      { name: "PHP", level: "Advanced" },
      { name: ".NET / C#", level: "Proficient" },
      { name: "Laravel", level: "Proficient" },
    ],
  },
  {
    id: "ai",
    name: "Agentic AI",
    count: "05",
    description: "Autonomous reasoning agents, LLM pipelines, and automation.",
    skills: [
      { name: "Autonomous AI Agents", level: "Core", highlight: true },
      { name: "Claude API", level: "Core", highlight: true },
      { name: "Prompt Engineering", level: "Core", highlight: true },
      { name: "Multi-Agent Systems", level: "Advanced", highlight: true },
      { name: "AI Workflow Automation", level: "Advanced" },
    ],
  },
  {
    id: "seo",
    name: "SEO & Growth",
    count: "07",
    description: "Search architecture, structured schemas, and organic performance.",
    skills: [
      { name: "Google Search Console", level: "Core", highlight: true },
      { name: "Google Analytics 4", level: "Core", highlight: true },
      { name: "Core Web Vitals", level: "Core", highlight: true },
      { name: "Schema & JSON-LD", level: "Core", highlight: true },
      { name: "Google Business Profile", level: "Advanced" },
      { name: "RankMath", level: "Advanced" },
      { name: "Yoast SEO", level: "Advanced" },
    ],
  },
  {
    id: "database",
    name: "Database",
    count: "05",
    description: "Relational modeling, document stores, and state persistence.",
    skills: [
      { name: "MySQL", level: "Core", highlight: true },
      { name: "PostgreSQL", level: "Advanced" },
      { name: "MongoDB", level: "Advanced" },
      { name: "Supabase", level: "Proficient" },
      { name: "Firebase", level: "Proficient" },
    ],
  },
  {
    id: "devops",
    name: "DevOps & Tools",
    count: "11",
    description: "Version control, hosting infrastructure, and deployment pipelines.",
    skills: [
      { name: "Git", level: "Core", highlight: true },
      { name: "GitHub", level: "Core", highlight: true },
      { name: "Vercel", level: "Advanced" },
      { name: "Linux", level: "Advanced" },
      { name: "WordPress", level: "Advanced" },
      { name: "Docker", level: "Proficient" },
      { name: "CI/CD", level: "Proficient" },
      { name: "Railway", level: "Proficient" },
      { name: "Netlify", level: "Proficient" },
      { name: "Hostinger", level: "Proficient" },
      { name: "GoDaddy", level: "Proficient" },
    ],
  },
];
