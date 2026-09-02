import React from "react";

export default function JsonLd() {
  const personSchema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Prince Gajjar",
    givenName: "Prince",
    familyName: "Gajjar",
    jobTitle: [
      "SEO Executive",
      "Full Stack Web Developer",
      "Agentic AI Specialist",
    ],
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ahmedabad",
      addressRegion: "Gujarat",
      addressCountry: "India",
    },
    email: "work.princegajjar@gmail.com",
    sameAs: [
      "https://github.com/Prince-Gajjar",
      "https://linkedin.com/in/prince-gajjar-55281b305",
    ],
    knowsAbout: [
      "Full Stack Web Development",
      "Agentic AI & Multi-Agent Systems",
      "Technical SEO & Core Web Vitals",
      "React.js & Next.js",
      "Node.js & Express.js",
      "Prompt Engineering",
      "Schema.org JSON-LD",
      "MySQL, MongoDB, PostgreSQL",
    ],
  };

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Prince Gajjar — Portfolio",
    url: "https://princegajjar.dev",
    description:
      "Personal portfolio of Prince Gajjar: SEO Executive, Full Stack Web Developer, and Agentic AI Specialist based in Ahmedabad, India.",
    author: {
      "@type": "Person",
      name: "Prince Gajjar",
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
    </>
  );
}
