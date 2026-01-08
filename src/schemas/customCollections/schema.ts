import { z } from "zod";

const customCollectionStatusSchema = z.enum([
  "draft",
  "published",
  "archived",
  "deleted",
]);

const fieldTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "date",
  "boolean",
  "select",
  "multi_select",
  "reference",
  "image",
  "file",
  "rich_text",
  "url",
  "email",
  "color",
]);

const fieldSchema = z.object({
  name: z.string(),
  label: z.string(),
  type: fieldTypeSchema,
  required: z.boolean(),
  description: z.string().nullable(),
  default_value: z.any().nullable(),
  related_collection: z.string().nullable(),
  options: z.array(z.record(z.unknown())).nullable(),
  validation: z.record(z.unknown()).nullable(),
});

const customCollectionSchema = z.object({
  id: z.string(),
  name: z.string(),
  slug: z.string(),
  description: z.string().nullable(),
  language: z.string(),
  fields: z.array(fieldSchema),
  status: customCollectionStatusSchema,
  created_at: z.string().nullable(),
  updated_at: z.string().nullable(),
});

const customCollectionItemSchema = z.object({
  id: z.string(),
  collection_id: z.string(),
  title: z.string(),
  slug: z.string(),
  data: z.record(z.any()),
  language: z.string(),
  status: customCollectionStatusSchema,
  created_at: z.string(),
  updated_at: z.string(),
  published_at: z.string().nullable(),
  translation_of_id: z.string().nullable(),
});

export {
  customCollectionStatusSchema,
  customCollectionItemSchema,
  fieldTypeSchema,
  fieldSchema,
  customCollectionSchema,
};

// Type inference
export type ICustomCollection = z.infer<typeof customCollectionSchema>;
export type ICustomCollectionItem = z.infer<typeof customCollectionItemSchema>;
