/**
 * Homepage content. Every item here must be real and public-safe:
 * no invented metrics, star counts, articles or employer internals.
 */
import type { IconName } from "../components/ui/Icon.astro"
import { contact, framePulse, patent } from "./career"
import { profile } from "./profile"

export interface Highlight {
  icon: IconName
  tone: "blue" | "green" | "violet"
  title: string
  body: string
  link?: { label: string; href: string; external?: boolean }
}

export const highlights: Highlight[] = [
  {
    icon: "shield",
    tone: "blue",
    title: "USPTO Patent",
    body: "Co-inventor on a granted United States patent",
    link: { label: "View patent", href: patent.href, external: true },
  },
  {
    icon: "calendar",
    tone: "green",
    title: `${profile.yearsOfExperience} Years`,
    body: "Building Android apps in production since 2017",
  },
  {
    icon: "pulse",
    tone: "blue",
    title: framePulse.name,
    body: "Open-source Android frame pacing and jank analysis",
    link: { label: "View on GitHub", href: framePulse.href, external: true },
  },
  {
    icon: "sparkles",
    tone: "violet",
    title: "AI-Assisted Engineering",
    body: "Agent workflows for Android SDK upgrades and migrations",
  },
]

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

export interface Milestone {
  year: string
  text: string
}

export const journey: Milestone[] = [
  { year: "2017", text: "Joined Tata Elxsi, starting in test automation" },
  { year: "2019", text: "Senior Engineer: Android TV and device tooling" },
  { year: "2023", text: "Joined Zebra Technologies, enterprise messaging" },
  { year: "2025", text: "Promoted to Senior Software Engineer I" },
  { year: "2026", text: "US patent granted; building FramePulse in public" },
]

export const callToAction = {
  title: "Let's build something together",
  body: "I'm always happy to talk about Android, performance, AI-assisted engineering, or a role where those matter.",
  label: "Get In Touch",
  href: "/contact",
}

export const footerColumns = [
  {
    title: "Navigate",
    links: [
      { label: "About", href: "/about" },
      { label: "Projects", href: "/projects" },
      { label: "Resume", href: "/resume" },
      { label: "Contact", href: "/contact" },
    ],
  },
  {
    title: "Work",
    links: [
      { label: "FramePulse", href: framePulse.href, external: true },
      { label: "Patent", href: patent.href, external: true },
      { label: "GitHub", href: "https://github.com/imayankkumar", external: true },
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
      { label: "Email", href: `mailto:${contact.email}` },
    ],
  },
]
