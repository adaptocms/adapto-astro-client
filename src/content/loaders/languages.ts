import { adapto, guardedLoad } from '../../lib/adapto';
import { DEFAULT_LANGUAGE } from '../../../settings.ts';
import type { Language } from '../../types/languages';

// When the CMS returns no languages (unconfigured or empty tenant), fall back to a single
// default language. The rest of the app assumes at least one language with a default
// exists, so this keeps nav/routing/translation logic working instead of crashing.
function fallbackLanguage(): Language {
    const short = DEFAULT_LANGUAGE.toLowerCase();
    const label = new Intl.DisplayNames([short], { type: 'language' }).of(short) || DEFAULT_LANGUAGE;

    return { id: DEFAULT_LANGUAGE, code: DEFAULT_LANGUAGE, short, label, is_default: true };
}

export async function languagesLoader(): Promise<Language[]> {
    const languages = await guardedLoad<Language>(async () => {
        const codes = await adapto.languages.list();

        return codes.map((code, i) => {
            const [lang] = code.split('-');

            const label = new Intl.DisplayNames([lang], { type: 'language' }).of(lang) || lang;

            return {
                id: code,
                code,
                short: lang.toLowerCase(),
                label,
                is_default: i === 0,
            };
        });
    });

    return languages.length > 0 ? languages : [fallbackLanguage()];
}
