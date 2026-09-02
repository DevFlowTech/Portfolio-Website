export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tagline: string;
  description: string;
  technologies: string[];
  features: string[];
  technicalHighlights: string[];
  metricsResult?: string;
  architectureType: "erp" | "healthcare-ai" | "real-estate" | "security-gate" | "visa-consulting";
}

export const projects: Project[] = [
  {
    id: "enterprise-erp",
    number: "01",
    title: "Enterprise ERP Business Management System",
    category: "Full-Stack Architecture",
    tagline: "Centralized multi-module enterprise resource system powering operations, inventory & financials.",
    description:
      "Architected a comprehensive, modular ERP platform engineered to unify fragmented business processes across inventory tracking, automated billing, and human resource management with strict role-based access control.",
    technologies: ["React.js", "Node.js", "Express.js", "MySQL", "JWT Authentication", "RBAC", "REST APIs"],
    features: [
      "Role-Based Access Control (RBAC) across administrative, managerial, and staff tiers",
      "Stateless JWT authentication with secure session token revocation",
      "Real-time operational KPI dashboards with live telemetry",
      "Immutable system audit logging for financial and operational compliance",
      "Automated invoice and inventory stock ledger generation",
    ],
    technicalHighlights: [
      "Designed normalized relational database schemas in MySQL handling concurrent inventory transactions.",
      "Engineered decoupled Express REST endpoints with centralized error handling and transaction rollbacks.",
      "Built responsive React interface with optimistic UI updates and modular state orchestration.",
    ],
    architectureType: "erp",
  },
  {
    id: "healthcare-ai-automation",
    number: "02",
    title: "AI-Powered Healthcare Data & Content Automation",
    category: "Agentic AI & Automation",
    tagline: "Autonomous multi-agent intelligence pipeline for medical data synthesis and content workflows.",
    description:
      "Developed an autonomous AI system designed for healthcare data processing and high-precision content automation, orchestrating Claude API LLM chains to transform complex healthcare datasets into verified, search-optimized assets.",
    technologies: ["Node.js", "Python", "Claude API", "Prompt Engineering", "Agentic AI", "JSON Pipelines"],
    features: [
      "Keyword-targeted medical landing-page generation with contextual accuracy",
      "Crawl-efficient site architecture generator for dynamic medical catalogs",
      "Autonomous AI-assisted content pipelines with strict verification checks",
      "Context-aware clinical terminology extraction and validation",
      "Batch prompt execution engine with structured JSON output enforcement",
    ],
    technicalHighlights: [
      "Engineered multi-stage prompt validation guards to maintain high informational integrity.",
      "Integrated Claude API endpoints with resilient retry logic and token usage optimization.",
      "Architected modular Python/Node data processors for real-time document transformation.",
    ],
    architectureType: "healthcare-ai",
  },
  {
    id: "real-estate-seo-platform",
    number: "03",
    title: "Real Estate Property Listing & Search Engine Platform",
    category: "Technical SEO & Web App",
    tagline: "High-performance property discovery portal with automated search engine indexation.",
    description:
      "Engineered an interactive real estate property listing platform designed from the ground up for peak Core Web Vitals performance, automated schema generation, and high-velocity search engine indexation.",
    technologies: ["React.js", "Node.js", "Technical SEO", "Schema JSON-LD", "Core Web Vitals", "XML Sitemaps"],
    features: [
      "Automated RealEstateListing Schema.org JSON-LD injection on all dynamic property routes",
      "Dynamic XML sitemap generator with automated priority and lastmod headers",
      "Self-referencing canonical tag management preventing duplicate listing penalties",
      "Ultra-fast Core Web Vitals performance with zero cumulative layout shift (CLS)",
      "Interactive property filtering engine with instant client-side state reflection",
    ],
    technicalHighlights: [
      "Implemented server-assisted dynamic metadata generation across thousands of property URLs.",
      "Optimized Largest Contentful Paint (LCP) through progressive asset hydration and responsive images.",
      "Configured robust robots directives and faceted navigation crawl budgets.",
    ],
    architectureType: "real-estate",
  },
  {
    id: "security-gate-access",
    number: "04",
    title: "Digital Security Gate Management & Access Control",
    category: "Systems & Access Control",
    tagline: "Real-time visitor entry orchestration and cryptographic QR verification for secure facilities.",
    description:
      "Developed a mission-critical digital security and visitor access management platform enabling automated QR code entry pass generation, instant guard terminal validation, and comprehensive facility audit trails.",
    technologies: ["React.js", "Node.js", "Express.js", "MySQL", "QR Code Auth", "WebSockets"],
    features: [
      "Time-bound, cryptographically signed QR code entry pass generation for visitors",
      "Real-time guard checkpoint verification terminal with instant scan feedback",
      "Multi-tier dashboard for facility managers, security personnel, and hosts",
      "Comprehensive visitor activity logging and instant anomaly reporting",
      "Automated check-in / check-out timestamps with duration analytics",
    ],
    technicalHighlights: [
      "Engineered rapid QR validation subroutines with low-latency database lookups in MySQL.",
      "Implemented real-time notification push events to security consoles upon checkpoint scans.",
      "Structured role-specific views with strict endpoint parameter validation.",
    ],
    architectureType: "security-gate",
  },
  {
    id: "visa-consulting-platform",
    number: "05",
    title: "Multi-Niche Visa Consulting & Local Authority Platform",
    category: "Growth & Local Search",
    tagline: "High-converting immigration & visa portal engineered for dominant local search visibility.",
    description:
      "Executed an end-to-end technical SEO architecture, content strategy, and WordPress development for a multi-niche immigration and visa consulting platform, focusing on regional authority and qualified lead generation.",
    technologies: ["WordPress", "SEO", "Local Search Optimization", "Schema Markup", "Google Business Profile"],
    features: [
      "Competitive keyword mapping across multiple visa streams and destination countries",
      "Comprehensive on-page technical optimization and schema hierarchy implementation",
      "Google Business Profile optimization and geo-targeted local citation network",
      "High-intent conversion funnels with automated consultation booking workflows",
      "Crawl budget optimization and mobile UX acceleration",
    ],
    technicalHighlights: [
      "Structured comprehensive LegalService and FAQPage JSON-LD schemas.",
      "Streamlined core template assets achieving sub-second mobile page loads.",
      "Implemented conversion tracking pipelines connecting search landing pages to CRM.",
    ],
    metricsResult: "Measurable improvement in local-pack rankings and qualified lead generation within 90 days.",
    architectureType: "visa-consulting",
  },
];
