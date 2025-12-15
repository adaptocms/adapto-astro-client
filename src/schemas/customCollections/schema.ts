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
  options: z.array(z.record(z.unknown())),
  validation: z.record(z.unknown()),
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

export {
  customCollectionStatusSchema,
  fieldTypeSchema,
  fieldSchema,
  customCollectionSchema,
};

// Type inference
export type ICustomCollection = z.infer<typeof customCollectionSchema>;
