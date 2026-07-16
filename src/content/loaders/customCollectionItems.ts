import { adapto, guardedLoad } from '../../lib/adapto';

export async function customCollectionItemsLoader() {
    return guardedLoad(async () => {
        const collections = await adapto.customCollections.listAll();

        const allItemsNested = await Promise.all(
            collections.map(async (collection) => {
                const items = await adapto.customCollections.listAllItems(collection.id);

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
