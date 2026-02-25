import { adapto } from "../../lib/adapto-sdk";
import type { IPage } from "../schemas/pages";

export async function pagesLoader() {
  try {
    //  Fetches ALL pages automatically (handling pagination 1, 2, 3...)
    // You can also pass filters here: .listAll({ status: 'published' })
    const allPages = await adapto.pages.listAll();

    return allPages.map((page: IPage) => ({
      ...page,
      // Recommendation: Use the slug as the Astro Collection ID
      // This makes looking up pages by URL much easier: getEntry('pages', 'about-us')
      id: page.slug,
    }));
  } catch (error) {
    console.error("⚠️ Pages loader failed:", error);
    return [];
  }
}
