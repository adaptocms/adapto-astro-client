import { adapto } from '../../lib/adapto';
import type { Language } from '../../types/languages';

export async function languagesLoader(): Promise<Language[]> {
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
}
