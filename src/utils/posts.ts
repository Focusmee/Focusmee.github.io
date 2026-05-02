import { getCollection, type CollectionEntry } from "astro:content";
import type { CollectionId } from "../data/collections";

export type LogEntry = CollectionEntry<"logs">;

export async function getPublishedLogs() {
  const logs = await getCollection("logs", ({ data }) => !data.draft);
  return logs.sort(
    (left, right) =>
      right.data.pubDate.getTime() - left.data.pubDate.getTime()
  );
}

export async function getRecentLogs(limit = 3) {
  const logs = await getPublishedLogs();
  return logs.slice(0, limit);
}

export async function getFeaturedLogs(limit = 3) {
  const logs = await getPublishedLogs();
  return logs.filter((entry) => entry.data.featured).slice(0, limit);
}

export async function getPostsByCategory(category: CollectionId) {
  const logs = await getPublishedLogs();
  return logs.filter((entry) => entry.data.category === category);
}

export async function getCategoryCounts() {
  const logs = await getPublishedLogs();

  return logs.reduce<Record<string, number>>((counts, entry) => {
    const key = entry.data.category;
    counts[key] = (counts[key] || 0) + 1;
    return counts;
  }, {});
}

export function getRelatedPosts(posts: LogEntry[], current: LogEntry, limit = 3) {
  return posts
    .filter((entry) => entry.id !== current.id)
    .sort((left, right) => {
      const sharedLeft = left.data.tags.filter((tag) =>
        current.data.tags.includes(tag)
      ).length;
      const sharedRight = right.data.tags.filter((tag) =>
        current.data.tags.includes(tag)
      ).length;

      return sharedRight - sharedLeft;
    })
    .slice(0, limit);
}

export function groupPostsByYear(posts: LogEntry[]) {
  return posts.reduce<Record<string, LogEntry[]>>((groups, entry) => {
    const year = entry.data.pubDate.getFullYear().toString();
    groups[year] ||= [];
    groups[year].push(entry);
    return groups;
  }, {});
}
