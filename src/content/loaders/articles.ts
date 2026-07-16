import { adapto, guardedLoad } from '../../lib/adapto';

export async function articlesLoader() {
    return guardedLoad(() => adapto.articles.listAll({ status: 'published' }));
}
