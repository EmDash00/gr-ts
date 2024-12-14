export function getLength(x) {
    if ('length' in x) {
        return x.length;
    }
    else if ('shape' in x) {
        return x.shape[0];
    }
    throw new Error("Invalid type: x must be either Sized or NdArray");
}
export function getContainer(x, i) {
    if (typeof x[0] !== 'undefined') {
        return x[i];
    }
    else if ('get' in x) {
        return x.get(i);
    }
    throw new Error("Invalid type: x must be either Sized or NdArray");
}
export function assertEqualLength(...args) {
    if (!args.length) {
        throw new RangeError("At least one array must be provided.");
    }
    const n = getLength(args[0]);
    for (const arg of args) {
        if (getLength(arg) != n) {
            throw new Error("assertEqualLength failed.");
        }
    }
    return n;
}
