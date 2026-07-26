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

export async function getRecentLogs(limit = 5) {
  return (await getPublishedLogs()).slice(0, limit);
}

export async function getPostsByCategory(category: CollectionId) {
  return (await getPublishedLogs()).filter(
    (entry) => entry.data.category === category
  );
}

export async function getCategoryCounts() {
  const logs = await getPublishedLogs();

  return logs.reduce<Record<string, number>>((counts, entry) => {
    if (entry.data.category) {
      counts[entry.data.category] = (counts[entry.data.category] || 0) + 1;
    }

    return counts;
  }, {});
}

export function groupPostsByYear(posts: LogEntry[]) {
  return posts.reduce<Record<string, LogEntry[]>>((groups, entry) => {
    const year = entry.data.pubDate.getFullYear().toString();
    groups[year] ||= [];
    groups[year].push(entry);
    return groups;
  }, {});
}
