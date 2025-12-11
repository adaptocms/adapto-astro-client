import { z } from "zod";

const pageStatusSchema = z.enum(["draft", "published", "archived", "deleted"]);

const mediaObjectsPlacementSchema = z.record(z.unknown());

const pageSchema = z.object({
  id: z.string(),
  title: z.string(),
  content: z.string(),
  slug: z.string(),
  menu_label: z.string().nullable(),
  parent_id: z.string().nullable(),
  language: z.string(),
  status: pageStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().nullable(),
  media_objects_placements: z.array(mediaObjectsPlacementSchema),
  translation_of_id: z.string().nullable(),
});

export { pageStatusSchema, mediaObjectsPlacementSchema, pageSchema };

// Type inference
//  type IPageSchema = z.infer<typeof pageSchema>;
