import { AdaptoSDK } from 'adapto-client-sdk';
import { API_URL, API_KEY } from '../../settings.ts';
import { isConfigured } from './config';

// True only when both the API URL and key are set. When false, the SDK is never
// called and content loaders return empty data, so an unconfigured project never
// crashes the dev server or build (see guardedLoad).
export const IS_CONFIGURED = isConfigured(API_URL, API_KEY);

export const adapto = new AdaptoSDK({
    baseUrl: API_URL,
    apiKey: API_KEY,
});

// Wrap every content-layer fetch. Unconfigured → empty (dev and build), so a fresh
// scaffold renders onboarding instead of crashing. Configured but the SDK/CMS errors →
// empty in dev (degrade gracefully), re-thrown in a production build so a genuinely
// broken build fails loudly instead of silently shipping an empty site.
export async function guardedLoad<T>(load: () => Promise<T[]>): Promise<T[]> {
    if (!IS_CONFIGURED) return [];

    try {
        return await load();
    } catch (err) {
        if (import.meta.env.PROD) throw err;
        console.warn(
            '[adapto] Content fetch failed — rendering empty. ' +
                'Check ADAPTO_API_URL and ADAPTO_API_KEY in .env.',
            err,
        );
        return [];
    }
}

// Fetch published content, and also drafts while running `astro dev` so you can
// preview unpublished items locally. A production build gets published content
// only — drafts never ship. Each item keeps its `status`, so the UI can flag the
// drafts (see DraftBadge). Pass a fetcher that takes a status and returns items.
export async function withDrafts<T>(
    fetchByStatus: (status: 'published' | 'draft') => Promise<T[]>,
): Promise<T[]> {
    const published = await fetchByStatus('published');
    if (!import.meta.env.DEV) return published;
    const drafts = await fetchByStatus('draft');
    return [...published, ...drafts];
}
