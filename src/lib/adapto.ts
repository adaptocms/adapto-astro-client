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
