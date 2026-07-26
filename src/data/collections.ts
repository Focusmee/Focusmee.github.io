export const COLLECTION_IDS = [
  "notes",
  "lab",
  "records",
  "frames",
  "garden",
  "drawer"
] as const;

export type CollectionId = (typeof COLLECTION_IDS)[number];

export type CollectionMeta = {
  id: CollectionId;
  title: string;
  description: string;
  href: string;
};

export const collections: CollectionMeta[] = [
  {
    id: "notes",
    title: "随笔",
    description: "个人记录、想法和暂时没有归类的文字。",
    href: "/collections/notes"
  },
  {
    id: "lab",
    title: "技术",
    description: "代码、Agent、系统设计与工程实践。",
    href: "/collections/lab"
  },
  {
    id: "records",
    title: "声音",
    description: "音乐、专辑、歌单和声音相关的记录。",
    href: "/collections/records"
  },
  {
    id: "frames",
    title: "影像",
    description: "电影、照片和视觉相关的旧文章。",
    href: "/collections/frames"
  },
  {
    id: "garden",
    title: "日常",
    description: "季节、生活与缓慢发生的事情。",
    href: "/collections/garden"
  },
  {
    id: "drawer",
    title: "旧稿",
    description: "重新整理的旧纸页和历史草稿。",
    href: "/collections/drawer"
  }
];

const collectionMap = new Map(
  collections.map((collection) => [collection.id, collection])
);

export function getCollectionMeta(id?: CollectionId) {
  return id ? collectionMap.get(id) : undefined;
}
