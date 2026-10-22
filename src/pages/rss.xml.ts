import type { APIRoute } from "astro"
import { getPublishedPosts, postUrl } from "../lib/blog"

const escape = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")

export const GET: APIRoute = async ({ site }) => {
  const posts = await getPublishedPosts()
  const items = posts
    .map((post) => {
      const link = new URL(postUrl(post), site).href
      return `    <item>
      <title>${escape(post.data.title)}</title>
      <link>${link}</link>
      <guid>${link}</guid>
      <description>${escape(post.data.description)}</description>
      <pubDate>${post.data.pubDate.toUTCString()}</pubDate>
    </item>`
    })
    .join("\n")

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
  <channel>
    <title>Mayank Kumar · Blog</title>
    <link>${new URL("/blog/", site).href}</link>
    <description>Android engineering, performance, and building Android apps with AI.</description>
    <language>en</language>
${items}
  </channel>
</rss>
`,
    { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } },
  )
}
