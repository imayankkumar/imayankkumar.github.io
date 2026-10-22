import { site } from "./site"
import { contact, patent, framePulse } from "./career"

/** Single source for the experience figure (career started Oct 2017). */
const yearsOfExperience = "9+"

export const profile = {
  name: "Mayank Kumar",
  yearsOfExperience,
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
  bio: `I'm Mayank Kumar, a Senior Android Engineer with ${yearsOfExperience} years of experience. I build high-performance Android applications, contribute to open source, and create developer tools that improve engineering productivity.`,
  image: {
    src: "/images/profile.png",
    alt: "Portrait of Mayank Kumar",
  },
  highlights: [
    {
      label: "USPTO Patent Inventor",
      href: patent.href,
      variant: "light" as const,
      icon: "patent" as const,
    },
    {
      label: "Creator of FramePulse",
      href: framePulse.href,
      variant: "dark" as const,
      icon: "pulse" as const,
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
      href: `mailto:${contact.email}`,
      external: false,
    },
  ],
}
