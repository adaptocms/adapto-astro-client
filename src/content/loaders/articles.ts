// src/content/loaders/articles.ts
import { adapto } from "../../lib/adapto-sdk";
import type { IArticle } from "../schemas/articles";

export async function articlesLoader() {
  try {
    //Automatically iterates through all pages of results
    // You can also add filters here, e.g., .listAll({ status: "published" })
    const allArticles = await adapto.articles.listAll({ status: "published" });

    return allArticles.map((article: IArticle) => ({
      ...article,
      //  Set the Astro ID to the slug for cleaner URLs (e.g. /blog/my-post)
      id: article.id,
    }));
  } catch (error) {
    console.error("⚠️ Articles loader failed:", error);
    return [];
  }
}
