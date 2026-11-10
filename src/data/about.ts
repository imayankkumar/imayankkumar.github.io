/**
 * About page content. Every item here must be real and public-safe:
 * no invented metrics, star counts, articles or employer internals.
 */
import type { IconName } from "../components/ui/Icon.astro"
import { framePulse, patent } from "./career"
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
    title: `${profile.yearsInAndroid} Years`,
    body: `Of Android development, ${profile.yearsInSoftware} years in software overall`,
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
