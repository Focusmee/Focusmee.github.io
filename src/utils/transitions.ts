import type { CollectionId } from "../data/collections";

export function getCollectionTransitionNames(id: CollectionId) {
  return {
    eyebrow: `collection-${id}-eyebrow`,
    title: `collection-${id}-title`
  };
}
