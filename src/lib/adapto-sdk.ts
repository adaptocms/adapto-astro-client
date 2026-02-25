import { API_URL, API_KEY } from "../../settings.ts";
import type { IArticle } from "../content/schemas/articles";
import type { ICategory } from "../content/schemas/categories";
import type { IPage } from "../content/schemas/pages";
import type {
  ICustomCollection,
  ICustomCollectionItem,
} from "../content/schemas/customCollections";
import type { IMicroCopy } from "../content/schemas/microCopies";

export interface IPaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  pages: number;
}

// --- Query Parameters Types ---

export interface IBaseQueryParams {
  page?: number;
  limit?: number;
  field?: string;
  order?: "asc" | "desc";
  language?: string;
}

export interface IArticleQueryParams extends IBaseQueryParams {
  status?: "draft" | "published" | "archived" | "deleted";
  category?: string;
  tag?: string;
  keyword?: string;
}

export interface ICategoryQueryParams extends IBaseQueryParams {
  parent_id?: string;
  keyword?: string;
}

export interface ICustomCollectionItemQueryParams extends IBaseQueryParams {
  status?: "draft" | "published" | "archived" | "deleted";
  translation_of_id?: string;
}

export interface IPageQueryParams extends IBaseQueryParams {
  status?: "draft" | "published" | "archived" | "deleted";
}

// --- The SDK Class ---

export class AdaptoSDK {
  private baseUrl: string;
  private apiKey: string;
  private maxRetries = 3; // Max retry attempts for transient errors
  private cache: Map<string, any> = new Map(); // Simple in-memory cache

