import { getCollection, type CollectionEntry } from "astro:content"
import { findRoadmapTopic } from "../data/roadmap"

export type Post = CollectionEntry<"blog">

/** Published posts, newest first. Drafts never ship. */
export async function getPublishedPosts(): Promise<Post[]> {
  const posts = await getCollection("blog", ({ data }) => !data.draft)
  return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf())
}

export function postUrl(post: Post): string {
  return `/blog/${post.id}/`
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

/**
 * Published posts that belong to the roadmap, keyed by topic id.
 * Fails the build if a post names a topic that src/data/roadmap.ts doesn't have.
 */
export async function getRoadmapPosts(): Promise<Map<string, Post>> {
  const byTopic = new Map<string, Post>()
  for (const post of await getPublishedPosts()) {
    const topic = post.data.roadmap?.topic
    if (!topic) continue
    if (!findRoadmapTopic(topic)) {
      throw new Error(`Post "${post.id}" has roadmap topic "${topic}", which is not in src/data/roadmap.ts`)
    }
    byTopic.set(topic, post)
  }
  return byTopic
}
