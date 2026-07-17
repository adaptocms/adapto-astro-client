import { adapto, guardedLoad } from '../../lib/adapto';
import { isReserved } from '../../lib/reserved';

export async function customCollectionsLoader() {
    return guardedLoad(async () => {
        const collections = await adapto.customCollections.listAll();
        return collections.filter((collection) => !isReserved(collection.slug));
    });
}
