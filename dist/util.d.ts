import { NdArray } from "numjs";
interface Sized {
    length: number;
}
interface Indexable<T> extends Sized {
    get(i: number): T;
}
export type NumericContainer = ArrayLike<number> | Indexable<number> | NdArray;
export declare function getLength(x: Sized | NdArray): number;
export declare function getContainer(x: NumericContainer, i: number): number;
export declare function assertEqualLength(...args: (Sized | NdArray)[]): number;
export {};
