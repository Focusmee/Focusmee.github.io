import { collectionMap, type CollectionId } from "../../data/collections";

type HotspotPlacement = {
  id: CollectionId;
  objectLabel: string;
  detail: string;
};

const placements: HotspotPlacement[] = [
  {
    id: "records",
    objectLabel: "front record rack",
    detail: "The brightest shelf by the door, full of playlists and sound notes."
  },
  {
    id: "lab",
    objectLabel: "CRT workbench",
    detail: "A blue screen corner for code, AI experiments, and broken ideas."
  },
  {
    id: "garden",
    objectLabel: "window plant",
    detail: "Sunflowers, seasons, and quiet things growing near the glass."
  },
  {
    id: "notes",
    objectLabel: "counter notes",
    detail: "Small scraps, daily fragments, and thoughts that still matter."
  },
  {
    id: "frames",
    objectLabel: "poster wall",
    detail: "Film, photos, visual fragments, and light pinned to the wall."
  },
  {
    id: "drawer",
    objectLabel: "under-counter drawer",
    detail: "Old paper, rescued drafts, and things worth pulling back out."
  }
];

export const homeHotspots = placements.map((placement) => {
  const collection = collectionMap.get(placement.id);

  if (!collection) {
    throw new Error(`Missing collection metadata for ${placement.id}`);
  }

  return {
    ...collection,
    ...placement
  };
});
