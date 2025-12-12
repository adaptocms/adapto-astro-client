import { defineCollection, z } from "astro:content";
import { articleSchema, type IArticle } from "./schemas/articles";
import { categorySchema, type ICategory } from "./schemas/categories";
import { pageSchema, type IPage } from "./schemas/pages";
import { microcopySchema, type IMicrocopy } from "./schemas/microCopies";
import {
  customCollectionSchema,
  type ICustomCollection,
} from "./schemas/customCollections";

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
    return pagesResponse.items.map((page: IPage) => ({
      ...page,
    }));
  },
  schema: pageSchema,
});

const customCollectionsCollection = defineCollection({
  loader: async () => {
    const response = await fetch(`${API_URL}/public/custom-collections`, {
      headers: {
        "x-api-key": SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch custom collections from CMS. Status: ${response.status}`
      );
    }
    const customCollectionsResponse = await response.json();
    return customCollectionsResponse.items.map(
      (customCollection: ICustomCollection) => ({
        ...customCollection,
      })
    );
  },
  schema: customCollectionSchema,
});

const microCopiesCollection = defineCollection({
  loader: async () => {
    const response = await fetch(`${API_URL}/public/micro-copy`, {
      headers: {
        "x-api-key": SECRET_KEY,
      },
    });

    if (!response.ok) {
      throw new Error(
        `Failed to fetch micro copies from CMS. Status: ${response.status}`
      );
    }
    const microCopiesResponse = await response.json();
    return microCopiesResponse.map((microCopy: IMicrocopy) => ({
      ...microCopy,
    }));
  },
  schema: microcopySchema,
});

export const collections = {
  articles: articlesCollection,
  categories: categoriesCollection,
  pages: pagesCollection,
  microCopies: microCopiesCollection,
  customCollections: customCollectionsCollection,
};
