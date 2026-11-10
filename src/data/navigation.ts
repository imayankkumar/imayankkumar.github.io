import { getPublishedPosts } from "../lib/blog"

/**
 * Main nav. The site is learning-first: the roadmap and interview prep lead.
 * Projects, Resume and Contact live in the footer and on About.
 * "Blog" appears once at least one post is published.
 */
export async function getNavigation() {
  const hasPosts = (await getPublishedPosts()).length > 0
  return [
    { title: "Roadmap", href: "/roadmap/" },
    { title: "Interview", href: "/interview/" },
    ...(hasPosts ? [{ title: "Blog", href: "/blog/" }] : []),
    { title: "About", href: "/about/" },
  ]
}
