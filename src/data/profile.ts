import { site } from "./site"

export const profile = {
  name: "Mayank Kumar",
  role: "Senior Android Engineer",
  tagline:
    "Building high-performance Android applications, open-source tools, and AI-powered products.",
  taglineHighlight: "Android",
  taglineLines: [
    [{ text: "Building high-performance" }],
    [
      { text: "Android", highlight: true },
      { text: " applications," },
    ],
    [{ text: "open-source tools, and" }],
    [{ text: "AI-powered products." }],
  ],
  location: "India",
  availability: "Open to opportunities",
  bio: "I'm Mayank Kumar, a Senior Android Engineer with 8+ years of experience. I build high-performance Android applications, contribute to open source, and create developer tools that improve engineering productivity.",
  image: {
    src: "/images/profile.png",
    alt: "Portrait of Mayank Kumar",
  },
  highlights: [
    {
      label: "USPTO Patent Inventor",
      variant: "light" as const,
      icon: "patent" as const,
    },
    {
      label: "Open Source Contributor",
      description: "Building tools for developers",
      variant: "dark" as const,
      icon: "globe" as const,
    },
  ],
  ctas: [
    {
      label: "View Projects",
      href: "/projects",
      variant: "primary" as const,
    },
    {
      label: "Get In Touch",
      href: "/contact",
      variant: "secondary" as const,
    },
  ],
  connectLabel: "Let's connect",
  connect: [
    {
      name: "GitHub",
      href: site.github,
      external: true,
    },
    {
      name: "LinkedIn",
      href: site.linkedin,
      external: true,
    },
    {
      name: "Email",
      href: "/contact",
      external: false,
    },
  ],
}
