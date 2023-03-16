export {};

function mapNumbersToString<T extends number>(arr: readonly T[]): `${T}`[] {
  return arr.map((value) => String(value) as `${T}`);
}

const result = mapNumbersToString([1, 2, 3]);
//    ^?

const readonlyIndexes = [112, 256, 411, 12] as const;

// needs to be used somewhere
export type ReadonlyIndex = typeof readonlyIndexes[number];
//          ^?

mapNumbersToString(readonlyIndexes);

console.log(result);
