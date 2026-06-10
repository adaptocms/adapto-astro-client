import { defineCollection } from 'astro:content';
import { z } from 'zod';
import { articleSchema, categorySchema, pageSchema, microCopySchema, customCollectionSchema, customCollectionItemSchema } from 'adapto-client-sdk/schemas';
import { categoriesLoader } from './content/loaders/categories';
import { pagesLoader } from './content/loaders/pages';
import { articlesLoader } from './content/loaders/articles';
import { microCopyLoader } from './content/loaders/microCopies';
import { languagesLoader } from './content/loaders/languages';
import { customCollectionsLoader } from './content/loaders/customCollections';
import { customCollectionItemsLoader } from './content/loaders/customCollectionItems';

const languageSchema = z.object({
    id: z.string(),
    code: z.string(),
    short: z.string(),
    label: z.string(),
    is_default: z.boolean(),
});

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
