import { collectionMap, type CollectionId } from "../../data/collections";

type CollectionChoiceId = Exclude<CollectionId, "notes">;
type DialogChoiceId = CollectionChoiceId | "about";

type DialogChoice = {
  id: DialogChoiceId;
  title: string;
  href: string;
  detail: string;
};

const collectionChoiceIds: CollectionChoiceId[] = [
  "records",
  "lab",
  "garden",
  "frames",
  "drawer"
];

export const homeDialogChoices: DialogChoice[] = [
  ...collectionChoiceIds.map((id) => {
    const collection = collectionMap.get(id);

    if (!collection) {
      throw new Error(`Missing collection metadata for ${id}`);
    }

    return {
      id,
      title: collection.title,
      href: collection.href,
      detail: collection.blurb
    };
  }),
  {
    id: "about",
    title: "About",
    href: "/about",
    detail: "who keeps this seaside archive open"
  }
];
