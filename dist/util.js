export function assertEqualLength(...args) {
    if (!args.length) {
        throw new RangeError("At least one array must be provided.");
    }
    const n = args[0].length;
    for (const arg of args) {
        if (arg.length != n) {
            throw new Error("assertEqualLength failed.");
        }
    }
    return n;
}
