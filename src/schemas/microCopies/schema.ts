import { z } from "zod";

const microcopySchema = z.object({
  id: z.string(),
  key: z.string(),
  value: z.string(),
  language: z.string(),
  translation_of: z.string().nullable(),
  tags: z.string(),
  created_at: z.string(),
  updated_at: z.string(),
});

export { microcopySchema };

// Type inference
export type IMicrocopy = z.infer<typeof microcopySchema>;
