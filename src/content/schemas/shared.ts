import { z } from "zod";

const customFieldTypeSchema = z.enum([
  "text",
  "textarea",
  "number",
  "date",
  "date_range",
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

const customFieldSchema = z.object({
  type: customFieldTypeSchema,
  multiple: z.boolean().default(false),
  related_collection: z.string().nullable().optional(),
  value: z.any().optional(),
  // name: z.string().optional(),
  // label: z.string().optional(),
  // required: z.boolean().default(false).optional(),
  // description: z.string().nullable().optional(),
  // default_value: z.any().optional(),
  // options: z.array(z.record(z.string())).nullable().optional(),
  // validation: z.record(z.any()).nullable().optional(),
});

const mediaObject = z.object({
  id: z.string().uuid(),
  title: z.string(),
  description: z.string(),
  file_id: z.string(),
  url: z.string(),
  type: z.enum([
    "image",
    "video",
    "audio",
    "document",
    "youtube",
    "vimeo",
    "tiktok",
    "instagram_reel",
    "instagram_post",
    "other",
  ]),
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

export { customFieldTypeSchema, customFieldSchema, mediaObject, mediaObjectsPlacementSchema };
export type ICustomField = z.infer<typeof customFieldSchema>;
export type ICustomFieldType = z.infer<typeof customFieldTypeSchema>;
export type IMediaObject = z.infer<typeof mediaObject>;
export type IMediaObjectsPlacement = z.infer<typeof mediaObjectsPlacementSchema>;
