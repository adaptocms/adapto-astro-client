import { adapto } from "../../lib/adapto-sdk";
import type { ICustomCollection } from "../schemas/customCollections";

export async function customCollectionsLoader() {
  try {
    // Fetches all collection definitions
    const collections = await adapto.collections.listAll();

    return collections.map((collection: ICustomCollection) => ({
      ...collection,
      id: collection.id,
    }));
  } catch (error) {
    console.error("⚠️ Custom Collections fetch failed:", error);
    return [];
  }
}
