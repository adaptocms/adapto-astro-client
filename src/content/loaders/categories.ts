import { adapto, guardedLoad } from '../../lib/adapto';

export async function categoriesLoader() {
    return guardedLoad(() => adapto.categories.listAll());
}
