import { defineCollection, z } from "astro:content";
import { articleSchema } from "./articles/schema.ts";
import { categorySchema } from "./categories/schema.ts";
import type { ICategory } from "./categories/types.ts";
import { pageSchema } from "./customPages/schema.ts";

const API_URL = import.meta.env.ADAPTO_API_URL;
const SECRET_KEY = import.meta.env.ADAPTO_SECRET_KEY;

const articlesCollection = defineCollection({
  loader: async () => {
    const response = await fetch(`${API_URL}/public/articles`, {
      headers: {
        "x-api-key": SECRET_KEY,
      },
    });
    if (!response.ok) {
      throw new Error(
        `Failed to fetch articles from CMS. Status: ${response.status}`
      );
    }
    const articles = await response.json();
    return articles.items.map((article: IArticle) => article);
  },
  schema: articleSchema,
});

const categoriesCollection = defineCollection({
  loader: async () => {
    const response = await fetch(`${API_URL}/public/categories`, {
      headers: {
        "x-api-key": SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch categories from CMS. Status: ${response.status}`
      );
    }
    const categoriesResponse = await response.json();
    return categoriesResponse.items.map((category: ICategory) => ({
      ...category,
    }));
  },
  schema: categorySchema,
});

const pagesCollection = defineCollection({
  loader: async () => {
    const response = await fetch(`${API_URL}/public/pages`, {
      headers: {
        "x-api-key": SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch pages from CMS. Status: ${response.status}`
      );
    }
    const pagesResponse = await response.json();
    return pagesResponse.items.map((page: any) => ({
      ...page,
    }));
  },
  schema: pageSchema,
});

export const collections = {
  articles: articlesCollection,
  categories: categoriesCollection,
  pages: pagesCollection,
};
