import { defineCollection } from "astro:content";
import { articleSchema, type IArticle } from "./schemas/articles";
import { categorySchema, type ICategory } from "./schemas/categories";
import { pageSchema, type IPage } from "./schemas/pages";
import { microCopySchema, type IMicroCopy } from "./schemas/microCopies";
import {
  customCollectionSchema,
  type ICustomCollection,
} from "./schemas/customCollections";

const API_URL = import.meta.env.ADAPTO_API_URL;
const SECRET_KEY = import.meta.env.ADAPTO_SECRET_KEY;

export const DEFAULT_LANGUAGE = "en-US";
export const PAGE_SIZE = 3;

const articlesCollection = defineCollection({
  loader: async () => {
    try {
      console.log("Fetching articles from CMS...");
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
      const response = await fetch(`${API_URL}/public/pages`, {
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

export const collections = {
  articles: articlesCollection,
  categories: categoriesCollection,
  pages: pagesCollection,
  microCopies: microCopiesCollection,
  customCollections: customCollectionsCollection,
};
