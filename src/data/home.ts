/**
 * Homepage content. Every item here must be real and public-safe:
 * no invented metrics, star counts, articles or employer internals.
 */
import type { IconName } from "../components/ui/Icon.astro"
import { contact, framePulse, patent } from "./career"
import { profile } from "./profile"
import { site } from "./site"

export interface FeaturedProject {
  icon: IconName
  tone: "blue" | "violet"
  title: string
  body: string
  tags: string[]
  meta?: string
  href: string
}

export const featuredProjects: FeaturedProject[] = [
  {
    icon: "pulse",
    tone: "blue",
    title: framePulse.name,
    body: "Android rendering and jank analysis library built on Choreographer, written from scratch in public.",
    tags: ["Kotlin", "Android", "Open Source"],
    meta: "Early alpha",
    href: framePulse.href,
  },
  {
    icon: "award",
    tone: "violet",
    title: `Patent ${patent.number}`,
    body: "Giving push-to-talk session participants control of the session. Granted March 2026.",
    tags: ["Push-to-talk", "Co-inventor"],
    href: patent.href,
  },
]

/** Home hero: written for the learner, not the hiring manager. */
export const hero = {
  badge: "Android Roadmap 2027 · New topics every week",
  lines: [
    [
      { text: "Learn " },
      { text: "Android", highlight: true },
      { text: " the way" },
    ],
    [{ text: "it works in production." }],
  ],
  bio: `Plain explanations, code checked on the current Kotlin version, and the interview follow-ups for every topic. I'm Mayank Kumar, a Senior Android Engineer with ${profile.yearsInAndroid} years building Android apps.`,
  ctas: [
    {
      label: "Start the roadmap",
      href: "/roadmap/",
      variant: "primary" as const,
    },
    {
      label: "Practice interview questions",
      href: "/interview/",
      variant: "secondary" as const,
    },
  ],
}

export const callToAction = {
  title: "New Android topics every week",
  body: "Each one comes with a plain explanation, checked code and the interview follow-ups. Get them by email: one email a week, free.",
  label: "Subscribe",
  href: site.newsletter,
}

export const footerColumns = [
  {
    title: "Navigate",
    links: [
      { label: "Roadmap", href: "/roadmap/" },
      { label: "Interview prep", href: "/interview/" },
      { label: "Blog", href: "/blog/" },
      { label: "About", href: "/about/" },
      { label: "Projects", href: "/projects/" },
      { label: "Resume", href: "/resume/" },
      { label: "Contact", href: "/contact/" },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "FramePulse", href: framePulse.href, external: true },
      { label: "Patent", href: patent.href, external: true },
      {
        label: "GitHub",
        href: "https://github.com/imayankkumar",
        external: true,
      },
    ],
  },
  {
    title: "Connect",
    links: [
      {
        label: "LinkedIn",
        href: "https://linkedin.com/in/mayankkumar-mk",
        external: true,
      },
      { label: "X", href: "https://x.com/bymayankkumar", external: true },
      { label: "Newsletter", href: site.newsletter, external: true },
      { label: "Email", href: `mailto:${contact.email}` },
    ],
  },
]
