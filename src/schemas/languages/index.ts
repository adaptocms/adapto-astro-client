type ILanguagePathParams = {
  params: { lang: string | undefined };
  props?: Record<string, any>;
};

type ILanguageLink = {
  lang: string;
  href?: string; // undefined = disabled
};

export * from "./schema.ts";
export type { ILanguagePathParams, ILanguageLink };
