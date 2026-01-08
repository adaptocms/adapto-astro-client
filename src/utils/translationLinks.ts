import { DEFAULT_LANGUAGE } from "../content.config";
import type { ICustomCollectionItem } from "../schemas/customCollections";
import type { ILanguageLink } from "../schemas/languages";

/**
 * Build available language links for a collection
 * based on EXISTING items.
 */
export function buildCollectionTranslationLinksFromItems(
  items: { data: ICustomCollectionItem }[],
  collectionSlug: string
): ILanguageLink[] {
  const langs = new Set<string>();

  items.forEach((item) => {
    langs.add(item.data.language.split("-")[0]);
  });

  return Array.from(langs).map((lang) => ({
    lang,
    href:
      lang === DEFAULT_LANGUAGE
        ? `/${collectionSlug}`
        : `/${lang}/${collectionSlug}`,
  }));
}
