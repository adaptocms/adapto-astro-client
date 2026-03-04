import { defineCollection } from "astro:content";
import { articleSchema } from "./content/schemas/articles";
import { categorySchema } from "./content/schemas/categories";
import { pageSchema } from "./content/schemas/pages";
import { microCopySchema } from "./content/schemas/microCopies";
import {
  customCollectionItemSchema,
  customCollectionSchema,
} from "./content/schemas/customCollections";
import { languageSchema } from "./content/schemas/languages/schema";
import { categoriesLoader } from "./content/loaders/categories";
import { pagesLoader } from "./content/loaders/pages";
import { articlesLoader } from "./content/loaders/articles";
import { microCopyLoader } from "./content/loaders/microCopies";
import { languagesLoader } from "./content/loaders/languages";
import { customCollectionsLoader } from "./content/loaders/customCollections";
import { customCollectionItemsLoader } from "./content/loaders/customCollectionItems";

const articles = defineCollection({
  loader: articlesLoader,
  schema: articleSchema,
});

const categories = defineCollection({
  loader: categoriesLoader,
  schema: categorySchema,
});

const pages = defineCollection({
  loader: pagesLoader,
  schema: pageSchema,
});

const customCollections = defineCollection({
  loader: customCollectionsLoader,
  schema: customCollectionSchema,
});

const customCollectionItems = defineCollection({
  loader: customCollectionItemsLoader,
  schema: customCollectionItemSchema,
});

const microCopies = defineCollection({
  loader: microCopyLoader,
  schema: microCopySchema,
});

const languages = defineCollection({
  loader: languagesLoader,
  schema: languageSchema,
});

export const collections = {
  articles: articles,
  categories: categories,
  pages: pages,
  microCopies: microCopies,
  customCollections: customCollections,
  customCollectionItems: customCollectionItems,
  languages: languages,
};
