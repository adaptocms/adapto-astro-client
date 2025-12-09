import { defineCollection, z } from "astro:content";
import type { ICategory } from "./categories/types.ts";
import { categorySchema } from "./categories/schema.ts";
import { slide } from "astro/virtual-modules/transitions.js";

// const API_URL = import.meta.env.ADAPTO_API_URL;
const API_URL = "https://jsonplaceholder.typicode.com";

const articlesCollection = defineCollection({
  loader: async () => {
    const res = await fetch(`${API_URL}/posts`);
    const articles = await res.json();

    return articles.map((article: any) => ({
      id: String(article.id),
      slug: `article-${article.id}`,
      userId: article.userId,
      title: article.title,
      body: article.body,
    }));
  },
  schema: z.object({
    id: z.string(),
    slug: z.string(),
    userId: z.number(),
    title: z.string(),
    body: z.string(),
  }),
});

// const categoriesCollection = defineCollection({
//   loader: async () => {
//     const response = await fetch(`${API_URL}/public/categories`);

//     if (!response.ok) {
//       throw new Error(`Failed to fetch categories: ${response.status}`);
//     }
//     const categoriesResponse = await response.json();
//     return categoriesResponse.items.map((category: ICategory) => ({
//       ...category,
//     }));
//   },
//   schema: categorySchema,
// });

export const collections = {
  articles: articlesCollection,
  //   categories: categoriesCollection,
};
