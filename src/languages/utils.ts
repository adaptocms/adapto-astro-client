import { getCollection } from "astro:content";
import type { ILanguage } from "../schemas/languages";

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

export { getDefaultLanguage, getFullLanguageCode, hasLanguagePrefixInUrl };
