import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"

/**
 * Posts live in src/content/writing/<slug>.md.
 * Set `draft: true` to keep a post out of the built site.
 */
const writing = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/writing" }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
    /** Links to where the post was shared, shown at the end of the article. */
    linkedinUrl: z.string().url().optional(),
    xUrl: z.string().url().optional(),
  }),
})

export const collections = { writing }
