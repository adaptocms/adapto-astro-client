// src/content/loaders/languages.ts
import { adapto } from "../../lib/adapto-sdk";
import { TENANT_ID } from "../../../settings.ts";

export async function languagesLoader() {
  try {
    // Ensure we have a tenant ID before calling the API
    if (!TENANT_ID) {
      console.warn("⚠️ No Tenant ID found in ADAPTO_API_KEY. Cannot fetch languages.");
      return [];
    }

    // 🟢 SDK Call: Uses the new .languages.list() method
    const codes = await adapto.languages.list(TENANT_ID);

    // Map the raw codes (['en-US', 'fr-FR']) to your schema format
    return codes.map((code, i) => {
      const [lang] = code.split("-");

      // Generate a nice label (e.g. "English" or "French")
      const label = new Intl.DisplayNames([lang], { type: "language" }).of(lang) || lang;

      return {
        id: code,
        code,
        short: lang.toLowerCase(),
        label,
        is_default: i === 0, // Logic: The first language returned is the default
      };
    });
  } catch (error) {
    console.error("⚠️ Languages loader failed:", error);
    return [];
  }
}
