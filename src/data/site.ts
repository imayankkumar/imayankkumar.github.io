export const site = {
  name: "Mayank Kumar",

  role: "Senior Android Engineer",

  url: "https://imayankkumar.com",

  github: "https://github.com/imayankkumar",

  linkedin: "https://linkedin.com/in/mayankkumar-mk",

  x: "https://x.com/bymayankkumar",

  resume: "/resume/",

  newsletter: "https://imayankkumar.substack.com/subscribe",

  /** Runnable code, tests and decompiled Java for each roadmap topic. */
  codeRepo: "https://github.com/imayankkumar/android-roadmap",
}

/**
 * Subscribe link tagged with where it sits on the site, so Substack's stats
 * show which placement brings signups. Keep placement names short and stable.
 */
export function newsletterLink(
  placement: "post" | "interview" | "interview-index" | "roadmap" | "roadmap-note" | "home" | "footer",
) {
  return `${site.newsletter}?utm_source=imayankkumar.com&utm_medium=website&utm_campaign=${placement}`
}
