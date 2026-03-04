import type { ILanguage } from "../content/schemas/languages";

export type ITranslationGroup<T> = {
  default: T; // the default language entity
  translations: Record<string, T>; // keyed by short language code
};

/**
 * Build a translation map for a collection of entities.
 * Works for articles, categories, pages.
 */
export function buildTranslationMap<
  T extends { id: string; language: string; translation_of_id?: string | null },
>(items: T[], languages: ILanguage[]): Record<string, ITranslationGroup<T>> {
  const defaultLang =
    languages.find((l) => l.is_default)?.short || languages[0].short;

  const groups: Record<string, ITranslationGroup<T>> = {};

  items.forEach((item) => {
    // Determine group key: translation_of_id points to default language item
    const groupId = item.translation_of_id ?? item.id;

    if (!groups[groupId]) {
      groups[groupId] = { default: null as any, translations: {} };
    }

    const langCode = item.language.split("-")[0];

    if (langCode === defaultLang) {
      groups[groupId].default = item;
    } else {
      groups[groupId].translations[langCode] = item;
    }
  });

  // Ensure every group has a default fallback
  for (const groupId in groups) {
    if (!groups[groupId].default) {
      const firstTranslation = Object.values(groups[groupId].translations)[0];
      groups[groupId].default = firstTranslation;
    }
  }

  return groups;
}
