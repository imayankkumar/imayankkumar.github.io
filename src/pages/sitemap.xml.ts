import type { APIRoute } from "astro"

// Hand-listed: the site has a handful of static pages. Add new pages here.
const paths = ["/", "/about/", "/projects/", "/resume/", "/contact/"]

export const GET: APIRoute = ({ site }) => {
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site)}</loc></url>`)
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
