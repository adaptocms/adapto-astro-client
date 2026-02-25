import { adapto } from "../../lib/adapto-sdk";
import type { ICategory } from "../schemas/categories";

export async function categoriesLoader() {
  try {
    // listAll() automatically fetches ALL pages of categories
    const categories = await adapto.categories.listAll();

    return categories.map((category: ICategory) => ({
      ...category,
      id: category.id,
    }));
  } catch (error) {
    console.error("⚠️ Categories loader failed:", error);
    return [];
  }
}
