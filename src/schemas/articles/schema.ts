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

const mediaObject = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  file_id: z.string(),
  url: z.string().url(),
  type: z.enum(["image", "video", "audio"]),
  created_at: z.string(),
  updated_at: z.string(),
});

const mediaObjectsPlacementSchema = z.object({
  placement_key: z.string(),
  media_object: mediaObject,
  caption: z.string().optional().or(z.literal("")),
  alt_text: z.string().optional().or(z.literal("")),
  meta_data: z.any(),
});

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
  mediaObject,
  mediaObjectsPlacementSchema,
  articleSchema,
};

// Type inference
export type IArticle = z.infer<typeof articleSchema>;
export type IMediaObject = z.infer<typeof mediaObject>;
export type IMediaObjectsPlacement = z.infer<
  typeof mediaObjectsPlacementSchema
>;
