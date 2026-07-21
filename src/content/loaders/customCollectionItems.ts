import { adapto, guardedLoad, withDrafts } from '../../lib/adapto';
import { isReserved } from '../../lib/reserved';

export async function customCollectionItemsLoader() {
    return guardedLoad(async () => {
        const collections = (await adapto.customCollections.listAll()).filter(
            (collection) => !isReserved(collection.slug)
        );

        const allItemsNested = await Promise.all(
            collections.map(async (collection) => {
                const items = await withDrafts((status) =>
                    adapto.customCollections.listAllItems(collection.id, { status })
                );

                return items.map((item) => ({
                    ...item,
                    // Composite id keeps entry ids unique across collections:
                    // "metrics/70-technical-seo-factors"
                    id: `${collection.slug}/${item.slug}`,
                }));
            })
        );

        return allItemsNested.flat();
    });
}
