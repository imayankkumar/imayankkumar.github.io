import { getPublishedPosts } from "../lib/blog"

const base = [
  { title: "About", href: "/about/" },
  { title: "Projects", href: "/projects/" },
  { title: "Contact", href: "/contact/" },
]

/** Main nav. "Blog" appears once at least one post is published. */
export async function getNavigation() {
  const hasPosts = (await getPublishedPosts()).length > 0
  return hasPosts
    ? [base[0], base[1], { title: "Blog", href: "/blog/" }, { title: "Roadmap", href: "/roadmap/" }, base[2]]
    : base
}
