export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  location: string;
  type: string;
  summary: string;
  responsibilities: string[];
  technologies: string[];
  keyAchievement?: string;
}

export const experienceData: ExperienceItem[] = [
  {
    id: "vassu-infotech",
    role: "SEO Executive & Full Stack Web Developer",
    company: "Vassu Infotech",
    period: "Feb 2025 – Mar 2026",
    location: "Ahmedabad, Gujarat, India",
    type: "Full-Time",
    summary:
      "Spearheaded technical search optimization strategies while architecting and developing full-stack web applications and custom digital solutions.",
    responsibilities: [
      "Engineered full-stack applications using React.js, Node.js, Express.js, and MySQL with secure JWT authentication.",
      "Conducted deep technical SEO audits, crawl error remediation, and coverage issue resolution via Google Search Console.",
      "Authored custom JSON-LD structured data schemas (Organization, LocalBusiness, FAQPage, Product, Article).",
      "Optimized Core Web Vitals (LCP, FID/INP, CLS) across client web properties to elevate organic search performance.",
      "Integrated third-party APIs, payment gateways, and custom database workflows.",
      "Executed local search programs and Google Business Profile optimizations to drive qualified geographic traffic.",
      "Customized WordPress core templates and built custom plugins tailored to client performance specifications.",
    ],
    technologies: [
      "React.js",
      "Node.js",
      "Express.js",
      "MySQL",
      "JWT",
      "Technical SEO",
      "JSON-LD Schema",
      "GSC & GA4",
      "Core Web Vitals",
      "WordPress",
    ],
    keyAchievement: "Unified full-stack engineering with technical SEO to deliver high-performing web platforms with zero crawl bottlenecks.",
  },
  {
    id: "independent-consulting",
    role: "Founder, Technical Lead & AI Specialist",
    company: "Independent Technology Consulting",
    period: "2024 – Present",
    location: "Ahmedabad, India (Remote / Global Clients)",
    type: "Practice / Consulting",
    summary:
      "Direct technical consulting practice delivering custom full-stack software, autonomous Agentic AI workflows, and data-driven organic growth architectures.",
    responsibilities: [
      "Managed end-to-end SEO strategy and technical execution for 5+ independent client projects across real estate, visa consulting, healthcare, and local service industries.",
      "Engineered autonomous AI-powered SEO workflows automating keyword research, search intent mapping, and content-gap analysis.",
      "Developed AI-assisted content pipelines with automated validation filters, reducing production cycles by 40%.",
      "Built custom full-stack web platforms and specialized WordPress architectures with tailored conversion funnels.",
      "Executed localized SEO campaigns and citation frameworks resulting in rapid local-pack visibility gains.",
      "Designed real-time performance monitoring scripts and automated technical alert systems.",
    ],
    technologies: [
      "Agentic AI",
      "Claude API",
      "Python",
      "React.js",
      "Node.js",
      "Technical SEO",
      "Prompt Engineering",
      "MySQL",
      "WordPress",
    ],
    keyAchievement: "Architected autonomous AI workflows that reduced content and keyword research production cycles by 40% across client engagements.",
  },
  {
    id: "it-path-solutions",
    role: "Web Design Intern",
    company: "IT Path Solutions",
    period: "2023 – 2024",
    location: "Ahmedabad, Gujarat, India",
    type: "Internship",
    summary:
      "Focused on modern frontend interface engineering, semantic markup architectures, responsive web design, and web performance optimization.",
    responsibilities: [
      "Developed responsive, semantic HTML5 and CSS3 user interfaces adhering to strict modern web standards.",
      "Applied accessibility (WCAG) and web performance best practices across frontend components.",
      "Supported WordPress theme customization, styling refinements, and layout restructuring.",
      "Collaborated on frontend feature development and cross-browser rendering compatibility.",
      "Optimized static component loading times and asset delivery pipelines.",
    ],
    technologies: ["HTML5", "CSS3", "JavaScript", "WordPress", "Responsive Web Design", "Web Accessibility (WCAG)"],
    keyAchievement: "Established foundational excellence in clean, semantic frontend architecture and performance-first responsive design.",
  },
];
