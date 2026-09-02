import { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Prince Gajjar — Portfolio",
    short_name: "Prince Gajjar",
    description:
      "Personal portfolio of Prince Gajjar: SEO Executive, Full Stack Web Developer, and Agentic AI Specialist.",
    start_url: "/",
    display: "standalone",
    background_color: "#08090a",
    theme_color: "#08090a",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
