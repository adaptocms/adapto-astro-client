type IPageStatus = "draft" | "published" | "archived" | "deleted";

interface IPage {
  id: string;
  title: string;
  content: string;
  slug: string;
  menu_label: string | null;
  parent_id: string | null;
  language: string;
  status: IPageStatus;
  created_at: string;
  updated_at: string;
  published_at: string;
  media_objects_placements: { [key: string]: unknown }[];
  translation_of_id: string | null;
}
