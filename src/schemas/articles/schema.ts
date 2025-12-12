import { z } from "zod";

const unixTimestampSchema = z.number();

const articleStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
  "deleted",
]);

const sourceTypeSchema = z.enum([
  "internal",
  "external",
  "user_submitted",
  "ai_generated",
]);

const sourceSchema = z.object({
  type: sourceTypeSchema,
  name: z.string(),
  url: z.string().nullable(),
  author: z.string().nullable(),
  published_date: unixTimestampSchema.nullable(),
  license: z.string().nullable(),
});

const mediaObjectsPlacementSchema = z.record(z.record(z.unknown()));

const articleSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  author: z.string(),
  source: sourceSchema,
  categories: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([]),
  summary: z.string().nullable(),
  language: z.string(),
  status: articleStatusSchema,
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
  published_at: z.string().nullable(),
  media_objects_placements: z.array(mediaObjectsPlacementSchema).default([]),
  translation_of_id: z.string().nullable(),
});

export {
  unixTimestampSchema,
  articleStatusSchema,
  sourceTypeSchema,
  sourceSchema,
  mediaObjectsPlacementSchema,
  articleSchema,
};

// Type inference
export type IArticle = z.infer<typeof articleSchema>;
