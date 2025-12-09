type ICustomCollectionStatus = "draft" | "published" | "archived" | "deleted";
type IFieldType =
  | "text"
  | "textarea"
  | "number"
  | "date"
  | "boolean"
  | "select"
  | "multi_select"
  | "reference"
  | "image"
  | "file"
  | "rich_text"
  | "url"
  | "email"
  | "color";

interface IField {
  name: string;
  label: string;
  type: IFieldType;
  required: boolean;
  description: string | null;
  default_value: any | null;
  options: { [key: string]: unknown }[];
  validation: { [key: string]: unknown };
}

interface ICustomCollection {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  language: string;
  fields: IField[];
  status: ICustomCollectionStatus;
  created_at: string | null;
  updated_at: string | null;
}