  constructor(config: { baseUrl: string; apiKey: string }) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
  }

  /**
   *  Internal fetcher with Retry Logic
   */
  private async request<T>(
    endpoint: string,
    params: Record<string, any> = {},
    attempt = 1,
  ): Promise<T> {
    const url = new URL(`${this.baseUrl}${endpoint}`);

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined && params[key] !== null) {
        url.searchParams.append(key, String(params[key]));
      }
    });

    if (this.cache.has(url.toString())) {
      console.log(`Cache hit for: ${url.toString()}`);
      return this.cache.get(url.toString());
    }

    try {
      console.log(`Cache miss for: ${url.toString()} (Attempt ${attempt})`);
      const response = await fetch(url.toString(), {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": this.apiKey,
        },
      });

      if (!response.ok) {
        // If rate limited (429) or server error (5xx), throw specifically to trigger retry
        if (response.status === 429 || response.status >= 500) {
          throw new Error(`Transient Error: ${response.status}`);
        }
        throw new Error(
          `Adapto API Error: ${response.status} ${response.statusText} on ${endpoint}`,
        );
      }

      const result = await response.json();
      //console.log(`Requested: ${url.toString()} (Attempt ${attempt})`);
      this.cache.set(url.toString(), result);
      return result;
    } catch (error) {
      if (attempt <= this.maxRetries) {
        const delay = 1000 * Math.pow(2, attempt - 1); // Exponential backoff: 1s, 2s, 4s
        console.warn(
          `Attempt ${attempt} failed for ${endpoint}. Retrying in ${delay}ms...`,
        );
        await new Promise((resolve) => setTimeout(resolve, delay));
        return this.request<T>(endpoint, params, attempt + 1);
      }
      throw error;
    }
  }

  /**
   * GENERIC ITERATOR: Fetches all pages for any endpoint returning a PaginatedResponse.
   * Used by the specific fetchAll methods below.
   */
  private async fetchAllPages<T>(
    fetcher: (params: any) => Promise<IPaginatedResponse<T>>,
    baseParams: any = {},
  ): Promise<T[]> {
    let allItems: T[] = [];
    let page = 1;
    const limit = 100; // Maximize batch size for fewer requests

    while (true) {
      const response = await fetcher({ ...baseParams, page, limit });
      allItems = [...allItems, ...response.items];

      if (page >= response.pages) break;
      page++;
    }

    return allItems;
  }

  // --- Helper to Transform URLs ---
  // Generic transform that can handle any item with optional file_urls
  private transformFileUrls<
    T extends { file_urls?: Record<string, string> | null },
  >(item: T): T {
    if (!item.file_urls) return item;

    const transformedUrls: Record<string, string> = {};

    Object.entries(item.file_urls).forEach(([key, url]) => {
      // Replace the S3 domain with your custom media domain
      if (url) {
        transformedUrls[key] = url.replace(
          "https://adapto-cms-files.s3.amazonaws.com",
          "https://media.adaptocms.com",
        );
      }
    });

    return {
      ...item,
      file_urls: transformedUrls,
    };
  }

  // --- Helper to Process Article (Summary Extraction + URL Transform) ---
  private processArticle(article: IArticle): IArticle {
    article.summary = "";

    if (article.content) {
      // Regex to match the first <p> tag content.
      const match = article.content.match(/<p[^>]*>(.*?)<\/p>/i);

      if (match && match[1]) {
        // Remove nested HTML tags (like <a>, <strong>) to get clean text
        const cleanText = match[1].replace(/<[^>]*>/g, "");
        // Slice it if it's too long
        article.summary =
          cleanText.length > 200
            ? cleanText.substring(0, 200) + "..."
            : cleanText;
      }
    }

    // 2. Transform File URLs
    return this.transformFileUrls(article);
  }

  // ==========================================
  // ARTICLES
  // ==========================================
  public articles = {
    list: async (params?: IArticleQueryParams) => {
      const response = await this.request<IPaginatedResponse<IArticle>>(
        "/public/articles",
        params,
      );
      response.items = response.items.map((item) => this.processArticle(item));
      return response;
    },

    get: async (id: string) => {
      const article = await this.request<IArticle>(`/public/articles/${id}`);
      return this.processArticle(article);
    },

    getBySlug: async (slug: string) => {
      const article = await this.request<IArticle>(
        `/public/articles/by-slug/${slug}`,
      );
      return this.processArticle(article);
    },

    /**
     * Loops through all pages to get every article.
     * Great for Astro SSG.
     */
    listAll: (params?: Omit<IArticleQueryParams, "page" | "limit">) =>
      this.fetchAllPages((p) => this.articles.list(p), params),
  };

  // ==========================================
  // CATEGORIES
  // ==========================================
  public categories = {
    list: async (params?: ICategoryQueryParams) => {
      const response = await this.request<IPaginatedResponse<ICategory>>(
        "/public/categories",
        params,
      );
      response.items = response.items.map((item) =>
        this.transformFileUrls(item),
      );
      return response;
    },

    get: async (id: string) => {
      const category = await this.request<ICategory>(
        `/public/categories/${id}`,
      );
      return this.transformFileUrls(category);
    },

    getBySlug: async (slug: string) => {
      const category = await this.request<ICategory>(
        `/public/categories/by-slug/${slug}`,
      );
      return this.transformFileUrls(category);
    },

    getSubcategories: async (id: string) => {
      const subcategories = await this.request<ICategory[]>(
        `/public/categories/${id}/subcategories`,
      );
      return subcategories.map((item) => this.transformFileUrls(item));
    },

    listAll: (params?: Omit<ICategoryQueryParams, "page" | "limit">) =>
      this.fetchAllPages((p) => this.categories.list(p), params),
  };

  // ==========================================
  // CUSTOM COLLECTIONS
  // ==========================================
  public collections = {
    list: (params?: IBaseQueryParams) =>
      this.request<IPaginatedResponse<ICustomCollection>>(
        "/public/custom-collections",
        params,
      ),

    get: (id: string) =>
      this.request<ICustomCollection>(`/public/custom-collections/${id}`),

    getBySlug: (slug: string) =>
      this.request<ICustomCollection>(
        `/public/custom-collections/by-slug/${slug}`,
      ),

    listAll: (params?: Omit<IBaseQueryParams, "page" | "limit">) =>
      this.fetchAllPages((p) => this.collections.list(p), params),

    // --- Collection Items ---
    listItems: async (
      collectionId: string,
      params?: ICustomCollectionItemQueryParams,
    ) => {
      const response = await this.request<
        IPaginatedResponse<ICustomCollectionItem>
      >(`/public/custom-collections/${collectionId}/items`, params);
      response.items = response.items.map((item) =>
        this.transformFileUrls(item),
      );
      return response;
    },

    getItem: async (collectionId: string, itemId: string) => {
      const item = await this.request<ICustomCollectionItem>(
        `/public/custom-collections/${collectionId}/items/${itemId}`,
      );
      return this.transformFileUrls(item);
    },

    getItemBySlug: async (collectionId: string, slug: string) => {
      const item = await this.request<ICustomCollectionItem>(
        `/public/custom-collections/${collectionId}/items/by-slug/${slug}`,
      );
      return this.transformFileUrls(item);
    },

    /**
     * Fetch ALL items within a specific collection.
     */
    listAllItems: (
      collectionId: string,
      params?: Omit<ICustomCollectionItemQueryParams, "page" | "limit">,
    ) =>
      this.fetchAllPages(
        (p) => this.collections.listItems(collectionId, p),
        params,
      ),
  };

  // ==========================================
  // PAGES
  // ==========================================
  public pages = {
    list: async (params?: IPageQueryParams) => {
      const response = await this.request<IPaginatedResponse<IPage>>(
        "/public/pages",
        params,
      );
      response.items = response.items.map((item) =>
        this.transformFileUrls(item),
      );
      return response;
    },

    get: async (id: string) => {
      const page = await this.request<IPage>(`/public/pages/${id}`);
      return this.transformFileUrls(page);
    },

    getBySlug: async (slug: string) => {
      const page = await this.request<IPage>(`/public/pages/by-slug/${slug}`);
      return this.transformFileUrls(page);
    },

    listAll: (params?: Omit<IPageQueryParams, "page" | "limit">) =>
      this.fetchAllPages((p) => this.pages.list(p), params),
  };
  // ==========================================
  // MICROCOPY
  // ==========================================
  public microCopy = {
    list: async (params?: { language?: string; tags?: string }) => {
      const items = await this.request<IMicroCopy[]>(
        "/public/micro-copy",
        params,
      );
      return items.map((item) => this.transformFileUrls(item));
    },

    getByKey: async (key: string, language?: string) => {
      const item = await this.request<IMicroCopy>(
        `/public/micro-copy/by-key/${key}`,
        { language },
      );
      return this.transformFileUrls(item);
    },

    /**
     * Helper to fetch microcopy as a simple Key-Value object
     * Useful for UI dictionaries.
     * Note: This strips custom fields and file_urls, returning only text values.
     */
    getDictionary: async (language: string) => {
      const items = await this.microCopy.list({ language });
      return items.reduce(
        (acc, item) => {
          acc[item.key] = item.value;
          return acc;
        },
        {} as Record<string, string>,
      );
    },
  };
  // ==========================================
  // LANGUAGES
  // ==========================================

  public languages = {
    /**
     * Fetch available languages. Requires the Tenant ID.
     */
    list: (tenantId: string) =>
      this.request<string[]>("/public/available-languages", {
        tenant_id: tenantId,
      }),
  };
}

export const adapto = new AdaptoSDK({
  baseUrl: API_URL,
  apiKey: API_KEY,
});
