import { adapto } from '../../lib/adapto';

export async function microCopyLoader() {
    const microCopies = await adapto.microCopy.list();

    return microCopies.map((item) => ({
        ...item,
        id: item.key,
    }));
}
