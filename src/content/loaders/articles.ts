import { adapto } from '../../lib/adapto';

export async function articlesLoader() {
    return adapto.articles.listAll({ status: 'published' });
}
