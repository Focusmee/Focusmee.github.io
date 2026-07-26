import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";
import { COLLECTION_IDS } from "./data/collections";

export const MEDIA_SHAPES = ["landscape", "portrait", "square"] as const;

const mediaShape = z.enum(MEDIA_SHAPES);
const sortOrder = z.number().int().nonnegative().default(999);

const logs = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/logs" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    tags: z.array(z.string()).default([]),
    cover: z.string().optional(),
    coverAlt: z.string().optional(),
    coverShape: mediaShape.default("landscape"),
    category: z.enum(COLLECTION_IDS).optional(),
    draft: z.boolean().default(false)
  })
});

const movies = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/movies" }),
  schema: z.object({
    title: z.string(),
    originalTitle: z.string().optional(),
    year: z.number().int().min(1888),
    director: z.string(),
    poster: z
      .string()
      .refine(
        (value) => value.startsWith("/media/movies/"),
        "电影海报必须放在 public/media/movies 下"
      ),
    note: z.string(),
    externalUrl: z.url().optional(),
    order: sortOrder,
    draft: z.boolean().default(false)
  })
});

const photos = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/photos" }),
  schema: z.object({
    image: z
      .string()
      .refine(
        (value) => value.startsWith("/media/photos/"),
        "图片必须放在 public/media/photos 下"
      ),
    alt: z.string().min(1),
    shape: mediaShape,
    caption: z.string().optional(),
    date: z.coerce.date().optional(),
    location: z.string().optional(),
    order: sortOrder,
    draft: z.boolean().default(false)
  })
});

export const collections = { logs, movies, photos };
