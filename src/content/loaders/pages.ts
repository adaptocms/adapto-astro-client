import { adapto } from '../../lib/adapto';

export async function pagesLoader() {
    const pages = await adapto.pages.listAll();

    return pages.map((page) => ({
        ...page,
        id: page.slug,
    }));
}
