import { getCollection } from "astro:content";
import type { ILanguage, ILanguagePathParams } from "../schemas/languages";

const getDefaultLanguage = async (): Promise<ILanguage | null> => {
  const languages = await getCollection("languages");
  return languages.find((lang) => lang.data.is_default)?.data || null;
};

const getFullLanguageCode = async (
  shortCode: string
): Promise<string | undefined> => {
  const languages = await getCollection("languages");
  return languages.find((l) => l.data.short === shortCode)?.data.code;
};

const hasLanguagePrefixInUrl = async (pathname: string): Promise<boolean> => {
  const availableLanguages = await getCollection("languages").then((langs) =>
    langs.map((language) => language.data.short)
  );

  return availableLanguages.includes(pathname.split("/")[1]);
};

/**
 * Generates paths for [lang] or [...lang] dynamic routes.
 * Supports root paths for default language and prefixed paths for all.
 */
const getLanguageStaticPaths = async (): Promise<ILanguagePathParams[]> => {
  const languages = await getCollection("languages");
  const paths: ILanguagePathParams[] = [];

  // If only one language exists, we only want the root path
  if (languages.length <= 1) {
    return [{ params: { lang: undefined } }];
  }

  languages.forEach((language) => {
    // Generate root path for default (e.g., /contact)
    if (language.data.is_default) {
      paths.push({ params: { lang: undefined } });
    }
    // Generate prefixed path (e.g., /ro/contact)
    paths.push({ params: { lang: language.data.short } });
  });

  return paths;
};

/**
 * Finds a root entry and all its translations, returning a map keyed by short code.
 * @param slug - The slug of the anchor page in the default language (e.g., 'home' or 'contact')
 * @param pages - The collection of all pages
 * @param defaultLangCode - The full code of the default language (e.g., 'en-US')
 */
const buildTranslationMap = (
  slug: string,
  pages: any[],
  defaultLangCode: string
) => {
  const translations: Record<string, any> = {};

  // 1. Find the anchor page (the one in default language)
  const anchorPage = pages.find(
    (p) => p.data.slug === slug && p.data.language === defaultLangCode
  );

  if (anchorPage) {
    // 2. Find all translations linked to this anchor ID
    const related = pages.filter(
      (p) =>
        p.data.id === anchorPage.id ||
        p.data.translation_of_id === anchorPage.id
    );

    related.forEach((p) => {
      const shortLang = p.data.language.split("-")[0].toLowerCase();
      translations[shortLang] = p.data;
    });
  }

  return translations;
};

export {
  getDefaultLanguage,
  getFullLanguageCode,
  hasLanguagePrefixInUrl,
  getLanguageStaticPaths,
  buildTranslationMap,
};
