import { z } from "astro:content";

export const categorySchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  parent_id: z.string().nullable(),
  language: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
  translation_of_id: z.string().nullable(),
});
