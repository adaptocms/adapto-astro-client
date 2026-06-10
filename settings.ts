export const ENV = import.meta.env.ENV;
export const API_URL = import.meta.env.ADAPTO_API_URL || "";
export const API_KEY = import.meta.env.ADAPTO_API_KEY || "";

export const DEFAULT_LANGUAGE = "en";
export const ARTICLES_PER_PAGE = 2;

// Collections with hand-built pages under src/pages/[...lang]/<slug>/.
// The generic [collection_slug] routes skip these slugs; everything else
// renders automatically.
export const BESPOKE_COLLECTION_SLUGS: string[] = ["showcase"];
