import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"writing">

/** Published posts, newest first. Drafts never ship. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("writing", ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

export function postUrl(post: Post): string {
  return `/writing/${post.id}/`
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  })
}

/** Rough reading time at ~220 words per minute. */
export function readingTime(post: Post): string {
  const words = (post.body ?? "").trim().split(/\s+/).filter(Boolean).length
  return `${Math.max(1, Math.round(words / 220))} min read`
}
