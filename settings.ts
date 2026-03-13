export const ENV = import.meta.env.ENV;
export const GA_ID = import.meta.env.GA_ID || "";
export const API_URL = import.meta.env.ADAPTO_API_URL || "";
export const API_KEY = import.meta.env.ADAPTO_API_KEY || "";
export const TENANT_ID = API_KEY?.split(".")[1] || "";

export const DEFAULT_LANGUAGE = "en";
export const ARTICLES_PER_PAGE = 2;
export const PAGE_SIZE = 10;
export const CUSTOM_COLLECTIONS: { id: string; name: string; slug: string }[] =
  [
    {
      id: "f8358a58-d632-43fe-954c-5c49953554ca",
      name: "Showcase",
      slug: "showcase",
    },
  ];
