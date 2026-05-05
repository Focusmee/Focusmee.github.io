export const COLLECTION_IDS = [
  "notes",
  "lab",
  "records",
  "frames",
  "garden",
  "drawer"
] as const;

export const MOOD_IDS = [
  "sunny",
  "weird",
  "soft",
  "noisy",
  "blue",
  "muddy",
  "bright"
] as const;

export type CollectionId = (typeof COLLECTION_IDS)[number];
export type MoodId = (typeof MOOD_IDS)[number];

export type CollectionMeta = {
  id: CollectionId;
  title: string;
  description: string;
  object: string;
  href: string;
  color: string;
  blurb: string;
};

export const collections: CollectionMeta[] = [
  {
    id: "records",
    title: "Records",
    description: "music, albums, playlists, and sound notes",
    object: "record shelf",
    href: "/collections/records",
    color: "orange",
    blurb: "notes that sound like summer"
  },
  {
    id: "lab",
    title: "Lab",
    description: "code, AI, experiments, and broken ideas",
    object: "CRT computer",
    href: "/collections/lab",
    color: "sky",
    blurb: "where ideas break and bloom"
  },
  {
    id: "garden",
    title: "Garden",
    description: "sunflowers, seasons, soft observations",
    object: "sunflower vase",
    href: "/collections/garden",
    color: "sunflower",
    blurb: "soft things I noticed"
  },
  {
    id: "notes",
    title: "Notes",
    description: "personal logs, fragments, and daily thoughts",
    object: "desk notes",
    href: "/collections/notes",
    color: "pink",
    blurb: "small scraps that still matter"
  },
  {
    id: "frames",
    title: "Frames",
    description: "film, photos, and visual fragments",
    object: "photo wall",
    href: "/collections/frames",
    color: "sea",
    blurb: "film, fragments, frozen light"
  },
  {
    id: "drawer",
    title: "Drawer",
    description: "revisits, old papers, and rescued drafts",
    object: "drawer",
    href: "/collections/drawer",
    color: "mud",
    blurb: "old paper, brought back out"
  }
];

export const collectionMap = new Map(
  collections.map((collection) => [collection.id, collection])
);

export function getCollectionMeta(id: CollectionId) {
  return collectionMap.get(id);
}
