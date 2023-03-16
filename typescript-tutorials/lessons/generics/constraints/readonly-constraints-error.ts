export {};

function mapNumbersToString<T extends number>(arr: T[]): `${T}`[] {
  return arr.map((value) => String(value) as `${T}`);
}

const result = mapNumbersToString([1, 2, 3]);
//    ^?

const readonlyIndexes = [112, 256, 411, 12] as const;

// needs to be used somewhere
export type ReadonlyIndex = typeof readonlyIndexes[number];
//         ^?

mapNumbersToString(readonlyIndexes);
//                 ^^^^^^^^^^^^^^^
// Argument of type 'readonly [112, 256, 411, 12]' is
// not assignable to parameter of type 'number[]'.

console.log(result);
