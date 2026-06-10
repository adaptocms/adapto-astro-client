import { DEFAULT_LANGUAGE } from '../../settings.ts';
import type { CustomCollectionItem } from 'adapto-client-sdk';
import type { LanguageLink } from '../types/languages';

/**
 * Build available language links for a collection
 * based on EXISTING items.
 */
export function buildCollectionTranslationLinksFromItems(items: { data: CustomCollectionItem }[], collectionSlug: string): LanguageLink[] {
    const langs = new Set<string>();

    items.forEach((item) => {
        langs.add(item.data.language.split('-')[0]);
    });

    return Array.from(langs).map((lang) => ({
        lang,
        href: lang === DEFAULT_LANGUAGE ? `/${collectionSlug}` : `/${lang}/${collectionSlug}`,
    }));
}
