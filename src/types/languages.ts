export type Language = {
    id: string;
    code: string;
    short: string;
    label: string;
    is_default: boolean;
};

export type LanguagePathParams = {
    params: { lang: string | undefined };
    props?: Record<string, any>;
};

export type LanguageLink = {
    lang: string;
    href: string;
};
