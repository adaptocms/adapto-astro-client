import { getCollection } from "astro:content";
import type { ILanguage } from "../schemas/languages";

const getDefaultLanguage = async (): Promise<ILanguage | null> => {
  const languages = await getCollection("languages");
  return languages.find((lang) => lang.data.is_default)?.data || null;
};

const getFullLanguageCode = async (shortCode: string): Promise<string | undefined> => {
  const languages = await getCollection("languages");
  return languages.find((l) => l.data.short === shortCode)?.data.code;
}

export { getDefaultLanguage, getFullLanguageCode };
