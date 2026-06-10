import { adapto } from '../../lib/adapto';

export async function customCollectionsLoader() {
    return adapto.customCollections.listAll();
}
