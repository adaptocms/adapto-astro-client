import { adapto } from "../../lib/adapto-sdk";
import type { ICustomCollectionItem } from "../schemas/customCollections";

export async function customCollectionItemsLoader() {
  try {
    // 1. Fetch all parent collection definitions (e.g. "Metrics", "FAQs")
    const collections = await adapto.collections.listAll();

    // 2. Fetch items for ALL collections in parallel
    const allItemsNested = await Promise.all(
      collections.map(async (collection) => {
        // Fetch items for this specific collection ID
        const items = await adapto.collections.listAllItems(collection.id);

        // Map items to include parent context
        return items.map((item: ICustomCollectionItem) => ({
          ...item,
          // 🟢 Composite ID: "metrics/70-technical-seo-factors"
          // This ensures ID uniqueness across different collections
          id: `${collection.slug}/${item.slug}`,

          // 🟢 Add helper field for filtering (e.g. getCollection('items', ({ data }) => data.parentCollectionSlug === 'metrics'))
          parentCollectionSlug: collection.slug,
        }));
      })
    );

    // 3. Flatten the array of arrays into a single list
    return allItemsNested.flat();
  } catch (error) {
    console.error("⚠️ Custom Collection Items loader failed:", error);
    return [];
  }
}
