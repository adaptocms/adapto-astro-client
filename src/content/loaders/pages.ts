import { adapto, guardedLoad } from '../../lib/adapto';

export async function pagesLoader() {
    return guardedLoad(async () => {
        const pages = await adapto.pages.listAll();

        return pages.map((page) => ({
            ...page,
            id: page.slug,
        }));
    });
}
