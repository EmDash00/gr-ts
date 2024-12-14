import { NdArray } from "numjs";
interface Sized {
    length: number;
}
export declare function getLength(x: Sized | NdArray): number;
export declare function getContainer(x: ArrayLike<number> | NdArray, i: number): number;
export declare function assertEqualLength(...args: (Sized | NdArray)[]): number;
export {};
