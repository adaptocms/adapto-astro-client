import { adapto, guardedLoad, withDrafts } from '../../lib/adapto';

export async function articlesLoader() {
    return guardedLoad(() =>
        withDrafts((status) => adapto.articles.listAll({ status })),
    );
}
