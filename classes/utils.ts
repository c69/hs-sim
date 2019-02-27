export function str2num (n: string | undefined) {
    return n ? Number(n) : undefined;
}

export function assignDefined<T={}>(
    // target: object,
     ...sources: T[]
): T {
    const target = {} as T;
    for (const source of sources) {
        for (const key of Object.keys(source)) {
            const val = source[key];
            if (val !== undefined) {
                target[key] = val;
            }
        }
    }
    return target;
}
