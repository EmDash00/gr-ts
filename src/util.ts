import { NdArray } from "numjs";

interface Sized {
  length: number;
}

interface Indexable<T> extends Sized {
  get(i: number): T;
}

export type NumericContainer = ArrayLike<number> | Indexable<number> | NdArray;

export function getLength(x: Sized | NdArray): number {
    if ('length' in x) {
        return x.length;
    } else if ('shape' in x) {
        return x.shape[0];
    }

    throw new Error("Invalid type: x must be either Sized or NdArray");
}

export function getContainer(x: NumericContainer, i: number): number {
    if (typeof x[0] !== 'undefined') {
        return x[i];
    } else if ('get' in x) {
        return x.get(i);
    }

    throw new Error("Invalid type: x must be either Sized or NdArray");
}

export function assertEqualLength(...args: (Sized | NdArray)[]): number {
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
