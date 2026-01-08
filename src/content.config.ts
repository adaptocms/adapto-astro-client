import { defineCollection } from "astro:content";
import { articleSchema, type IArticle } from "./schemas/articles";
import { categorySchema, type ICategory } from "./schemas/categories";
import { pageSchema, type IPage } from "./schemas/pages";
import { microCopySchema, type IMicroCopy } from "./schemas/microCopies";
import {
  customCollectionItemSchema,
  customCollectionSchema,
  type ICustomCollection,
  type ICustomCollectionItem,
} from "./schemas/customCollections";
import { languageSchema } from "./schemas/languages/schema";
import { custom } from "astro:schema";

const API_URL = import.meta.env.ADAPTO_API_URL;
const SECRET_KEY = import.meta.env.ADAPTO_SECRET_KEY;
const TENANT_ID = SECRET_KEY?.split(".")[1] || "";

export const PAGE_SIZE = 2;
export const DEFAULT_LANGUAGE = "en";
const LIMIT = 20;

const articlesCollection = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(`${API_URL}/public/articles`, {
        headers: {
          "x-api-key": SECRET_KEY,
        },
      });
      if (!response.ok) {
        console.error(
          `⚠️  Failed to fetch articles from CMS. Status: ${response.status}`
        );
        return [];
      }
      const articles = await response.json();
      return articles.items.map((article: IArticle) => article);
    } catch (error) {
      console.error("⚠️ Articles fetch failed:", error);
      return [];
    }
  },
  schema: articleSchema,
});

const categoriesCollection = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(`${API_URL}/public/categories`, {
        headers: {
          "x-api-key": SECRET_KEY,
        },
      });

      if (!response.ok) {
        console.error(
          `⚠️ Failed to fetch categories from CMS. Status: ${response.status}`
        );
        return [];
      }

      const categoriesResponse = await response.json();
      return categoriesResponse.items.map((category: ICategory) => ({
        ...category,
      }));
    } catch (error) {
      console.error("⚠️ Categories fetch failed:", error);
      return [];
    }
  },
  schema: categorySchema,
});

const pagesCollection = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(`${API_URL}/public/pages?limit=${LIMIT}`, {
        headers: {
          "x-api-key": SECRET_KEY,
        },
      });

      if (!response.ok) {
        console.error(
          `⚠️  Failed to fetch pages from CMS. Status: ${response.status}`
        );
        return [];
      }
      const pagesResponse = await response.json();
      return pagesResponse.items.map((page: IPage) => ({
        ...page,
      }));
    } catch (error) {
      console.error("⚠️ Pages fetch failed:", error);
      return [];
    }
  },
  schema: pageSchema,
});

const customCollectionsCollection = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(`${API_URL}/public/custom-collections`, {
        headers: {
          "x-api-key": SECRET_KEY,
        },
      });

      if (!response.ok) {
        console.error(
          `⚠️  Failed to fetch custom collections from CMS. Status: ${response.status}`
        );
        return [];
      }
      const customCollectionsResponse = await response.json();
      return customCollectionsResponse.items.map(
        (customCollection: ICustomCollection) => ({
          ...customCollection,
        })
      );
    } catch (error) {
      console.error("⚠️ Custom Collections fetch failed:", error);
      return [];
    }
  },
  schema: customCollectionSchema,
});

const customCollectionItems = defineCollection({
  loader: async () => {
    try {
      // 1. Fetch all parent collections
      const collectionsRes = await fetch(
        `${API_URL}/public/custom-collections`,
        {
          headers: { "x-api-key": SECRET_KEY },
        }
      );

      if (!collectionsRes.ok) {
        console.error(
          `⚠️  Failed to fetch custom collections from CMS. Status: ${collectionsRes.status}`
        );
        return [];
      }

      const { items: collections } = await collectionsRes.json();

      // 2. Map through collections and fetch their specific items
      const allItemsNested = await Promise.all(
        collections.map(async (collection: any) => {
          const itemRes = await fetch(
            `${API_URL}/public/custom-collections/${collection.id}/items`,
            {
              headers: { "x-api-key": SECRET_KEY },
            }
          );

          if (!itemRes.ok) return []; // Skip failed collection fetches
          const data = await itemRes.json();
          return data.items;
        })
      );

      // 3. Flatten the array of arrays into a single list of items
      const flatItems = allItemsNested.flat();

      // 4. Return the items formatted for Astro
      return flatItems.map((item: ICustomCollectionItem) => ({
        ...item,
      }));
    } catch (error) {
      console.error("⚠️ Error loading custom collection items:", error);
      return [];
    }
  },
  schema: customCollectionItemSchema,
});

const microCopiesCollection = defineCollection({
  loader: async () => {
    try {
      const response = await fetch(`${API_URL}/public/micro-copy`, {
        headers: {
          "x-api-key": SECRET_KEY,
        },
      });

      if (!response.ok) {
        console.error(
          `⚠️  Failed to fetch micro copies from CMS. Status: ${response.status}`
        );
        return [];
      }
      const microCopiesResponse = await response.json();

      return microCopiesResponse.map((microCopy: IMicroCopy) => ({
        ...microCopy,
      }));
    } catch (error) {
      console.error("⚠️ Micro Copies fetch failed:", error);
      return [];
    }
  },
  schema: microCopySchema,
});

const languagesCollection = defineCollection({
  loader: async () => {
    try {
      const res = await fetch(
        `${API_URL}/public/available-languages?tenant_id=${TENANT_ID}`,
        {
          headers: { "x-api-key": SECRET_KEY },
        }
      );

      if (!res.ok) {
        console.warn("⚠️ Failed to load languages, falling back");
        return [];
      }

      const codes: string[] = await res.json();

      return codes.map((code, i) => {
        const [lang, region] = code.split("-");
        const label =
          new Intl.DisplayNames([lang], { type: "language" }).of(lang) || lang;

        return languageSchema.parse({
          id: code,
          code,
          short: lang.toLowerCase(),
          label,
          is_default: i === 0, // First language is default
        });
      });
    } catch (error) {
      console.error("⚠️ Languages fetch failed:", error);
      return [];
    }
  },
  schema: languageSchema,
});

export const collections = {
  articles: articlesCollection,
  categories: categoriesCollection,
  pages: pagesCollection,
  microCopies: microCopiesCollection,
  customCollections: customCollectionsCollection,
  customCollectionItems: customCollectionItems,
  languages: languagesCollection,
};
