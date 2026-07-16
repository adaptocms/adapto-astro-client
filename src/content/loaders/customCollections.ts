import { adapto, guardedLoad } from '../../lib/adapto';

export async function customCollectionsLoader() {
    return guardedLoad(() => adapto.customCollections.listAll());
}
