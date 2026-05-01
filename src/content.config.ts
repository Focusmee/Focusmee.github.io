import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { COLLECTION_IDS, MOOD_IDS } from "./data/collections";

const logs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/logs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    category: z.enum(COLLECTION_IDS),
    tags: z.array(z.string()).default([]),
    mood: z.enum(MOOD_IDS).default("sunny"),
    season: z.string().optional(),
    cover: z.string().optional(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false)
  })
});

export const collections = { logs };
