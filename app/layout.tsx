import type { Metadata, Viewport } from "next";
import { Inter, Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import LenisProvider from "@/components/LenisProvider";
import JsonLd from "@/components/JsonLd";
import CustomCursor from "@/components/CustomCursor";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-space-grotesk",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL("https://princegajjar.dev"),
  title: "Prince Gajjar — SEO Executive · Full Stack Web Developer · Agentic AI Specialist",
  description:
    "Personal portfolio of Prince Gajjar. Combining full-stack software engineering, autonomous Agentic AI pipelines, and technical SEO in Ahmedabad, Gujarat, India.",
  keywords: [
    "Prince Gajjar",
    "Prince Gajjar developer",
    "Prince Gajjar Ahmedabad",
    "SEO Executive Ahmedabad",
    "Full Stack Developer Ahmedabad",
    "Agentic AI Specialist",
    "Full Stack Web Developer",
    "Technical SEO Developer",
    "AI Automation Engineer",
  ],
  authors: [{ name: "Prince Gajjar", url: "https://princegajjar.dev" }],
  creator: "Prince Gajjar",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://princegajjar.dev",
    title: "Prince Gajjar — SEO Executive · Full Stack Web Developer · Agentic AI Specialist",
    description:
      "I build digital systems that think, perform and grow. Combining full-stack engineering, Agentic AI, and technical SEO.",
    siteName: "Prince Gajjar Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Prince Gajjar — SEO Executive · Full Stack Web Developer · Agentic AI Specialist",
    description:
      "I build digital systems that think, perform and grow. Combining full-stack engineering, Agentic AI, and technical SEO.",
    creator: "@PrinceGajjar",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://princegajjar.dev",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`light ${inter.variable} ${spaceGrotesk.variable} ${jetbrainsMono.variable}`}
    >
      <head>
        <JsonLd />
      </head>
      <body className="bg-[#ffffff] text-[#0a192f] antialiased selection:bg-sapphire-100 selection:text-sapphire-800 min-h-screen">
        <CustomCursor />
        <LenisProvider>
          {children}
        </LenisProvider>
      </body>
    </html>
  );
}
