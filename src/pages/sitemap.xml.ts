import type { APIRoute } from "astro"
import { getPublishedPosts, getRoadmapPosts, postUrl } from "../lib/blog"
import { interviewCards } from "../data/interview"

// Static pages, interview ladder pages, plus every published post.
const pages = ["/", "/about/", "/projects/", "/roadmap/", "/interview/", "/resume/", "/contact/"]

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts()
  const roadmapPosts = await getRoadmapPosts()
  const entries = [
    ...pages.map((path) => ({ path, lastmod: undefined as Date | undefined })),
    ...interviewCards.flatMap((c) =>
      c.kind === "ladder" && c.page && roadmapPosts.has(c.topic) ? [{ path: `/interview/${c.page.slug}/`, lastmod: undefined }] : [],
    ),
    ...(posts.length ? [{ path: "/blog/", lastmod: posts[0].data.pubDate }] : []),
    ...posts.map((p) => ({ path: postUrl(p), lastmod: p.data.updatedDate ?? p.data.pubDate })),
  ]
  const urls = entries
    .map(({ path, lastmod }) => {
      const loc = new URL(path, site)
      const mod = lastmod ? `<lastmod>${lastmod.toISOString().slice(0, 10)}</lastmod>` : ""
      return `  <url><loc>${loc}</loc>${mod}</url>`
    })
    .join("\n")

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`,
    { headers: { "Content-Type": "application/xml" } },
  )
}
