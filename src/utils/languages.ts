import { getCollection } from "astro:content";
import type { ILanguage, ILanguagePathParams } from "../schemas/languages";
import type { IPage } from "../schemas/pages";

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

const getPagesWithTranslations = async (
  page: string
): Promise<Record<string, IPage>> => {
  const pages: IPage[] = (await getCollection("pages")).map((p) => p.data);
  const pageTranslations: Record<string, IPage> = {};
  const pageInDefaultLang = pages.find((p) => p.slug === page);
  if (pageInDefaultLang) {
    const langCode = pageInDefaultLang.language.split("-")[0].toLowerCase();
    pageTranslations[langCode] = pageInDefaultLang;

    pages.forEach((page) => {
      if (page.translation_of_id === pageInDefaultLang.id) {
        const shortLang = page.language.split("-")[0].toLowerCase();
        pageTranslations[shortLang] = page;
      }
    });
  }
  return pageTranslations;
};

/**
 * Generates paths for [lang] or [...lang] dynamic routes.
 * Supports root paths for default language and prefixed paths for all.
 * Adds translation data to props for easier access in pages.
 */
const getPageStaticPaths = async (
  pageSlug: string
): Promise<ILanguagePathParams[]> => {
  const pageTranslations = await getPagesWithTranslations(pageSlug);

  const paths: ILanguagePathParams[] = [];

  if (Object.entries(pageTranslations).length >= 1) {
    Object.entries(pageTranslations).forEach(([shortLang, page]) => {
      if (page.translation_of_id === null) {
        paths.push({
          params: { lang: undefined },
          props: { lang: shortLang, translations: pageTranslations },
        });
      }
      paths.push({
        params: {
          lang: shortLang,
        },
        props: { lang: shortLang, translations: pageTranslations },
      });
    });
  }

  return paths;
};

export {
  getDefaultLanguage,
  getFullLanguageCode,
  hasLanguagePrefixInUrl,
  getPageStaticPaths,
  getPagesWithTranslations,
};
