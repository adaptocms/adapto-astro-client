import { adapto } from "../../lib/adapto-sdk";
import type { IMicroCopy } from "../schemas/microCopies";

export async function microCopyLoader() {
  try {
    // Fetches the array of micro-copy items
    // Since this endpoint isn't paginated, .list() gets everything in one go.
    const microCopies = await adapto.microCopy.list();

    return microCopies.map((item: IMicroCopy) => ({
      ...item,
      // 🟢 TODO: Use the 'key' as the ID so you can look it up easily:
      // getEntry('microCopies', 'submit-button-label')
      id: item.key,
    }));
  } catch (error) {
    console.error("⚠️ Micro Copies loader failed:", error);
    return [];
  }
}
