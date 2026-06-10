import { adapto } from '../../lib/adapto';

export async function categoriesLoader() {
    return adapto.categories.listAll();
}
