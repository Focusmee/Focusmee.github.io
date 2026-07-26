import { getCollection, type CollectionEntry } from "astro:content";

export type MovieEntry = CollectionEntry<"movies">;
export type PhotoEntry = CollectionEntry<"photos">;

export async function getPublishedMovies(limit?: number) {
  const movies = await getCollection("movies", ({ data }) => !data.draft);

  const sorted = movies.sort(
    (left, right) =>
      left.data.order - right.data.order ||
      left.data.title.localeCompare(right.data.title, "zh-CN")
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}

export async function getPublishedPhotos(limit?: number) {
  const photos = await getCollection("photos", ({ data }) => !data.draft);

  const sorted = photos.sort(
    (left, right) =>
      left.data.order - right.data.order ||
      (right.data.date?.getTime() ?? 0) - (left.data.date?.getTime() ?? 0) ||
      left.id.localeCompare(right.id)
  );

  return typeof limit === "number" ? sorted.slice(0, limit) : sorted;
}
