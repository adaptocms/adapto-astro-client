import { defineCollection, z } from "astro:content";

const articlesCollection = defineCollection({
  loader: async () => {
    const res = await fetch("https://jsonplaceholder.typicode.com/posts");
    const articles = await res.json();

    return articles.map((article: any) => ({
      id: String(article.id),
      userId: article.userId,
      title: article.title,
      body: article.body,
    }));
  },
  schema: z.object({
    id: z.string(),
    userId: z.number(),
    title: z.string(),
    body: z.string(),
  }),
});

export const collections = {
  articles: articlesCollection,
};
