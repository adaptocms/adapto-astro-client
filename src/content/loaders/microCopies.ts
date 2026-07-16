import { adapto, guardedLoad } from '../../lib/adapto';

export async function microCopyLoader() {
    return guardedLoad(async () => {
        const microCopies = await adapto.microCopy.list();

        return microCopies.map((item) => ({
            ...item,
            id: item.key,
        }));
    });
}
