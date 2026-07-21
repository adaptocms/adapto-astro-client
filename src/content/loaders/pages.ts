import { adapto, guardedLoad, withDrafts } from '../../lib/adapto';

export async function pagesLoader() {
    return guardedLoad(async () => {
        const pages = await withDrafts((status) => adapto.pages.listAll({ status }));

        return pages.map((page) => ({
            ...page,
            id: page.slug,
        }));
    });
}
