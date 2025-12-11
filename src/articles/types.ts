type IUnixTimestamp = number;

type IArticleStatus = "draft" | "published" | "archived" | "deleted";
type ISourceType = "internal" | "external" | "user_submitted" | "ai_generated";

interface ISource {
  type: ISourceType;
  name: string;
  url: string | null;
  author: string | null;
  published_date: IUnixTimestamp | null;
  license: string | null;
}

interface IMediaObjectsPlacement {
  [key: string]: Record<string, unknown>;
}

interface IArticle {
  id: string;
  title: string;
  content: string;
  slug: string;
  author: string;
  source: ISource;
  categories: string[];
  tags: string[];
  summary: string;
  language: string;
  status: IArticleStatus;
  created_at: string | null;
  updated_at: string | null;
  published_at: string | null;
  media_objects_placements: IMediaObjectsPlacement[];
  translation_of_id: string | null;
}
