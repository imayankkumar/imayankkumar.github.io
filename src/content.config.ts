import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

/**
 * Posts live in src/content/blog/<slug>.md.
 * Set `draft: true` to keep a post out of the built site.
 */
const blog = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/blog" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      /** Shorter title for search results and the browser tab. Defaults to `title`. */
      seoTitle: z.string().optional(),
      description: z.string().max(200),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([]),
      draft: z.boolean().default(false),
      /** Links to where the post was shared, shown at the end of the article. */
      linkedinUrl: z.string().url().optional(),
      xUrl: z.string().url().optional(),
      /** Link-preview image for this post, a root-relative path under public/ (1200×630). */
      ogImage: z.string().startsWith("/").optional(),
      ogImageAlt: z.string().optional(),
      /** Image shown on the post's card on the homepage. Path relative to the post file. */
      cover: image().optional(),
      coverAlt: z.string().optional(),
    }),
})

export const collections = { blog }
